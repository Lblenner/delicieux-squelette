<script lang="ts">
	import { toolColor } from './tools';

	let colors = ['#50d71e', '#9625b3', '#000000', '#c22d00', '#1ff0ec', '#ffffff'];

	let selected_color = colors[0];
	toolColor.update(() => selected_color);

	toolColor.subscribe((value) => {
		selected_color = value
	})
</script>

<div class="w-[144px] flex items-center justify-center flex-col mt-4">
	<div class="grid grid-cols-3 gap-2 mb-2">
		{#each colors as color, i}
			<button
				class=" w-[30px] h-[30px] {selected_color === color
					? 'border-green-600 border-4'
					: 'border-black border-2'}"
				style="background-color : {color};"
				on:click={() => {
					toolColor.update(() => color);
				}}
			/>
		{/each}
	</div>
	{selected_color}
</div>
