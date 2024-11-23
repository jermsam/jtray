import {
  $,
  type NoSerialize,
  component$,
  noSerialize,
  useContext,
  useOnDocument,
  useSignal,
  useTask$,
  useComputed$,
} from '@builder.io/qwik';
import {type DocumentHead, server$} from '@builder.io/qwik-city';
import Sortable from 'sortablejs';
import TrayCard from '../../components/tray-card';
import TrayDialog from '~/components/tray-dialog';
import TrayForm from '../../components/forms/tray-form';
import {Button} from '~/components/ui/button/button';
import {TraysContext} from './layout';
import {isServer} from '@builder.io/qwik/build';
import {initialTray, type Tray} from '~/lib/data';

export const deleteTray = server$(async function (id: string) {
  const res: Response = await fetch(`${this.url.origin}/api/trays/${id}`, {
    method: 'DELETE',
  });
  
  if (res.status === 204) {
    return {message: `Tray with ID ${id} deleted successfully.`};
  } else {
    const error = await res.json();
    return {error: error.error || 'Failed to delete tray'};
  }
});

export const reOrderTrays = server$(async function (affectedTrays: Tray[]) {
  try {
    const updatePromises = affectedTrays.map(async (tray) => {
      const res = await fetch(`${this.url.origin}/api/trays/${tray.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({order: tray.order}),
      });
      
      if (!res.ok) {
        const error = await res.json();
        console.error(`Failed to update tray ${tray.id}:`, error.error);
      } else {
        console.log(`Tray ${tray.id} updated successfully.`);
      }
    });
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error updating trays:', error);
  }
});

const recalculateOrder = (
  trays: Tray[],
  oldIndex: number,
  newIndex: number,
) => {
  // Determine the range of affected indices
  const change = oldIndex < newIndex ? -1 : 1;
  const affectedRange =
    change < 0 // [1,2,3,4,5] [1,3,4,2,5]
      ? {start: oldIndex - change, end: newIndex} // down/right // [1,2,3,4,5] [1,2,5,3,4]
      : {start: newIndex, end: oldIndex - change}; // up/left
  const moved = trays[oldIndex];
  const subArray = trays.slice(affectedRange.start, affectedRange.end + 1);
  const affectedTrays: Tray[] = [
    ...subArray.map((tray) => ({
      ...tray,
      order: (tray.order as number) + change,
    })),
    {...moved, order: newIndex + 1},
  ];
  return affectedTrays;
};

export default component$(() => {
  const sortableGrid = useSignal<HTMLDivElement>();
  const openDeleteDialog = useSignal<boolean>(false);
  const openAddTrayForm = useSignal<boolean>(false);
  const traysStore = useContext(TraysContext);
  const trayToEdit = useSignal<Tray>();
  const trayToDelete = useSignal<Tray>();
  const sortable = useSignal<NoSerialize<Sortable>>();
  
  const initSortable = $(async () => {
    if (!sortableGrid.value) return;
    const sort = new Sortable(sortableGrid.value, {
      animation: 150,
      ghostClass: 'ghost-tray',
      onEnd: (e) => {
        const oldIndex = e.oldIndex;
        const newIndex = e.newIndex;
        if (
          oldIndex === undefined ||
          newIndex === undefined ||
          oldIndex === newIndex
        )
          return;
        // Collect affected trays and update their order
        const affectedTrays = recalculateOrder(
          traysStore.trays,
          oldIndex,
          newIndex,
        );
        console.log('Affected trays:', affectedTrays);
        reOrderTrays(affectedTrays);
      },
    });
    sortable.value = noSerialize(sort);
  });
  
  useTask$(async ({track}) => {
    track(() => sortableGrid.value);
    if (isServer) return;
    await initSortable();
  });
  
  useOnDocument('DOMContentLoaded', initSortable);
  
  const editTray = $((tray: Tray) => {
    trayToEdit.value = tray;
    openAddTrayForm.value = true;
  });
  
  const cancelEditAction = $(() => {
    trayToEdit.value = initialTray;
    openAddTrayForm.value = false;
  });
  const promptDeleteTray = $((tray: Tray) => {
    trayToDelete.value = tray;
    openDeleteDialog.value = true;
  });
  const confirmDeleteTray = $(async () => {
    if (!trayToDelete.value) return;
    const trayIdToDelete = trayToDelete.value.id as string;
    const result = await deleteTray(trayIdToDelete);
    console.log(result.message || result.error);
    trayToDelete.value = undefined;
    openDeleteDialog.value = false;
  });
  const cancelDeleteAction = $(() => {
    trayToDelete.value = undefined;
    openDeleteDialog.value = false;
  });
  
  const openAddTray = $(() => {
    trayToEdit.value = initialTray;
    openAddTrayForm.value = true;
  });
  
  const onCancel = $(async () => {
    trayToEdit.value = initialTray;
    openAddTrayForm.value = false;
  });
  
  const orderedTrays = useComputed$(() => {
    return traysStore.trays.slice().sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    })
  });
  
  return (
    <div class={'max-w-screen mx-auto'}>
      <div class={'flex flex-col items-center justify-center py-16 md:p-2'}>
        <div
          class={'my-2 flex h-10 w-full items-center justify-between gap-10'}
        >
          <div class="flex w-full max-w-md items-center justify-between text-sm">
            For optimal efficiency, categorize trays by business operations.
          </div>
          <Button
            onClick$={openAddTray}
            look={'outline'}
            class={
              ' w-48 border border-gray-500 bg-gray-200 text-sm text-gray-500 hover:bg-gray-100 active:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-500'
            }
          >
            Add Tray
          </Button>
        </div>
        <div class={'flex h-full flex-wrap  gap-5'}>
          <div
            ref={sortableGrid}
            class={
              'no-scrollbar no-scrollbar grid h-full max-h-[800px] grid-cols-2 flex-wrap gap-10 overflow-y-auto border-dashed py-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
            }
          >
            {orderedTrays.value.map((tray) => (
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
          title={`${trayToEdit.value?.label ? 'Edit' : 'New'} Tray`}
          description={
            'Temporary hold for items awaiting further processing, review or action'
          }
          open={openAddTrayForm.value}
          openChange$={(val) => (openAddTrayForm.value = val)}
        >
          <TrayForm tray={trayToEdit.value} onCancel$={onCancel}>
            <Button
              q:slot={'cancel'}
              look={'outline'}
              onClick$={cancelEditAction}
            >
              Cancel
            </Button>
          </TrayForm>
        </TrayDialog>
        <TrayDialog
          title={'Confirm'}
          description={`Do you really want to delete tray ${trayToDelete.value?.label}? Deleting it will also delete all its items.`}
          open={openDeleteDialog.value}
          openChange$={(val) => (openDeleteDialog.value = val)}
        >
          <div class={'h-10'}/>
          <div class={'flex  w-full justify-between'}>
            <Button look={'outline'} onClick$={cancelDeleteAction}>
              No
            </Button>
            <Button
              class={'bg-[#75617C] text-gray-200'}
              onClick$={confirmDeleteTray}
            >
              Yes
            </Button>
          </div>
        </TrayDialog>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Trays | Dashboard',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
