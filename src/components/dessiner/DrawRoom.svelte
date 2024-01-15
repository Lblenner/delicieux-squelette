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
  import ToolSelector from "./ToolSelector.svelte";

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

<div class="w-full h-full flex flex-col justify-center items-center">
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
      <div class="absolute h-16 w-16 top-36 left-4"></div>
      <div class="absolute bottom-0 ml-auto mr-auto">
        <button class="btn variant-filled p-4 m-4 btn-lg" on:click={comp}
          >Envoyer</button
        >
      </div>
      <div class="absolute left-0">
        <div>
          <button
            class="h-16 w-16"
            on:click={() => {
              cancelDessin();
            }}
          >
            <FaArrowLeft />
          </button>
          <ToolSelector />
        </div>
      </div>
    {:else}
      <div
        class="flex flex-col items-center p-4 gap-2 bg-dessin rounded-3xl shadow-fuzz no-text-border m-2"
      >
        <ChooseRoom />
        {#if $selectedRoom}
          <button
            class="btn variant-filled p-3 m-1 btn-sm bg-black"
            on:click={req}>Demander un dessin</button
          >
        {/if}
      </div>
    {/if}
  {/await}
</div>
