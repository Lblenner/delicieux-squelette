<script lang="ts">
  export let image_resolution: number;
  export let pixel_size: number;
  export let current_dessin: Dessin;

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | null;

  import type { Dessin } from "../types";
  import { onMount } from "svelte";

  $: dxy = image_resolution * 0.25 * pixel_size;
  $: w = image_resolution * pixel_size + dxy * 2;
  $: h = w;

  $: drawBuffer = (
    current_dessin: Dessin,
    image_resolution: number,
    pixel_size: number
  ) => {
    if (!context || pixel_size == -1) {
      return;
    }

    current_dessin.side_cells.forEach((cell) => {
      if (!cell.content) {
        let imageData = new ImageData(
          image_resolution * pixel_size,
          image_resolution * pixel_size
        );
        let content = new Uint8ClampedArray(
          image_resolution * image_resolution * pixel_size * pixel_size * 4
        );
        content.forEach((_, content_index) => {
          if (content_index % 4 == 3) {
            content[content_index] = 128;
            return;
          }
          content[content_index] = 0;
        });

        imageData.data.set(content);

        let x =
          dxy +
          image_resolution *
            pixel_size *
            (cell.x - current_dessin.selected_cell.x);
        let y =
          dxy +
          image_resolution *
            pixel_size *
            (cell.y - current_dessin.selected_cell.y);

        setTimeout(function () {
          context?.putImageData(imageData, x, y);
        }, 10);
        return;
      }

      if (cell.content.length !== image_resolution * image_resolution * 4) {
        return;
      }

      let imageData = new ImageData(
        image_resolution * pixel_size,
        image_resolution * pixel_size
      );

      let content = toBuffer(cell.content, image_resolution, pixel_size);

      imageData.data.set(content);

      let x =
        dxy +
        image_resolution *
          pixel_size *
          (cell.x - current_dessin.selected_cell.x);
      let y =
        dxy +
        image_resolution *
          pixel_size *
          (cell.y - current_dessin.selected_cell.y);

      setTimeout(function () {
        context?.putImageData(imageData, x, y);
      }, 10);
    });
  };

  $: drawBuffer(current_dessin, image_resolution, pixel_size);

  function toBuffer(content: number[], res: number, pix_size: number) {
    let buffer = new Uint8ClampedArray(res * res * pix_size * pix_size * 4);

    content.forEach((_, content_index) => {
      if (content_index % 4 !== 0) {
        return;
      }
      let x = (content_index / 4) % res;
      let y = Math.floor(content_index / 4 / res);
      for (let i = 0; i < pix_size; i++) {
        for (let j = 0; j < pix_size; j++) {
          let bufferPos =
            (x * pix_size + i + (j + y * pix_size) * res * pix_size) * 4;
          buffer[bufferPos] = content[content_index];
          buffer[bufferPos + 1] = content[content_index + 1];
          buffer[bufferPos + 2] = content[content_index + 2];
          buffer[bufferPos + 3] = content[content_index + 3];
        }
      }
    });
    return buffer;
  }

  onMount(async () => {
    if (!canvas) return;
    context = canvas.getContext("2d");
    if (!context) return;
    // drawBuffer(current_dessin,im)
  });
</script>

<div class="card p-4">
  <div style="width: {w}px; height: {h}px">
    <div class="relative bg-slate-500/[0.7]">
      <canvas
        bind:this={canvas}
        width={w}
        height={h}
        style="width: {w}px; height: {h}px;"
      />

      <div
        style="width: {image_resolution *
          pixel_size}px; height: {image_resolution *
          pixel_size}px; top: {dxy}px; left: {dxy}px"
        class="absolute top-0 bg-blue-950"
      >
        <slot />
      </div>
    </div>
  </div>
</div>
