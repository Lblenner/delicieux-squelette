<script lang="ts">
  import ViewCanvas from "./ViewCanvas.svelte";
  import { currentCells } from "../appState";

  let height: number;
  let width: number;
</script>

<svelte:window />

<div
  bind:clientWidth={width}
  bind:clientHeight={height}
  class="bg-surface-100-800-token w-screen h-[calc(100vh_-_5rem)]"
>
  {#await $currentCells}
    Load
  {:then cells}
    {#if cells}
      <ViewCanvas {width} {height} {cells} />
    {:else}
      <div class="flex flex-col items-center justify-center p-4 gap-2">
        <p class="text-center lg:max-w-lg max-w-xs">
          Pas de dessin selectionné ! Clique sur le lien du dessin ou rejoins un
          dessin public pour commencer
        </p>
      </div>
    {/if}
  {/await}
</div>
