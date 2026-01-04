#!/bin/bash

# ShopifyアプリのURLを定期的に自動更新するスクリプト
# 30秒ごとにURLをチェックして更新します

INTERVAL=30  # チェック間隔（秒）

echo "🔄 URL自動更新を開始します（${INTERVAL}秒ごとにチェック）"
echo "⏹️  停止するには Ctrl+C を押してください"
echo ""

while true; do
  ./update-url-safe.sh
  sleep "${INTERVAL}"
done


