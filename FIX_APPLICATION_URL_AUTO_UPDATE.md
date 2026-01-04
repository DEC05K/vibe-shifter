# application_urlの自動更新を完全に停止する方法

## 問題

`automatically_update_urls_on_dev = false`に設定したのに、`application_url`だけがまだ自動更新されてしまいます。`redirect_urls`は自動更新されなくなりました。

## 原因

`shopify app dev`コマンドを実行しているときに、Shopify CLIが`application_url`を特別に扱い、最新のトンネルURLに自動更新している可能性があります。

`automatically_update_urls_on_dev = false`は`redirect_urls`には効果がありますが、`application_url`には完全には効かない場合があります。

## 解決方法

### 方法1: application_urlを固定値に設定し、ファイルを保護（推奨）

`shopify.app.toml`で`application_url`をVercelのURLに設定し、ファイルを読み取り専用にするか、変更を監視します。

```toml
# 固定URLを設定（VercelのURL）
application_url = "https://v0-vibe-shifter.vercel.app"
```

### 方法2: shopify app devを実行する前にapplication_urlを確認

`shopify app dev`を実行する前に、`application_url`が正しい値に設定されているか確認し、実行後に変更されていないかチェックします。

### 方法3: .gitignoreでshopify.app.tomlを保護（推奨しない）

`.gitignore`に`shopify.app.toml`を追加すると、変更が追跡されなくなりますが、これは推奨しません。

### 方法4: スクリプトでapplication_urlを監視・復元

`shopify app dev`を実行している間、`application_url`が変更されないように監視スクリプトを作成します。

## 推奨される解決策

### ステップ1: application_urlをVercelのURLに設定

```toml
application_url = "https://v0-vibe-shifter.vercel.app"
```

### ステップ2: shopify app devを実行しない（Vercelを使用している場合）

Vercelにデプロイしている場合、ローカル開発で`shopify app dev`を実行する必要はありません。

代わりに：
- VercelのURLを直接使用
- ローカル開発は`npm run dev`（通常のRemix開発サーバー）を使用

### ステップ3: ファイルを保護するスクリプトを作成

`shopify app dev`を実行する前に、`application_url`をバックアップし、実行後に復元するスクリプトを作成します。

## 実装例

### 保護スクリプト（protect-url.sh）

```bash
#!/bin/bash

# application_urlを保護するスクリプト

FIXED_URL="https://v0-vibe-shifter.vercel.app"
TOML_FILE="shopify.app.toml"

# 現在のapplication_urlを確認
CURRENT_URL=$(grep -E "^application_url\s*=" "$TOML_FILE" | sed -E 's/.*=.*"(.*)"/\1/' | tr -d ' ')

if [ "$CURRENT_URL" != "$FIXED_URL" ]; then
  echo "🔄 application_urlを固定URLに更新: $FIXED_URL"
  sed -i '' "s|application_url = \".*\"|application_url = \"$FIXED_URL\"|" "$TOML_FILE"
fi

echo "✅ application_urlが保護されました: $FIXED_URL"
```

### shopify app devのラッパースクリプト（dev-safe.sh）

```bash
#!/bin/bash

# shopify app devを安全に実行するスクリプト
# application_urlが自動更新されないように保護

FIXED_URL="https://v0-vibe-shifter.vercel.app"
TOML_FILE="shopify.app.toml"

# 実行前にapplication_urlを固定
./protect-url.sh

# shopify app devを実行
shopify app dev &

# バックグラウンドでapplication_urlを監視
while true; do
  sleep 5
  CURRENT_URL=$(grep -E "^application_url\s*=" "$TOML_FILE" | sed -E 's/.*=.*"(.*)"/\1/' | tr -d ' ')
  if [ "$CURRENT_URL" != "$FIXED_URL" ]; then
    echo "⚠️  application_urlが変更されました。復元中..."
    sed -i '' "s|application_url = \".*\"|application_url = \"$FIXED_URL\"|" "$TOML_FILE"
  fi
done
```

## 最も簡単な解決策

Vercelを使用している場合、**`shopify app dev`を実行しない**のが最も簡単です。

1. **Vercelにデプロイ**
2. **VercelのURLを使用**
3. **ローカル開発は通常のRemix開発サーバーを使用**

これにより、`application_url`が自動更新されることはありません。

## まとめ

- `application_url`を固定URL（VercelのURL）に設定
- `shopify app dev`を実行する場合は、監視スクリプトを使用
- または、Vercelを使用している場合は`shopify app dev`を実行しない


