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

  let screenWidth: number;
  let screenHeight: number;

  $: getPixelSize = () => {
    let value;
    if ($selectedRoom && screenHeight && screenWidth) {
      if ((screenWidth ?? 0) > 768) {
        value = 5
      } else {
        value = Math.floor(0.5 * screenWidth / ($selectedRoom?.resolution));
      }
    } else {
      value = null;
    }
    return value;
  };

  // const setPixelSize = () => {
  //   pixel_size = getPixelSize();
  // };

  $: pixel_size = getPixelSize();

  // $: {
  //   if ($selectedRoom && screenHeight && screenWidth) {
  //     setPixelSize();
  //   }
  // }

</script>

<div
  bind:clientWidth={screenWidth}
  bind:clientHeight={screenHeight}
  class="w-full h-full flex items-center justify-center"
>
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
        <div class="flex flex-col items-center">
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

          <div class="flex flex-col">
            <ToolSelector />
            <button class="btn variant-filled p-4 m-4 btn-lg" on:click={comp}
              >Envoyer</button
            >
          </div>
        </div>
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
    {/await}
  {:else}
    <p class="text-center lg:max-w-lg max-w-xs">
      Pas de dessin selectionné ! Clique sur le lien du dessin ou rejoins un
      dessin public pour commencer
    </p>
  {/if}
</div>
