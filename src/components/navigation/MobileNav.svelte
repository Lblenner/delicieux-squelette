<script lang="ts" setup>
	import { goto } from '$app/navigation';
	import { navigationValues } from './navigation';
	import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';

	// export let open: boolean;
	// export let setOpen: () => void;

	function click(route: string) {
		goto(route);
		getDrawerStore().close();
	}
</script>

<Drawer>
	<div class="flex items-center justify-center filter drop-shadow-md bg-primary-light h-20">
		<!-- {/* potential name */} -->
	</div>
	<div class="flex flex-col">
		{#each navigationValues as item}
			<button
				class="text-2xl my-4 block py-2 pl-3 pr-4 rounded mx-16
            hover:text-black hover:bg-primary-light"
				on:click={() => click(item.route)}
			>
				<!-- :class="{ 'text-secondary' :  router.pathname==item.route}" -->
				{item.name}
			</button>
		{/each}
	</div>
</Drawer>

<!-- <div
	class={'bg-primary z-10 absolute top-0 left-0 h-screen w-screen transform transition-transform duration-300 ease-in-out filter drop-shadow-md ' +
		(open ? '-translate-x-0' : '-translate-x-full')}
>
	<div class="flex items-center justify-center filter drop-shadow-md bg-primary-light h-20">
		{/* potential name */} 
	</div>
	<div class="flex flex-col">
		{#each navigationValues as item}
			<button
				class="text-2xl my-4 block py-2 pl-3 pr-4 rounded mx-16
            text-white hover:text-black hover:bg-primary-light"
				on:click={() => click(item.route)}
			>
				 :class="{ 'text-secondary' :  router.pathname==item.route}" 
				{item.name}
			</button>
		{/each}
	</div>
</div> -->
