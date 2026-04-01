<script lang="ts">
	import Briefcase from '@lucide/svelte/icons/briefcase';
	import Cpu from '@lucide/svelte/icons/cpu';
	import FolderKanban from '@lucide/svelte/icons/folder-kanban';
	import ScrollText from '@lucide/svelte/icons/scroll-text';
	import UserRound from '@lucide/svelte/icons/user-round';
	import ChatTextField from './components/ChatTextField.svelte';
	import Navbar from './components/Navbar.svelte';
	import type { Component } from 'svelte';

	let chatMessage = $state('');

	function handleChatSend(message: string) {
		void message;
		chatMessage = '';
	}

	const askTopics: { label: string; icon: Component }[] = [
		{ label: 'About me', icon: UserRound },
		{ label: 'Experiences', icon: Briefcase },
		{ label: 'Projects', icon: FolderKanban },
		{ label: 'Summary of Me', icon: ScrollText },
		{ label: 'Technical Skills', icon: Cpu },
	];
</script>

<div class="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--color-accent),transparent)] opacity-70 dark:opacity-40"
		aria-hidden="true">
  </div>
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_100%,oklch(0.85_0.08_250/0.12),transparent)] dark:bg-[radial-gradient(ellipse_50%_40%_at_80%_100%,oklch(0.45_0.12_250/0.15),transparent)]"
		aria-hidden="true">
  </div>

	<Navbar />

	<main class="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-12 pb-8">
		<div class="max-w-2xl text-center">
			<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
				Hi, welcome to <span class="text-primary font-bold italic">RazzDev</span>
			</h1>
			<p class="mt-4 text-lg text-muted-foreground sm:text-xl md:text-lg">
				Chat with the assistant about my experience, skills, and projects. It's focused on my story and what's on this site.
			</p>

		</div>
	</main>

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
