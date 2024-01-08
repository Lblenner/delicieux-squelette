<script lang="ts">
  import { onMount, tick } from "svelte";
  import { selectedToolIndex, toolsList, type ToolAction } from "./tools";
  import { get } from "svelte/store";
  import { currentDessin } from "../appState";
  import type { Dessin } from "../types";
  import { createCanvasData } from "./canvasData";

  export let image_resolution: number;
  export let pixel_size: number;
  export let current_dessin: Dessin;

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | null;

  $: buffer = createCanvasData(image_resolution, pixel_size, current_dessin);

  const handleMousemove = (e: MouseEvent) => {
    var rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = Math.floor(x / pixel_size);
    y = Math.floor(y / pixel_size);
    if (e.buttons === 1) {
      applyTool(x, y);
    }
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
    updateDessin(toolAction);
    buffer?.applyToolActions(toolAction);
    buffer?.draw(context);
  };

  const updateDessin = (toolAction: ToolAction[]) => {
    // Update dessin
    currentDessin.update((value) => {
      if (!value) {
        return value;
      }
      let content: number[];
      if (!value.selected_cell.content) {
        content = new Array(image_resolution * image_resolution * 4);
        content.fill(0);
      } else {
        content = value?.selected_cell.content;
      }

      toolAction.forEach((coo) => {
        let pos = (coo.y * image_resolution + coo.x) * 4; // position in buffer based on x and y
        // dessin.splice.apply([pos, 4, ...coo.value]);
        content[pos] = coo.value[0]; // some R value [0, 255]
        content[pos + 1] = coo.value[1]; // some G value
        content[pos + 2] = coo.value[2]; // some B value
        content[pos + 3] = coo.value[3]; // set alpha channel
      });

      content = content.map((value) => (value === null ? 0 : value));

      value.selected_cell.content = content;
      return value;
    });
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
  on:mousemove={handleMousemove}
  on:mousedown={handleMousemove}
  on:touchmove|stopPropagation={handleTouchemove}
/>
