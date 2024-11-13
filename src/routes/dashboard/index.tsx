import {
  $,
  component$,
  useContext,
  useOnDocument,
  useSignal,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import Sortable from "sortablejs";
import TrayCard from "../../components/tray-card";
import TrayDialog from "~/components/tray-dialog";
import TrayForm from "~/components/tray-form";
import { TraysContext } from "~/routes/layout";
import type { TrayProps } from "~/data_source";
import { Button } from "~/components/ui/button/button";

export default component$(() => {
  const sortableGrid = useSignal<HTMLDivElement>();
  const openDeleteDialog = useSignal<boolean>(false);
  const openAddTrayForm = useSignal<boolean>(false);
  const traysStore = useContext(TraysContext);
  const trayToEdit = useSignal<TrayProps>();
  const trayToDelete = useSignal<TrayProps>();
  useOnDocument(
    "DOMContentLoaded",
    $(() => {
      if (!sortableGrid.value) return;
      new Sortable(sortableGrid.value, {
        animation: 150,
        ghostClass: "ghost-tray",
      });
    }),
  );

  const saveTray = $((tray: TrayProps) => {
    if (trayToEdit.value) {
      const index = traysStore.trays.findIndex(
        (item) => item.label === trayToEdit.value?.label,
      );
      console.log({index});
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
    trayToEdit.value = {label: '', description:''};
    openAddTrayForm.value = false;
  });
  const promptDeleteTray = $((tray: TrayProps) => {
    trayToDelete.value = tray;
    openDeleteDialog.value = true;
  });
  const confirmDeleteTray = $(() => {
    const indexToRemove = traysStore.trays.findIndex(
      (item) => item.label === trayToDelete.value?.label,
    );
    
    if (indexToRemove > -1 && indexToRemove < traysStore.trays.length) {
      traysStore.trays.splice(indexToRemove, 1);
    }
    trayToDelete.value = undefined;
    openDeleteDialog.value = false;
  });
  const cancelDeleteAction = $(() => {
    trayToDelete.value = undefined;
    openDeleteDialog.value = false;
  });

  return (
    <div class={"mx-auto w-[560px] md:w-5/6 "}>
      <div class={"flex flex-col items-center justify-center p-2"}>
        <div class={"flex h-full flex-wrap gap-5"}>
          <div
            ref={sortableGrid}
            class={"flex flex-wrap  justify-center gap-10 border-dashed"}
          >
            {traysStore.trays.map((tray, index) => (
              <TrayCard key={index} {...tray} onEdit$={() => editTray(tray)}  onDelete$={()=>promptDeleteTray(tray)}/>
            ))}
            <div
              class={"base-tray border-dashed"}
              onclick$={() => (openAddTrayForm.value = true)}
            >
              <p class={"text-4xl"}> + </p>
            </div>
          </div>
        </div>
        <TrayDialog
          title={"New Tray"}
          description={
            "Temporary hold for items awaiting further processing, review or action"
          }
          open={openAddTrayForm.value}
          openChange$={(val) => (openAddTrayForm.value = val)}
        >
          <TrayForm saveTray$={saveTray} tray={trayToEdit.value} >
            <Button q:slot={'cancel'} look={'outline'} onClick$={cancelEditAction}>
              Cancel
            </Button>
          </TrayForm>
        </TrayDialog>
        <TrayDialog
          title={"Confirm"}
          description={
            `Do you really want to delete tray ${trayToDelete.value?.label}? Deleting it will also delete all its items.`
          }
          open={openDeleteDialog.value}
          openChange$={(val) => (openDeleteDialog.value = val)}
        >
          <div class={'h-10'}/>
          <div class={'w-full  flex justify-between'}>
            <Button look={'outline'} onClick$={cancelDeleteAction}>
              No
            </Button>
            <Button onClick$={confirmDeleteTray}>
              Yes
            </Button>
          </div>
        </TrayDialog>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
