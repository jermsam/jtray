import {
  $,
  NoSerialize,
  component$,
  noSerialize,
  useComputed$,
  useContext,
  useOnDocument,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";

import Sortable from "sortablejs";
import TrayCard from "../../components/tray-card";
import TrayDialog from "~/components/tray-dialog";
import TrayForm from "~/components/tray-form";
import { DarkModeContext, useUser } from "~/routes/layout";
import type { TrayProps } from "~/data_source";
import { Button } from "~/components/ui/button/button";
import Switch from "~/components/switch";
import {
  HugeiconsWifiConnected02,
  HugeiconsWifiDisconnected02, LucideHouse
} from "~/components/icons";
import { LightDarkMode } from "~/components/light-dark-mode";
import ProfileAvatar from "~/components/profile-avatar";
import { TraysContext } from "./layout";
import { isServer } from "@builder.io/qwik/build";


export default component$(() => {
  const sortableGrid = useSignal<HTMLDivElement>();
  const openDeleteDialog = useSignal<boolean>(false);
  const openAddTrayForm = useSignal<boolean>(false);
  const traysStore = useContext(TraysContext);
  const trayToEdit = useSignal<TrayProps>();
  const trayToDelete = useSignal<TrayProps>();

  
  const sortable = useSignal<NoSerialize<Sortable>>();
  
  
  const initSortable = $(async () => {
    if (!sortableGrid.value) return;
    const sort = new Sortable(sortableGrid.value, {
      animation: 150,
      ghostClass: "ghost-tray",
      onEnd: (e) => {
        if (e.oldIndex === undefined || e.newIndex === undefined) return;
        const getItemsFromNode = (i: Element) => {
          const ijson = i.getAttribute("data-tray") as string;
          return JSON.parse(ijson);
        };
        const newItems = Array.from(e.target.children).map(getItemsFromNode);
        traysStore.trays = newItems;
      }
    });
    sortable.value = noSerialize(sort);
  });
  
  useTask$(({ track }) => {
    track(() => sortableGrid.value);
    if (isServer) return;
    initSortable();
  });
  
  useOnDocument("DOMContentLoaded", initSortable);
  
  const saveTray = $((tray: TrayProps) => {
    if (trayToEdit.value?.id) {
      const index = traysStore.trays.findIndex(
        (item) => item.id === trayToEdit.value?.id
      );
      if (index !== -1) {
        traysStore.trays[index] = tray;
      }
    } else {
      traysStore.trays.push(tray);
    }
    openAddTrayForm.value = false;
    trayToEdit.value = undefined;
  });
  
  const editTray = $((tray: TrayProps) => {
    trayToEdit.value = tray;
    openAddTrayForm.value = true;
  });
  
  const cancelEditAction = $(() => {
    trayToEdit.value = { id: "", label: "", description: "" };
    openAddTrayForm.value = false;
  });
  const promptDeleteTray = $((tray: TrayProps) => {
    trayToDelete.value = tray;
    openDeleteDialog.value = true;
  });
  const confirmDeleteTray = $(() => {
    const trays = traysStore.trays.filter(tray => tray.id !== trayToDelete.value?.id);
    traysStore.trays = trays;
    trayToDelete.value = undefined;
    openDeleteDialog.value = false;
  });
  const cancelDeleteAction = $(() => {
    trayToDelete.value = undefined;
    openDeleteDialog.value = false;
  });
  
  const openAddTray = $(() => {
    trayToEdit.value = { id: "", label: "", description: "" };
    openAddTrayForm.value = true;
  });
  
  return (
    <div class={"mx-auto w-[560px] md:w-5/6 max-w-screen"}>
      <div class={"flex flex-col items-center justify-center p-2"}>
        <div class={"my-2 flex justify-between items-center gap-10 h-10 w-full"}>
          <div class="flex w-full max-w-sm items-center justify-between bg-red-100 ">
          </div>
          <Button
            onClick$={openAddTray}
            look={'outline'}
            class={'bg-gray-200 border border-gray-500 hover:bg-gray-100 active:bg-gray-50 text-gray-500 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-500'}
           >
            Add Tray
          </Button>
        </div>
        <div class={"flex h-full flex-wrap  gap-5"}>
          <div
            ref={sortableGrid}
            class={
              "max-h-[800px] py-2 h-full flex-wrap gap-10 overflow-y-auto border-dashed no-scrollbar grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 no-scrollbar"
            }
          >
            {traysStore.trays.map((tray) => (
              <TrayCard
                key={tray.id}
                tray={tray}
                onEdit$={() => editTray(tray)}
                onDelete$={() => promptDeleteTray(tray)}
              />
            ))}
          </div>
        </div>
        <TrayDialog
          title={`${trayToEdit.value?.id ? "Edit" : "New"} Tray`}
          description={
            "Temporary hold for items awaiting further processing, review or action"
          }
          open={openAddTrayForm.value}
          openChange$={(val) => (openAddTrayForm.value = val)}
        >
          <TrayForm saveTray$={saveTray} tray={trayToEdit.value}>
            <Button
              q:slot={"cancel"}
              look={"outline"}
              onClick$={cancelEditAction}
            >
              Cancel
            </Button>
          </TrayForm>
        </TrayDialog>
        <TrayDialog
          title={"Confirm"}
          description={`Do you really want to delete tray ${trayToDelete.value?.label}? Deleting it will also delete all its items.`}
          open={openDeleteDialog.value}
          openChange$={(val) => (openDeleteDialog.value = val)}
        >
          <div class={"h-10"} />
          <div class={"flex  w-full justify-between"}>
            <Button look={"outline"} onClick$={cancelDeleteAction}>
              No
            </Button>
            <Button class={"bg-[#75617C] text-gray-200"} onClick$={confirmDeleteTray}>Yes</Button>
          </div>
        </TrayDialog>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Trays | Dashboard",
  meta: [
    {
      name: "description",
      content: "Qwik site description"
    }
  ]
};
