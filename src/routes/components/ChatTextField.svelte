<script lang="ts">
	import Send from '@lucide/svelte/icons/send';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';
	import type { Component } from 'svelte';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	export type ChatTopic = { label: string; icon: Component };

	let {
		value = $bindable(''),
		placeholder = 'Ask anything…',
		disabled = false,
		class: className,
		onsend,
		topics = [],
		oninput: oninputProp,
		onkeydown: onkeydownProp,
		...restProps
	}: Omit<HTMLTextareaAttributes, 'children' | 'value'> & {
		value?: string;
		onsend?: (message: string) => void;
		class?: string;
		topics?: ChatTopic[];
	} = $props();

	let textareaRef: HTMLTextAreaElement | null = $state(null);

	function autoGrow() {
		const el = textareaRef;
		if (!el) return;
		el.style.height = 'auto';
		el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
	}

	function submitMessage() {
		const text = value.trim();
		if (!text || disabled) return;
		onsend?.(text);
	}

	function selectTopic(topic: ChatTopic) {
		if (disabled) return;
		value = topic.label;
		queueMicrotask(() => textareaRef?.focus());
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key !== 'Enter' || e.shiftKey) return;
		if (e.metaKey || e.ctrlKey) {
			e.preventDefault();
			submitMessage();
		}
	}

	$effect(() => {
		void value;
		queueMicrotask(autoGrow);
	});
</script>

<div
	class={cn(
		'flex flex-col rounded-2xl border border-border/60 bg-card px-3.5 pb-3 pt-3 shadow-sm dark:border-white/10 dark:bg-[oklch(0.22_0_0)]',
		className
	)}
>
	{#if topics.length > 0}
		<div
			class="-mx-1 mb-2 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:thin]"
			role="group"
			aria-label="Quick topics"
		>
			{#each topics as topic (topic.label)}
				{@const Icon = topic.icon}
				<Button
					type="button"
					variant="outline"
					size="sm"
					class="h-8 shrink-0 gap-1.5 rounded-lg px-2.5 text-xs font-medium"
					{disabled}
					onclick={() => selectTopic(topic)}
				>
					<Icon class="size-3.5 shrink-0" aria-hidden="true" />
					{topic.label}
				</Button>
			{/each}
		</div>
	{/if}
	<label class="sr-only" for="chat-message">Message</label>
	<textarea
		bind:this={textareaRef}
		id="chat-message"
		bind:value
		{placeholder}
		{disabled}
		rows="1"
		class="min-h-10 max-h-[200px] w-full resize-none border-0 bg-transparent py-1.5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
		{...restProps}
		oninput={(e) => {
			oninputProp?.(e);
			autoGrow();
		}}
		onkeydown={(e) => {
			onkeydownProp?.(e);
			handleKeydown(e);
		}}
	></textarea>

	<div class="mt-1 flex items-center justify-end gap-2 pt-1 dark:border-white/5">
		<Button
			variant="default"
			size="sm"
			class="h-8 gap-1.5 rounded-lg px-2.5 text-xs"
			disabled={disabled || !value.trim()}
			onclick={submitMessage}
		>
			<Send class="size-3.5 shrink-0" stroke-width={2.25} aria-hidden="true" />
			Send
		</Button>
	</div>
</div>
