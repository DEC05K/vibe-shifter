#!/bin/bash

# shopify app devを再起動してログを確認するスクリプト

echo "🔄 shopify app devを再起動します..."
echo ""

# 既存のプロセスを停止
pkill -f "shopify app dev" 2>/dev/null
sleep 2

# プロセスが停止したか確認
if ps aux | grep -q "[s]hopify app dev"; then
  echo "⚠️ プロセスが停止しませんでした。手動で停止してください。"
  exit 1
fi

echo "✅ 既存のプロセスを停止しました"
echo ""
echo "📋 次のステップ:"
echo "1. このターミナルで以下のコマンドを実行してください:"
echo "   shopify app dev"
echo ""
echo "2. ブラウザでアプリにアクセスしてください:"
echo "   https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite"
echo ""
echo "3. このターミナルに表示されるログを確認してください:"
echo "   - 🔍 entry.server.tsx リクエスト受信"
echo "   - 🔍 root.tsx loader実行"
echo "   - ✅ サーバー側リダイレクト不要 または 🔄 サーバー側リダイレクト実行"
echo ""


