import { component$, type QRL, Slot, useTask$ } from "@builder.io/qwik";
import { useForm, zodForm$, formAction$, setValue } from "@modular-forms/qwik";
import { Input } from "~/components/ui/input/input";
import { Button } from "~/components/ui/button/button";
import { initialTray, type Tray,  traySchema } from "~/lib/data";
import { Label } from "@qwik-ui/headless";
import { Textarea } from "~/components/ui/textarea/textarea";

export const useFormAction = formAction$(async (values, ctx) => {
  // Runs on server

  if (!values.id) {
    // post
    await fetch(`${ctx.url.origin}/api/trays`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

  } else {
    // put
    await fetch(`${ctx.url.origin}/api/trays/${values.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
  }


  // @ts-ignore
}, zodForm$(traySchema));

export interface TrayFormProps {
  tray?: Tray;
  onCancel$?: QRL<() => void>;
}

export default component$<TrayFormProps>((props) => {
  const [trayForm, { Form, Field }] = useForm<Tray>({
    // @ts-ignore
    loader: { value: initialTray },
    validate: zodForm$(traySchema),
    action: useFormAction(),
  });

  useTask$(({ track }) => {
    const tray = track(() => props.tray);
    if (!tray) return;
    for (const [key, value] of Object.entries(tray)) {
      setValue(trayForm, key, value as never);
    }
  });

  return (
    <Form class={"flex flex-col gap-10"} onSubmit$={props.onCancel$}>
      <div class="grid gap-4 py-4">
        <Field name={"id"}>
          {(field, props) => ( <Input  {...props}  value={field.value}  type="hidden" />)}
        </Field>
        <Field name={"label"}>
          {(field, props) => (
            <div class="items-center gap-2 md:grid md:grid-cols-4 ">
              <Label for="label" class="text-left">
                Label
              </Label>
              <Input
                {...props}
                name="label"
                id="label"
                placeholder="Required Label"
                class="col-span-3 dark:bg-[#212121] dark:text-gray-300"
                value={field.value}
                error={field.error}
              />
            </div>
          )}
        </Field>

        <Field name={"description"}>
          {(field, props) => (
            <div class="items-center gap-4 md:grid md:grid-cols-4">
              <Label for="description" class="text-left">
                Description
              </Label>
              <Textarea
                {...props}
                name="description"
                id="description"
                placeholder="Optional Description"
                class="col-span-3"
                value={field.value}
                error={field.error}
              />
            </div>
          )}
        </Field>
      </div>
      <footer class={"flex justify-between"}>
        <Slot name={"cancel"} />
        <Button
          look="primary"
          type={"submit"}
          class={"bg-[#75617C] text-gray-200"}
        >
          Save
        </Button>
      </footer>
    </Form>
  );
});
