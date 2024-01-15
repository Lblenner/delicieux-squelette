<script lang="ts" setup>
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();
</script>

<div>
	<button
		class="z-50 flex relative sm:w-8 sm:h-8  h-6 w-6 flex-col justify-between items-center {$drawerStore.open
			? ''
			: 'md:hidden'}"
		on:click={() => ($drawerStore.open ? drawerStore.close() : drawerStore.open())}
	>
		<span class="sr-only">Open main menu</span>
		<!-- {/* hamburger button */} -->
		<span
			class="h-1 w-full bg-white rounded-lg transform transition duration-300 ease-in-out {$drawerStore.open
				? 'rotate-45 sm:translate-y-3.5 translate-y-2.5'
				: ''}"
		/>
		<span
			class="h-1 w-full bg-white rounded-lg transition-all duration-300 ease-in-out {$drawerStore.open
				? 'scale-0'
				: ''}"
		/>
		<span
			class="h-1 w-full bg-white rounded-lg transform transition duration-300 ease-in-out {$drawerStore.open
				? '-rotate-45 sm:-translate-y-3.5 -translate-y-2.5'
				: ''}"
		/>
	</button>
</div>
