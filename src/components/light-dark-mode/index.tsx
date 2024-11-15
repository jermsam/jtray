import {$, component$, type QRL, useOnDocument, useSignal, useTask$} from '@builder.io/qwik';
import {isServer} from '@builder.io/qwik/build';
import { IonMdMoon, IonMdSunny } from "~/components/icons";

export interface LightDarkModeProps {
  mode: boolean;
  onModeChange$: QRL<(mode: boolean) => void>;
}

export const LightDarkMode = component$<LightDarkModeProps>((props) => {
  const darkMode = useSignal<boolean>(props.mode);
  useTask$(async ({track}) => {
    track(() => darkMode.value);
    if (isServer) return;
   
    darkMode.value ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    const darkString = JSON.stringify(darkMode.value);
    localStorage.setItem('dark-mode', darkString);
    await props.onModeChange$(darkMode.value);
  });
  useOnDocument('DOMContentLoaded', $(() => {
    const darkString = localStorage.getItem('dark-mode') ;
    const dark = darkString ?  JSON.parse(darkString): false;
    darkMode.value = !!dark;
  }));
  return (
    <>
      {darkMode.value ?
        <button onClick$={() => darkMode.value = !darkMode.value}>
          <IonMdSunny
            class="text-4xl cursor-pointer  rounded-full p-2 inline-block transition-transform hover:scale-110"/>
        </button>
        :
        <button onClick$={() => darkMode.value = !darkMode.value}>
          <IonMdMoon
            class="text-4xl cursor-pointer  rounded-full p-2 inline-block transition-transform hover:scale-110"/>
        </button>
      }
    </>
  );
});


