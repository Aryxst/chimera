<script lang="ts">
  import { Button } from "@/components/ui/button";
  import { Checkbox } from "@/components/ui/checkbox";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import * as Select from "@/components/ui/select";
  import { settings } from "@/stores";
  import * as Types from "@/types";
  import { capitalize } from "@/utils";
  import { open as openDialog } from "@tauri-apps/plugin-dialog";
  import { locale, locales, t } from "svelte-i18n";
  import { resetMode, setMode } from "mode-watcher";
</script>

<div class="flex flex-col gap-4">
  <h1 class="text-2xl font-bold">{$t("settings.general:title")}</h1>

  <div class="flex flex-col gap-2">
    <Label for="downloads-path">{$t("settings.general.downloads_path")}</Label>
    <div class="flex gap-2">
      <Input
        type="text"
        name="downloads-path"
        value={$settings.general.downloads_path}
        readonly
      />
      <Button
        variant="outline"
        onclick={async () => {
          const selected = await openDialog({ multiple: false, directory: true });
          if (!selected) return;
          $settings.general.downloads_path = selected;
        }}>{$t("common.change")}</Button
      >
    </div>
  </div>

  <div class="flex flex-col gap-2">
    <Label for="theme">{$t("settings.general.theme:title")}</Label>
    <Select.Root
      type="single"
      name="theme"
      bind:value={() => $settings.general.theme,
      value => {
        value === "system" ? resetMode() : setMode(value);
        $settings.general.theme = value;
      }}
    >
      <Select.Trigger class="w-[180px]">
        {capitalize($t("settings.general.theme." + $settings.general.theme))}
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="light">{$t("settings.general.theme.light")}</Select.Item>
        <Select.Item value="dark">{$t("settings.general.theme.dark")}</Select.Item>
        <Select.Item value="system">{$t("settings.general.theme.system")}</Select.Item>
      </Select.Content>
    </Select.Root>
  </div>

  <div class="flex flex-col gap-2">
    <Label for="language">{$t("settings.general.language")}</Label>
    <Select.Root
      type="single"
      name="language"
      bind:value={() => $settings.general.locale,
      value => {
        $settings.general.locale = value as Types.AppLocale;
        locale.set(value);
      }}
    >
      <Select.Trigger class="w-[180px]">{$settings.general.locale}</Select.Trigger>
      <Select.Content>
        {#each $locales as locale}
          <Select.Item value={locale}>{locale}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>

  <h3 class="text-lg font-bold">{$t("settings.general.notifications:title")}</h3>

  <div class="flex items-center gap-2">
    <Checkbox
      id="when-download-complete"
      bind:checked={$settings.general.notifications.when_download_complete}
    />
    <Label for="when-download-complete"
      >{$t("settings.general.notifications.when_download_complete")}</Label
    >
  </div>
</div>
