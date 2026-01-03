#!/bin/bash

# ShopifyアプリのURLを自動更新するスクリプト

# 最新のCloudflare Tunnel URLを取得
LATEST_URL=$(cat .shopify/dev-bundle/manifest.json | grep -o "https://[^\"]*trycloudflare.com" | head -1)

if [ -z "$LATEST_URL" ]; then
  echo "エラー: Cloudflare Tunnel URLが見つかりません"
  exit 1
fi

echo "最新のURL: $LATEST_URL"

# shopify.app.tomlを更新
sed -i '' "s|application_url = \".*\"|application_url = \"$LATEST_URL\"|" shopify.app.toml
sed -i '' "s|https://[^\"]*trycloudflare.com|$LATEST_URL|g" shopify.app.toml

echo "shopify.app.tomlを更新しました"

# 注意: shopify app config pull を実行すると、Shopify Partnersダッシュボードの
# 古い設定で shopify.app.toml が上書きされるため、実行しない
# echo "設定を同期中..."
# shopify app config pull

echo "完了しました！"
echo "注意: Shopify Partnersダッシュボードの設定は手動で更新する必要があります"

