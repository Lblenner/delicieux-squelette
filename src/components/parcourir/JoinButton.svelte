<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import JoinModal from './JoinModal.svelte';

	let modalComponent: ModalComponent = {
		// Pass a reference to your custom component
		ref: JoinModal,
		// Add the component properties as key/value pairs
		props: {},
		// Provide a template literal for the default component slot
		slot: '<p>Skeleton</p>'
	};

	let modal: ModalSettings = {
		type: 'component',
		component: modalComponent
	};

	const modalStore = getModalStore()
	const onclick = () => {
		modalStore.trigger(modal);
	};
</script>

<button type="button" class="btn variant-filled p-4 btn-lg" on:click={onclick}>Rejoindre</button>
