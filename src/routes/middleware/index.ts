import { loggingMiddleware } from './logging';

export const onRequest = [loggingMiddleware];
