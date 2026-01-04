# 緊急修正：古いURLが表示される問題

## 問題

まだ古いCloudflare Tunnel URL（`verified-mailto-scoop-filled.trycloudflare.com`）が表示される。

## 原因

Shopify PartnersダッシュボードやShopify Adminのデータベースに古いURLがキャッシュされている可能性が高い。

## 解決方法

### ステップ1: shopify app devを停止（重要）

`shopify app dev`が実行中の場合、古いURLが生成され続けます。必ず停止してください。

```bash
# shopify app devを実行しているターミナルで Ctrl+C を押す
# または、プロセスを強制終了
pkill -f "shopify app dev"
```

### ステップ2: shopify.app.tomlを確認

`shopify.app.toml`の`application_url`がVercelのURLになっているか確認：

```bash
grep "application_url" shopify.app.toml
```

正しい値：
```
application_url = "https://v0-vibe-shifter.vercel.app"
```

### ステップ3: Partnersダッシュボードの設定を強制的に更新

1. **Partnersダッシュボードにアクセス**
   - https://partners.shopify.com にログイン
   - 「Apps」> 「delivery-gift-lite」を選択

2. **App setup > URLs and redirects を開く**

3. **Application URL を確認・更新**
   - 現在の値が古いURL（`verified-mailto-scoop-filled.trycloudflare.com`など）の場合
   - **Application URL**: `https://v0-vibe-shifter.vercel.app` に変更
   - 「Save」をクリック

4. **Allowed redirection URLs を確認・更新**
   - 古いURL（`trycloudflare.com`）が含まれている場合、削除
   - 以下のURLのみを残す：
     - `https://v0-vibe-shifter.vercel.app/auth/callback`
     - `https://v0-vibe-shifter.vercel.app/auth/shopify/callback`
     - `https://v0-vibe-shifter.vercel.app/api/auth/callback`
   - 「Save」をクリック

### ステップ4: 設定をCLI経由で強制的に反映

```bash
cd /Users/hakkow_h/delivery-gift-lite
shopify app deploy --no-release --force
```

このコマンドは、`shopify.app.toml`の内容をPartnersダッシュボードに強制的に反映します。

### ステップ5: アプリを完全にアンインストール・再インストール

1. **Shopify Adminでアプリをアンインストール**
   - https://admin.shopify.com/store/gift-app-test-01/apps にアクセス
   - 「delivery-gift-lite」を選択
   - 「Uninstall」をクリック
   - **重要**: アンインストール後、数分待つ

2. **ブラウザのキャッシュをクリア**
   - シークレットモードで開く
   - または、ブラウザのキャッシュを完全にクリア

3. **アプリを再インストール**
   - 「Apps」> 「Custom apps」を選択
   - 「delivery-gift-lite」を選択
   - 「Install」をクリック

### ステップ6: Vercelの環境変数を確認

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **環境変数を確認**
   - 「Settings」> 「Environment Variables」を開く
   - `SHOPIFY_APP_URL`が`https://v0-vibe-shifter.vercel.app`になっているか確認
   - 古いURL（`trycloudflare.com`）が設定されている場合、更新

3. **再デプロイ**
   - 環境変数を更新した場合、「Deployments」タブで「Redeploy」をクリック

## 確認方法

### 1. Partnersダッシュボードで確認

```bash
shopify app info
```

このコマンドで、Partnersダッシュボードの現在の設定を確認できます。

### 2. ブラウザで確認

1. **シークレットモードで開く**
   - 古いキャッシュの影響を避けるため

2. **アプリページにアクセス**
   - https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite にアクセス

3. **エラーが表示されないか確認**
   - 「サーバーの IP アドレスが見つかりませんでした」というエラーが表示されないことを確認

## トラブルシューティング

### まだ古いURLが表示される場合

1. **Partnersダッシュボードの設定を再確認**
   - Application URLが正しいか
   - Allowed redirection URLsに古いURLが含まれていないか

2. **アプリを再度アンインストール・再インストール**
   - 完全にアンインストールしてから、数分待ってから再インストール

3. **ブラウザのキャッシュを完全にクリア**
   - シークレットモードで開く
   - または、ブラウザの設定からキャッシュを完全にクリア

4. **Vercelのデプロイログを確認**
   - エラーがないか確認
   - 環境変数が正しく設定されているか確認

## まとめ

1. ✅ `shopify app dev`を停止
2. ✅ `shopify.app.toml`を確認
3. ✅ PartnersダッシュボードのURLを更新
4. ✅ `shopify app deploy --no-release --force`を実行
5. ✅ アプリを完全にアンインストール・再インストール
6. ✅ Vercelの環境変数を確認
7. ✅ ブラウザのキャッシュをクリア

これで、古いURLが表示される問題は解決するはずです。

