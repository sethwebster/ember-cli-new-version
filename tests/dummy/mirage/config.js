import { createServer } from 'miragejs';

function routes() {}

export default function (config) {
  return createServer({
    ...config,
    routes,
  });
}
