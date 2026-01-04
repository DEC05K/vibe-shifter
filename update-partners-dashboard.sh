#!/bin/bash

# Shopify PartnersダッシュボードのURLを更新するスクリプト
# shopify app deploy を使用して shopify.app.toml の内容をPartnersダッシュボードに反映

set -e

echo "🔄 Shopify PartnersダッシュボードのURLを更新します..."
echo ""

# 最新のCloudflare Tunnel URLを取得
LATEST_URL=$(cat .shopify/dev-bundle/manifest.json 2>/dev/null | grep -o "https://[^\"]*trycloudflare.com" | head -1)

if [ -z "$LATEST_URL" ]; then
  echo "❌ エラー: Cloudflare Tunnel URLが見つかりません"
  echo "💡 shopify app dev が実行中であることを確認してください"
  exit 1
fi

echo "✅ 最新のURL: ${LATEST_URL}"

# shopify.app.tomlの現在のURLを確認
CURRENT_URL=$(grep -E "^application_url\s*=" shopify.app.toml | sed -E 's/.*=.*"(.*)"/\1/' | tr -d ' ')

if [ "$CURRENT_URL" != "$LATEST_URL" ]; then
  echo "⚠️  警告: shopify.app.tomlのURLが最新のCloudflare Tunnel URLと一致していません"
  echo "   まず、update-url-safe.shを実行してshopify.app.tomlを更新してください"
  exit 1
fi

echo "📋 shopify.app.tomlのURL: ${CURRENT_URL}"
echo ""

# shopify app deploy を使用して設定を同期
echo "🚀 shopify app deploy を実行して、Partnersダッシュボードに設定を反映します..."
echo "   ⚠️  注意: --no-release フラグを使用するため、本番環境には影響しません"
echo ""

# shopify app deploy を実行（--no-release で本番環境には影響しない）
echo "📤 設定をデプロイ中..."
shopify app deploy --no-release --force 2>&1 || {
  echo ""
  echo "❌ エラー: shopify app deploy の実行に失敗しました"
  echo ""
  echo "💡 代替方法:"
  echo "   1. Shopify Partnersダッシュボードにログイン"
  echo "   2. Apps > delivery-gift-lite > Settings に移動"
  echo "   3. App setup > URLs and redirects でURLを手動更新"
  exit 1
}

echo ""
echo "✅ デプロイが完了しました"
echo ""
echo "✨ 完了しました！"
echo ""
echo "📌 次のステップ:"
echo "   1. Shopify Partnersダッシュボードで設定が更新されたか確認してください"
echo "   2. ブラウザでアプリにアクセスして、正常に動作することを確認してください"


