<script lang="ts">
  // @ts-ignore
  import FaDown from "svelte-icons/fa/FaChevronDown.svelte";

  import {
    popup,
    storePopup,
    type PopupSettings,
  } from "@skeletonlabs/skeleton";
  import { usersRooms, selectedRoom, setSelectedRoom } from "../appState";
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";

  $: index = $usersRooms?.findIndex((elem) => elem.id === $selectedRoom?.id);

  const popupFeatured: PopupSettings = {
    // Represents the type of event that opens/closed the popup
    event: "click",
    // Matches the data-popup value on your popup element
    target: "popupFeatured",
    // Defines which side of your trigger the popup will appear
    placement: "bottom",
  };
</script>

<button class="btn variant-filled" use:popup={popupFeatured}>
  {#if $selectedRoom?.name}
    <div class="min-w-[200px]">
      {$selectedRoom?.name ?? "Selectionner un dessin"}
    </div>
    <div class="w-[16px] h-[16px] mt-1">
      <FaDown />
    </div>
  {:else}
    pas de dessin selectionné
  {/if}
</button>
<div data-popup="popupFeatured">
  <div class="card p-4 w-72 flex-col flex">
    {#if $usersRooms.length !== 0}
      <RadioGroup
        display="flex-col flex items-stretch"
        rounded="rounded-container-token"
      >
        {#each $usersRooms as r, i}
          <RadioItem
            name={r.name}
            class="p-2 cursor-pointer rounded-none"
            bind:group={index}
            on:change={() => setSelectedRoom(r)}
            value={i}
          >
            <div class="pl-2">{r.name}</div>
          </RadioItem>
        {/each}
      </RadioGroup>
    {:else}
      <a href="/parcourir" class="my-2 btn w-full variant-filled"
        >parcourir les dessins publics</a
      >
    {/if}
    <a href="/gerer_dessins" class="mt-2 btn w-full variant-filled"
      >gerer les dessins</a
    >
    <a href="/creer_dessin" class="mt-2 btn w-full variant-filled"
      >créer un dessins</a
    >
  </div>
</div>
