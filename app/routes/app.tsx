import type { HeadersArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Token Exchange (New Embedded Auth Strategy) を使用する場合、
  // 認証フローは自動的に処理されるため、シンプルに認証を実行するだけ
  // リダイレクトが必要な場合は、authenticate.admin() が自動的に Response を throw します
  await authenticate.admin(request);
  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey} i18n={polarisTranslations}>
      <Outlet />
    </AppProvider>
  );
}

// ErrorBoundary: Token Exchangeでは、認証エラーは自動的に処理されるため、
// シンプルなエラーハンドリングで十分です
export function ErrorBoundary() {
  const error = useRouteError();
  
  // Responseオブジェクト（リダイレクト）の場合は、そのまま再スロー
  // これにより、Shopifyの認証フローが正常に動作する
  if (error instanceof Response) {
    throw error;
  }
  
  // エラーの詳細をコンソールに出力（デバッグ用）
  console.error("ErrorBoundary caught error:", error);
  
  const errorMessage = error instanceof Error ? error.message : "不明なエラーが発生しました";
  
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>エラー - Delivery Gift Lite</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
          }
          h1 {
            color: #d72c0d;
            border-bottom: 2px solid #d72c0d;
            padding-bottom: 10px;
          }
          .error-box {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
          }
        `,
          }}
        />
      </head>
      <body>
        <h1>🚨 アプリケーションエラー</h1>
        <div className="error-box">
          <p>{errorMessage}</p>
        </div>
      </body>
    </html>
  );
}

export const headers = (headersArgs: HeadersArgs) => {
  return boundary.headers(headersArgs);
};