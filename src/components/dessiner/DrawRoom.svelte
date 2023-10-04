<script lang="ts">
  import {
    request,
    currentDessin,
    selectedRoom,
    complete,
  } from "../../components/appState";
  import DrawCanvas from "../../components/dessiner/DrawCanvas.svelte";
  import ToolSelector from "../../components/dessiner/ToolSelector.svelte";
  import type { Dessin } from "../../components/types";
  import SideCellsCanvas from "./SideCellsCanvas.svelte";

  let promise: Promise<void>;
  let error: string = "";

  const req = () => {
    promise = request().catch((e) => {
      error = e;
    });
  };

  const comp = () => {
    promise = complete().catch((e) => {
      error = e;
    });
  };

  let dess: null | Dessin;

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

  let screenWidth: number | undefined;
  let screenHeight: number | undefined;

  const getPixelSize = () => {
    let value;
    if ($selectedRoom && screenHeight && screenWidth) {
      if ((screenWidth ?? 0) > 768) {
        value = Math.floor(screenHeight / (2.5 * $selectedRoom?.resolution));
      } else {
        value = Math.floor(screenWidth / (2 * $selectedRoom?.resolution));
      }
    } else {
      value = null;
    }
    return value;
  };

  const setPixelSize = () => {
    pixel_size = getPixelSize();
  };

  let pixel_size = getPixelSize();

  $: {
    if ($selectedRoom && screenHeight && screenWidth) {
      setPixelSize();
    }
  }
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />

<div class="flex flex-col items-center justify-center p-4 gap-2">
  {#if error}
    <div
      class="w-full card bg-error-200-700-token text-error-800-100-token p-4"
    >
      {error}
    </div>
  {/if}
  {#if $selectedRoom}
    {#await promise}
      load ...
    {:then}
      {#if dess && pixel_size}
        <div class="flex items-center flex-row">
          <SideCellsCanvas
            image_resolution={$selectedRoom?.resolution ?? 0}
            {pixel_size}
            current_dessin={dess}
          >
            <DrawCanvas
              image_resolution={$selectedRoom?.resolution ?? 0}
              {pixel_size}
              current_dessin={dess}
            />
          </SideCellsCanvas>
          <ToolSelector />
        </div>

        <button class="btn variant-filled p-4 m-4 btn-lg" on:click={comp}
          >Envoyer</button
        >
        <!-- <label
          class="label w-[200px] text-center px-2"
          on:touchmove|preventDefault
          for="slide"
        >
          <span>Taille du dessin</span>
          <input
            id="slide"
            type="range"
            min="1"
            max="20"
            bind:value={pixel_size}
            step="1"
            class=" input w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </label> -->
      {:else}
        <div class="flex flex-col items-center p-4 gap-2 lg:max-w-lg max-w-xs">
          <p class="text-center whitespace-pre-line">
            Dessin selectionné : <span class="text-token"
              >{$selectedRoom.name}</span
            >

            Une fois que le dessin est demandé, l'emplacement est reservé
            pendant 15 minutes.
          </p>
          {#if $selectedRoom.rules}
            <p class="text-center whitespace-pre-line">
              Description de la salle :
            </p>
            <p class="w-full bg-surface-50-900-token p-2 whitespace-pre-line">
              {$selectedRoom.rules}
            </p>
          {/if}

          <button class="btn variant-filled p-4 m-4 btn-lg" on:click={req}
            >Demander un dessin</button
          >
        </div>
      {/if}
      <!-- {:catch error}
			Error
			<button class="btn variant-filled p-4 m-4 btn-lg" on:click={req}>Demander un dessin</button> -->
    {/await}
  {:else}
    <p class="text-center lg:max-w-lg max-w-xs">
      Pas de dessin selectionné ! Clique sur le lien du dessin ou rejoins un
      dessin public pour commencer
    </p>
  {/if}
</div>
