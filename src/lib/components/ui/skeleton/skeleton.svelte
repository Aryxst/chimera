<script lang="ts">
  import { cn } from "@/utils";
  import type { HTMLAttributes } from "svelte/elements";
  import type { WithElementRef, WithoutChildren } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props();
</script>

<div
  bind:this={ref}
  class={cn("animate-pulse rounded-md bg-muted", className)}
  {...restProps}
></div>
