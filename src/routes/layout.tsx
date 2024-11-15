import {
  component$,
  createContextId,
  type Signal,
  Slot,
  useContextProvider,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { routeLoader$, type Cookie, type RequestHandler } from "@builder.io/qwik-city";
import { isServer } from "@builder.io/qwik/build";

import { v4 as uuid } from "uuid";
import SimpleLayout from "~/components/layouts/simple-layout";

export interface User {
  avatar?: string;
  username: string;
  email: string;
  id: string;
  color?: string;
}

export const onRequest: RequestHandler = async ({
                                                  sharedMap,
                                                  cookie,
                                                  send,
                                                  redirect
                                                }) => {
  const user = loadUserFromCookie(cookie);
  if (user) {
    sharedMap.set("user", user);
  } else {
    redirect(308, "/");
    throw send(401, "NOT_AUTHORIZED");
  }
};

function loadUserFromCookie(cookie: Cookie): User | null {
  // this is where you would check cookie for user.
  console.log(cookie);
  // if (cookie) {
  // just return mock user for this demo.
  return {
    id: uuid(),
    username: `Mock User`,
    email: `mock@users.com`
  };
  // } else {
  //   return null;
  // }
}

export const useUser = routeLoader$(({ sharedMap }) => {
  return sharedMap.get("user") as User;
});


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

// Create a Context ID (no data is saved here.)
// You will use this ID to both create and retrieve the Context.

export const DarkModeContext = createContextId<Signal<boolean>>(
  "docs.dark-mode-context"
);

export default component$(() => {
  const darkMode = useSignal<boolean>(false);
  useContextProvider(DarkModeContext, darkMode);
  
  // register custom event when dark-mode toggles
  useTask$(async ({ track }) => {
    track(() => darkMode.value);
    if (isServer) return;
    document.dispatchEvent(
      new CustomEvent("darkModeToggle", { detail: darkMode.value })
    );
  });
  
  return (
    <SimpleLayout>
      <Slot />
    </SimpleLayout>
  );
  
});
