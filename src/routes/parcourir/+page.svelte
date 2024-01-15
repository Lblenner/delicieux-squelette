<script lang="ts">
  import { onMount } from "svelte";
  import RoomJoin from "../../components/parcourir/RoomJoin.svelte";
  import { allRooms } from "../../components/appState";
  import type { Room } from "../../components/types";

  /** @type {import('./$types').PageData} */
  export let data: { allRooms: Room[] };

  onMount(() => {
    allRooms.set(data.allRooms);
  });
</script>

<div class="bg-primary w-full h-full pt-12">
  <RoomJoin />
</div>

