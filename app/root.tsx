import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { json } from "@remix-run/node";
import "@shopify/polaris/build/esm/styles.css";

// ▼▼▼ この headers 設定が重要です！ ▼▼▼
// これがないとiframeの制御権限がもらえず、ブロックされます
export const headers = (headersArgs) => {
  return {
    // Remixのデフォルトヘッダー
    ...headersArgs.loaderHeaders,
    ...headersArgs.actionHeaders,
    // Shopify固有のCSPヘッダーなどはAppProviderが自動で管理しますが
    // 明示的に親ヘッダーを通す設定をしておきます
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