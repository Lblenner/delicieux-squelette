<script lang="ts">
  import ViewCanvas from "./ViewCanvas.svelte";
  import { currentCells } from "../appState";
  // @ts-ignore
  import FaArrowLeft from "svelte-icons/fa/FaArrowLeft.svelte";
  import { goto } from "$app/navigation";

  import { _ } from 'svelte-i18n'

  let height: number;
  let width: number;
</script>

<svelte:window />

<div bind:clientWidth={width} bind:clientHeight={height} class="w-full h-full">
  <div class="absolute h-16 w-16 top-16 left-4">
    <button
      class="h-full w-fulltext-base"
      on:click={() => {
        goto("/voir");
      }}
    >
      <FaArrowLeft />
    </button>
  </div>

  {#await $currentCells}
    <div class="pt-32">{$_('loading')}</div>
  {:then cells}
    {#if cells}
      <ViewCanvas {width} {height} {cells} />
    {:else}
      <div class="flex flex-col items-center justify-center p-4 gap-2">
        <p class="text-center lg:max-w-lg max-w-xs">
          Pas de dessin selectionné !
        </p>
      </div>
    {/if}
  {/await}
</div>
