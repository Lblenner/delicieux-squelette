<script lang="ts">
  import { selectedRoom } from "../appState";

  import DrawCanvas from "./DrawCanvas.svelte";
  import SideCellsCanvas from "./SideCellsCanvas.svelte";

  $: getPixelSize = () => {
    let value;
    if ($selectedRoom && screenHeight && screenWidth) {
      if (screenWidth < 450) {
        value = Math.floor((0.5 * screenWidth) / $selectedRoom?.resolution);
      } else {
        value = Math.floor((0.5 * screenHeight) / $selectedRoom?.resolution);;
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
  class="w-full h-full flex items-center sm:justify-center justify-end"
  bind:clientWidth={screenWidth}
  bind:clientHeight={screenHeight}
>
  {#if pixel_size && $selectedRoom}
    <SideCellsCanvas
      image_resolution={$selectedRoom.resolution}
      {pixel_size}
    >
      <DrawCanvas
        image_resolution={$selectedRoom.resolution}
        {pixel_size}
      />
    </SideCellsCanvas>

  {/if}
</div>
