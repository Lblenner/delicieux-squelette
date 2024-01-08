<script lang="ts">
  import { selectedRoom } from "../appState";
  import { toolColor } from "./tools";

  let colors = $selectedRoom?.colors
    ? $selectedRoom?.colors //.concat(["#33ff35", "#173bac", "#d936a9"])
    : null;

  let selected_color = colors ? colors[0] : null;
  toolColor.update(() => selected_color ?? "");

  toolColor.subscribe((value) => {
    selected_color = value;
  });
</script>

<div class="w-[64px] flex items-center justify-center flex-col p-[2px]">
  <span class="text-sm">{selected_color}</span>
  <div class="grid grid-cols-2 gap-[2px]">
    {#if colors}
      {#each colors as color, i}
        <button
          class=" w-[29px] h-[29px] {selected_color === color
            ? 'border-green-600 border-4'
            : 'border-black border-2'}"
          style="background-color : {color};"
          on:click={() => {
            toolColor.update(() => color);
          }}
        />
      {/each}
    {:else}
      No colors
    {/if}
  </div>
</div>
