<script lang="ts">
	import BrushVisualisation from './BrushVisualisation.svelte';
	import ColorPicker from './ColorPicker.svelte';
	import SizeSlider from './SizeSlider.svelte';
	import { selectedToolIndex, toolsList } from './tools';

	let selected: null | number;

	function select(index: number) {
		selectedToolIndex.update((old) => index);
	}
	selectedToolIndex.subscribe((value) => {
		selected = value;
	});
</script>

<div class="card flex-row flex items-center">
	<div class="flex flex-col">
		{#each toolsList as tool, i}
		<button
			class={'flex flex-row p-[8px] items-center ' +
				(selected === i
					? 'hover:cursor-default bg-surface-200-700-token'
					: 'filter hover:brightness-90')}
			on:click={() => select(i)}
		>
			<div class="w-[32px] h-[32px]">
				<svelte:component this={tool.icon} />
			</div>
			<div class="w-[96px] text-center">
				{tool.name}
			</div>
		</button>
	{/each}
	</div>
	<div class="flex flex-col">
		<BrushVisualisation />
		<SizeSlider />
	</div>
	
	<ColorPicker />
</div>
