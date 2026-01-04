# 完全修正ガイド：Vercelデプロイ後のエラー解決

## 問題

Vercel、Supabase、GitHubと連携してデプロイしたが、Shopify Adminで古いCloudflare Tunnel URL（`newfoundland-gulf-wait-finder.trycloudflare.com`）が表示され、「サーバーの IP アドレスが見つかりませんでした」というエラーが出る。

## 原因

1. **Shopify Partnersダッシュボードの設定が古いURLのまま**
2. **Vercelの環境変数`SHOPIFY_APP_URL`が設定されていない、または古いURL**
3. **アプリが再インストールされていない**

## 実施した修正

### ✅ コードの整理

1. **不要なコードを削除**
   - `app/utils/get-app-url.server.ts` - Cloudflare Tunnel URLを取得するコード（Vercel使用時は不要）
   - `app/utils/url-redirect.server.ts` - リダイレクトロジック（不要）
   - `app/entry.server.tsx`の不要なインポートとコードを削除

2. **`app/shopify.server.ts`の確認**
   - `SHOPIFY_APP_URL`環境変数を使用（正しく設定済み）

3. **`shopify.app.toml`の確認**
   - `application_url = "https://v0-vibe-shifter.vercel.app"`（正しく設定済み）
   - `redirect_urls`もVercelのURLに設定済み

## あなたがやるべきこと

### ステップ1: Vercelの環境変数を確認・設定

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **環境変数を確認**
   - 「Settings」> 「Environment Variables」を開く
   - 以下の環境変数が設定されているか確認：

   | 変数名 | 値 |
   |--------|-----|
   | `SHOPIFY_API_KEY` | あなたのAPIキー |
   | `SHOPIFY_API_SECRET` | あなたのAPIシークレット |
   | `SCOPES` | `write_products` |
   | `DATABASE_URL` | Supabaseの接続文字列 |
   | `NODE_ENV` | `production` |
   | `SHOPIFY_APP_URL` | **`https://v0-vibe-shifter.vercel.app`** ⚠️重要 |

3. **`SHOPIFY_APP_URL`を設定・更新**
   - `SHOPIFY_APP_URL`が存在しない場合、追加
   - 値が古いURL（`trycloudflare.com`）の場合、`https://v0-vibe-shifter.vercel.app`に更新

4. **環境変数を保存後、再デプロイ**
   - 「Save」をクリック
   - 「Deployments」タブで「Redeploy」をクリック

### ステップ2: Shopify Partnersダッシュボードの設定を更新

1. **Partnersダッシュボードにアクセス**
   - https://partners.shopify.com にログイン
   - 「Apps」> 「delivery-gift-lite」を選択

2. **App setup > URLs and redirects を開く**

3. **Application URL を更新**
   - **Application URL**: `https://v0-vibe-shifter.vercel.app`
   - 「Save」をクリック

4. **Allowed redirection URLs を更新**
   以下のURLを追加（既に存在する場合は更新）：
   - `https://v0-vibe-shifter.vercel.app/auth/callback`
   - `https://v0-vibe-shifter.vercel.app/auth/shopify/callback`
   - `https://v0-vibe-shifter.vercel.app/api/auth/callback`
   - 「Save」をクリック

### ステップ3: 設定をPartnersダッシュボードに反映（CLI経由）

ターミナルで以下のコマンドを実行：

```bash
cd /Users/hakkow_h/delivery-gift-lite
shopify app deploy --no-release --force
```

このコマンドは、`shopify.app.toml`の内容をPartnersダッシュボードに反映します。

### ステップ4: アプリを再インストール

1. **Shopify Adminでアプリをアンインストール**
   - https://admin.shopify.com/store/gift-app-test-01/apps にアクセス
   - 「delivery-gift-lite」を選択
   - 「Uninstall」をクリック

2. **アプリを再インストール**
   - 「Apps」> 「Custom apps」を選択
   - 「delivery-gift-lite」を選択
   - 「Install」をクリック

### ステップ5: 動作確認

1. **アプリページにアクセス**
   - https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite にアクセス

2. **エラーが表示されないか確認**
   - 「サーバーの IP アドレスが見つかりませんでした」というエラーが表示されないことを確認

3. **アプリが正常に表示されるか確認**
   - 「Free Plan」バッジと「Upgrade to PRO」ボタンが表示されることを確認

## トラブルシューティング

### エラーが続く場合

1. **ブラウザのキャッシュをクリア**
   - シークレットモードで開く
   - または、ブラウザのキャッシュを完全にクリア

2. **Vercelのデプロイログを確認**
   - Vercelダッシュボード > 「Deployments」> 最新のデプロイを選択
   - 「Build Logs」を確認
   - エラーがないか確認

3. **環境変数が正しく設定されているか再確認**
   - Vercelダッシュボードで環境変数を確認
   - `SHOPIFY_APP_URL`が`https://v0-vibe-shifter.vercel.app`になっているか確認

4. **Partnersダッシュボードの設定を再確認**
   - Application URLが正しいか確認
   - Allowed redirection URLsが正しいか確認

## まとめ

実施したこと：
- ✅ 不要なコードを削除
- ✅ `shopify.app.toml`を確認・修正

あなたがやること：
1. ✅ Vercelの環境変数`SHOPIFY_APP_URL`を設定・更新
2. ✅ PartnersダッシュボードのURLを更新
3. ✅ `shopify app deploy --no-release --force`を実行
4. ✅ アプリを再インストール
5. ✅ 動作確認

これで、エラーは解決するはずです！

