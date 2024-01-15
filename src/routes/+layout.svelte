<script lang="ts">
  import "../app.postcss";
  import "./layout.css";

  import { AppShell, Modal, storePopup } from "@skeletonlabs/skeleton";
  import Header from "../components/navigation/Header.svelte";

  import { initializeStores } from "@skeletonlabs/skeleton";
  import { isLoading } from "svelte-i18n";
  import {
    computePosition,
    autoUpdate,
    flip,
    shift,
    offset,
    arrow,
  } from "@floating-ui/dom";
  import { initLang } from "../i18n";

  initializeStores();
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
  initLang()
</script>

<Modal />

{#if $isLoading}
  Please wait...
{:else}
  <AppShell class="text-center text-border text-white">
    <svelte:fragment slot="header">
      <Header />
    </svelte:fragment>
    <div class="bgg h-full">
      <slot />
    </div>
  </AppShell>
{/if}
