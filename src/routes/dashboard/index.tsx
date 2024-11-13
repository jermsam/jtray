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
import { DarkModeContext, TraysContext } from "~/routes/layout";
import type { TrayProps } from "~/data_source";
import { Button } from "~/components/ui/button/button";
import Switch from "~/components/switch";
import {
  AkarIconsGithubOutlineFill,
  HugeiconsWifiConnected02,
  HugeiconsWifiDisconnected02,
} from "~/components/icons";
import { LightDarkMode } from "~/components/light-dark-mode";


export default component$(() => {
  const sortableGrid = useSignal<HTMLDivElement>();
  const openDeleteDialog = useSignal<boolean>(false);
  const openAddTrayForm = useSignal<boolean>(false);
  const traysStore = useContext(TraysContext);
  const trayToEdit = useSignal<TrayProps>();
  const trayToDelete = useSignal<TrayProps>();
  const darkMode = useContext(DarkModeContext);
  const connected = useSignal<boolean>(true);
  
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
      console.log({ index });
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
    trayToEdit.value = { label: "", description: "" };
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
  
  const onSwitchChange = $((v: boolean) => {
    connected.value = v
  })
  
  const openAddTray = $(()=>{
    trayToEdit.value = { label: "", description: "" };
    openAddTrayForm.value = true
  })

  return (
    <div class={"mx-auto w-[560px] md:w-5/6 max-w-screen"}>
      <div class={"flex flex-col items-center justify-center p-2"}>
        <div class={"flex w-full items-center justify-between"}>
          <div class={"flex gap-10"}>
            <div class={"flex gap-2"} style={{ marginRight: 6 }}>
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
            </div>
            
            <a
              href="https://github.com/jermsam"
              target="_blank"
            >
              <AkarIconsGithubOutlineFill class={"cursor-pointer text-2xl"} />
            </a>
          </div>
          <div class={"flex items-center gap-10"}>
            <div onclick$={openAddTray}>
              <Button look={'ghost'}>
                + TRAY
              </Button>
            </div>
           
            <LightDarkMode
              mode={darkMode.value}
              onModeChange$={(mode) => (darkMode.value = mode)}
            />
          </div>
          </div>
          <div class={"my-5 flex justify-center items-center gap-10 h-20 w-full"}>
            <div class="flex w-full max-w-sm items-center space-x-2">
            </div>
          </div>
          <div class={"flex h-full flex-wrap  gap-5"}>
            <div
              ref={sortableGrid}
              class={
                "max-h-[800px] py-2 h-full flex-wrap gap-10 overflow-y-auto border-dashed no-scrollbar grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 no-scrollbar"
              }
            >
              {traysStore.trays.map((tray, index) => (
                <TrayCard
                  key={index}
                  {...tray}
                  onEdit$={() => editTray(tray)}
                  onDelete$={() => promptDeleteTray(tray)}
                />
              ))}
            </div>
          </div>
          <TrayDialog
            title={`${trayToEdit.value ?'Edit': 'New'} Tray`}
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
              <Button onClick$={confirmDeleteTray}>Yes</Button>
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
