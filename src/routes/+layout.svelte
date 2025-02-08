<script lang="ts">
  import AppSidebar from "@/components/app-sidebar.svelte";
  import BottomPanel from "@/components/bottom-panel.svelte";
  import Header from "@/components/header.svelte";
  import * as Sidebar from "@/components/ui/sidebar";
  import { events } from "@/specta-bindings";
  import { apps, appsByLetter, games, settings } from "@/stores";
  import { formatTitle } from "@/utils";
  import { dev } from "$app/environment";
  import { onMount, untrack } from "svelte";
  import { init, locale, register } from "svelte-i18n";
  import { Toaster } from "svelte-sonner";
  import ky from "ky";
  import { ModeWatcher } from "mode-watcher";
  import "../app.css";

  let { children } = $props();

  $effect.pre(() => {
    register("en", () => import("../locales/en.json"));
    register("it", () => import("../locales/it.json"));

    init({
      fallbackLocale: "en",
      initialLocale: $settings.general.locale,
      ignoreTag: false,
    });

    untrack(() => locale.set($settings.general.locale));
  });

  onMount(() => {
    ky<Array<{ name: string; id: number; clientIcon: string }>>(
      atob(
        "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2h5ZHJhbGF1bmNoZXIvaHlkcmEvcmVmcy9oZWFkcy9tYWluL3NlZWRzL3N0ZWFtLWdhbWVzLmpzb24"
      )
    )
      .then(response => response.json())
      .then(data =>
        data.map(app => ({
          name: app.name,
          id: String(app.id),
          clientIcon: app.clientIcon,
        }))
      )
      .then(data => {
        apps.set(data);
        appsByLetter.set(
          data.reduce<Record<string, Array<{ name: string; id: string }>>>((acc, app) => {
            if (!app.name) return acc;
            const formattedTitle = formatTitle(app.name);
            const [firstLetter] = formattedTitle;

            if (!acc[firstLetter]) acc[firstLetter] = [];

            acc[firstLetter].push({ name: formattedTitle, id: app.id });
            return acc;
          }, {})
        );
      });
    events.executableEvent.listen(({ payload: { data, type } }) => {
      switch (type) {
        case "started": {
          games.updateGame("executable_path", data.path, state => ({
            ...state,
            running: true,
          }));
          break;
        }
        case "finished": {
          games.updateGame("executable_path", data.path, state => ({
            ...state,
            last_played_at: Date.now(),
            playtime_in_seconds: state.playtime_in_seconds + data.execution_time,
            running: false,
          }));
          break;
        }
      }
    });
  });
</script>

<Toaster theme={$settings.general.theme} />
<ModeWatcher />

<Sidebar.Provider>
  <AppSidebar />
  <div class="w-full">
    <Header />
    {@render children()}
  </div>
  <BottomPanel />
</Sidebar.Provider>

<svelte:window
  on:contextmenu|preventDefault
  on:keydown={event => {
    if (dev) return;
    if (
      event.key === "F5" ||
      (event.ctrlKey && event.key === "r") ||
      (event.metaKey && event.key === "r")
    ) {
      event.preventDefault();
    }
  }}
/>
