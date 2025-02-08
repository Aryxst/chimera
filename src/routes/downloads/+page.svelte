<script lang="ts">
  import { downloads } from "@/stores";
  import * as Types from "@/types";
  import { t } from "svelte-i18n";
  import DownloadIcon from "lucide-svelte/icons/download";
  import DeleteDownloadModal from "./delete-download-modal.svelte";
  import DownloadGroup from "./download-group.svelte";

  const downloadGroups = $derived([
    {
      title: $t("downloads.download_in_progress"),
      items: $downloads.filter(download => download.status === "progress"),
    },
    {
      title: $t("downloads.queued_downloads"),
      items: $downloads.filter(download => download.status === "paused"),
    },
    {
      title: $t("downloads.completed"),
      items: $downloads.filter(download => download.status === "completed"),
    },
  ]);
  let downloadToDelete: Types.Download | null = $state(null);

  const handleDownloadDelete = (download: Types.Download) => {
    downloadToDelete = download;
  };
</script>

<main
  class={[
    "flex min-h-[calc(100vh-99px)] p-4",
    { "items-center justify-center": $downloads.length === 0 },
  ]}
>
  {#if $downloads.length > 0}
    <div class="flex w-full flex-col gap-4">
      {#each downloadGroups as group}
        <DownloadGroup {...group} openDeleteDownloadModal={handleDownloadDelete} />
      {/each}
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center gap-4 p-4">
      <DownloadIcon size="48" />
      <p class="text-lg font-bold">{$t("downloads.no_downloads")}</p>
      <p class="text-sm text-muted-foreground">
        {$t("downloads.no_downloads:description")}
      </p>
    </div>
  {/if}

  <DeleteDownloadModal
    open={downloadToDelete !== null}
    onCancel={() => {
      downloadToDelete = null;
    }}
    onConfirm={() => {
      downloads.removeDownload(downloadToDelete!.url);
      downloadToDelete = null;
    }}
  />
</main>
