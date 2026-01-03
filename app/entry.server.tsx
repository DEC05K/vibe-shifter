import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import { createReadableStreamFromReadable } from "@remix-run/node";
import type { EntryContext } from "@remix-run/node";
import { isbot } from "isbot"; // ← ★ここを書き換えました（{}をつけました）
import { handleUrlRedirect } from "./utils/url-redirect.server";

const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  // サーバー側リダイレクトは一時的に無効化（リダイレクトループの問題を解決するため）
  // デバッグログ
  const requestUrl = new URL(request.url);
  console.log("🔍 entry.server.tsx リクエスト受信:", {
    hostname: requestUrl.hostname,
    pathname: requestUrl.pathname,
  });
  
  // 古いURLからのリクエストを最新URLにリダイレクト（一時的に無効化）
  // const redirectResponse = handleUrlRedirect(request);
  // if (redirectResponse) {
  //   console.log("🔄 サーバー側リダイレクト実行");
  //   return redirectResponse;
  // }
  
  // console.log("✅ サーバー側リダイレクト不要");

  // Botか人間かを判定
  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          didError = true;
          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}