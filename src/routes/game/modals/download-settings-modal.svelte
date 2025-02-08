<script lang="ts">
  import { Button } from "@/components/ui/button";
  import * as Dialog from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Separator } from "@/components/ui/separator";
  import { Downloader, DOWNLOADER_NAME } from "@/constants/";
  import { getGameContext } from "@/context";
  import { steamImageBuilder } from "@/services/steam";
  import { apps, downloads, games, settings } from "@/stores";
  import * as Types from "@/types";
  import { getDownloaderFromUrl } from "@/utils";
  import { open as openDialog } from "@tauri-apps/plugin-dialog";
  import { t } from "svelte-i18n";
  import CircleCheck from "lucide-svelte/icons/circle-check-big";
  import DownloadIcon from "lucide-svelte/icons/download";

  interface DownloadSettingsModalProps {
    open: boolean;
    selectedPackDownload: Types.Pack | null;
    onDownloadStarted: () => void;
    onDownloadErrored: () => void;
  }

  let {
    open,
    selectedPackDownload,
    onDownloadStarted,
    onDownloadErrored,
  }: DownloadSettingsModalProps = $props();
  const gameContext = getGameContext();
  const { title, remoteId, local, download } = $derived(gameContext);
  let selectedUri = $derived<string | null>(selectedPackDownload?.uris?.[0] ?? null);
  let downloadPath = $state($settings.general.downloads_path);
</script>

<Dialog.Root {open}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{$t("game.download_settings")}</Dialog.Title>
      <Dialog.Description>{$t("game.choose_pack_to_download")}</Dialog.Description>
    </Dialog.Header>
    <Separator />
    <div class="flex flex-col gap-4">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">{$t("game.downloader")}</p>
        <div class="flex flex-row gap-2">
          {#each selectedPackDownload?.uris! as uri}
            {@const downloader = getDownloaderFromUrl(uri)}
            <Button
              variant={selectedUri === uri ? "default" : "outline"}
              class="flex-1"
              disabled={downloader === Downloader.RealDebrid}
            >
              {#if selectedUri === uri}
                <CircleCheck />
              {/if}
              {DOWNLOADER_NAME[downloader]}
            </Button>
          {/each}
        </div>
      </div>
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">{$t("game.download_path")}</p>
        <div class="flex flex-row gap-2">
          <Input
            type="text"
            value={downloadPath}
            placeholder={$t("game.download_path")}
            readonly
          />
          <Button
            variant="outline"
            onclick={async () => {
              const selected = await openDialog({
                directory: true,
                multiple: false,
              });
              if (!selected) return;
              downloadPath = selected;
            }}>{$t("common.change")}</Button
          >
        </div>
        <p class="text-xs text-muted-foreground">
          {@html $t("game.change_default_download_path", {
            values: {
              settings: text =>
                `<a href="/settings" class="text-primary underline">${text}</a>`,
            },
          })}
        </p>
      </div>
      <Button
        disabled={!selectedUri || !downloadPath}
        onclick={async () => {
          if (!local) {
            games.addGame({
              title,
              remote_id: remoteId,
              icon_url: steamImageBuilder.icon(
                remoteId,
                $apps.find(app => app.id === remoteId)?.clientIcon!
              ),
            });
          }

          if (download && download.original_url === selectedUri) {
            await downloads.removeDownload(selectedUri!);
          }

          try {
            await downloads.addDownload(selectedUri!, remoteId, title, downloadPath);
            onDownloadStarted();
          } catch (e) {
            console.error(e);
            onDownloadErrored();
          }
        }}><DownloadIcon />{$t("game.download_now")}</Button
      >
    </div>
  </Dialog.Content>
</Dialog.Root>
