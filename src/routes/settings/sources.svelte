<script lang="ts" module>
  import { z } from "zod";

  const schema = z.object({
    url: z.string().url("Please enter a valid URL"),
  });
</script>

<script lang="ts">
  import { Button, buttonVariants } from "@/components/ui/button";
  import * as Dialog from "@/components/ui/dialog";
  import * as Form from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Separator } from "@/components/ui/separator";
  import { sources } from "@/stores";
  import * as Types from "@/types";
  import { t } from "svelte-i18n";
  import { fade, slide } from "svelte/transition";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms/client";
  import CircleMinus from "lucide-svelte/icons/circle-minus";
  import CirclePlus from "lucide-svelte/icons/circle-plus";
  import RefreshCcw from "lucide-svelte/icons/refresh-ccw";

  let temporarySource = $state<Types.Source | null>(null);
  let isRefreshing = $state(false);

  const form = superForm(
    { url: "" },
    {
      SPA: true,
      validators: zodClient(schema),
      onSubmit: async () => {
        const url = $formData.url;
        if ($sources.find(source => source.url === url)) {
          $errors.url = [$t("settings.sources.already_added")];
          return;
        }
        fetch(url)
          .then(response => response.json())
          .then(source => {
            temporarySource = { ...source, url };
          })
          .catch(() => {
            $errors.url = [$t("settings.sources.invalid_json_url")];
          });
      },
    }
  );
  const { form: formData, errors, enhance } = form;
</script>

<div class="flex flex-col gap-4">
  <h1 class="text-2xl font-bold">{$t("settings.sources:title")}</h1>

  <p>{$t("settings.sources:description")}</p>

  <div class="flex justify-between">
    <Button
      variant="outline"
      disabled={$sources.length === 0 || isRefreshing}
      onclick={async () => {
        isRefreshing = true;
        await sources.refreshSources();
        isRefreshing = false;
      }}
      ><RefreshCcw class={isRefreshing ? "animate-spin" : ""} />{$t(
        "settings.sources.sync_sources"
      )}</Button
    >
    <Dialog.Root>
      <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
        ><CirclePlus />{$t("settings.sources.add_source")}</Dialog.Trigger
      >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{$t("settings.sources.add_source")}</Dialog.Title>
          <Dialog.Description>{$t("settings.sources:description")}</Dialog.Description>
        </Dialog.Header>
        <Separator />
        <div class="space-y-4">
          <form method="POST" use:enhance>
            <Form.Field {form} name="url">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>{$t("settings.sources.download_source_url")}</Form.Label>
                  <div class="flex gap-2">
                    <Input
                      placeholder={$t("settings.sources.insert_json_url")}
                      bind:value={$formData.url}
                      autocomplete="off"
                      {...props}
                    />
                    <Form.Button variant="outline"
                      >{$t("settings.sources.validate")}</Form.Button
                    >
                  </div>
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </form>

          {#if temporarySource}
            <div class="flex items-center justify-between">
              <div>
                <p>{temporarySource.name}</p>
                <small
                  >{$t("settings.sources.found_download_options", {
                    values: { count: temporarySource.downloads.length },
                  })}</small
                >
              </div>
              <Dialog.Close
                class={buttonVariants()}
                onclick={() => {
                  sources.addSource(temporarySource!);
                  temporarySource = null;
                }}>{$t("settings.sources.import")}</Dialog.Close
              >
            </div>
          {/if}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  </div>

  <ul class="space-y-4">
    {#each $sources as source, index (source.name)}
      <li class="space-y-2 rounded-lg border p-4 shadow-sm" out:fade in:slide>
        <h1 class="text-lg font-bold">{source.name}</h1>
        <small
          >{$t("settings.sources.count_download_options", {
            values: { count: source.downloads.length },
          })}</small
        >
        <p class="text-sm text-muted-foreground">
          {$t("settings.sources.download_source_url")}
        </p>
        <div class="flex justify-between gap-4">
          <Input value={source.url} readonly />
          <Button
            variant="outline"
            onclick={() => {
              sources.removeSource(index);
            }}><CircleMinus />{$t("settings.sources.remove")}</Button
          >
        </div>
      </li>
    {/each}
  </ul>
</div>
