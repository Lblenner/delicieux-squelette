<script lang="ts">
  import { onMount, tick } from "svelte";
  import { selectedToolIndex, toolsList, type ToolAction } from "./tools";
  import { get } from "svelte/store";
  import {
    currentDessin,
    redoBuffer,
    undoBuffer,
    updateDessin,
  } from "../appState";
  import { createCanvasData } from "./canvasData";
  import { clone } from "$lib/hash";

  export let image_resolution: number;
  export let pixel_size: number;

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | null;

  $: buffer = createCanvasData(image_resolution, pixel_size, $currentDessin);

  const mouseEnter = (e) => {
    if (e.buttons === 1) {
      undoBuffer.update((value) => {
        value.push(clone($currentDessin));
        return value;
      });
      redoBuffer.set([]);
      draw(e);
    }
  };

  const draw = (e: MouseEvent) => {
    if (e.buttons === 1) {
      var rect = canvas.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      x = Math.floor(x / pixel_size);
      y = Math.floor(y / pixel_size);
      applyTool(x, y);
    }
  };

  const touchEnter = (e) => {
    undoBuffer.update((value) => {
      value.push(clone($currentDessin));
      return value;
    });
    redoBuffer.set([]);
    handleTouchemove(e);
  };

  const handleTouchemove = (e: TouchEvent) => {
    var rect = canvas.getBoundingClientRect();
    if (
      e.touches[0].clientX >= rect.left &&
      e.touches[0].clientX <= rect.right &&
      e.touches[0].clientY >= rect.top &&
      e.touches[0].clientY <= rect.bottom
    ) {
      let x = e.touches[0].clientX - rect.left;
      let y = e.touches[0].clientY - rect.top;

      x = Math.floor(x / pixel_size);
      y = Math.floor(y / pixel_size);
      applyTool(x, y);
    }
  };

  const applyTool = (x: number, y: number) => {
    let tool = toolsList[get(selectedToolIndex)];
    let toolAction = tool.action(x, y, image_resolution);
    updateDessin(toolAction, image_resolution);
    // buffer?.applyToolActions(toolAction); //idea of not recreating the buffer all dessin update
    buffer?.draw(context);
  };

  onMount(async () => {
    if (!canvas) return;
    context = canvas.getContext("2d");
    if (!context) return;
  });

  $: {
    if (canvas && context) {
      canvas.width = image_resolution * pixel_size;
      canvas.height = image_resolution * pixel_size;
      buffer?.draw(context);
    }
  }
</script>

<canvas
  bind:this={canvas}
  style="width: {image_resolution * pixel_size}px; height: {image_resolution *
    pixel_size}px;"
  class="bg-[#5d9281] touch-none"
  on:mousemove={draw}
  on:mousedown={mouseEnter}
  on:mouseenter={mouseEnter}
  on:touchmove|stopPropagation={handleTouchemove}
  on:touchstart|stopPropagation={touchEnter}
/>
