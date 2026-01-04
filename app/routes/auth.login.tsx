import { useState } from "react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useActionData } from "@remix-run/react";
import { Page, Card, Text, Button, TextField, BlockStack } from "@shopify/polaris";
import { login } from "../shopify.server";

// ログインが必要になったら、まずこのページが表示されます
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  // URLにショップ名が含まれていれば、即座にログイン（脱出）処理を開始
  if (shop) {
    try {
      return await login(request);
    } catch (error) {
      // エラーが出ても画面を表示し続ける
      console.error(error);
    }
  }

  return json({ shop });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const shop = formData.get("shop");
  
  // フォームからショップ名が入力されたらログイン処理へ
  if (typeof shop === "string" && shop.length > 0) {
    return await login(request);
  }
  
  return json({ errors: { shop: "Please enter your shop domain" } });
};

export default function AuthLogin() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [shop, setShop] = useState(loaderData.shop || "");

  return (
    <Page>
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "50px" }}>
        <Card>
          <BlockStack gap="500">
            <Text as="h2" variant="headingMd">
              Log in to Delivery Gift Lite
            </Text>
            <Form method="post">
              <BlockStack gap="400">
                <TextField
                  label="Shop domain"
                  name="shop"
                  value={shop}
                  onChange={setShop}
                  autoComplete="on"
                  error={actionData?.errors?.shop}
                  helpText="e.g. my-shop.myshopify.com"
                />
                <Button submit variant="primary">
                  Log in
                </Button>
              </BlockStack>
            </Form>
          </BlockStack>
        </Card>
      </div>
    </Page>
  );
}