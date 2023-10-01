<script lang="ts" setup>
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();
</script>

<div>
	<button
		class="z-50 flex relative w-8 h-8 flex-col justify-between items-center {$drawerStore.open
			? ''
			: 'md:hidden'}"
		on:click={() => ($drawerStore.open ? drawerStore.close() : drawerStore.open())}
	>
		<span class="sr-only">Open main menu</span>
		<!-- {/* hamburger button */} -->
		<span
			class="h-1 w-full bg-white rounded-lg transform transition duration-300 ease-in-out {$drawerStore.open
				? 'rotate-45 translate-y-3.5'
				: ''}"
		/>
		<span
			class="h-1 w-full bg-white rounded-lg transition-all duration-300 ease-in-out {$drawerStore.open
				? 'scale-0'
				: ''}"
		/>
		<span
			class="h-1 w-full bg-white rounded-lg transform transition duration-300 ease-in-out {$drawerStore.open
				? '-rotate-45 -translate-y-3.5'
				: ''}"
		/>
	</button>
</div>
