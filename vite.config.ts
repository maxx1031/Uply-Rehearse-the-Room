import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

type DevApiRequest = IncomingMessage & { body?: unknown };
type DevApiResponse = ServerResponse & {
  status: (code: number) => DevApiResponse;
  json: (payload: unknown) => void;
};

async function readRequestBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (!chunks.length) return {};

  const text = Buffer.concat(chunks).toString('utf8');
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function localRealtimeTokenApi(): Plugin {
  const routeToHandler: Record<string, string> = {
    "/api/realtime-token": "./api/realtime-token.js",
    "/api/review-advice": "./api/review-advice.js",
    "/api/review-chat": "./api/review-chat.js",
  };

  return {
    name: 'uply-local-realtime-token-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url ? new URL(req.url, 'http://localhost').pathname : '';
        const handlerPath = routeToHandler[pathname];
        if (!handlerPath) {
          next();
          return;
        }

        const devReq = req as DevApiRequest;
        devReq.body = await readRequestBody(req);

        const devRes = res as DevApiResponse;
        devRes.status = (code: number) => {
          res.statusCode = code;
          return devRes;
        };
        devRes.json = (payload: unknown) => {
          if (!res.headersSent) {
            res.setHeader('Content-Type', 'application/json');
          }
          res.end(JSON.stringify(payload));
        };

        const handlerUrl = new URL(handlerPath, import.meta.url).href;
        const { default: handler } = await import(handlerUrl);
        await handler(devReq, devRes);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  if (!process.env.OPENAI_API_KEY && env.OPENAI_API_KEY) {
    process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
  }

  return {
    plugins: [localRealtimeTokenApi(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
