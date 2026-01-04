# Shopify PartnersダッシュボードでURLを更新する方法

## 現在の状況

スクリーンショットを確認したところ、現在のPartnersダッシュボードには：
- **App URL**: `legendary-wedding-instructions-operations.trycloudflare.com`（古い）
- **最新のURL**: `inquiry-tvs-energy-kong.trycloudflare.com`（最新）

が表示されています。

## URLを更新する方法

### 方法1: Settingsセクションから更新（推奨）

最新のShopify Partnersダッシュボードでは、URLの編集は**「Settings」セクション**にあります：

1. **左側のメニューから「Settings」をクリック**
   - 現在「Versions」セクションにいる場合は、左側のメニューで「Settings」を探してください

2. **「App setup」セクションを開く**
   - Settingsページ内で「App setup」を探します

3. **「URLs and redirects」を開く**
   - 「URLs and redirects」セクションを展開します

4. **URLを更新**
   - **Application URL** を `https://inquiry-tvs-energy-kong.trycloudflare.com` に更新
   - **Allowed redirection URLs** に以下を追加/更新：
     - `https://inquiry-tvs-energy-kong.trycloudflare.com/auth/callback`
     - `https://inquiry-tvs-energy-kong.trycloudflare.com/auth/shopify/callback`

5. **保存**
   - ページ下部の「Save」ボタンをクリック

### 方法2: shopify app deploy を使用（CLI経由）

`shopify.app.toml`の内容をPartnersダッシュボードに反映させる：

```bash
./update-partners-dashboard.sh
```

または、直接実行：

```bash
shopify app deploy --no-release --force
```

**注意:**
- `--no-release`フラグを使用するため、本番環境には影響しません
- 開発環境の設定のみが更新されます

### 方法3: 直接URLにアクセス（一時的な解決策）

アプリのページにアクセスする代わりに、直接最新のURLにアクセス：

```
https://inquiry-tvs-energy-kong.trycloudflare.com
```

## Settingsセクションが見つからない場合

もし「Settings」セクションが見つからない場合：

1. **左側のメニューを確認**
   - 「Apps」> 「delivery-gift-lite」の下に「Settings」があるはずです
   - メニューが折りたたまれている場合は、展開してください

2. **アプリのホームページから確認**
   - アプリのホームページ（「Home」セクション）に「Settings」へのリンクがある場合があります

3. **URLから直接アクセス**
   - 以下のURLに直接アクセスしてみてください：
     ```
     https://partners.shopify.com/[YOUR_PARTNER_ID]/apps/[APP_ID]/settings
     ```
   - `[YOUR_PARTNER_ID]`と`[APP_ID]`は、現在のURLから取得できます

## トラブルシューティング

### Settingsセクションが表示されない

**原因:**
- アプリの権限や設定によって、Settingsセクションが表示されない場合があります

**解決方法:**
- `shopify app deploy`を使用してCLI経由で更新を試みてください

### URLが更新されない

**原因:**
- キャッシュやブラウザの問題
- 設定の保存が正しく行われていない

**解決方法:**
1. ブラウザのキャッシュをクリア
2. 別のブラウザで試す
3. `shopify app deploy`を使用してCLI経由で更新

## 現在の最新URL

```
https://inquiry-tvs-energy-kong.trycloudflare.com
```

このURLを使用して、Partnersダッシュボードの設定を更新してください。


