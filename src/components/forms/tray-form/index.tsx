import {
  $,
  component$,
  type QRL, Slot,
  useComputed$,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { Label } from "~/components/ui/label/label";
import { Input } from "~/components/ui/input/input";
import { Textarea } from "~/components/ui/textarea/textarea";
import { Button } from "~/components/ui/button/button";
import { type TrayProps } from "~/data_source";
import { v4 as uuid } from "uuid";

export interface TrayFormProps {
  tray?: TrayProps;
  saveTray$: QRL<(tray: TrayProps) => void>;
}

export default component$<TrayFormProps>((props) => {
  const label = useSignal<string>("");
  const description = useSignal<string>("");
  const tray = useComputed$(() => ({
    id: props.tray?.id || uuid(),
    label: label.value,
    description: description.value
  }));
  
  useTask$(({ track }) => {
    track(() => props.tray);
    if (!props.tray) return;
    label.value = props.tray.label;
    description.value = props.tray.description || "";
  });
  
  const saveTray = $(async () => {
    await props.saveTray$(tray.value);
    label.value = "";
    description.value = "";
  });
  
  return (
    <div class={"flex flex-col gap-10"}>
      <div class="grid gap-4 py-4">
        <div class="md:grid md:grid-cols-4 items-center gap-2 ">
          <Label for="label" class="text-left">
            Label
          </Label>
          <Input
            name="label"
            id="label"
            placeholder="Pedro Duarte"
            class="col-span-3 dark:bg-[#212121] dark:text-gray-300"
            bind:value={label}
          />
        </div>
        <div class="md:grid md:grid-cols-4 items-center gap-4">
          <Label for="description" class="text-left">
            Description
          </Label>
          <Textarea
            name="description"
            id="description"
            placeholder="Optional Description"
            class="col-span-3"
            bind:value={description}
          />
        </div>
      </div>
      <footer class={"flex justify-between"}>
        <Slot name={"cancel"} />
        <Button look="primary" onClick$={saveTray} class={"bg-[#75617C] text-gray-200"}>
          Save
        </Button>
      </footer>
    </div>
  );
});
