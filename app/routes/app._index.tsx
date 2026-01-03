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
  const { admin, billing } = await authenticate.admin(request);

  // 1. 現在の課金状態をチェック
  // check() は、そのプランが有効なら { hasActivePayment: true } を返します
  let isPremium = false;
  try {
    const billingCheck = await billing.check({
      plans: [MONTHLY_PLAN],
      isTest: true,
    } as any);
    isPremium = billingCheck.hasActivePayment;
  } catch (error) {
    console.log("Billing check skipped or failed:", error);
    isPremium = false;
  }

  // 2. ショップ情報を取得（念のため）
  const response = await admin.graphql(`query { shop { name } }`);
  const shopData = await response.json();

  return json({
    shopName: shopData.data?.shop?.name || "My Shop",
    isPremium, // フロントエンドに「課金済みか？」を渡す
  });
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
  const shopName = loaderData?.shopName || "Shop";
  const isPremium = loaderData?.isPremium || false;

  const submit = useSubmit();

  // アップグレードボタンを押した時の動き
  const handleUpgrade = () => {
    submit({ actionType: "upgrade" }, { method: "POST" });
  };

  return (
    <Page title="Delivery Gift Lite">
      <BlockStack gap="500">
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

                  {!isPremium && (
                    <Button variant="primary" onClick={handleUpgrade}>
                      Upgrade to PRO
                    </Button>
                  )}

                  {isPremium && <Button disabled>Currently Active</Button>}
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}