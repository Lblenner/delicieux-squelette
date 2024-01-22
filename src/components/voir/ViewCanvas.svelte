<script lang="ts">
  import { onMount } from "svelte";
  import InfiniteCanvas, {
    type InfiniteCanvasRenderingContext2D,
  } from "ef-infinite-canvas";
  import { selectedRoom } from "../appState";
  import type { Cell } from "../types";

  export let width: number;
  export let height: number;
  export let cells: Cell[];

  let worker: Worker | null;

  let canvas: HTMLCanvasElement;
  let context: InfiniteCanvasRenderingContext2D | null;

  const loadWorker = async () => {
    const SyncWorker = await import("$lib/worker.ts?worker");
    worker = new SyncWorker.default();

    //const url = new URL("/src/service-worker.js", import.meta.url);
    //let worker = new Worker(url);

    worker.onmessage = (e: MessageEvent<any>) => {
      if (e.data.message) {
        console.log("worker: ", e.data.message);
      }
      if (e.data.imageData) {
        try {
          context?.putImageData(
            e.data.imageData,
            e.data.x + canvas.width / 2,
            e.data.y + canvas.height / 2
          );
        } catch (e) {
          console.log("e : ", e);
        }
      }
    };

    if ($selectedRoom?.resolution) {
      worker.postMessage({ res: $selectedRoom?.resolution, cells: cells });
    } else {
      console.log("error drawing : no room selected");
    }
  };

  onMount(() => {
    if (!canvas) return;
    const infinite_canvas = new InfiniteCanvas(canvas);
    infinite_canvas.greedyGestureHandling = true;
    context = infinite_canvas.getContext("2d");
    if (!context) return;
    context.shadowBlur = 0;
    context.imageSmoothingEnabled = false;

    if (window.Worker) {
      loadWorker();

      return () => {
        worker?.terminate();
      };
    } else {
      console.log("no worker capabilities");
    }
  });
</script>

<canvas
  bind:this={canvas}
  {width}
  {height}
  style="width: {width}px; height: {height}px; background-color: #709c8d;"
/>
