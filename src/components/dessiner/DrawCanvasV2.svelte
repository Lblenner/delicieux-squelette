<script lang="ts">
  import { onMount } from "svelte";
  import InfiniteCanvas, {
    type InfiniteCanvasRenderingContext2D,
    type InfiniteCanvasTouchEvent,
  } from "ef-infinite-canvas";
  import { selectedRoom } from "../appState";
  import type { Cell, Dessin } from "../types";

  // export let current_dessin: Dessin;
  // export let resolution: number;
  export let width: number;
  export let height: number;

  let canvas: HTMLCanvasElement;
  let context: InfiniteCanvasRenderingContext2D | null;

  const draw = () => {
    if (context && canvas) {
      context.fillRect(50, 50, 50, 50);
      //   let room = $selectedRoom;
      //   cells.forEach((cell) => {
      //     if (!cell.content) return;
      //     let imageData = new ImageData(room.resolution, room.resolution);
      //     imageData.data.set(cell.content);
      //     context?.putImageData(
      //       imageData,
      //       cell.x * room.resolution + canvas.width / 2,
      //       cell.y * room.resolution + canvas.height / 2
      //     );
      //   });
    }
  };

  const handleMousemove = (e: MouseEvent) => {
    var rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (e.buttons === 1 && context) {
      let matrix = context.getTransform();
      let point = { x: e.clientX, y: e.clientY };
      const transformedPoint = {
        x: matrix.a * point.x + matrix.c * point.y + matrix.e,
        y: matrix.b * point.x + matrix.d * point.y + matrix.f,
      };
      //draw();
      context.fillRect(x, y, 1, 1);


      //applyTool(x, y);
    }
   
  };

  const handleTouchemove = (e: any) => {
    console.log(e.infiniteCanvasY);
  };

  onMount(async () => {
    if (!canvas) return;
    const infinite_canvas = new InfiniteCanvas(canvas);
    //infinite_canvas.greedyGestureHandling = true;
    context = infinite_canvas.getContext("2d");
    if (!context) return;

    canvas.addEventListener("draw", (e: any) => {
      const transformation = e.transformation;
      console.log(transformation);
      console.log("draw event");
      // and this is its inverse
      const inverseTransformation = e.inverseTransformation;
    });
    context.shadowBlur = 0;
    context.imageSmoothingEnabled = false;
    draw();
  });
</script>

<canvas
  bind:this={canvas}
  on:mousemove={handleMousemove}
  on:touchmove={handleTouchemove}
  on:contextmenu|stopPropagation
  {width}
  {height}
  class="bg-slate-600"
  style="width: {width}px; height: {height}px;"
>
  <slot />
</canvas>
