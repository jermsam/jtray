import {type RequestHandler} from '@builder.io/qwik-city';
import {trays} from '~/lib/data';
import {notifySubscribers} from '~/routes/api/trays/sse';

// GET: Fetch a tray by ID
export const onGet: RequestHandler = async (event) => {
  const tray = trays.find((t) => t.id === event.params.id);
  if (!tray) {
    event.json(404, {error: 'Tray not found'});
    return;
  }
  event.json(200, tray);
};

// PUT: Update a tray by ID
export const onPut: RequestHandler = async (event) => {
  const index = trays.findIndex((t) => t.id === event.params.id);
  if (index === -1) {
    event.json(404, {error: 'Tray not found'});
    return;
  }
  
  const updatedData = await event.request.json();
  trays[index] = {...trays[index], ...updatedData};
  notifySubscribers();
  event.json(200, trays[index]);
};

// DELETE: Remove a tray by ID
export const onDelete: RequestHandler = async (event) => {
  const index = trays.findIndex((t) => t.id === event.params.id);
  if (index === -1) {
    event.json(404, {error: 'Tray not found'});
    return;
  }
  
  trays.splice(index, 1); // Remove the tray
  notifySubscribers(); // Notify SSE clients
  event.json(204, null); // Use 204 No Content
};
