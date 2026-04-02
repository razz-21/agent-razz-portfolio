<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import { onMount } from 'svelte';

	const cvHref = '/CV - Ernesto Razo [03.25.2026].pdf';
	const githubHref = 'https://github.com/razz-21/';

	type Theme = 'dark' | 'light';

	let theme = $state<Theme>('light');

	function applyTheme(nextTheme: Theme) {
		const root = document.documentElement;
		if (nextTheme === 'dark') root.classList.add('dark');
		else root.classList.remove('dark');
	}

	onMount(() => {
		const storedTheme = localStorage.getItem('theme');
		const initialTheme: Theme =
			storedTheme === 'dark' || storedTheme === 'light'
				? storedTheme
				: window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light';

		theme = initialTheme;
		localStorage.setItem('theme', initialTheme);
		applyTheme(initialTheme);
	});

	function toggleTheme() {
		const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
		theme = nextTheme;
		localStorage.setItem('theme', nextTheme);
		applyTheme(nextTheme);
	}
</script>

<div class="border-b border-t border-teal-300/20 bg-teal-100/20">
  <header
    class="relative z-10 flex shrink-0 items-center justify-between px-4 py-3 sm:px-4 sm:py-2 max-w-7xl mx-auto w-full"
  >
    <Button
      href="/"
      variant="secondary"
      size="icon-lg"
      class="rounded-xl font-bold tracking-tight"
      aria-label="Home"
    >
      R
    </Button>
  
    <nav class="flex items-center gap-1 sm:gap-2" aria-label="Primary">
      <Button href={cvHref} download="Ernesto_Razo_CV.pdf" variant="ghost" class="text-sm font-medium">Get CV</Button>
      <Button
        href={githubHref}
        target="_blank"
        rel="noopener noreferrer"
        variant="ghost"
        size="icon"
        aria-label="GitHub profile"
      >
        <svg
          class="size-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={theme === 'dark'}
        onclick={toggleTheme}
      >
        {@const Icon = theme === 'dark' ? Moon : Sun}
        <Icon class="size-4" aria-hidden="true" />
      </Button>
    </nav>
  </header>
</div>
