#!/bin/bash

# 最終的なURL問題解決スクリプト
# 古いURLが残っている場合の追加対策

set -e

echo "🔧 最終的なURL問題解決を開始します..."
echo ""

# 最新のURLを取得
LATEST_URL=$(cat .shopify/dev-bundle/manifest.json 2>/dev/null | grep -o "https://[^\"]*trycloudflare.com" | head -1)

if [ -z "$LATEST_URL" ]; then
  echo "❌ エラー: Cloudflare Tunnel URLが見つかりません"
  exit 1
fi

echo "✅ 最新のURL: ${LATEST_URL}"
echo ""

# 古いURLを確認
OLD_URL="inquiry-tvs-energy-kong.trycloudflare.com"
echo "🔍 古いURLの確認: ${OLD_URL}"
if curl -s -o /dev/null -w "%{http_code}" "https://${OLD_URL}" 2>&1 | grep -q "Could not resolve"; then
  echo "✅ 確認: 古いURLは既に存在しません（正常）"
else
  echo "⚠️  警告: 古いURLがまだ存在する可能性があります"
fi
echo ""

# すべての設定ファイルを最新のURLに更新
echo "📋 すべての設定ファイルを最新のURLに更新中..."
./update-env-url.sh > /dev/null 2>&1
./update-url-safe.sh > /dev/null 2>&1
echo "✅ 設定ファイルを更新しました"
echo ""

# Partnersダッシュボードに再度反映
echo "📋 Partnersダッシュボードに再度設定を反映中..."
if shopify app deploy --no-release --force 2>&1 | tee /tmp/shopify-deploy-final.log | grep -q "success\|New version created"; then
  VERSION_NAME=$(grep -o "delivery-gift-lite-[0-9]*" /tmp/shopify-deploy-final.log | tail -1)
  if [ -n "$VERSION_NAME" ]; then
    echo "✅ 新しいバージョンを作成しました: ${VERSION_NAME}"
    if shopify app release --version "${VERSION_NAME}" --force 2>&1 | grep -q "success\|Version released"; then
      echo "✅ バージョンをリリースしました: ${VERSION_NAME}"
    fi
  fi
fi
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "📋 追加の対策（手動操作が必要）"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "古いURLがまだ表示される場合、以下を試してください:"
echo ""
echo "1. ブラウザを完全に閉じて、再度開く"
echo "   - すべてのブラウザウィンドウを閉じる"
echo "   - ブラウザを再起動"
echo ""
echo "2. 別のブラウザで試す"
echo "   - Chrome、Firefox、Safariなど、別のブラウザで試してください"
echo ""
echo "3. 直接最新URLにアクセス"
echo "   ブラウザで直接以下にアクセス:"
echo "   ${LATEST_URL}"
echo ""
echo "4. 開発ストアのURLを直接変更"
echo "   ブラウザのアドレスバーで、以下にアクセス:"
echo "   https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite"
echo "   その後、F5キーで強制リロード（Ctrl+F5 / Cmd+Shift+R）"
echo ""
echo "5. Shopify Adminから直接アプリを開く"
echo "   - Shopify Adminの左側メニューから「アプリ」をクリック"
echo "   - 「delivery-gift-lite」をクリック"
echo ""

