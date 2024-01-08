<script lang="ts">
  import { currentDessin, selectedRoom } from "../appState";
  import type { Dessin } from "../types";

  import DrawCanvas from "./DrawCanvas.svelte";
  import SideCellsCanvas from "./SideCellsCanvas.svelte";
  import ToolSelector from "./ToolSelector.svelte";

  let dess: null | Dessin = null;

  currentDessin.subscribe((value) => {
    if (!value) {
      dess = value;
      return;
    }
    if (dess && dess.key == value.key) {
      return;
    }
    dess = value;
  });

  $: getPixelSize = () => {
    let value;
    if ($selectedRoom && screenHeight && screenWidth) {
      if ((screenWidth ?? 0) > screenHeight - 200) {
        value = Math.floor((0.5 * screenHeight) / $selectedRoom?.resolution);;
      } else {
        value = Math.floor((0.65 * screenWidth) / $selectedRoom?.resolution);
      }
    } else {
      value = null;
    }
    return value;
  };

  $: pixel_size = getPixelSize();

  let screenWidth: number;
  let screenHeight: number;

</script>

<div
  class="w-full h-full flex items-center justify-center"
  bind:clientWidth={screenWidth}
  bind:clientHeight={screenHeight}
>
  {#if dess && pixel_size && $selectedRoom}
    <SideCellsCanvas
      current_dessin={dess}
      image_resolution={$selectedRoom.resolution}
      {pixel_size}
    >
      <DrawCanvas
        current_dessin={dess}
        image_resolution={$selectedRoom.resolution}
        {pixel_size}
      />
    </SideCellsCanvas>

    <div class="absolute right-0 top-16">
        <ToolSelector />
    </div>
  {/if}
</div>
