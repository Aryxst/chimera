<script lang="ts">
  import { buttonVariants } from "@/components/ui/button/index.js";
  import { cn } from "@/utils";
  import { t } from "svelte-i18n";
  import ChevronLeft from "lucide-svelte/icons/chevron-left";
  import { Pagination as PaginationPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: PaginationPrimitive.PrevButtonProps = $props();
</script>

{#snippet Fallback()}
  <ChevronLeft class="size-4" />
  <span>{$t("search.previous_page")}</span>
{/snippet}

<PaginationPrimitive.PrevButton
  bind:ref
  class={cn(
    buttonVariants({
      variant: "ghost",
      class: "gap-1 pl-2.5",
    }),
    className
  )}
  children={children || Fallback}
  {...restProps}
/>
