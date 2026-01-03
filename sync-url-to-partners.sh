#!/bin/bash

# Shopify PartnersダッシュボードのURLを最新のCloudflare Tunnel URLに同期するスクリプト
# このスクリプトは、shopify.app.tomlを更新した後、Partnersダッシュボードにも反映させます

set -e  # エラーが発生したら即座に終了

echo "🔄 Shopify PartnersダッシュボードへのURL同期を開始します..."

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
# 注意: これは開発環境用の設定のみを更新し、本番環境には影響しません
echo "🚀 Shopify Partnersダッシュボードに設定を同期中..."
echo "   （この処理には数秒かかる場合があります）"
echo ""

# shopify app deploy を実行（--no-release フラグで本番環境には影響しない）
# ただし、開発環境では通常、設定の同期のみが必要な場合があります
# そのため、まずは shopify app info で現在の設定を確認します

echo "📊 現在のアプリ設定を確認中..."
shopify app info 2>&1 | grep -A 10 "App URL\|Redirect" || echo "設定情報の取得に失敗しました"

echo ""
echo "💡 次のステップ:"
echo "   1. Shopify Partnersダッシュボードにログイン"
echo "   2. アプリ設定 > URLs and redirects に移動"
echo "   3. Application URL を ${LATEST_URL} に更新"
echo "   4. Allowed redirection URLs に以下を追加（既に存在する場合は更新）:"
echo "      - ${LATEST_URL}/auth/callback"
echo "      - ${LATEST_URL}/auth/shopify/callback"
echo ""
echo "   または、shopify app deploy を実行して設定を同期することもできます"
echo "   （注意: 本番環境に影響する可能性があるため、開発環境でのみ使用してください）"
echo ""

# オプション: shopify app deploy を実行するかどうかを確認
read -p "shopify app deploy を実行して設定を同期しますか？ (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🚀 shopify app deploy を実行中..."
  shopify app deploy --no-release --force 2>&1 | head -50 || {
    echo "❌ エラー: shopify app deploy の実行に失敗しました"
    echo "💡 手動でPartnersダッシュボードの設定を更新してください"
    exit 1
  }
  echo "✅ 設定の同期が完了しました"
else
  echo "⏭️  shopify app deploy をスキップしました"
  echo "💡 手動でPartnersダッシュボードの設定を更新してください"
fi

echo ""
echo "✨ 完了しました！"
echo "   ブラウザでアプリにアクセスして、正常に動作することを確認してください"

