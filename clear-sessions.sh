#!/bin/bash

# データベースのセッション情報をクリアするスクリプト
# 古いURLが保存されているセッション情報を削除します

set -e

echo "🗑️  データベースのセッション情報をクリアします..."
echo ""

# データベースファイルの存在確認
DB_FILE="prisma/dev.sqlite"

if [ ! -f "$DB_FILE" ]; then
  echo "⚠️  データベースファイルが見つかりません: ${DB_FILE}"
  echo "💡 これは正常です。セッション情報がまだ作成されていない可能性があります"
  exit 0
fi

echo "📊 現在のセッション情報を確認中..."
echo ""

# SQLiteが利用可能か確認
if command -v sqlite3 &> /dev/null; then
  # セッション数を確認
  SESSION_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM Session;" 2>/dev/null || echo "0")
  echo "   現在のセッション数: ${SESSION_COUNT}"
  
  if [ "$SESSION_COUNT" -gt 0 ]; then
    echo ""
    echo "⚠️  警告: セッション情報が存在します"
    echo "   これらを削除すると、開発ストアでアプリを再認証する必要があります"
    echo ""
    read -p "セッション情報を削除しますか？ (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      # セッション情報を削除
      sqlite3 "$DB_FILE" "DELETE FROM Session;" 2>/dev/null || {
        echo "❌ エラー: セッション情報の削除に失敗しました"
        exit 1
      }
      echo "✅ セッション情報を削除しました"
    else
      echo "⏭️  セッション情報の削除をスキップしました"
    fi
  else
    echo "✅ セッション情報は存在しません"
  fi
else
  echo "⚠️  sqlite3コマンドが見つかりません"
  echo "💡 手動でデータベースを削除する場合は、以下を実行:"
  echo "   rm prisma/dev.sqlite prisma/dev.sqlite-journal"
fi

echo ""
echo "📋 完全な解決手順:"
echo ""
echo "   1. データベースのセッション情報をクリア（上記で実行済み）"
echo "   2. ブラウザのキャッシュを完全にクリア"
echo "      - Ctrl+Shift+Delete (Mac: Cmd+Shift+Delete)"
echo "      - 「キャッシュ」と「Cookie」を削除"
echo "   3. 開発ストアでアプリを完全にアンインストール"
echo "      - 設定 > アプリと販売チャネル > delivery-gift-lite > 削除"
echo "   4. シークレットモードでアプリを再インストール"
echo "      - 新しいシークレットウィンドウを開く"
echo "      - https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite にアクセス"
echo ""
echo "✨ 完了しました！"


