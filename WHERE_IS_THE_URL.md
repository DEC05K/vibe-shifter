# 古いURLはどこから来ているのか？

## 調査結果

### 発見された古いURLの所在

1. **`.shopify/dev-bundle/manifest.json`**
   - URL: `newfoundland-gulf-wait-finder.trycloudflare.com`
   - **影響**: ローカル開発環境のみ（Vercelには影響しない）
   - **対応**: 削除済み ✅

2. **`.env`ファイル**
   - URL: `johnston-transmit-specs-prince.trycloudflare.com`
   - **影響**: ローカル開発環境のみ（Vercelには影響しない）
   - **対応**: 更新済み ✅

3. **Shopify Adminのデータベース**（最も可能性が高い）
   - URL: `verified-mailto-scoop-filled.trycloudflare.com`
   - **影響**: **これがShopify Adminで表示されているURL**
   - **対応**: アプリを再インストールする必要がある

## なぜShopify Adminで古いURLが表示されるのか？

### Shopify AdminがURLを取得する仕組み

1. **アプリのインストール時に保存**
   - アプリをインストールした時点で、Partnersダッシュボードの設定からURLを取得
   - Shopify Adminのデータベースに保存される
   - **これが最も優先される**

2. **アプリを開くたびに使用**
   - Shopify Adminは、保存されたURLを使用してアプリを表示
   - Partnersダッシュボードの設定を変更しても、**アプリを再インストールしない限り、古いURLが使用され続ける**

3. **アプリを再インストールすると更新**
   - アプリを再インストールすると、Partnersダッシュボードの現在の設定からURLを取得
   - 新しいURLがデータベースに保存される

## 解決方法

### ステップ1: Partnersダッシュボードの設定を確認・更新（最重要）

**これが最も重要です。** アプリを再インストールする前に、必ずPartnersダッシュボードの設定を更新してください。

1. **Partnersダッシュボードにアクセス**
   - https://partners.shopify.com にログイン
   - 「Apps」> 「delivery-gift-lite」を選択

2. **App setup > URLs and redirects を開く**

3. **Application URL を確認**
   - 現在の値が`verified-mailto-scoop-filled.trycloudflare.com`など古いURLの場合
   - **必ず** `https://v0-vibe-shifter.vercel.app` に変更
   - 「Save」をクリック

4. **Allowed redirection URLs を確認**
   - 古いURL（`trycloudflare.com`）が含まれている場合、**すべて削除**
   - 以下のURLのみを残す：
     - `https://v0-vibe-shifter.vercel.app/auth/callback`
     - `https://v0-vibe-shifter.vercel.app/auth/shopify/callback`
     - `https://v0-vibe-shifter.vercel.app/api/auth/callback`
   - 「Save」をクリック

### ステップ2: 設定をCLI経由で強制的に反映

```bash
cd /Users/hakkow_h/delivery-gift-lite
shopify app deploy --no-release --force
```

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

### ステップ4: アプリを完全にアンインストール・再インストール（最重要）

**これが最も重要です。** Shopify Adminのデータベースに保存された古いURLを削除するには、アプリを完全にアンインストールする必要があります。

1. **Shopify Adminでアプリをアンインストール**
   - https://admin.shopify.com/store/gift-app-test-01/apps にアクセス
   - 「delivery-gift-lite」を選択
   - 「Uninstall」をクリック
   - **重要**: アンインストール後、**10分以上待つ**

2. **Partnersダッシュボードの設定を再確認**
   - Application URLが`https://v0-vibe-shifter.vercel.app`になっているか確認
   - Allowed redirection URLsに古いURLが含まれていないか確認

3. **ブラウザのキャッシュをクリア**
   - **シークレットモードで開く**（推奨）
   - または、ブラウザのキャッシュを完全にクリア

4. **アプリを再インストール**
   - 「Apps」> 「Custom apps」を選択
   - 「delivery-gift-lite」を選択
   - 「Install」をクリック
   - **この時点で、Partnersダッシュボードの設定からURLが取得される**

## 確認方法

### Partnersダッシュボードの設定を確認

```bash
shopify app info
```

このコマンドで、Partnersダッシュボードの現在の設定を確認できます。

### ブラウザの開発者ツールで確認

1. **ブラウザの開発者ツールを開く**（F12）
2. **Networkタブを開く**
3. **アプリページにアクセス**
4. **リクエストのURLを確認**
   - どのURLにリクエストが送られているか確認
   - 古いURL（`trycloudflare.com`）にリクエストが送られている場合、Partnersダッシュボードの設定が古いまま

## まとめ

**古いURLが表示される原因：**

1. **Shopify Adminのデータベースに古いURLが保存されている**（最も可能性が高い）
   - アプリをインストールした時点で保存されたURL
   - アプリを再インストールしない限り、更新されない

2. **Partnersダッシュボードの設定が古いURLのまま**
   - Application URLが古いURL
   - Allowed redirection URLsに古いURLが含まれている

3. **Vercelの環境変数が古いURL**
   - `SHOPIFY_APP_URL`が古いURL

**解決方法：**

1. ✅ ローカルファイルを削除・更新（完了）
2. ✅ Partnersダッシュボードの設定を更新（最重要）
3. ✅ `shopify app deploy --no-release --force`を実行
4. ✅ Vercelの環境変数を確認・更新
5. ✅ アプリを完全にアンインストール・再インストール（10分以上待つ）

これで、古いURLが表示される問題は解決するはずです。


