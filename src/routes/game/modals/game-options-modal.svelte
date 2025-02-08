<script lang="ts">
  import { Button, buttonVariants } from "@/components/ui/button";
  import * as Dialog from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Separator } from "@/components/ui/separator";
  import { getGameContext } from "@/context";
  import { commands } from "@/specta-bindings";
  import { games } from "@/stores";
  import { open as openDialog } from "@tauri-apps/plugin-dialog";
  import { revealItemInDir } from "@tauri-apps/plugin-opener";
  import { t } from "svelte-i18n";
  import { toast } from "svelte-sonner";
  import File from "lucide-svelte/icons/file";

  interface GameOptionsModalProps {
    open: boolean;
  }

  let { open = $bindable(false) }: GameOptionsModalProps = $props();
  const gameContext = getGameContext();
  const { title, remoteId, local, packs, download } = $derived(gameContext);
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
    </Dialog.Header>
    <Separator />
    <div class="space-y-4">
      <div class="space-y-2">
        <h2 class="text-xl font-bold text-muted-foreground">
          {$t("game.select_executable:title")}
        </h2>
        <p class="text-sm text-muted-foreground">
          {$t("game.select_executable:description")}
        </p>
      </div>
      <div class="flex gap-2">
        <Input
          type="text"
          placeholder={$t("game.select_executable:none_selected")}
          value="{local?.executable_path};"
          readonly
        />
        <Button
          variant="outline"
          onclick={async () => {
            const selected = await openDialog({
              filters: [
                {
                  name: "Game executable",
                  extensions: ["exe", "lnk"],
                },
              ],
            });
            if (!selected) return;
            games.updateGame("remote_id", remoteId, game => ({
              ...game,
              executable_path: selected,
            }));
          }}
        >
          <File />
          {$t("game.select_executable")}
        </Button>
        {#if local?.executable_path}
          <Button
            variant="outline"
            onclick={() => {
              games.updateGame("remote_id", remoteId, game => ({
                ...game,
                executable_path: "",
              }));
            }}>{$t("game.clear")}</Button
          >
        {/if}
      </div>
      <div class="flex gap-2">
        <Button
          variant="outline"
          disabled={!local?.executable_path}
          onclick={() => {
            revealItemInDir(local?.executable_path!);
          }}>{$t("game.open_folder")}</Button
        >
        <Button
          variant="outline"
          disabled={!local?.executable_path}
          onclick={async () => {
            const result = await commands.createShortcut(local?.executable_path!);
            if (result.status === "ok") {
              toast.success($t("game.create_desktop_shortcut:success"));
            } else {
              toast.error($t("game.create_desktop_shortcut:error"));
            }
          }}>{$t("game.create_desktop_shortcut")}</Button
        >
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-bold text-muted-foreground">
          {$t("game.downloads")}
        </h2>
        <p class="text-sm text-muted-foreground">
          {$t("game.check_other_versions")}
        </p>
      </div>
      <div class="flex gap-2">
        <Button
          variant="outline"
          disabled={packs.length === 0 || !!download}
          onclick={() => {
            gameContext.showDownloadOptionsModal = true;
          }}>{$t("game.open_download_options")}</Button
        >
        <Button
          variant="outline"
          disabled={!download}
          onclick={async () => {
            if (!download) return;
            revealItemInDir(download.path!).catch(() => {
              toast.error($t("game.see_downloaded_files:error"));
            });
          }}>{$t("game.see_downloaded_files")}</Button
        >
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-bold text-muted-foreground">
          {$t("game.danger_zone")}
        </h2>
        <p class="text-sm text-muted-foreground">
          {$t("game.remove_from_library_or_files")}
        </p>
      </div>
      <div class="flex gap-2">
        <Dialog.Root>
          <Dialog.Trigger class={buttonVariants({ variant: "destructive" })}
            >{$t("game.remove_from_library")}</Dialog.Trigger
          >
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{$t("common.are_you_sure")}</Dialog.Title>
              <Dialog.Description>
                {$t("game.remove_from_library:description", {
                  values: { title },
                })}
              </Dialog.Description>
            </Dialog.Header>
            <Separator />
            <Dialog.Footer>
              <Dialog.Close
                class={buttonVariants({ variant: "outline" })}
                onclick={() => {
                  games.removeGame(remoteId);
                  open = false;
                }}>{$t("common.confirm")}</Dialog.Close
              >
              <Dialog.Close class={buttonVariants()}>{$t("common.cancel")}</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
        <Dialog.Root>
          <Dialog.Trigger>
            {#snippet child({ props })}
              <Button
                variant="destructive"
                disabled={!local?.executable_path}
                onclick={() => {
                  // Should remove files
                }}
                {...props}>{$t("game.remove_files")}</Button
              >
            {/snippet}
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{$t("common.are_you_sure")}</Dialog.Title>
              <Dialog.Description>
                {$t("game.remove_files:description", {
                  values: { title },
                })}
              </Dialog.Description>
            </Dialog.Header>
            <Separator />
            <Dialog.Footer>
              <Dialog.Close
                class={buttonVariants({ variant: "outline" })}
                onclick={() => {
                  // Should delete installation files
                }}>{$t("common.confirm")}</Dialog.Close
              >
              <Dialog.Close class={buttonVariants()}>{$t("common.cancel")}</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>
