<script lang="ts">
  import Burger from "./Burger.svelte";
  import MobileNav from "./MobileNav.svelte";
  import { navigationValues } from "./navigation";
</script>

<nav class="w-full h-20">
  <div class="base h-20 w-full flex items-center justify-center text-2xl p-4">
    <MobileNav />
    <Burger />
    <div class="hidden md:flex flex-row items-center gap-10">
      <ul class="gap-10 items-center justify-center flex">
        {#each navigationValues as item}
          <li>
            <a href={item.route}>
              {item.name}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
  <div class="shadow-blend h-12"></div>
</nav>
