<script lang="ts">
  import { Canvas, Layer, type Render } from "svelte-canvas";
  import { selectedToolIndex, toolColor, toolSize, toolsList } from "./tools";
  import { get } from "svelte/store";

  let image_dimension = 7;
  let pixel_size = 8;

  let positions: any[] = toolsList[get(selectedToolIndex)].action(
    Math.floor(image_dimension / 2),
    Math.floor(image_dimension / 2),
    image_dimension
  );

  toolSize.subscribe(() => {
    positions = toolsList[get(selectedToolIndex)].action(
      image_dimension / 2,
      image_dimension / 2,
      image_dimension
    );
  });

  let render: Render;
  $: render = ({ context, width, height }) => {
    context.fillStyle = "#ffffff";
    positions.forEach((pos) => {
      context.fillRect(
        pos.x * pixel_size,
        pos.y * pixel_size,
        pixel_size,
        pixel_size
      );
    });
  };
</script>

<button
  class="w-[64px] h-[64px] flex justify-center items-center "
  on:click={() => {
	toolSize.set($toolSize + 1 > 4 ? 1 :$toolSize + 1)
  }}
>
  <Canvas width={64} height={64}><Layer {render} /></Canvas>
</button>
