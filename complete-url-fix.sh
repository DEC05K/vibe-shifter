#!/bin/bash

# 古いURL問題を完全に解決する自動化スクリプト
# 可能な限り自動化し、手動操作を最小限にします

set -e

echo "🚀 古いURL問題の完全解決を開始します..."
echo ""

# ステップ1: 最新のURLを取得
echo "📋 ステップ1: 最新のURLを取得中..."
LATEST_URL=$(cat .shopify/dev-bundle/manifest.json 2>/dev/null | grep -o "https://[^\"]*trycloudflare.com" | head -1)

if [ -z "$LATEST_URL" ]; then
  echo "❌ エラー: Cloudflare Tunnel URLが見つかりません"
  echo "💡 shopify app dev が実行中であることを確認してください"
  exit 1
fi

echo "✅ 最新のURL: ${LATEST_URL}"
echo ""

# ステップ2: データベースのセッション情報をクリア
echo "📋 ステップ2: データベースのセッション情報をクリア中..."
if [ -f "prisma/dev.sqlite" ]; then
  if command -v sqlite3 &> /dev/null; then
    SESSION_COUNT=$(sqlite3 "prisma/dev.sqlite" "SELECT COUNT(*) FROM Session;" 2>/dev/null || echo "0")
    if [ "$SESSION_COUNT" -gt 0 ]; then
      sqlite3 "prisma/dev.sqlite" "DELETE FROM Session;" 2>/dev/null || true
      echo "✅ セッション情報を削除しました（${SESSION_COUNT}件）"
    else
      echo "✅ セッション情報は存在しません"
    fi
  else
    echo "⚠️  sqlite3が見つかりません。手動でデータベースを削除する場合は:"
    echo "   rm prisma/dev.sqlite prisma/dev.sqlite-journal"
  fi
else
  echo "✅ データベースファイルは存在しません"
fi
echo ""

# ステップ3: 設定ファイルを最新のURLに更新
echo "📋 ステップ3: 設定ファイルを最新のURLに更新中..."
./update-env-url.sh > /dev/null 2>&1
./update-url-safe.sh > /dev/null 2>&1
echo "✅ 設定ファイルを更新しました"
echo ""

# ステップ4: Partnersダッシュボードに設定を反映
echo "📋 ステップ4: Partnersダッシュボードに設定を反映中..."
echo "   （この処理には数分かかる場合があります）"
echo ""

# shopify app deploy を実行
if shopify app deploy --no-release --force 2>&1 | tee /tmp/shopify-deploy.log | grep -q "success\|New version created"; then
  DEPLOY_SUCCESS=true
  # 新しいバージョン名を取得
  VERSION_NAME=$(grep -o "delivery-gift-lite-[0-9]*" /tmp/shopify-deploy.log | tail -1)
  if [ -n "$VERSION_NAME" ]; then
    echo "✅ 新しいバージョンを作成しました: ${VERSION_NAME}"
    echo ""
    echo "📋 ステップ5: 新しいバージョンをリリース中..."
    if shopify app release --version "${VERSION_NAME}" --force 2>&1 | grep -q "success\|Version released"; then
      echo "✅ バージョンをリリースしました: ${VERSION_NAME}"
      RELEASE_SUCCESS=true
    else
      echo "⚠️  バージョンのリリースに失敗しました。手動でリリースしてください:"
      echo "   shopify app release --version ${VERSION_NAME} --force"
      RELEASE_SUCCESS=false
    fi
  else
    echo "⚠️  バージョン名を取得できませんでした"
    RELEASE_SUCCESS=false
  fi
else
  echo "❌ デプロイに失敗しました"
  DEPLOY_SUCCESS=false
  RELEASE_SUCCESS=false
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✨ 自動化可能な処理が完了しました"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# 手動操作が必要なステップ
echo "📋 次のステップ（手動操作が必要）:"
echo ""
echo "   1. ブラウザのキャッシュを完全にクリア"
echo "      - Ctrl+Shift+Delete (Mac: Cmd+Shift+Delete)"
echo "      - 「キャッシュされた画像とファイル」をチェック"
echo "      - 「Cookieとその他のサイトデータ」をチェック"
echo "      - 「時間範囲」を「全期間」に設定"
echo "      - 「データを削除」をクリック"
echo ""
echo "   2. 開発ストアでアプリをアンインストール"
echo "      - https://admin.shopify.com/store/gift-app-test-01 にアクセス"
echo "      - 設定 > アプリと販売チャネル"
echo "      - 「delivery-gift-lite」を探して「削除」をクリック"
echo ""
echo "   3. シークレットモードでアプリを再インストール"
echo "      - 新しいシークレットウィンドウを開く（Ctrl+Shift+N / Cmd+Shift+N）"
echo "      - 以下にアクセス:"
echo "        https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite"
echo "      - 「インストール」をクリック"
echo ""

# 現在の状態を表示
echo "📊 現在の状態:"
echo "   最新URL: ${LATEST_URL}"
if [ "$DEPLOY_SUCCESS" = true ]; then
  echo "   Partnersダッシュボード: ✅ 更新済み"
else
  echo "   Partnersダッシュボード: ❌ 更新失敗"
fi
if [ "$RELEASE_SUCCESS" = true ]; then
  echo "   バージョン: ✅ リリース済み"
else
  echo "   バージョン: ⚠️  リリースが必要"
fi
echo ""

# 確認用のURL
echo "🔍 確認用URL:"
echo "   最新URL: ${LATEST_URL}"
echo "   アプリURL: https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite"
echo ""

echo "💡 ヒント:"
echo "   手動操作が完了したら、以下で動作確認してください:"
echo "   curl -I ${LATEST_URL}"
echo ""


