<script lang="ts">
  import { SteamContentDescriptor } from "@/constants";
  import { setGameContext } from "@/context";
  import { getSteamAppDetails } from "@/services/steam";
  import { appsByLetter, downloads, games, settings, sources } from "@/stores";
  import * as Types from "@/types";
  import * as Steam from "@/types/steam.types";
  import { formatTitle } from "@/utils";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { t } from "svelte-i18n";
  import { toast } from "svelte-sonner";
  import GameDetailsContent from "./game-content.svelte";
  import {
    DownloadOptionsModal,
    DownloadSettingsModal,
    GameOptionsModal,
    NsfwAlertModal,
  } from "./modals";

  const title = $derived(page.url.searchParams.get("title")!);
  const remoteId = $derived(page.url.searchParams.get("id")!);
  const local = $derived($games.find(game => game.remote_id === remoteId));
  const download = $derived($downloads.find(download => download.remote_id === remoteId));

  let details = $state<Steam.AppDetails | null>(null);
  let selectedPackDownload = $state<Types.Pack | null>(null);
  let showDownloadOptionsModal = $state(false);
  let showGameOptionsModal = $state(false);
  let hasNSFWContentBlocked = $state(false);

  $effect(() => {
    getSteamAppDetails(remoteId).then(data => {
      details = data;
      hasNSFWContentBlocked =
        details!.content_descriptors.ids.includes(
          SteamContentDescriptor.AdultOnlySexualContent
        ) && !$settings.behavior.disable_nsfw_alert;
    });

    return () => {
      details = null;
    };
  });
  /* TESTING: Proof of concept
   * Can throw error if source is not found
   */
  const source = $sources[0];

  const remoteIdsOnSource = new Set<string>();
  const results = $derived(
    source.downloads.map(download => {
      const formattedTitle = formatTitle(download.title);
      const [firstLetter] = formattedTitle;
      const gamesInSteam = ($appsByLetter[firstLetter] || []).filter(app =>
        formattedTitle.startsWith(app.name)
      );

      gamesInSteam.forEach(game => remoteIdsOnSource.add(game.id));

      return {
        ...download,
        packer: source.name,
        remoteIds: gamesInSteam.map(app => app.id),
      };
    })
  );
  const packs = $derived(results.filter(result => result.remoteIds.includes(remoteId)));
  /* END OF TESTING */
  setGameContext({
    get title() {
      return title;
    },
    get remoteId() {
      return remoteId;
    },
    get local() {
      return local;
    },
    get download() {
      return download;
    },
    get packs() {
      return packs;
    },
    get details() {
      return details;
    },
    get hasNSFWContentBlocked() {
      return hasNSFWContentBlocked;
    },
    get showDownloadOptionsModal() {
      return showDownloadOptionsModal;
    },
    get showGameOptionsModal() {
      return showGameOptionsModal;
    },
    set showDownloadOptionsModal(value) {
      showDownloadOptionsModal = value;
    },
    set showGameOptionsModal(value) {
      showGameOptionsModal = value;
    },
  });
</script>

<main>
  <GameDetailsContent />

  <GameOptionsModal bind:open={showGameOptionsModal} />

  <DownloadOptionsModal
    bind:open={showDownloadOptionsModal}
    onPackSelected={pack => (selectedPackDownload = pack)}
  />

  <DownloadSettingsModal
    open={selectedPackDownload != null}
    {selectedPackDownload}
    onDownloadStarted={() => {
      showDownloadOptionsModal = false;
      showGameOptionsModal = false;
      selectedPackDownload = null;
    }}
    onDownloadErrored={() => {
      toast.error($t("common.an_error_occurred"));
    }}
  />

  <NsfwAlertModal
    onCancel={() => {
      goto("/");
    }}
    onConfirm={() => {
      hasNSFWContentBlocked = false;
    }}
  />
</main>
