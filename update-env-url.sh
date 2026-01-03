#!/bin/bash

# .envファイルのSHOPIFY_APP_URLを最新のCloudflare Tunnel URLに更新するスクリプト

set -e

echo "🔄 .envファイルのSHOPIFY_APP_URLを更新します..."
echo ""

# 最新のCloudflare Tunnel URLを取得
LATEST_URL=$(cat .shopify/dev-bundle/manifest.json 2>/dev/null | grep -o "https://[^\"]*trycloudflare.com" | head -1)

if [ -z "$LATEST_URL" ]; then
  echo "❌ エラー: Cloudflare Tunnel URLが見つかりません"
  echo "💡 shopify app dev が実行中であることを確認してください"
  exit 1
fi

echo "✅ 最新のURL: ${LATEST_URL}"
echo ""

# .envファイルが存在するか確認
if [ ! -f .env ]; then
  echo "⚠️  .envファイルが見つかりません。作成します..."
  echo "SHOPIFY_APP_URL=${LATEST_URL}" > .env
  echo "✅ .envファイルを作成しました"
else
  # .envファイルのSHOPIFY_APP_URLを更新
  if grep -q "SHOPIFY_APP_URL" .env; then
    # 既存のSHOPIFY_APP_URLを更新
    sed -i '' "s|SHOPIFY_APP_URL=.*|SHOPIFY_APP_URL=${LATEST_URL}|" .env
    echo "✅ .envファイルのSHOPIFY_APP_URLを更新しました"
  else
    # SHOPIFY_APP_URLが存在しない場合は追加
    echo "SHOPIFY_APP_URL=${LATEST_URL}" >> .env
    echo "✅ .envファイルにSHOPIFY_APP_URLを追加しました"
  fi
fi

echo ""
echo "📋 更新後の設定:"
grep "SHOPIFY_APP_URL" .env || echo "SHOPIFY_APP_URLが見つかりません"

echo ""
echo "💡 次のステップ:"
echo "   1. shopify app dev を再起動してください（環境変数の変更を反映するため）"
echo "   2. ブラウザのキャッシュをクリアしてください"
echo "   3. 開発ストアでアプリを再インストールすることを推奨します"
echo ""
echo "✨ 完了しました！"

