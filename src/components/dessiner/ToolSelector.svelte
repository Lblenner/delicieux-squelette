<script lang="ts">
  import BrushVisualisation from "./BrushVisualisation.svelte";
  import ColorPicker from "./ColorPicker.svelte";
  import { selectedToolIndex, toolsList } from "./tools";

  let selected: null | number;

  function select(index: number) {
    selectedToolIndex.update((old) => index);
  }
  selectedToolIndex.subscribe((value) => {
    selected = value;
  });
</script>

<div class="flex-col flex items-center bg-[rgb(19,71,5)] rounded-lg p-1">
  {#each toolsList as tool, i}
    <button
      class={"flex flex-row pt-2 pb-2 p-[16px] items-center " +
        (selected === i
          ? "hover:cursor-default opacity-20"
          : "filter hover:brightness-90")}
      on:click={() => select(i)}
    >
      <div class="w-[24px] h-[24px]">
        <svelte:component this={tool.icon} />
      </div>
    </button>
  {/each}
  <BrushVisualisation />

  <ColorPicker />
</div>
