import { component$, type QRL, Slot, useSignal, useTask$ } from "@builder.io/qwik";
import { cn } from "@qwik-ui/utils";
import { LuX } from "@qwikest/icons/lucide";
import { Modal } from "../ui/modal/modal";
import {  buttonVariants } from "~/components/ui/button/button";

export interface TrayDialogProps {
  open?: boolean;
  openChange$?: QRL<(open: boolean) => void>;
  title?: string;
  description?: string;
}

export default component$<TrayDialogProps>((props) => {
  const show = useSignal<boolean>(false);
  useTask$(({ track }) => {
    track(() => props.open);
    show.value = props.open || false;
  });
  useTask$(async ({ track }) => {
    track(() => show.value);
    if (!props.openChange$) return;
    await props.openChange$(show.value);
  });
  return (
    <Modal.Root bind:show={show}>
      {props.open === undefined && (
        <slot name={"dialog-trigger"}>
          <Modal.Trigger class={[buttonVariants({ look: "outline" })]}>
            Open modal
          </Modal.Trigger>
        </slot>
      )}
      <Modal.Panel class={'dark:bg-[#212121] dark:text-gray-300 border'}>
        <Modal.Close
          class={cn(
            buttonVariants({ size: "icon", look: "link" }),
            "absolute right-3 top-2",
          )}
          type="button"
        >
          <LuX class="h-5 w-5" />
        </Modal.Close>
        <div class={'h-full w-full'}>
          <Modal.Title>{props.title}</Modal.Title>
          <Modal.Description>{props.description}</Modal.Description>
          <Slot/>
        </div>
        
        
      </Modal.Panel>
    </Modal.Root>
  );
});
