<script lang="ts">
	import Briefcase from '@lucide/svelte/icons/briefcase';
	import Cpu from '@lucide/svelte/icons/cpu';
	import FolderKanban from '@lucide/svelte/icons/folder-kanban';
	import ScrollText from '@lucide/svelte/icons/scroll-text';
	import UserRound from '@lucide/svelte/icons/user-round';
	import Chatboard from './components/Chatboard.svelte';
	import ChatTextField from './components/ChatTextField.svelte';
	import IntroSection from './components/IntroSection.svelte';
	import Navbar from './components/Navbar.svelte';
	import type { ChatMessage } from '$lib/types/chat.js';
	import type { Component } from 'svelte';
	import { onMount } from 'svelte';
	import { loadSlim } from '@tsparticles/slim';
	import { tsParticles } from '@tsparticles/engine';
	import type { Container } from '@tsparticles/engine';

	const particlesConfig = {
		fullScreen: { enable: false },
		background: { color: { value: 'transparent' } },
		particles: {
			color: {
				value: '#E5E4E9',
			},
			links: {
				enable: true,
				color: '#E5E4E9',
			},
			move: {
				enable: true,
			},
			opacity: {
				value: 0.5,
			},
			number: {
				value: 50,
			},
		},
		style: {
			position: 'absolute',
			height: '100%',
			width: '100%',
		},
	};

	let chatMessage = $state('');
	let messages = $state<ChatMessage[]>([]);

	const hasConversation = $derived(messages.length > 0);

	function handleChatSend(message: string) {
		const trimmed = message.trim();
		if (!trimmed) return;

		const userTurn: ChatMessage = {
			id: crypto.randomUUID(),
			role: 'user',
			content: trimmed,
		};
		const assistantTurn: ChatMessage = {
			id: crypto.randomUUID(),
			role: 'assistant',
			content:
				"Thanks for reaching out. I'm a demo reply for now — connect your agent here to respond with real portfolio answers.",
		};
		messages = [...messages, userTurn, assistantTurn];
		chatMessage = '';
	}

	const askTopics: { label: string; icon: Component }[] = [
		{ label: 'About me', icon: UserRound },
		{ label: 'Experiences', icon: Briefcase },
		{ label: 'Projects', icon: FolderKanban },
		{ label: 'Summary of Me', icon: ScrollText },
		{ label: 'Technical Skills', icon: Cpu },
	];

	onMount(() => {
		let cancelled = false;
		let instance: Container | undefined;

		void (async () => {
			await loadSlim(tsParticles);
			if (cancelled) return;
			instance = await tsParticles.load({
				id: 'tsparticles',
				options: particlesConfig,
			});
			if (cancelled) {
				instance?.destroy();
				instance = undefined;
			}
		})();

		return () => {
			cancelled = true;
			instance?.destroy();
		};
	});
</script>

<div class="relative flex min-h-dvh max-h-dvh flex-col overflow-hidden bg-background text-foreground">
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--color-accent),transparent)] opacity-70 dark:opacity-40"
		aria-hidden="true">
  </div>
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_100%,oklch(0.85_0.08_250/0.12),transparent)] dark:bg-[radial-gradient(ellipse_50%_40%_at_80%_100%,oklch(0.45_0.12_250/0.15),transparent)]"
		aria-hidden="true">
  </div>

	<Navbar />

	<div class="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
		<div
			id="tsparticles"
			class="pointer-events-none absolute inset-0 z-0 min-h-0"
			aria-hidden="true"
		></div>
		<div class="relative z-10 flex min-h-0 flex-1 flex-col">
			{#if !hasConversation}
				<IntroSection />
			{:else}
				<Chatboard {messages} />
			{/if}
		</div>
	</div>

	<div
		class="relative z-10 shrink-0 border-t border-border/60 bg-background/80 px-4 py-4 backdrop-blur-md supports-backdrop-filter:bg-background/60 sm:px-6"
	>
		<section class="mx-auto w-full max-w-2xl space-y-2" aria-labelledby="ask-me-heading">
			<ChatTextField
				bind:value={chatMessage}
				onsend={handleChatSend}
				topics={askTopics}
				class="w-full"
			/>
		</section>
	</div>
</div>
