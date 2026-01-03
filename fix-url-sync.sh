#!/bin/bash

# Shopify PartnersダッシュボードのURL同期問題を解決するスクリプト
# 「Update URLs Not yet configured」の問題を解決します

set -e

echo "🔧 Shopify URL同期問題の解決を開始します..."
echo ""

# 1. 最新のCloudflare Tunnel URLを取得
LATEST_URL=$(cat .shopify/dev-bundle/manifest.json 2>/dev/null | grep -o "https://[^\"]*trycloudflare.com" | head -1)

if [ -z "$LATEST_URL" ]; then
  echo "❌ エラー: Cloudflare Tunnel URLが見つかりません"
  echo "💡 shopify app dev が実行中であることを確認してください"
  exit 1
fi

echo "✅ 最新のURL: ${LATEST_URL}"
echo ""

# 2. shopify.app.tomlを最新のURLに更新
echo "📝 shopify.app.tomlを更新中..."
./update-url-safe.sh
echo ""

# 3. 現在の設定を確認
echo "📊 現在の設定を確認中..."
shopify app info 2>&1 | grep -A 5 "Update URLs" || echo "設定情報の取得に失敗しました"

echo ""
echo "💡 解決方法:"
echo ""
echo "   方法1: Shopify Partnersダッシュボードで手動更新（推奨・確実）"
echo "   1. https://partners.shopify.com にログイン"
echo "   2. Apps > delivery-gift-lite を選択"
echo "   3. App setup > URLs and redirects に移動"
echo "   4. Application URL を ${LATEST_URL} に更新"
echo "   5. Allowed redirection URLs に以下を追加（既に存在する場合は更新）:"
echo "      - ${LATEST_URL}/auth/callback"
echo "      - ${LATEST_URL}/auth/shopify/callback"
echo ""
echo "   方法2: shopify app config push を使用（実験的）"
echo "   ⚠️  注意: このコマンドは shopify.app.toml の内容をPartnersダッシュボードにプッシュします"
echo "   shopify app config push"
echo ""

# 4. 現在のURLが動作するか確認
echo "🔍 最新URLの動作確認中..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${LATEST_URL}" || echo "000")
if echo "$HTTP_CODE" | grep -qE "200|302|301"; then
  echo "✅ 最新URLは正常に動作しています (HTTP ${HTTP_CODE})"
else
  echo "⚠️  最新URLへのアクセスに問題がある可能性があります (HTTP ${HTTP_CODE})"
fi

echo ""
echo "✨ 完了しました！"
echo ""
echo "📌 次のステップ:"
echo "   1. 上記の方法1（手動更新）を実行することを強く推奨します"
echo "   2. 更新後、ブラウザでアプリにアクセスして動作を確認してください"
echo "   3. 今後、URLが変更された場合は、このスクリプトを再実行してください"

