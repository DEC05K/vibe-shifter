import { useEffect } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, Text, Spinner } from "@shopify/polaris";
import { login } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  // APIキーをサーバーから取得してクライアントに渡す
  return json({
    shop,
    apiKey: process.env.SHOPIFY_API_KEY,
  });
};

export default function AuthLogin() {
  const { shop, apiKey } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (shop && apiKey) {
      // 【強制脱出ロジック】
      // App Bridgeに頼らず、直接親ウィンドウ(top)をインストール画面へ遷移させる
      // これにより "Refused to connect" を100%回避します
      const installUrl = `https://${shop}/admin/oauth/install?client_id=${apiKey}`;
      
      // 親ウィンドウが存在する場合のみ実行
      if (window.top) {
        window.top.location.href = installUrl;
      } else {
        window.location.href = installUrl;
      }
    }
  }, [shop, apiKey]);

  return (
    <Page>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Card>
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <Spinner accessibilityLabel="Redirecting" size="large" />
            <Text as="h2" variant="headingMd">
              Redirecting to Shopify...
            </Text>
            {/* JavaScriptが無効な場合のフォールバックボタン */}
            <br />
            {shop && apiKey && (
               <a 
                 href={`https://${shop}/admin/oauth/install?client_id=${apiKey}`} 
                 target="_top"
                 style={{ textDecoration: "none", color: "blue" }}
               >
                 Click here if not redirected
               </a>
            )}
          </div>
        </Card>
      </div>
    </Page>
  );
}