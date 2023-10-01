<script lang="ts">
	import '../app.postcss';

	import { AppShell, Drawer, Modal, storePopup } from '@skeletonlabs/skeleton';
	import Header from '../components/navigation/Header.svelte';
	import { initStores, type InitAppState } from '../components/appState';
    import { onMount } from 'svelte';

	import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();

	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	
	/** @type {import('./$types').PageData} */
	export let data: InitAppState;

	onMount(() => {
		initStores(data);
	});


</script>


<Modal />
<Drawer />

<AppShell>
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>
	<slot />
</AppShell>
