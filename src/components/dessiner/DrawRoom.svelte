<script lang="ts">
  import {
    request,
    currentDessin,
    selectedRoom,
    complete,
    cancelDessin,
  } from "../../components/appState";
  import ChooseRoom from "./ChooseRoom.svelte";
  import Draw from "./Draw.svelte";
  // @ts-ignore
  import FaArrowLeft from "svelte-icons/fa/FaArrowLeft.svelte";

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
</script>

<div class="w-full h-full flex items-center justify-center">
  {#if error}
    <div
      class="w-full card bg-error-200-700-token text-error-800-100-token p-4"
    >
      {error}
    </div>
  {/if}

  {#await promise}
    load ...
  {:then}
    {#if $currentDessin}
      <Draw />
      <div class="absolute h-16 w-16 top-36 left-4">
        <button
          class="h-full w-fulltext-base"
          on:click={() => {
            cancelDessin();
          }}
        >
          <FaArrowLeft />
        </button>
      </div>
      <div class="absolute bottom-0 ml-auto mr-auto">
        <button class="btn variant-filled p-4 m-4 btn-lg" on:click={comp}
          >Envoyer</button
        >
      </div>
    {:else}
      <div class="flex flex-col items-center p-4 gap-2 lg:max-w-lg max-w-xs">
        <ChooseRoom />
        {#if $selectedRoom}
          <button
            class="btn variant-filled p-4 m-2 btn-lg bg-black"
            on:click={req}>Demander un dessin</button
          >
        {/if}
      </div>
    {/if}
  {/await}
</div>
