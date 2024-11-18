import { type RequestHandler } from '@builder.io/qwik-city';
import { trays } from '~/lib/data';
import { v4 as uuid } from 'uuid';
import { notifySubscribers } from "~/routes/api/trays/sse";

// GET: List all trays
export const onGet: RequestHandler = async (event) => {
  event.json(200, trays); // Send the entire list
};

// POST: Create a new tray
export const onPost: RequestHandler = async (event) => {
  const newTray = await event.request.json();
  newTray.id = uuid();
  trays.push(newTray);
  notifySubscribers(); // Notify clients via SSE
  event.json(201, newTray); // Use 201 Created
};
