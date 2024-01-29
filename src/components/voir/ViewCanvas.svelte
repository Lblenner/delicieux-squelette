<script lang="ts">
  import { onMount } from "svelte";
  import InfiniteCanvas, {
  } from "ef-infinite-canvas";
  import { selectedRoom } from "../appState";
  import type { Cell } from "../types";
  import { _ } from "svelte-i18n";
  import FaArrowLeft from "svelte-icons/fa/FaArrowLeft.svelte";
  import FaArrowRight from "svelte-icons/fa/FaArrowRight.svelte";
  import FaArrowDown from "svelte-icons/fa/FaArrowDown.svelte";
  import FaArrowUp from "svelte-icons/fa/FaArrowUp.svelte";
  import FaPlus from "svelte-icons/fa/FaPlus.svelte";
  import FaMinus from "svelte-icons/fa/FaMinus.svelte";

  export let width: number;
  export let height: number;
  export let cells: Cell[];

  let worker: Worker | null;

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | null;

  let middlex = width / 2;
  let middley = height / 2;
  let scale = 1;

  const move = (x, y) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    middlex += x;
    middley += y;
    worker.postMessage({
      res: $selectedRoom?.resolution,
      cells: cells,
      wait: false,
    });
  };

  function scaleImageData(imageData, scale) {
    var scaled = context.createImageData(
      imageData.width * scale,
      imageData.height * scale
    );

    for (var row = 0; row < imageData.height; row++) {
      for (var col = 0; col < imageData.width; col++) {
        var sourcePixel = [
          imageData.data[(row * imageData.width + col) * 4 + 0],
          imageData.data[(row * imageData.width + col) * 4 + 1],
          imageData.data[(row * imageData.width + col) * 4 + 2],
          imageData.data[(row * imageData.width + col) * 4 + 3],
        ];
        for (var y = 0; y < scale; y++) {
          var destRow = row * scale + y;
          for (var x = 0; x < scale; x++) {
            var destCol = col * scale + x;
            for (var i = 0; i < 4; i++) {
              scaled.data[(destRow * scaled.width + destCol) * 4 + i] =
                sourcePixel[i];
            }
          }
        }
      }
    }

    return scaled;
  }

  const zoom = (value) => {
    if (value) {
      scale += 1;
    } else {
      if (scale <= 1) {
        return;
      }
      scale -= 1;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    worker.postMessage({
      res: $selectedRoom?.resolution,
      cells: cells,
      wait: false,
    });
  };

  const loadWorker = async () => {
    const SyncWorker = await import("$lib/worker.ts?worker");
    worker = new SyncWorker.default();

    //const url = new URL("/src/service-worker.js", import.meta.url);
    //let worker = new Worker(url);

    worker.onmessage = async (e: MessageEvent<any>) => {
      if (e.data.message) {
        console.log("worker: ", e.data.message);
      }
      if (e.data.imageData) {
        let data;
        if (is_safari) {
          data = scaleImageData(e.data.imageData, scale);
        } else {
          data = e.data.imageData;
        }

        context?.putImageData(
          data,
          e.data.x * scale + middlex,
          e.data.y * scale + middley
        );
      }
    };

    if ($selectedRoom?.resolution) {
      worker.postMessage({
        res: $selectedRoom?.resolution,
        cells: cells,
        wait: true,
      });
    } else {
      console.log("error drawing : no room selected");
    }
  };

  let is_safari = navigator.userAgent.indexOf("Safari") > -1;
  var is_chrome = navigator.userAgent.indexOf("Chrome") > -1;
  if (is_chrome && is_safari) {
    is_safari = false;
  }

  onMount(() => {
    if (!canvas) return;

    if (is_safari) {
      context = canvas.getContext("2d");
    } else {
      const infinite_canvas = new InfiniteCanvas(canvas);
      infinite_canvas.greedyGestureHandling = true;
      context = infinite_canvas.getContext("2d");
    }

    if (!context) return;
    context.shadowBlur = 0;
    context.imageSmoothingEnabled = false;

    if (window.Worker) {
      loadWorker();

      return () => {
        worker?.terminate();
      };
    } else {
      console.log("no worker capabilities");
    }
  });
</script>

<div style="width: {width}px; height: {height}px;">
  {#if is_safari}
    <div
      class="absolute top-0 bottom-0 right-0 flex justify-center items-center"
    >
      <div class="base rounded-md w-[5.5rem]">
        <div class="no-text-border text-xs pb-0 p-2">
          {$_("safari_bug")}
        </div>
        <div class="flex flex-row gap-2 m-2 text-[#134705]">
          <button
            on:click={() => {
              zoom(true);
            }}
            class="h-8 w-8 bg-dessin rounded-md"
          >
            <FaPlus />
          </button>
          <button
            on:click={() => {
              zoom(false);
            }}
            class="h-8 w-8 bg-dessin rounded-md"
          >
            <FaMinus />
          </button>
        </div>

        <div class="flex flex-row gap-1 m-1 text-[#134705]">
          <div class="h-6 w-6"></div>
          <button
            on:click={() => {
              move(0, 50);
            }}
            class="h-6 w-6 bg-dessin rounded-md"
          >
            <FaArrowUp />
          </button>
          <div class="h-6 w-6"></div>
        </div>
        <div class="flex flex-row gap-1 m-1 mb-2 text-[#134705]">
          <button
            on:click={() => {
              move(50, 0);
            }}
            class="h-6 w-6 bg-dessin rounded-md"
          >
            <FaArrowLeft />
          </button>
          <button
            on:click={() => {
              move(0, -50);
            }}
            class="h-6 w-6 bg-dessin rounded-md"
          >
            <FaArrowDown />
          </button>
          <button
            on:click={() => {
              move(-50, 0);
            }}
            class="h-6 w-6 bg-dessin rounded-md"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  {/if}

  <canvas
    bind:this={canvas}
    {width}
    {height}
    style="width: {width}px; height: {height}px; background-color: #709c8d;"
  />
</div>
