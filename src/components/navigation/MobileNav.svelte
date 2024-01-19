<script lang="ts" setup>
  import { goto } from "$app/navigation";
  import LanguageSwitch from "./LanguageSwitch.svelte";
  import { navigationValues } from "./navigation";
  import { Drawer, LightSwitch, getDrawerStore } from "@skeletonlabs/skeleton";

  const drawerStore = getDrawerStore();
  function click(route: string) {
    goto(route);
    drawerStore.close();
  }
</script>

<Drawer bgDrawer="base">
  <div
    class="flex items-center justify-center filter drop-shadow-md h-20"
  >
    <!-- {/* potential name */} -->
  </div>
  <div class="flex flex-col items-center">
    {#each $navigationValues as item}
      <button
        class="btn text-2xl hover:text-black"
        on:click={() => click(item.route)}
      >
        <!-- :class="{ 'text-secondary' :  router.pathname==item.route}" -->
        {item.name}
      </button>
    {/each}
  </div>
</Drawer>
