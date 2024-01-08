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

<div class="bg-[#432C78] w-full h-full p-20">
  <RoomJoin />
</div>

