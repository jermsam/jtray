import { type RequestHandler } from '@builder.io/qwik-city';
import { type Tray, trays } from "~/lib/data";

let subscribers: ((data: Tray[]) => void)[] = [];

// SSE endpoint for real-time updates
export const onGet: RequestHandler = async (event) => {
  const stream = new ReadableStream({
    start(controller) {
      const sendData = () => {
        controller.enqueue(`data: ${JSON.stringify(trays)}\n\n`); // Ensure correct format
      };
      
      // Send initial data
      sendData();
      
      // Subscribe for real-time updates
      const unsubscribe = subscribe(() => sendData());
      
      // Clean up on client disconnect
      event.request.signal.addEventListener('abort', () => {
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
      Connection: 'keep-alive',
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
