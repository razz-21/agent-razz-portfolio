<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const rows = [
		{
			label: 'LinkedIn',
			href: 'https://www.linkedin.com/in/razz-ernesto',
			text: 'linkedin.com/in/razz-ernesto',
			external: true
		},
		{
			label: 'Email',
			href: 'mailto:razz.ernesto@gmail.com',
			text: 'razz.ernesto@gmail.com',
			external: false
		},
		{
			label: 'Mobile Number',
			href: 'tel:+639067978160',
			text: '+639067978160',
			external: false
		},
		{
			label: 'Instagram',
			href: 'https://www.instagram.com/razzern/',
			text: '@razzern',
			external: true
		}
	] as const;
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Contact me</Dialog.Title>
			<Dialog.Description>Reach out through any of these channels.</Dialog.Description>
		</Dialog.Header>
		<dl class="grid gap-4">
			{#each rows as row (row.label)}
				<div class="grid gap-1">
					<dt class="text-muted-foreground text-xs font-medium uppercase tracking-wide">{row.label}</dt>
					<dd>
						<a
							href={row.href}
							class="text-primary font-medium underline-offset-4 hover:underline"
							rel="external noopener noreferrer"
							{...(row.external ? { target: '_blank' } : {})}
						>
							{row.text}
						</a>
					</dd>
				</div>
			{/each}
		</dl>
	</Dialog.Content>
</Dialog.Root>
