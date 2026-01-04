import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Badge,
  Banner,
} from "@shopify/polaris";
import { authenticate, MONTHLY_PLAN } from "../shopify.server";

// サーバー側: データの読み込みと処理
export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("=== LOADER START ===");
  console.log("Request URL:", request.url);
  console.log("Request method:", request.method);

  try {
    console.log("Step 1: Authenticating admin request...");
    const { admin, billing } = await authenticate.admin(request);
    console.log("✅ Authentication successful");

    // 1. 現在の課金状態をチェック
    // check() は、そのプランが有効なら { hasActivePayment: true } を返します
    let isPremium = false;
    let billingError: string | null = null;
    let billingCheckResult: any = null;

    console.log("Step 2: Checking billing status...");
    console.log("MONTHLY_PLAN:", MONTHLY_PLAN);
    
    try {
      console.log("Calling billing.check with:", {
        plans: [MONTHLY_PLAN],
        isTest: true,
      });
      
      billingCheckResult = await billing.check({
        plans: [MONTHLY_PLAN],
        isTest: true,
      } as any);
      
      console.log("✅ Billing check successful");
      console.log("Billing check raw result:", JSON.stringify(billingCheckResult, null, 2));
      
      isPremium = billingCheckResult?.hasActivePayment ?? false;
      console.log("isPremium determined:", isPremium);
      console.log("Billing check result:", { 
        isPremium, 
        billingCheck: billingCheckResult,
        hasActivePayment: billingCheckResult?.hasActivePayment,
      });
    } catch (error) {
      billingError = error instanceof Error ? error.message : "Unknown billing error";
      console.error("❌ LOADER ERROR: Billing check failed");
      console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
      console.error("Error message:", billingError);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      console.error("Error details:", {
        error: billingError,
        errorDetails: error,
        billingObject: billing ? "exists" : "null",
      });
      // 課金チェックが失敗しても、アプリは動作を続ける（Free Planとして表示）
      isPremium = false;
      console.log("⚠️ Continuing with isPremium = false due to billing check failure");
    }

    // 2. ショップ情報を取得
    let shopName = "My Shop";
    let shopError: string | null = null;
    
    console.log("Step 3: Fetching shop information...");
    try {
      const graphqlQuery = `query { shop { name } }`;
      console.log("GraphQL query:", graphqlQuery);
      
      const response = await admin.graphql(graphqlQuery);
      console.log("GraphQL response status:", response.status);
      console.log("GraphQL response ok:", response.ok);
      
      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
      }
      
      const shopData = await response.json();
      console.log("Shop data raw:", JSON.stringify(shopData, null, 2));
      
      shopName = shopData?.data?.shop?.name || "My Shop";
      console.log("✅ Shop name fetched:", shopName);
    } catch (error) {
      shopError = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ LOADER ERROR: Failed to fetch shop name");
      console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
      console.error("Error message:", shopError);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      console.error("Error details:", {
        error: shopError,
        errorDetails: error,
      });
      // ショップ名の取得に失敗しても、デフォルト値を使用
      shopName = "My Shop";
      console.log("⚠️ Using default shop name due to fetch failure");
    }

    const responseData = {
      shopName,
      isPremium, // フロントエンドに「課金済みか？」を渡す
      billingError, // デバッグ用
      shopError, // デバッグ用
      billingCheckResult, // デバッグ用（本番環境では削除可能）
      debug: {
        timestamp: new Date().toISOString(),
        isPremium,
        shopName,
        hasBillingError: !!billingError,
        hasShopError: !!shopError,
      },
    };

    console.log("=== LOADER SUCCESS ===");
    console.log("Response data:", JSON.stringify(responseData, null, 2));
    
    return json(responseData);
  } catch (error) {
    // エラーの詳細をログに記録
    console.error("❌ LOADER ERROR: Top-level error in app._index.tsx loader");
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error value:", error);
    
    // Responseオブジェクト（リダイレクト）の場合は、そのまま再スロー
    // これにより、Shopifyの認証フローが正常に動作する
    if (error instanceof Response) {
      const redirectUrl = error.headers.get("Location");
      if (redirectUrl) {
        console.log("🔄 Redirecting to:", redirectUrl);
      }
      throw error;
    }
    
    // その他のエラーの場合、詳細をログに記録して500エラーを返す
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error("Non-Error object:", JSON.stringify(error, null, 2));
    }
    
    // エラーページを表示するため、500エラーを返す（リダイレクトループを防ぐ）
    const errorResponse = {
      shopName: "Error",
      isPremium: false,
      error: error instanceof Error ? error.message : "Unknown error",
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      debug: {
        timestamp: new Date().toISOString(),
        hasError: true,
      },
    };
    
    console.error("=== LOADER ERROR RESPONSE ===");
    console.error("Error response:", JSON.stringify(errorResponse, null, 2));
    
    return json(errorResponse, { status: 500 });
  }
};

// サーバー側: ボタンが押された時の処理
export const action = async ({ request }: ActionFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("actionType") as string | null;

  if (actionType === "upgrade") {
    // A. アップグレード処理
    // Shopifyの課金承認画面へリダイレクトさせます
    // 戻り先(returnUrl)は、後で作る処理用URLを指定します
    await billing.require({
      plans: [MONTHLY_PLAN],
      isTest: true,
      onFailure: async () =>
        billing.request({
          plan: MONTHLY_PLAN,
          isTest: true,
          returnUrl: `https://${session.shop}/admin/apps/${process.env.SHOPIFY_API_KEY}/app`,
        } as any),
    } as any);
  }

  // キャンセル処理などは別途実装が必要ですが、まずはアップグレードのみ
  return null;
};

// フロントエンド: 画面表示
export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  
  // デバッグ用ログ
  console.log("=== FRONTEND RENDER ===");
  console.log("Loader data:", loaderData);
  console.log("Loader data type:", typeof loaderData);
  console.log("Loader data keys:", loaderData ? Object.keys(loaderData) : "null");
  
  // データの検証とデフォルト値の設定
  const shopName = loaderData?.shopName || "Shop";
  const isPremium = loaderData?.isPremium ?? false; // null/undefinedの場合はfalse
  const billingError = loaderData?.billingError || null;
  const shopError = loaderData?.shopError || null;
  const hasError = loaderData?.error || billingError || shopError;
  
  console.log("Extracted values:", {
    shopName,
    isPremium,
    billingError,
    shopError,
    hasError,
  });

  const submit = useSubmit();

  // アップグレードボタンを押した時の動き
  const handleUpgrade = () => {
    console.log("Upgrade button clicked");
    submit({ actionType: "upgrade" }, { method: "POST" });
  };

  // エラー表示用のコンポーネント
  const ErrorBanner = ({ error, title }: { error: string | null; title: string }) => {
    if (!error) return null;
    return (
      <Banner tone="critical" title={title}>
        <p>{error}</p>
      </Banner>
    );
  };

  // データが読み込めない場合の表示
  if (hasError && loaderData?.error) {
    console.error("Rendering error state");
    return (
      <Page title="Delivery Gift Lite">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Banner tone="critical" title="エラーが発生しました">
                  <p>プラン情報の読み込みに失敗しました。しばらくしてから再度お試しください。</p>
                  {process.env.NODE_ENV === "development" && (
                    <Text as="p" variant="bodySm" tone="subdued">
                      エラー詳細: {loaderData.error}
                    </Text>
                  )}
                </Banner>
                <Button onClick={() => window.location.reload()}>再読み込み</Button>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  console.log("Rendering normal state");

  return (
    <Page title="Delivery Gift Lite">
      <BlockStack gap="500">
        {/* エラーバナー（デバッグ用） */}
        {process.env.NODE_ENV === "development" && (
          <>
            <ErrorBanner error={billingError} title="課金チェックエラー" />
            <ErrorBanner error={shopError} title="ショップ情報取得エラー" />
          </>
        )}

        {/* ウェルカムメッセージ */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Welcome, {shopName}!
                </Text>
                <Text as="p" variant="bodyMd">
                  現在のプランステータス:{" "}
                  {isPremium ? (
                    <Badge tone="success">PRO Plan (Active)</Badge>
                  ) : (
                    <Badge tone="info">Free Plan</Badge>
                  )}
                </Text>
                {process.env.NODE_ENV === "development" && (
                  <Text as="p" variant="bodySm" tone="subdued">
                    Debug: isPremium = {String(isPremium)}, billingError = {billingError || "none"}
                  </Text>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* プラン比較表 */}
          <Layout.Section>
            <BlockStack gap="500">
              {isPremium ? (
                <Banner tone="success" title="ご利用ありがとうございます！">
                  <p>
                    現在、すべてのプレミアム機能（和紙・桜・ホログラムなど）が解放されています。
                  </p>
                </Banner>
              ) : (
                <Banner tone="warning" title="PROプランにアップグレードしませんか？">
                  <p>
                    月額 $9.99
                    で、制限されているすべての「神素材」をアンロックしましょう。
                  </p>
                </Banner>
              )}

              <Card>
                <BlockStack gap="400">
                  <Text as="h3" variant="headingMd">Plan Details</Text>

                  {/* プランデータが読み込めない場合の表示 */}
                  {!loaderData && (
                    <Banner tone="warning" title="プラン情報を読み込み中...">
                      <p>プラン情報を取得しています。しばらくお待ちください。</p>
                    </Banner>
                  )}

                  {loaderData && (
                    <Box paddingBlock="200">
                      <BlockStack gap="200">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text as="span" variant="bodyLg" fontWeight="bold">
                            PRO Plan
                          </Text>
                          <Text as="span" variant="bodyLg">$9.99 / month</Text>
                        </div>
                        <List type="bullet">
                          <List.Item>
                            全てのプレミアムテクスチャ使い放題 (和紙, 桜, etc)
                          </List.Item>
                          <List.Item>新素材の優先アクセス権</List.Item>
                          <List.Item>開発者サポート</List.Item>
                        </List>
                      </BlockStack>
                    </Box>
                  )}

                  {!isPremium && loaderData && (
                    <Button variant="primary" onClick={handleUpgrade}>
                      Upgrade to PRO
                    </Button>
                  )}

                  {isPremium && loaderData && (
                    <Button disabled>Currently Active</Button>
                  )}

                  {!loaderData && (
                    <Button disabled>読み込み中...</Button>
                  )}
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}