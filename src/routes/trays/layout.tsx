import {
  $,
  component$,
  createContextId,
  Slot, useContext,
  useContextProvider, useOnDocument,
  useResource$,
  useStore, useTask$
} from "@builder.io/qwik";
import {  useLocation } from "@builder.io/qwik-city";
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
    return  await res.json();
  });
  
  useTask$( async ({ track }) => {
    await track(async () => await itemsResource.value);
    traysStore.trays = await itemsResource.value;
  });
  
  
  const refreshTrays$ = $(()=>{
    let retryCount = 0;
    const MAX_RETRY_DELAY = 30000; // Maximum retry delay of 30 seconds
    
    const connect = () => {
      const eventSource = new EventSource(`${loc.url.origin}/api/trays/sse`);
      
      eventSource.onopen = () => {
        console.log('connected');
        connected.value = true;
        retryCount = 0; // Reset retry count on successful connection
      };
      
      eventSource.onmessage = (event) => {
        try {
          traysStore.trays = JSON.parse(event.data);
        } catch (error) {
          console.error('Failed to parse SSE data:', error);
        }
      };
      
      eventSource.onerror = () => {
        connected.value = false;
        console.log('closed');
        eventSource.close();
        
        // Implement exponential backoff
        const retryDelay = Math.min(1000 * Math.pow(2, retryCount), MAX_RETRY_DELAY);
        setTimeout(connect, retryDelay);
        retryCount++;
      };
      
      return eventSource;
    };
    
    const eventSource = connect();
    return () => eventSource.close();
  })
  
  useTask$(() => {
    if(isServer) return;
    refreshTrays$()
  })
  
  useOnDocument('DOMContentLoaded', refreshTrays$)

  useContextProvider(TraysContext, traysStore);
  return (
    <div class={"h-full w-full"}>
      <Slot />
    </div>
  );
});
