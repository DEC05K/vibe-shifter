#!/bin/bash

# application_urlを保護するスクリプト
# shopify app devが実行されている間、application_urlが自動更新されないようにします

FIXED_URL="https://v0-vibe-shifter.vercel.app"
TOML_FILE="shopify.app.toml"

# 現在のapplication_urlを確認
CURRENT_URL=$(grep -E "^application_url\s*=" "$TOML_FILE" 2>/dev/null | sed -E 's/.*=.*"(.*)"/\1/' | tr -d ' ')

if [ -z "$CURRENT_URL" ]; then
  echo "❌ エラー: application_urlが見つかりません"
  exit 1
fi

if [ "$CURRENT_URL" != "$FIXED_URL" ]; then
  echo "🔄 application_urlを固定URLに更新: $FIXED_URL"
  sed -i '' "s|application_url = \".*\"|application_url = \"$FIXED_URL\"|" "$TOML_FILE"
  echo "✅ 更新完了"
else
  echo "✅ application_urlは既に正しい値です: $FIXED_URL"
fi


