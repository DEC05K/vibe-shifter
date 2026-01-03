#!/bin/bash

# ShopifyアプリのURLを安全に自動更新するスクリプト
# バックアップ、検証、ロールバック機能付き

set -e  # エラーが発生したら即座に終了

BACKUP_DIR=".shopify-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/shopify.app.toml.${TIMESTAMP}"

# バックアップディレクトリを作成
mkdir -p "${BACKUP_DIR}"

# 現在のshopify.app.tomlをバックアップ
echo "📦 バックアップを作成中..."
cp shopify.app.toml "${BACKUP_FILE}"
echo "✅ バックアップ作成完了: ${BACKUP_FILE}"

# 最新のCloudflare Tunnel URLを取得
echo "🔍 最新のURLを取得中..."
LATEST_URL=$(cat .shopify/dev-bundle/manifest.json 2>/dev/null | grep -o "https://[^\"]*trycloudflare.com" | head -1)

if [ -z "$LATEST_URL" ]; then
  echo "❌ エラー: Cloudflare Tunnel URLが見つかりません"
  echo "💡 shopify app dev が実行中であることを確認してください"
  exit 1
fi

echo "✅ 最新のURL: ${LATEST_URL}"

# 現在のURLを取得
CURRENT_URL=$(grep -E "^application_url\s*=" shopify.app.toml | sed -E 's/.*=.*"(.*)"/\1/' | tr -d ' ')

if [ "$CURRENT_URL" = "$LATEST_URL" ]; then
  echo "ℹ️  URLは既に最新です。更新は不要です。"
  exit 0
fi

echo "🔄 URLを更新中..."
echo "   現在: ${CURRENT_URL}"
echo "   最新: ${LATEST_URL}"

# shopify.app.tomlを更新（安全に）
# application_urlを更新
sed -i '' "s|application_url = \".*\"|application_url = \"${LATEST_URL}\"|" shopify.app.toml

# redirect_urlsを更新（既存のURLパターンを保持）
sed -i '' "s|https://[^\"]*trycloudflare.com|${LATEST_URL}|g" shopify.app.toml

# 更新後の検証
UPDATED_URL=$(grep -E "^application_url\s*=" shopify.app.toml | sed -E 's/.*=.*"(.*)"/\1/' | tr -d ' ')

if [ "$UPDATED_URL" != "$LATEST_URL" ]; then
  echo "❌ エラー: URLの更新に失敗しました"
  echo "🔄 バックアップから復元中..."
  cp "${BACKUP_FILE}" shopify.app.toml
  echo "✅ 復元完了"
  exit 1
fi

# ファイルの構文チェック（基本的な検証）
if ! grep -q "application_url" shopify.app.toml; then
  echo "❌ エラー: shopify.app.tomlの構文が不正です"
  echo "🔄 バックアップから復元中..."
  cp "${BACKUP_FILE}" shopify.app.toml
  echo "✅ 復元完了"
  exit 1
fi

echo "✅ shopify.app.tomlを安全に更新しました"
echo ""
echo "📝 更新内容:"
echo "   application_url: ${CURRENT_URL} → ${LATEST_URL}"
echo ""
echo "💡 次のステップ:"
echo "   1. ブラウザで https://${LATEST_URL#https://} にアクセスして動作確認"
echo "   2. 問題がある場合は、以下のコマンドでバックアップから復元:"
echo "      cp ${BACKUP_FILE} shopify.app.toml"
echo ""
echo "✨ 完了しました！"

