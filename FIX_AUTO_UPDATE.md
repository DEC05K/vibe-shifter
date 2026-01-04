# shopify.app.tomlの自動更新を停止する方法

## 問題

`shopify app config push`を実行すると、手動で変更した`application_url`と`redirect_urls`が自動的に変更されてしまいます。

## 原因

1. **`automatically_update_urls_on_dev = true`が設定されている**
   - この設定により、Shopify CLIが開発中に自動的にURLを更新します

2. **`shopify app config push`の動作**
   - このコマンドは、ローカルの設定をリモートにプッシュする前に、リモートの設定を取得してローカルを上書きする場合があります
   - または、最新のトンネルURLを検出して自動更新します

## 解決方法

### 方法1: 自動更新を無効化（推奨）

`shopify.app.toml`の`[build]`セクションを以下のように変更します：

```toml
[build]
automatically_update_urls_on_dev = false
```

これにより、開発中に自動的にURLが更新されることがなくなります。

### 方法2: `shopify app config push`の代わりに`shopify app deploy`を使用

`shopify app config push`の代わりに、以下のコマンドを使用してください：

```bash
shopify app deploy --no-release --force
```

このコマンドは、ローカルの`shopify.app.toml`の内容をPartnersダッシュボードに反映しますが、自動更新は行いません。

**違い**:
- `shopify app config push`: 設定をプッシュする前に、リモートの設定でローカルを上書きする可能性がある
- `shopify app deploy --no-release --force`: ローカルの設定をそのままリモートに反映する（自動更新しない）

### 方法3: `shopify app config pull`を実行しない

`shopify app config pull`を実行すると、リモート（Partners Dashboard）の設定でローカルの`shopify.app.toml`が上書きされます。

このコマンドは使用しないでください。

## 推奨される設定

```toml
[build]
automatically_update_urls_on_dev = false
```

この設定により：
- ✅ 手動で設定したURLが保持される
- ✅ 自動更新が無効化される
- ✅ `shopify app deploy --no-release --force`で確実に設定を反映できる

## 手動でURLを更新する場合の手順

1. **`shopify.app.toml`を手動で編集**
   ```toml
   application_url = "https://your-fixed-url.com"
   
   [auth]
   redirect_urls = [
     "https://your-fixed-url.com/auth/callback",
     "https://your-fixed-url.com/auth/shopify/callback"
   ]
   ```

2. **Partnersダッシュボードに反映**
   ```bash
   shopify app deploy --no-release --force
   ```

3. **確認**
   - PartnersダッシュボードでURLが正しく更新されているか確認

## まとめ

- `automatically_update_urls_on_dev = false`に設定する
- `shopify app config push`の代わりに`shopify app deploy --no-release --force`を使用する
- `shopify app config pull`は実行しない

これで、手動で設定したURLが自動的に変更されることはなくなります。


