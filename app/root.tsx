import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { AppProvider } from "@shopify/shopify-app-remix/react"; // ← これを使います
import { json } from "@remix-run/node";
import "@shopify/polaris/build/esm/styles.css";

export const loader = async ({ request }) => {
  // 環境変数からAPIキーを注入
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
        <meta name="shopify-api-key" content={apiKey} />
        <Meta />
        <Links />
      </head>
      <body>
        {/* isEmbeddedApp を true にして Token Exchange を有効化 */}
        <AppProvider isEmbeddedApp apiKey={apiKey}>
          <Outlet />
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}