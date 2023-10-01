<script lang="ts">
	import { onMount } from 'svelte';
	import InfiniteCanvas, { type InfiniteCanvasRenderingContext2D } from 'ef-infinite-canvas';
	import { selectedRoom } from '../appState';
	import type { Cell } from '../types';

	export let width: number;
	export let height: number;
	export let cells: Cell[];

	let canvas: HTMLCanvasElement;
	let context: InfiniteCanvasRenderingContext2D | null;

	const draw = () => {
		if ($selectedRoom && context && canvas) {
			let room = $selectedRoom;
			cells.forEach((cell) => {
				if (!cell.content) return;

				let imageData = new ImageData(room.resolution, room.resolution);
				imageData.data.set(cell.content);
				context?.putImageData(
					imageData,
					cell.x * room.resolution + canvas.width / 2,
					cell.y * room.resolution + canvas.height / 2
				);
			});
		}
	};

	onMount(async () => {
		if (!canvas) return;
		const infinite_canvas = new InfiniteCanvas(canvas);
		infinite_canvas.greedyGestureHandling = true;
		context = infinite_canvas.getContext('2d');
		if (!context) return;
		context.shadowBlur = 0;
		context.imageSmoothingEnabled = false;
		draw();
	});
</script>

<canvas bind:this={canvas} {width} {height} style="width: {width}px; height: {height}px;" />
