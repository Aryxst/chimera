<script lang="ts">
  import * as Pagination from "@/components/ui/pagination";
  import { ITEMS_PER_PAGE } from "@/constants/";
  import { constructGameUrl } from "@/helpers";
  import { apps, isTyping, search } from "@/stores";
  import { t } from "svelte-i18n";
  import uFuzzy from "@leeoniya/ufuzzy";

  // See https://github.com/leeoniya/uFuzzy#options
  const uf = new uFuzzy({
    intraMode: 0,
    intraIns: 1,
    interIns: Infinity,
    intraChars: "[a-z\d\' ]",
    interChars: ".",
    interLft: 0,
    interRgt: 0,
    intraSub: 1,
    intraTrn: 1,
    intraDel: 1,
  });

  const haystack = $apps.map(app => app.name);
  const searchResults = $derived.by(() => {
    if (!$search) return [];
    const idxs = uf.filter(haystack, $search)!;

    return idxs.map(index => $apps[index]);
  });
  let currentPage = $state<number>(1);
</script>

<main class="p-4">
  {#if searchResults && searchResults.length > 0 && !$isTyping}
    {@const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE)}
    {@const startIndex = (currentPage - 1) * ITEMS_PER_PAGE}
    {@const end =
      currentPage === totalPages ? searchResults.length : startIndex + ITEMS_PER_PAGE}
    <div class="flex flex-col">
      {#each searchResults.slice(startIndex, end) as item}
        <a href={constructGameUrl(item.id, item.name)}>
          {item.name}
        </a>
      {/each}
    </div>
    <Pagination.Root
      count={searchResults.length}
      perPage={ITEMS_PER_PAGE}
      bind:page={currentPage}
    >
      {#snippet children({ pages, currentPage })}
        <p>
          {$t("search.displaying", {
            values: {
              range: `${startIndex === 0 ? 1 : startIndex}-${end}`,
              total: searchResults.length,
            },
          })}
        </p>
        <Pagination.Content class="mt-2">
          <Pagination.Item>
            <Pagination.PrevButton />
          </Pagination.Item>
          {#each pages as page (page.key)}
            {#if page.type === "ellipsis"}
              <Pagination.Item>
                <Pagination.Ellipsis />
              </Pagination.Item>
            {:else}
              <Pagination.Item>
                <Pagination.Link {page} isActive={currentPage === page.value}>
                  {page.value}
                </Pagination.Link>
              </Pagination.Item>
            {/if}
          {/each}
          <Pagination.Item>
            <Pagination.NextButton />
          </Pagination.Item>
        </Pagination.Content>
      {/snippet}
    </Pagination.Root>
  {:else if searchResults.length === 0 && !$isTyping}
    <div class="flex h-full flex-col items-center justify-center gap-4">
      <p class="text-muted-foreground">{$t("search.no_results")}</p>
    </div>
  {:else if $isTyping}
    {$t("search.typing")}
  {/if}
</main>
