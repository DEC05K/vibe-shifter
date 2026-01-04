import type { HeadersArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    await authenticate.admin(request);
    return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
  } catch (error) {
    // 認証エラーの場合、Shopifyの認証フローに任せる（リダイレクトを投げる）
    // ただし、無限ループを防ぐため、エラーを再スロー
    if (error instanceof Response) {
      throw error;
    }
    // その他のエラーの場合も再スロー
    throw error;
  }
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey} i18n={polarisTranslations}>
      <Outlet />
    </AppProvider>
  );
}

// ErrorBoundary: Polarisに完全に依存しない、純粋なHTMLでエラーを表示
export function ErrorBoundary() {
  const error = useRouteError();
  
  // エラーの詳細をコンソールに出力（デバッグ用）
  console.error("=== ErrorBoundary でキャッチしたエラー ===");
  console.error(error);
  if (error instanceof Error) {
    console.error("エラーメッセージ:", error.message);
    console.error("エラースタック:", error.stack);
  }
  
  // エラーの詳細情報を取得
  let errorMessage = "不明なエラーが発生しました";
  let errorStack = "";
  let errorDetails = "";
  
  if (error instanceof Error) {
    errorMessage = error.message;
    errorStack = error.stack || "";
  } else if (typeof error === "object" && error !== null) {
    errorDetails = JSON.stringify(error, null, 2);
  } else {
    errorMessage = String(error);
  }
  
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
          .error-message {
            font-weight: bold;
            color: #991b1b;
            margin-bottom: 10px;
          }
          pre {
            background: #1f2937;
            color: #f9fafb;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 12px;
            line-height: 1.4;
          }
          .info {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
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
          <div className="error-message">エラーメッセージ:</div>
          <div>{errorMessage}</div>
        </div>
        
        {errorStack && (
          <div>
            <h2>スタックトレース:</h2>
            <pre>{errorStack}</pre>
          </div>
        )}
        
        {errorDetails && (
          <div>
            <h2>エラー詳細（JSON）:</h2>
            <pre>{errorDetails}</pre>
          </div>
        )}
        
        <div className="info">
          <strong>💡 デバッグのヒント:</strong>
          <ul>
            <li>このエラーは i18n エラーではなく、元のエラーです</li>
            <li>ブラウザのコンソール（F12）にも詳細が出力されています</li>
            <li>サーバーのログも確認してください</li>
          </ul>
        </div>
      </body>
    </html>
  );
}

export const headers = (headersArgs: HeadersArgs) => {
  return boundary.headers(headersArgs);
};