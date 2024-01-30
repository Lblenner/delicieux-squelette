<script lang="ts">
  import BrushVisualisation from "./BrushVisualisation.svelte";
  import ColorPicker from "./ColorPicker.svelte";
  import UndoRedo from "./UndoRedo.svelte";
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
  <div class="flex flex-col mt-1 mb-1">
    {#each toolsList as tool, i}
      <button
        class={"p-1 " + (selected === i
          ? "hover:cursor-default opacity-20"
          : "filter hover:brightness-90")}
        on:click={() => select(i)}
      >
        <div class="w-[24px] h-[24px]">
          <svelte:component this={tool.icon} />
        </div>
      </button>
    {/each}
  </div>
  <div class="w-full mr-4 ml-4 bg-black h-[1px]"></div>
  <BrushVisualisation />
  <div class="w-full mr-4 ml-4 bg-black h-[1px]"></div>
  <UndoRedo />
  <div class="w-full mr-4 ml-4 bg-black h-[1px]"></div>
  <ColorPicker />
</div>
