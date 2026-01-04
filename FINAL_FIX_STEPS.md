# 最終修正手順：古いURLを完全に削除

## ⚠️ 重要な問題

`shopify app dev`が実行中だったため、古いCloudflare Tunnel URL（`verified-mailto-scoop-filled.trycloudflare.com`）が生成され続けていました。

**Vercelにデプロイしている場合、`shopify app dev`は実行する必要がありません。**

## 実施した修正

✅ `shopify app dev`を停止しました
✅ `cloudflared`を停止しました

## あなたがやるべきこと（順番に実行）

### ステップ1: Partnersダッシュボードの設定を確認・更新

1. **Partnersダッシュボードにアクセス**
   - https://partners.shopify.com にログイン
   - 「Apps」> 「delivery-gift-lite」を選択

2. **App setup > URLs and redirects を開く**

3. **Application URL を確認**
   - 現在の値が古いURL（`verified-mailto-scoop-filled.trycloudflare.com`など）の場合
   - **Application URL**: `https://v0-vibe-shifter.vercel.app` に変更
   - 「Save」をクリック

4. **Allowed redirection URLs を確認**
   - 古いURL（`trycloudflare.com`）が含まれている場合、**すべて削除**
   - 以下のURLのみを残す：
     - `https://v0-vibe-shifter.vercel.app/auth/callback`
     - `https://v0-vibe-shifter.vercel.app/auth/shopify/callback`
     - `https://v0-vibe-shifter.vercel.app/api/auth/callback`
   - 「Save」をクリック

### ステップ2: 設定をCLI経由で強制的に反映

ターミナルで以下のコマンドを実行：

```bash
cd /Users/hakkow_h/delivery-gift-lite
shopify app deploy --no-release --force
```

このコマンドは、`shopify.app.toml`の内容をPartnersダッシュボードに強制的に反映します。

### ステップ3: Vercelの環境変数を確認

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **環境変数を確認**
   - 「Settings」> 「Environment Variables」を開く
   - `SHOPIFY_APP_URL`が`https://v0-vibe-shifter.vercel.app`になっているか確認
   - 古いURL（`trycloudflare.com`）が設定されている場合、更新

3. **再デプロイ（環境変数を変更した場合）**
   - 「Save」をクリック
   - 「Deployments」タブで「Redeploy」をクリック

### ステップ4: アプリを完全にアンインストール・再インストール

1. **Shopify Adminでアプリをアンインストール**
   - https://admin.shopify.com/store/gift-app-test-01/apps にアクセス
   - 「delivery-gift-lite」を選択
   - 「Uninstall」をクリック
   - **重要**: アンインストール後、**5分以上待つ**

2. **ブラウザのキャッシュをクリア**
   - **シークレットモードで開く**（推奨）
   - または、ブラウザのキャッシュを完全にクリア

3. **アプリを再インストール**
   - 「Apps」> 「Custom apps」を選択
   - 「delivery-gift-lite」を選択
   - 「Install」をクリック

### ステップ5: 動作確認

1. **シークレットモードでアプリページにアクセス**
   - https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite にアクセス

2. **エラーが表示されないか確認**
   - 「サーバーの IP アドレスが見つかりませんでした」というエラーが表示されないことを確認

3. **アプリが正常に表示されるか確認**
   - 「Free Plan」バッジと「Upgrade to PRO」ボタンが表示されることを確認

## トラブルシューティング

### まだ古いURLが表示される場合

1. **Partnersダッシュボードの設定を再確認**
   - Application URLが`https://v0-vibe-shifter.vercel.app`になっているか
   - Allowed redirection URLsに古いURL（`trycloudflare.com`）が含まれていないか

2. **アプリを再度アンインストール・再インストール**
   - 完全にアンインストールしてから、**10分以上待ってから**再インストール

3. **ブラウザのキャッシュを完全にクリア**
   - シークレットモードで開く
   - または、ブラウザの設定からキャッシュを完全にクリア

4. **Vercelのデプロイログを確認**
   - エラーがないか確認
   - 環境変数が正しく設定されているか確認

## 重要な注意事項

### ⚠️ shopify app devを実行しない

Vercelにデプロイしている場合、**`shopify app dev`は実行する必要がありません**。

- ローカル開発は通常のRemix開発サーバー（`npm run dev`）を使用
- 本番環境はVercelを使用

### ⚠️ アンインストール後は待つ

アプリをアンインストールした後、**5分以上待ってから**再インストールしてください。Shopifyのデータベースが更新されるまで時間がかかります。

## まとめ

1. ✅ `shopify app dev`を停止（完了）
2. ✅ PartnersダッシュボードのURLを更新
3. ✅ `shopify app deploy --no-release --force`を実行
4. ✅ Vercelの環境変数を確認
5. ✅ アプリを完全にアンインストール・再インストール（5分以上待つ）
6. ✅ シークレットモードで動作確認

これで、古いURLが表示される問題は解決するはずです。

