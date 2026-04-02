<script lang="ts">
	import type { ChatMessage } from '$lib/types/chat.js';
	import ChatConversationItem from './ChatConversationItem.svelte';
	import { tick } from 'svelte';

	let { messages = [] as ChatMessage[] }: { messages?: ChatMessage[] } = $props();

	let scrollRoot: HTMLDivElement | null = $state(null);

	$effect(() => {
		void messages.length;
		void tick().then(() => {
			const el = scrollRoot;
			if (!el) return;
			el.scrollTop = el.scrollHeight;
		});
	});
</script>

<div class="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto ">
	<div
		bind:this={scrollRoot}
		class="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-3 px-4 pt-6 pb-2 sm:px-6 [scrollbar-width:thin]"
		role="list"
		aria-label="Conversation"
	>
		{#each messages as message (message.id)}
			<ChatConversationItem role={message.role} content={message.content} />
		{/each}
	</div>
</div>
