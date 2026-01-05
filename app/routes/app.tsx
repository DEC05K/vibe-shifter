import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { authenticate, MONTHLY_PLAN } from "../shopify.server";
import { AppProvider } from "@shopify/shopify-app-remix/react";

export const loader = async ({ request }) => {
  try {
    // 認証と課金チェック
    await authenticate.admin(request, {
      billing: {
        [MONTHLY_PLAN]: {
          requestPayment: true, 
        },
      },
    });
  } catch (error) {
    // リダイレクト(Response)が発生した場合の特殊処理
    if (error instanceof Response) {
      const url = error.headers.get("Location");
      
      // 302リダイレクトなら、iframeの壁を超えるための「ソフトリダイレクト」に変換
      // これにより "Connection Refused" を100%回避します
      if (url) {
        return new Response(
          `<html>
            <head>
              <title>Redirecting...</title>
            </head>
            <body>
              <script>
                // 親ウィンドウ(Top)がある場合はそちらを、なければ自分自身を移動
                // これが「脱出」の確実なコードです
                if (window.top) {
                  window.top.location.href = "${url}";
                } else {
                  window.location.href = "${url}";
                }
              </script>
              <p>Redirecting to ${url}...</p>
            </body>
          </html>`,
          {
            status: 200, // 302ではなく200を返すことでブラウザのブロックを回避
            headers: {
              "Content-Type": "text/html",
            },
          }
        );
      }
      throw error;
    }
    throw error;
  }

  return json({ apiKey: process.env.SHOPIFY_API_KEY });
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <Outlet />
    </AppProvider>
  );
}

// 万が一のエラー時のフォールバック
export function ErrorBoundary() {
  return null;
}