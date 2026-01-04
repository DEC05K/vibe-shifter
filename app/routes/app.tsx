import type { HeadersArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // 環境変数の検証（早期リターンでエラーを防ぐ）
  if (!process.env.SHOPIFY_API_KEY) {
    console.error("SHOPIFY_API_KEY is not set");
    return json({ apiKey: "" }, { status: 500 });
  }

  // SHOPIFY_APP_URLの検証
  const appUrl = process.env.SHOPIFY_APP_URL;
  if (!appUrl) {
    console.error("SHOPIFY_APP_URL is not set");
    return json({ apiKey: process.env.SHOPIFY_API_KEY || "" }, { status: 500 });
  }

  // URLが有効か確認
  try {
    const url = new URL(appUrl);
    if (url.protocol !== "https:") {
      console.error(`SHOPIFY_APP_URL must use https protocol. Current: ${appUrl}`);
      return json({ apiKey: process.env.SHOPIFY_API_KEY || "" }, { status: 500 });
    }
  } catch (urlError) {
    console.error(`Invalid SHOPIFY_APP_URL: ${appUrl}`, urlError);
    return json({ apiKey: process.env.SHOPIFY_API_KEY || "" }, { status: 500 });
  }

  try {
    // リダイレクトループを防ぐため、現在のURLを確認
    const url = new URL(request.url);
    console.log("=== app.tsx loader ===");
    console.log("Request URL:", url.toString());
    console.log("Pathname:", url.pathname);
    
    // OAuthコールバックパスの場合は、auth.$.tsxに処理を任せる
    if (url.pathname.startsWith("/auth/")) {
      console.log("OAuth path detected, skipping authentication check");
      return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
    }
    
    // 認証を実行（これがリダイレクトを返す可能性がある）
    console.log("Calling authenticate.admin(request)...");
    await authenticate.admin(request);
    console.log("✅ Authentication successful");
    return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
  } catch (error) {
    // エラーの詳細をログに記録
    console.error("Authentication error in app.tsx loader:", error);
    
    // Responseオブジェクト（リダイレクト）の場合は、そのまま再スロー
    // これにより、Shopifyの認証フローが正常に動作する
    if (error instanceof Response) {
      // リダイレクトループを防ぐため、リダイレクト先を確認
      const redirectUrl = error.headers.get("Location");
      if (redirectUrl) {
        console.log("Redirecting to:", redirectUrl);
        
        // リダイレクト先が現在のURLと同じ場合、ループを防ぐ
        const currentUrl = new URL(request.url);
        const redirectUrlObj = new URL(redirectUrl, request.url);
        if (currentUrl.pathname === redirectUrlObj.pathname && 
            currentUrl.search === redirectUrlObj.search) {
          console.error("⚠️ WARNING: Redirect loop detected! Same URL redirect.");
          console.error("Current URL:", currentUrl.toString());
          console.error("Redirect URL:", redirectUrl);
          // リダイレクトループを防ぐため、500エラーを返す
          return json({ apiKey: process.env.SHOPIFY_API_KEY || "" }, { status: 500 });
        }
      }
      throw error;
    }
    
    // その他のエラーの場合、詳細をログに記録して500エラーを返す
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL,
      });
    }
    
    // エラーページを表示するため、500エラーを返す（リダイレクトループを防ぐ）
    return json({ apiKey: process.env.SHOPIFY_API_KEY || "" }, { status: 500 });
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