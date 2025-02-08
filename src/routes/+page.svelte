<script lang="ts">
  import { apps, appsByLetter } from "@/stores";
  import { formatTitle } from "@/utils";
  import { onMount } from "svelte";
  import ky from "ky";

  onMount(() => {
    if (!$apps || !appsByLetter) {
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
            data.reduce<Record<string, Array<{ name: string; id: string }>>>(
              (acc, app) => {
                if (!app.name) return acc;
                const formattedTitle = formatTitle(app.name);
                const [firstLetter] = formattedTitle;

                if (!acc[firstLetter]) acc[firstLetter] = [];

                acc[firstLetter].push({ name: formattedTitle, id: app.id });
                return acc;
              },
              {}
            )
          );
        });
    }
  });
</script>
