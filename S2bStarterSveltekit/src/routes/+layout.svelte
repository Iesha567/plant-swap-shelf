<script>
	import favicon from '#lib/assets/favicon.svg';
	import './classless (1).css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
