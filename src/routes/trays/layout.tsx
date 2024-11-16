import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { trays, type TrayType } from "~/data_source";


interface TrayStore {
  trays: TrayType[];
}

// Create a Context ID (no data is saved here.)
// You will use this ID to both create and retrieve the Context.
export const TraysContext = createContextId<TrayStore>("Trays");
export default component$(() => {
  const traysStore = useStore<TrayStore>({
    trays,
  })

  useContextProvider(
    TraysContext,
    traysStore,
  );
  return(<div class={'w-full h-full'}>
    <Slot />
  </div>)
  
});
