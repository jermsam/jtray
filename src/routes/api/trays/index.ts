import { type RequestHandler } from '@builder.io/qwik-city';
import { trays } from '~/lib/data';
import { v4 as uuid } from 'uuid';
import { notifySubscribers } from "~/routes/api/trays/sse";
import {traySchema } from "~/lib/data";

// GET: List all trays
export const onGet: RequestHandler = async (event) => {
  event.json(200, trays); // Send the entire list
};

// POST: Create a new tray
export const onPost: RequestHandler = async (event) => {
  const newTray = await event.request.json();
  const data = {
    ...newTray,
    order: (trays.length + 1),
    id: uuid()
  }
  traySchema.parse(data)
  trays.push(data);
  notifySubscribers(); // Notify clients via SSE
  console.log('post middleware', data);
  event.json(201, data); // Use 201 Created
};
