import {
  $,
  component$,
  createContextId,
  Slot,
  useContext,
  useContextProvider,
  useOnDocument,
  useResource$,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { type Tray } from "~/lib/data";
import { ConnectionContext } from "~/routes/layout";
import { isServer } from "@builder.io/qwik/build";

interface TrayStore {
  trays: Tray[];
}

// Create a Context ID (no data is saved here.)
// You will use this ID to both create and retrieve the Context.
export const TraysContext = createContextId<TrayStore>("Trays");
export default component$(() => {
  const loc = useLocation(); // Provides current URL including origin
  const traysStore = useStore({
    trays: [] as Tray[],
  });

  const connected = useContext(ConnectionContext);

  const itemsResource = useResource$(async () => {
    const res = await fetch(`${loc.url.origin}/api/trays`);
    return await res.json();
  });

  useTask$(async ({ track }) => {
    await track(async () => await itemsResource.value);
    traysStore.trays = await itemsResource.value;
  });

  const refreshTrays$ = $(() => {
    let retryCount = 0;
    const MAX_RETRY_DELAY = 30000;

    const connect = () => {
      const url = new URL("/api/trays/sse", loc.url.origin);
      url.searchParams.set("nocache", Date.now().toString());

      const eventSource = new EventSource(url.toString());
      console.log("Attempting SSE connection to:", url.toString());

      eventSource.onopen = () => {
        console.log("SSE Connected, state:", eventSource.readyState);
        connected.value = true;
        retryCount = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          console.log("SSE Message received:", event.data);
          const newTrays = JSON.parse(event.data);
          if (JSON.stringify(traysStore.trays) !== JSON.stringify(newTrays)) {
            traysStore.trays = newTrays;
            console.log("Trays updated:", newTrays);
          }
        } catch (error) {
          console.error("Failed to parse SSE data:", error);
        }
      };

      eventSource.onerror = () => {
        console.log("SSE Error, state:", eventSource.readyState);
        connected.value = false;
        eventSource.close();

        const retryDelay = Math.min(
          1000 * Math.pow(2, retryCount),
          MAX_RETRY_DELAY,
        );
        console.log("Retrying in", retryDelay, "ms");
        setTimeout(connect, retryDelay);
        retryCount++;
      };

      return eventSource;
    };

    return connect();
  });

  useTask$(async ({ cleanup }) => {
    if (isServer) return;
    const eventSource = await refreshTrays$();
    cleanup(() => eventSource.close());
  });

  useOnDocument("DOMContentLoaded", refreshTrays$);

  useContextProvider(TraysContext, traysStore);
  return (
    <div class={"h-full w-full"}>
      <Slot />
    </div>
  );
});
