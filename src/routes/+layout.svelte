<script lang="ts">
  import "../app.postcss";
  import "./layout.css";

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

<AppShell class="text-center text-border text-white">
  <svelte:fragment slot="header">
    <Header />
  </svelte:fragment>
  <div class="bgg h-full">
    <slot />
  </div>
</AppShell>
