<script lang="ts">
	import Burger from './Burger.svelte';
	import MobileNav from './MobileNav.svelte';
	import { navigationValues } from './navigation';
	import RoomSelect from './RoomSelect.svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
</script>

<nav class="w-full h-20 bg-surface-50-900-token flex items-center text-2xl p-4">
	<MobileNav />
	<Burger />
	<div class="w-full hidden md:flex flex-row items-center gap-10">
		<ul class="gap-20 items-center justify-center flex">
			{#each navigationValues as item}
				<li>
					<a href={item.route}>
						{item.name}
					</a>
				</li>
			{/each}
		</ul>
		<div class="flex flex-1" />
		<LightSwitch />
		<RoomSelect />
	</div>
</nav>
