import { type RequestHandler } from '@builder.io/qwik-city';
import { type Tray, trays } from "~/lib/data";
const MAX_SUBSCRIBERS = 1000;
const HEARTBEAT_INTERVAL = 30000;

let subscribers: ((data: Tray[]) => void)[] = [];

// SSE endpoint for real-time updates
export const onGet: RequestHandler = async (event) => {

  if (subscribers.length >= MAX_SUBSCRIBERS) {
    event.json(503, { error: 'Too many connections' });
    return;
  }

  const stream = new ReadableStream({
    start(controller) {

      const heartbeat = setInterval(() => {
        controller.enqueue(': heartbeat\n\n');
      }, HEARTBEAT_INTERVAL);

      const sendData = () => {
        try {
          controller.enqueue(`data: ${JSON.stringify(trays)}\n\n`);
        } catch (error) {
          console.error('SSE send error:', error);
        }
      };

      // // Send initial data
      sendData();

      // Subscribe for real-time updates
      const unsubscribe = subscribe(sendData);

      // Clean up on client disconnect
      event.request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        unsubscribe();
        controller.close();
      });
    },
  });

  // Correct MIME type for SSE
  event.send(new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Prevent proxy buffering
    },
  }));

};

// Subscribe for real-time updates
export function subscribe(subscriber: (data: Tray[]) => void) {
  subscribers.push(subscriber);
  return () => {
    subscribers = subscribers.filter((sub) => sub !== subscriber);
  };
}

// Notify subscribers of changes
export function notifySubscribers() {
  subscribers.forEach((callback) => callback(trays));
}
