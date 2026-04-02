<script lang="ts">
	import { Spinner } from '$lib/components/ui/spinner';
	import { marked } from 'marked';
	import sanitizeHtml from 'sanitize-html';

	let {
		role,
		content,
		isLoading = false
	}: {
		role: 'user' | 'assistant';
		content: string;
		isLoading?: boolean;
	} = $props();

	const isUser = $derived(role === 'user');
	const showLoading = $derived(isLoading && role === 'assistant' && content.length === 0);

	const loadingLabelOptions = [
		'Please wait ...',
		'Finalizing your response ...',
		'Fetching more context ...',
		'Working on it ...',
		'Just a moment ...',
		'Cross-checking details ...',
		'Tuning the finishing touches ...'
	] as const;

	function pickLoadingLabel() {
		return loadingLabelOptions[Math.floor(Math.random() * loadingLabelOptions.length)];
	}

	// Pick once per component instance so the label stays stable while loading.
	const loadingLabel = pickLoadingLabel();

	const sanitizedHtml = $derived.by(() => {
		// Marked outputs HTML; we sanitize it before rendering to avoid XSS.
		const dirty = marked.parse(content ?? '', { gfm: true, breaks: true });

		return sanitizeHtml(dirty, {
			allowedTags: [
				'a',
				'br',
				'p',
				'strong',
				'b',
				'em',
				'i',
				'code',
				'pre',
				'blockquote',
				'ul',
				'ol',
				'li',
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'span',
				'hr'
			],
			allowedAttributes: {
				a: ['href', 'title', 'target', 'rel'],
				// Prevent passing arbitrary attributes through the sanitizer.
				span: [],
				code: [],
				pre: [],
				p: [],
				strong: [],
				b: [],
				em: [],
				i: [],
				blockquote: [],
				ul: [],
				ol: [],
				li: [],
				h1: [],
				h2: [],
				h3: [],
				h4: [],
				h5: [],
				h6: [],
				hr: []
			},
			allowedSchemes: ['http', 'https', 'mailto'],
			allowedSchemesAppliedToAttributes: ['href']
		});
	});
</script>

<div
	class="flex w-full gap-3 {isUser ? 'justify-end' : 'justify-start'}"
	role="listitem"
	aria-label={isUser ? 'You' : 'Assistant'}
>
	<div
		class="max-w-[min(85%,28rem)] rounded-lg px-4 py-2.5 text-sm {isUser
			? 'bg-primary text-primary-foreground'
			: 'bg-neutral-50 text-neutral-700 dark:bg-zinc-700 dark:text-zinc-50 border border-border/90'}"
	>
		<div class="wrap-break-word">
			{#if showLoading}
				<span class="inline-flex items-center gap-2 leading-relaxed">
					<Spinner />
					<span>{loadingLabel}</span>
				</span>
			{:else}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<div
					class="chat-html prose prose-sm max-w-none leading-relaxed first:mt-0
						{isUser
						? 'prose-invert prose-headings:text-inherit prose-p:text-inherit prose-li:text-inherit prose-strong:text-inherit prose-blockquote:text-inherit prose-code:text-inherit prose-a:text-primary-foreground/95 prose-a:underline-offset-2'
						: 'text-neutral-700 dark:prose-invert dark:text-zinc-50'}"
				>
					{@html sanitizedHtml}
				</div>
			{/if}
		</div>
	</div>
</div>
