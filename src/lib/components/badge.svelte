<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";
  import type { WithElementRef } from "bits-ui";
  import { tv, type VariantProps } from "tailwind-variants";

  export const badgeVariants = tv({
    base: "inline-flex items-center justify-center gap-1 rounded border px-2 py-1 text-xs font-semibold transition-colors",
    variants: {
      variant: {
        default: "bg-background text-foreground hover:bg-background/80",
        transparent: "bg-transparent text-foreground",
      },
      position: {
        "top-left": "left-2 top-2",
        "top-right": "right-2 top-2",
        "bottom-left": "bottom-2 left-2",
        "bottom-right": "bottom-2 right-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
    compoundVariants: [
      {
        position: ["top-left", "top-right", "bottom-left", "bottom-right"],
        class: "absolute",
      },
    ],
  });

  export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
  export type BadgePosition = VariantProps<typeof badgeVariants>["position"];
  export type BadgeProps = WithElementRef<
    HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > & {
    variant?: BadgeVariant;
    position?: BadgePosition;
  };
</script>

<script lang="ts">
  import { cn } from "@/utils";

  let {
    class: className,
    variant = "default",
    position,
    ref = $bindable(null),
    children,
    ...restProps
  }: BadgeProps = $props();
</script>

<span
  bind:this={ref}
  class={cn(badgeVariants({ variant, position }), className)}
  {...restProps}
>
  {@render children?.()}
</span>
