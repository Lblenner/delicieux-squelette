<script lang="ts">
  import "../app.postcss";

  import { AppShell, Modal, storePopup } from "@skeletonlabs/skeleton";
  import Header from "../components/navigation/Header.svelte";

  import { initializeStores } from "@skeletonlabs/skeleton";
  initializeStores();

  import {
    computePosition,
    autoUpdate,
    flip,
    shift,
    offset,
    arrow,
  } from "@floating-ui/dom";
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<Modal />

<AppShell>
    <svelte:fragment slot="header">
      <Header />
    </svelte:fragment>
    <slot />
</AppShell>
