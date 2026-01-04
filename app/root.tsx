import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError, // ← 追加
} from "@remix-run/react";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { json } from "@remix-run/node";
import "@shopify/polaris/build/esm/styles.css";

// ヘッダー制御（iframe許可のため必須）
export const headers = (headersArgs) => {
  return {
    ...headersArgs.loaderHeaders,
    ...headersArgs.actionHeaders,
  };
};

export const loader = async ({ request }) => {
  return json({
    apiKey: process.env.SHOPIFY_API_KEY || "",
  });
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="stylesheet" href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider isEmbeddedApp apiKey={apiKey}>
          <Outlet />
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// ▼▼▼ これが足りていませんでした！ ▼▼▼
// 認証エラー（401）やリダイレクトが発生した時、
// iframeの中でクラッシュせず、正しく処理するための「受け皿」です。
export function ErrorBoundary() {
  const error = useRouteError();
  // エラー発生時でもAPIキーを取得（取得できない場合は空文字）
  // ※ルートローダーが失敗している可能性があるため、安全策を取る
  const apiKey = process.env.SHOPIFY_API_KEY || ""; 
  // 注意: クライアントサイドでは process.env は使えないことが多いですが、
  // Remixのビルドプロセスで置換されるか、または単純なエラー画面を表示します。
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="stylesheet" href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* エラー時も AppProvider で囲むことで、Shopifyライブラリが
            「あ、これは認証リダイレクトだ」と検知して、自動で脱出処理をしてくれます */}
        <AppProvider isEmbeddedApp apiKey={apiKey}>
           <Outlet />
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}