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
	import { fetchChatTextStream } from '../services/chat.service.js';
	import type { ChatMessage } from '$lib/types/chat.js';
	import type { Component } from 'svelte';
	import { onMount, tick } from 'svelte';
	import { loadSlim } from '@tsparticles/slim';
	import { tsParticles } from '@tsparticles/engine';
	import type { Container } from '@tsparticles/engine';
	import { themeStore } from '$lib/store/theme.store';

	let particleColor = $derived(
		$themeStore === 'dark' ? '#b7b5c225' : '#E5E4E9'
	)

	const particlesConfig = $derived(
		{
			fullScreen: { enable: false },
			background: { color: { value: 'transparent' } },
			particles: {
				color: {
					value: particleColor
				},
				links: {
					enable: true,
					color: particleColor
				},
				move: {
					enable: true
				},
				opacity: {
					value: 0.5
				},
				number: {
					value: 50
				}
			},
			style: {
				position: 'absolute',
				height: '100%',
				width: '100%'
			}
		}
	)

	let chatMessage = $state('');
	let messages = $state<ChatMessage[]>([]);
	let isRequesting = $state(false);

	let instance: Container | undefined;

	const hasConversation = $derived(messages.length > 0);

	const askTopics: { label: string; icon: Component, prompt: string }[] = [
		{
			label: 'About me',
			icon: UserRound,
			prompt:
				'Tell me about Ernesto Razo'
		},
		{
			label: 'Experiences',
			icon: Briefcase,
			prompt:
				"Tell me the work experience of Ernesto Razo"
		},
		{
			label: 'Projects',
			icon: FolderKanban,
			prompt:
				"Provide me a list of projects Ernesto Razo has worked on"
		},
		{
			label: 'Summary of Me',
			icon: ScrollText,
			prompt:
				"Create a 'Summary of Ernesto Razo' using headings and bullet points for strengths, skills, motivations, problem-solving approach."
		},
		{
			label: 'Technical Skills',
			icon: Cpu,
			prompt:
				"List Ernesto Razo's technical skills."
		}
	];

	$effect(() => {
		if (instance && particleColor) {
			const options = instance.options as any;
			options.particles.color.value = particleColor;
			options.particles.links.color = particleColor;
			void instance.refresh();
		}
	})

	onMount(() => {
		let cancelled = false;

		void (async () => {
			await loadSlim(tsParticles);
			if (cancelled) return;
			instance = await tsParticles.load({
				id: 'tsparticles',
				options: particlesConfig
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

	async function handleChatSend(message: string) {
		const trimmed = message.trim();
		if (!trimmed || isRequesting) return;

		const userTurn: ChatMessage = {
			id: crypto.randomUUID(),
			role: 'user',
			content: trimmed
		};

		const assistantId = crypto.randomUUID();
		const assistantTurn: ChatMessage = {
			id: assistantId,
			role: 'assistant',
			content: ''
		};

		messages = [...messages, userTurn, assistantTurn];
		chatMessage = '';

		isRequesting = true;

		const errorMessage = 'Sorry — something went wrong. Please try again.';
		void (async () => {
			try {
				for await (const chunk of fetchChatTextStream({ message: trimmed })) {
					messages = messages.map((m) =>
						m.id === assistantId
							? {
									...m,
									content: m.content + chunk
								}
							: m
					);
				}
			} catch {
				messages = messages.map((m) =>
					m.id === assistantId
						? {
								...m,
								content: errorMessage
							}
						: m
				);
			} finally {
				isRequesting = false;
			}
		})();

		await tick();
		scrollToBottom();
	}

	function scrollToBottom() {
		const chatboard = document.getElementById('chatboard');
		if (chatboard) {
			chatboard.scrollTop = chatboard.scrollHeight;
			chatboard.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<div
	class="relative flex max-h-dvh min-h-dvh flex-col overflow-hidden bg-background text-foreground"
>
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--color-accent),transparent)] opacity-70 dark:opacity-40"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_100%,oklch(0.85_0.08_250/0.12),transparent)] dark:bg-[radial-gradient(ellipse_50%_40%_at_80%_100%,oklch(0.45_0.12_250/0.15),transparent)]"
		aria-hidden="true"
	></div>

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
				<Chatboard {messages} {isRequesting} />
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
				disabled={isRequesting}
				class="w-full"
			/>
		</section>
	</div>
</div>
