<script lang="ts">
	let {
		role,
		content,
	}: {
		role: 'user' | 'assistant';
		content: string;
	} = $props();

	const isUser = $derived(role === 'user');
</script>

<div
	class="flex w-full gap-3 {isUser ? 'justify-end' : 'justify-start'}"
	role="listitem"
	aria-label={isUser ? 'You' : 'Assistant'}
>
	<div
		class="max-w-[min(85%,28rem)] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm {isUser
			? 'bg-primary text-primary-foreground'
			: 'bg-neutral-200 text-neutral-900 dark:bg-zinc-700 dark:text-zinc-50'}"
	>
		<p class="whitespace-pre-wrap wrap-break-word">{content}</p>
	</div>
</div>
