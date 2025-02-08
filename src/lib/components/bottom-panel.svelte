<script lang="ts">
  import { BYTES_TO_MEGABYTES } from "@/constants/";
  import { downloads } from "@/stores";
  import { getCurrentWindow, ProgressBarStatus } from "@tauri-apps/api/window";
  import { t } from "svelte-i18n";
  import { formatDuration, intervalToDuration } from "date-fns";

  const [currentDownload] = $derived(
    $downloads
      .filter(download => download.status === "progress")
      .toSorted((a, b) => b.progress_percentage! - a.progress_percentage!)
  );

  const window = getCurrentWindow();

  $effect(() => {
    if (currentDownload && currentDownload.status === "progress") {
      window.setProgressBar({
        status: ProgressBarStatus.Normal,
        progress: Math.trunc(currentDownload.progress_percentage!),
      });
    } else {
      window.setProgressBar({
        status: ProgressBarStatus.None,
      });
    }
  });
</script>

<footer
  class="fixed bottom-0 z-50 flex w-full justify-between border-y bg-background px-4 py-1 text-xs text-muted-foreground shadow"
>
  <a href="/downloads" class="underline-offset-1 hover:underline">
    {#if currentDownload && currentDownload.status === "progress"}
      {#if currentDownload.eta}
        {$t("bottom_panel.downloading", {
          values: {
            title: currentDownload.title,
            percentage: currentDownload.progress_percentage?.toFixed(1),
            eta: formatDuration(
              intervalToDuration({
                start: 0,
                end: currentDownload.eta * 1000,
              }),
              { format: ["minutes", "seconds", "hours", "days", "weeks"] }
            ),
            speed: (currentDownload.download_speed! / BYTES_TO_MEGABYTES).toFixed(1),
          },
        })}
      {:else}
        {$t("bottom_panel.calculating_eta", {
          values: {
            title: currentDownload.title,
            percentage: currentDownload.progress_percentage?.toFixed(1),
          },
        })}
      {/if}
    {:else}
      {$t("bottom_panel.no_downloads_in_progress")}
    {/if}
  </a>

  <p>Version: {__APP_VERSION__}</p>
</footer>
