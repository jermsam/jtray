import { $, component$, Slot, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { Separator } from "@qwik-ui/headless";
import { HugeiconsWifiConnected02, HugeiconsWifiDisconnected02, LucideHouse } from "~/components/icons";
import { LightDarkMode } from "~/components/light-dark-mode";
import { NavLink } from "~/components/nav-link";
import ProfileAvatar from "~/components/profile-avatar";
import Switch from "~/components/switch";
import { DarkModeContext,ConnectionContext, useUser } from "~/routes/layout";


export interface SimpleLayoutProps {
  title?: string;
}

export default component$<SimpleLayoutProps>((props) => {
  const darkMode = useContext(DarkModeContext);
  const connected = useContext(ConnectionContext);
  const user = useUser();
  const loc = useLocation();
  
  const username = useSignal<string>("");
  useTask$(({ track }) => {
    track(() => user.value);
    username.value = user.value.username || user.value.email;
  });
  
  const onSwitchChange = $((v: boolean) => {
    connected.value = v;
  });
  
  
  return (
    <div class={"bg-gray-50 dark:bg-[#212121] min-h-screen min-w-screen md:w-full dark:text-teal-50 p-2 "}>
      <div class="mx-auto flex  max-w-screen-xl flex-col items-center justify-center p-3">
        <div class="py-3">
          <h1>{props.title}</h1>
        </div>
        <Separator
          orientation="horizontal"
          class="separator-top h-[0.1rem] w-full bg-gray-300  dark:bg-gray-50"
        />
        <div class={"flex w-full items-center justify-between py-3"}>
          <div class={"flex gap-10"}>
            <div class={"flex gap-2"} style={{ marginRight: 6 }}>
              {loc.url.pathname !== "/" &&
                <NavLink href="/" activeClass="text-green-600">
                  <LucideHouse class={"cursor-pointer text-2xl"} />
                </NavLink>}
             <ProfileAvatar username={username.value} color={"#75617C"} />
              <Switch
                color={"#215155"}
                on={connected.value}
                onChange$={onSwitchChange}
              >
                <span q:slot={"off"} class={"text-2xl"}>
                  {connected.value ? (
                    <HugeiconsWifiConnected02
                      class={"text-green-700 dark:text-green-300"}
                    />
                  ) : (
                    <HugeiconsWifiDisconnected02 />
                  )}
                </span>
              </Switch>
              <Slot name={"top-left-menu"} />
            </div>
          </div>
          <Slot name={"top-ceter-menu"} />
          <div class={"flex items-center gap-5"}>
            <Slot name={"top-right-menu"} />
            <LightDarkMode
              mode={darkMode.value}
              onModeChange$={(mode) => (darkMode.value = mode)}
            />
          </div>
        </div>
        <div class="flex h-[90vh] w-full flex-col items-center justify-center">
          <Slot />
        </div>
      </div>
    </div>
  );
});
