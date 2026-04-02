import { get, writable } from 'svelte/store';

export type Theme = 'dark' | 'light';

export const themeStore = writable<Theme>('light');

export function setTheme(theme: Theme) {
	themeStore.set(theme);
	localStorage.setItem('theme', theme);
}

export function toggleTheme() {
	const currentTheme = get(themeStore);
	setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}