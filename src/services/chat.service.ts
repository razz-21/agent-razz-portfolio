import { PUBLIC_API_URL } from '$env/static/public';
import type { ChatMessage } from '$lib/types/chat';

export type ChatStreamRequest = Record<string, unknown> & {
	message?: string;
};

export type FetchTextStreamOptions = {
	/** Allows cancelling the request/stream from the caller. */
	signal?: AbortSignal;
	/** Override the endpoint path (defaults to `/chat/stream`). */
	endpointPath?: string;
	/** Extra headers to include in the request. */
	headers?: HeadersInit;
};

function tryParseChatStreamLine(line: string): Partial<ChatMessage> | null {
	const trimmed = line.trim();
	if (!trimmed) return null;

	// Support SSE-like formatting: `data: { ...json... }`
	const data = trimmed.startsWith('data:')
		? trimmed.slice('data:'.length).trim()
		: trimmed;

	// Common SSE completion marker.
	if (data === '[DONE]') return { role: 'assistant' };

	try {
		return JSON.parse(data) as Partial<ChatMessage>;
	} catch {
		return null;
	}
}

/**
 * Fetches the `/chat/stream` endpoint and yields assistant text chunks.
 *
 * The endpoint is expected to stream newline- or SSE-delimited JSON objects
 * that match `ChatMessage` (`id`, `role`, `content`).
 */
export async function* fetchTextStream(
	request: ChatStreamRequest,
	options: FetchTextStreamOptions = {}
): AsyncGenerator<string> {
	const endpointPath = options.endpointPath ?? '/chat/stream';
	const url = `${PUBLIC_API_URL}${endpointPath}`;

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			...(options.headers ?? {})
		},
		body: JSON.stringify(request),
		signal: options.signal
	});

	if (!res.ok) {
		throw new Error(`chat stream request failed: ${res.status} ${res.statusText}`);
	}
	if (!res.body) {
		throw new Error('chat stream response did not include a readable body');
	}

	const reader = res.body.getReader();
	const decoder = new TextDecoder();

	let buffer = '';

	// Helps when the server sends cumulative `content` instead of deltas.
	let lastEmittedContent = '';

	while (true) {
		const { value, done } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });

		let newlineIndex: number;
		while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
			const line = buffer.slice(0, newlineIndex);
			buffer = buffer.slice(newlineIndex + 1);

			const parsed = tryParseChatStreamLine(line);
			if (!parsed) continue;

			// If we received the SSE `[DONE]` marker, stop right away.
			if (typeof parsed.content === 'undefined' && trimmedIsDoneMarker(line)) {
				return;
			}

			// Your backend appears to send `{ user: "assistant" }` instead of `{ role: "assistant" }`.
			// Support both to avoid silently dropping all chunks.
			const roleCandidate = (parsed as unknown as { role?: unknown; user?: unknown }).role ?? (parsed as unknown as { user?: unknown }).user;
			if (roleCandidate !== 'assistant') continue;
			if (typeof parsed.content !== 'string' || parsed.content.length === 0) continue;

			// If the server sends cumulative content, only emit the new suffix.
			if (parsed.content.startsWith(lastEmittedContent)) {
				const next = parsed.content.slice(lastEmittedContent.length);
				if (next.length > 0) {
					lastEmittedContent = parsed.content;
					yield next;
				}
			} else {
				// Fallback: treat `content` as a delta and emit it as-is.
				lastEmittedContent = parsed.content;
				yield parsed.content;
			}
		}
	}

	// Flush any remaining buffered data (in case the stream ends mid-line).
	if (buffer.trim().length > 0) {
		const parsed = tryParseChatStreamLine(buffer);
		if (!parsed) return;
		const roleCandidate = (parsed as unknown as { role?: unknown; user?: unknown }).role ?? (parsed as unknown as { user?: unknown }).user;
		if (roleCandidate !== 'assistant') return;
		if (typeof parsed.content !== 'string' || parsed.content.length === 0) return;

		if (parsed.content.startsWith(lastEmittedContent)) {
			const next = parsed.content.slice(lastEmittedContent.length);
			if (next.length > 0) yield next;
		} else {
			yield parsed.content;
		}
	}
}

/**
 * Convenience alias for callers that prefer an explicit name.
 */
export const fetchChatTextStream = fetchTextStream;

function trimmedIsDoneMarker(line: string) {
	return line.trim().replace(/^data:\s*/, '') === '[DONE]';
}

