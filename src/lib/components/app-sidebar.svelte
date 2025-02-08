<script lang="ts">
  import * as Sidebar from "@/components/ui/sidebar";
  import { constructGameUrl } from "@/helpers";
  import { games } from "@/stores";
  import { page } from "$app/state";
  import { t } from "svelte-i18n";
  import Book from "lucide-svelte/icons/book";
  import DownloadIcon from "lucide-svelte/icons/download";
  import House from "lucide-svelte/icons/house";
  import LayoutGrid from "lucide-svelte/icons/layout-grid";
  import SettingsIcon from "lucide-svelte/icons/settings";

  const items = $derived([
    {
      title: $t("common.home"),
      href: "/",
      icon: House,
    },
    {
      title: $t("common.downloads"),
      href: "/downloads",
      icon: DownloadIcon,
    },
    {
      title: $t("common.library"),
      href: "/library",
      icon: Book,
    },
    {
      title: $t("common.catalog"),
      href: "/catalog",
      icon: LayoutGrid,
    },
    {
      title: $t("common.settings"),
      href: "/settings",
      icon: SettingsIcon,
    },
  ]);

  let search = $state("");
</script>

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.href)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                class={{ "bg-accent": page.url.pathname === item.href }}
              >
                {#snippet child({ props })}
                  <a href={item.href} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
    <Sidebar.Group>
      <Sidebar.GroupLabel>{$t("common.library")}</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Input
          type="text"
          placeholder={$t("sidebar.filter_by_name")}
          bind:value={search}
        />
        <Sidebar.Menu class="mt-2">
          {#each $games
            .filter(game => game.title.toLowerCase().includes(search.toLowerCase()))
            .toSorted((a, b) => a.title.localeCompare(b.title)) as game (game.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={constructGameUrl(game.remote_id, game.title)} {...props}>
                    <img
                      src={game.icon_url}
                      width="20"
                      alt={game.title}
                      class="rounded-md"
                    />
                    <span class={{ "font-bold": !!game.executable_path }}
                      >{game.title}</span
                    >
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
