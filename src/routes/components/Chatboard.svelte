<script lang="ts">
	import type { ChatMessage } from '$lib/types/chat.js';
	import ChatConversationItem from './ChatConversationItem.svelte';

	let {
		messages = [] as ChatMessage[],
		isRequesting = false
	}: {
		messages: ChatMessage[];
		isRequesting: boolean;
	} = $props();

	let scrollRoot: HTMLDivElement | null = null;

	function setScrollRoot(node: HTMLDivElement) {
		scrollRoot = node;
		return () => {
			if (scrollRoot === node) scrollRoot = null;
		};
	}

	$effect(() => {
		const lastMessage = messages[messages.length - 1];
		const lastContent = lastMessage?.content ?? '';
		void messages.length;
		void lastContent;
		const el = scrollRoot;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	});
</script>

<div class="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">
	<div
		{@attach setScrollRoot}
		class="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-3 px-4 pt-6 pb-2 [scrollbar-width:thin] sm:px-6"
		role="list"
		aria-label="Conversation"
	>
		{#each messages as message (message.id)}
			<ChatConversationItem
				role={message.role}
				content={message.content}
				isLoading={isRequesting && message.role === 'assistant' && message.content.length === 0}
			/>
		{/each}
	</div>
</div>
