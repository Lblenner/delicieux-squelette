<script lang="ts">
  import Right from "svelte-icons/fa/FaCaretLeft.svelte";
  import Left from "svelte-icons/fa/FaCaretRight.svelte";
  import { currentDessin, redoBuffer, undoBuffer } from "../appState";
  import { clone } from "$lib/hash";

  const redo = () => {
    if ($redoBuffer.length != 0) {
      currentDessin.update((dessin) => {
        undoBuffer.update((buff) => {
          buff.push(clone(dessin));
          return buff
        });
        return $redoBuffer[$redoBuffer.length - 1];
      });
      redoBuffer.update((buff) => {
        buff.splice(buff.length - 1);
        return buff;
      });
    }
  };
  const undo = () => {
    if ($undoBuffer.length != 0) {
      currentDessin.update((dessin) => {
        redoBuffer.update((buff) => {
          buff.push(clone(dessin));
          return buff;
        });
        return $undoBuffer[$undoBuffer.length - 1];
      });
      undoBuffer.update((buff) => {
        buff.splice(buff.length - 1);
        return buff;
      });
    }
  };
</script>

<div class="w-[64px] flex flex-row items-center justify-center p-[2px]">
  <button on:click={undo} class={"w-[30px] h-[30px] " + ($undoBuffer.length !== 0 ? "" : "opacity-20")}><Right /></button>
  <button on:click={redo} class={"w-[30px] h-[30px] " + ($redoBuffer.length !== 0 ? "" : "opacity-20")}><Left /></button>
</div>
