#!/bin/bash

# キャッシュされた古いURLの問題を解決するスクリプト

set -e

echo "🔧 キャッシュされた古いURLの問題を解決します..."
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

# 古いURLが存在しないことを確認
OLD_URL="city-ongoing-falls-waters.trycloudflare.com"
echo "🔍 古いURLの存在確認中..."
if curl -s -o /dev/null -w "%{http_code}" "https://${OLD_URL}" 2>&1 | grep -q "Could not resolve"; then
  echo "✅ 確認: 古いURL（${OLD_URL}）は既に存在しません"
  echo "   これは正常です。Cloudflare Tunnelは起動のたびに新しいURLを生成します"
else
  echo "⚠️  警告: 古いURLがまだ存在する可能性があります"
fi

echo ""
echo "📋 問題の原因と解決方法:"
echo ""
echo "   原因:"
echo "   - Shopify Adminやブラウザが古いURLをキャッシュしている"
echo "   - 開発ストア側の設定が古いURLのままになっている"
echo "   - セッション情報に古いURLが保存されている"
echo ""
echo "   解決方法:"
echo ""
echo "   1. ブラウザのキャッシュとCookieをクリア"
echo "      - Chrome/Edge: Ctrl+Shift+Delete (Mac: Cmd+Shift+Delete)"
echo "      - 「キャッシュされた画像とファイル」と「Cookieとその他のサイトデータ」を選択"
echo "      - 「時間範囲」を「全期間」に設定"
echo "      - 「データを削除」をクリック"
echo ""
echo "   2. シークレット/プライベートモードでアクセス"
echo "      - 新しいシークレットウィンドウを開く"
echo "      - 以下にアクセス:"
echo "        https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite"
echo ""
echo "   3. 開発ストアでアプリを再インストール（推奨）"
echo "      - Shopify Adminにログイン"
echo "      - 設定 > アプリと販売チャネル"
echo "      - delivery-gift-lite をアンインストール"
echo "      - 再度インストール"
echo "      - これにより、最新のURL設定が反映されます"
echo ""
echo "   4. 直接最新URLにアクセスしてセッションをリセット"
echo "      - ブラウザで以下に直接アクセス:"
echo "        ${LATEST_URL}"
echo "      - これにより、新しいセッションが開始されます"
echo ""
echo "   5. Shopify CLIを再起動"
echo "      - 現在の shopify app dev を停止（Ctrl+C）"
echo "      - 再度 shopify app dev を実行"
echo "      - 新しいURLが生成される可能性があります"
echo ""

# 現在のshopify app devプロセスを確認
if ps aux | grep -q "[s]hopify app dev"; then
  echo "✅ shopify app dev は実行中です"
else
  echo "⚠️  shopify app dev が実行されていません"
  echo "   shopify app dev を起動してください"
fi

echo ""
echo "✨ 完了しました！"
echo ""
echo "📌 推奨される手順:"
echo "   1. ブラウザのキャッシュをクリア"
echo "   2. シークレットモードでアプリにアクセス"
echo "   3. それでも解決しない場合は、開発ストアでアプリを再インストール"

