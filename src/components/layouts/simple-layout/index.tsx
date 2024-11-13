import { component$, Slot } from "@builder.io/qwik";
import { Separator } from "@qwik-ui/headless";

export interface SimpleLayoutProps {
  title?: string;
}

export default component$<SimpleLayoutProps>((props) => {
  return (
    <div class="mx-auto flex  max-w-screen-xl flex-col items-center justify-center p-5">
      <div class="py-2">
        <h1>{props.title}</h1>
      </div>
      <Separator
        orientation="horizontal"
        class="separator-top h-[0.1rem] w-full bg-gray-300  dark:bg-gray-50"
      />
      <Slot name={"header"} />
      <div class="flex h-[90vh] w-full flex-col items-center justify-center">
        <Slot />
      </div>
    </div>
  );
});
