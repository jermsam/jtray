import {
  component$,
  createContextId,
  type Signal,
  Slot,
  useContextProvider,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { type TrayProps, trays } from "~/data_source";
import { isServer } from "@builder.io/qwik/build";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

interface TrayStore {
  trays: TrayProps[];
}

// Create a Context ID (no data is saved here.)
// You will use this ID to both create and retrieve the Context.
export const TraysContext = createContextId<TrayStore>("Trays");
export const DarkModeContext = createContextId<Signal<boolean>>(
  "docs.dark-mode-context",
);

export default component$(() => {
  const darkMode = useSignal<boolean>();
  useContextProvider(DarkModeContext, darkMode);

  // register custom event when dark-mode toggles
  useTask$(async ({ track }) => {
    track(() => darkMode.value);
    if (isServer) return;
    document.dispatchEvent(
      new CustomEvent("darkModeToggle", { detail: darkMode.value }),
    );
  });

  useContextProvider(
    TraysContext,
    useStore<TrayStore>({
      trays,
    }),
  );
  return <div class={'bg-gray-50 dark:bg-[#212121] min-h-screen min-w-screen md:w-full dark:text-teal-50 '}>
    <Slot />
  </div>
  
});
