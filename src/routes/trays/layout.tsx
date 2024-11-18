import {
  $,
  component$,
  createContextId,
  Slot,
  useContextProvider, useOnDocument, useResource$,
  useStore, useTask$
} from "@builder.io/qwik";
import {  useLocation } from "@builder.io/qwik-city";
import { type Tray } from "~/lib/data";

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
    // mode: 'view', // 'view' | 'create' | 'update'
    // currentItem: { id: 0, name: '' },
  });
  
  
  const itemsResource = useResource$(async () => {
    const res = await fetch(`${loc.url.origin}/api/trays`);
    return  await res.json();
  });
  
  useTask$( async ({ track }) => {
    await track(async () => await itemsResource.value);
    traysStore.trays = await itemsResource.value;
  });
  
  useOnDocument('DOMContentLoaded', $(() => {
    const eventSource = new EventSource(`${loc.url.origin}/api/trays/sse`);
    
    eventSource.onopen = () => {
      console.log('connected');
      // connected.value = true;
    };
    
    eventSource.onmessage = (event) => {
      traysStore.trays = JSON.parse(event.data);
    };
    
    eventSource.onerror = () => {
      // connected.value = false;
      console.log('closed');
      eventSource.close();
    };
    
    return () => eventSource.close();
  }))

  useContextProvider(TraysContext, traysStore);
  return (
    <div class={"h-full w-full"}>
      <Slot />
    </div>
  );
});
