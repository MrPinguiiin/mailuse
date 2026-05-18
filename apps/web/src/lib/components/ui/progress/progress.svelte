<script lang="ts">
  import { cn, type WithElementRef, type WithoutChildren } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    value = 0,
    max = 100,
    class: className,
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> & { value?: number; max?: number } = $props();

  let percentage = $derived(Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0)));
</script>

<div
  bind:this={ref}
  data-slot="progress"
  class={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
  {...restProps}
>
  <div
    data-slot="progress-indicator"
    class="h-full w-full flex-1 bg-primary transition-transform duration-500 ease-out"
    style={`transform: translateX(-${100 - percentage}%);`}
  ></div>
</div>
