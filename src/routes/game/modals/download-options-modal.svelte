<script lang="ts">
  import Badge from "@/components/badge.svelte";
  import * as Dialog from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Separator } from "@/components/ui/separator";
  import { getGameContext } from "@/context";
  import * as Types from "@/types";
  import { t } from "svelte-i18n";

  interface DownloadOptionsModalProps {
    open: boolean;
    onPackSelected: (pack: Types.Pack) => void;
  }

  let { open = $bindable(false), onPackSelected }: DownloadOptionsModalProps = $props();
  const { packs, download } = getGameContext();
  let filter = $state("");
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{$t("game.download_options")}</Dialog.Title>
    </Dialog.Header>
    <Separator />
    <Input type="text" bind:value={filter} placeholder={$t("game.filter_packs")} />
    <div class="flex max-h-80 flex-col gap-2 overflow-y-scroll">
      {#each packs.filter(pack => {
        const lowercaseFilter = filter.toLowerCase();
        return pack.title.toLowerCase().includes(lowercaseFilter) || pack.packer
            .toLowerCase()
            .includes(lowercaseFilter);
      }) as pack}
        <button
          class="flex flex-col gap-2 rounded-md border bg-primary-foreground p-4 text-left hover:bg-primary-foreground/80 dark:border-none"
          onclick={() => onPackSelected(pack)}
        >
          <p class="text-wrap text-sm">{pack.title}</p>
          {#if download && pack.uris.find(uri => download!.original_url.startsWith(uri))}
            <Badge variant="transparent">{$t("game.last_downloaded_option")}</Badge>
          {/if}
          <p class="text-xs text-muted-foreground">
            {pack.fileSize} - {pack.packer} - {new Date(
              pack.uploadDate
            ).toLocaleDateString()}
          </p>
        </button>
      {/each}
    </div>
  </Dialog.Content>
</Dialog.Root>
