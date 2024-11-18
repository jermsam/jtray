import { type RequestHandler } from '@builder.io/qwik-city';

// Middleware as a RequestHandler
export const loggingMiddleware: RequestHandler  = async ({ request, next }) => {
  console.log(`[Request] ${request.method} ${request.url}`);
  await next();
};
