<script lang="ts">
  import { selectedRoom } from "../appState";
  import { toolColor } from "./tools";

  let colors = $selectedRoom?.colors;

  let selected_color = colors ? colors[0] : null;
  toolColor.update(() => selected_color ?? "");

  toolColor.subscribe((value) => {
    selected_color = value;
  });
</script>

<div class="w-[144px] flex items-center justify-center flex-col">
  <span>Couleur : {selected_color}</span>
  <div class="grid grid-cols-3 gap-2 mt-2">
    {#if colors}
      {#each colors as color, i}
        <button
          class=" w-[30px] h-[30px] {selected_color === color
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
