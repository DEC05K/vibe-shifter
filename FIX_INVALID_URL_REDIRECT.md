# Invalid URL. Refusing to redirect エラーの修正

## エラー内容

```
ShopifyError: Invalid URL. Refusing to redirect
```

## 根本原因

このエラーは、`SHOPIFY_APP_URL`が無効であるか、正しく設定されていない場合に発生します。

1. **`SHOPIFY_APP_URL`が空または未設定**
   - 環境変数が設定されていない
   - 空文字列が設定されている

2. **`SHOPIFY_APP_URL`が無効な形式**
   - `https://`で始まっていない
   - 無効なURL形式

3. **リダイレクトループ**
   - 無効なURLが設定されているため、認証フローが正しく動作しない
   - エラーが発生すると、再度認証を試みる
   - これが繰り返され、リダイレクトループが発生

## 実施した修正

1. **`app/shopify.server.ts`を修正**
   - URLの検証と正規化を追加
   - `https://`プロトコルであることを確認
   - 末尾のスラッシュを削除
   - フォールバックURLを設定

2. **`app/routes/app.tsx`を修正**
   - `SHOPIFY_APP_URL`の検証を追加
   - URLが有効か確認
   - `ShopifyError`の場合、詳細をログに記録
   - リダイレクトループを防ぐため、`Invalid URL`エラーの場合は500エラーを返す

## あなたがやるべきこと

### ステップ1: Vercelの環境変数を確認

**これが最も重要です。**

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **環境変数を確認**
   - 「Settings」> 「Environment Variables」を開く
   - `SHOPIFY_APP_URL`を確認
   - **値が`https://v0-vibe-shifter.vercel.app`になっているか確認**
   - **末尾にスラッシュ（`/`）が含まれていないか確認**
   - **`http://`ではなく、`https://`であることを確認**

3. **環境変数を修正（必要に応じて）**
   - `SHOPIFY_APP_URL`が正しく設定されていない場合、以下に更新：
     - `https://v0-vibe-shifter.vercel.app`（末尾にスラッシュなし）
   - 「Save」をクリック

4. **再デプロイ（環境変数を変更した場合）**
   - 「Deployments」タブで「Redeploy」をクリック

### ステップ2: 変更をGitHubにプッシュ

```bash
cd /Users/hakkow_h/delivery-gift-lite
git add .
git commit -m "Fix Invalid URL redirect error: add URL validation and error handling"
git push
```

### ステップ3: Vercelで再デプロイ

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **再デプロイ**
   - 「Deployments」タブを開く
   - 最新のデプロイの「...」メニューから「Redeploy」を選択
   - または、GitHubにプッシュすると自動的に再デプロイされます

### ステップ4: Runtime Logsを確認

再デプロイ後、Runtime Logsを確認してください：

1. **Runtime Logsを確認**
   - `Invalid URL. Refusing to redirect`エラーが発生しないか確認
   - `SHOPIFY_APP_URL`の検証メッセージが表示されているか確認

2. **エラーが発生した場合**
   - 最新のエラーメッセージを共有してください
   - `SHOPIFY_APP_URL`の値がログに表示されているか確認

## まとめ

1. ✅ URLの検証と正規化を追加（完了）
2. ✅ エラーハンドリングを改善（完了）
3. ✅ リダイレクトループを防ぐ処理を追加（完了）
4. 📋 **Vercelの`SHOPIFY_APP_URL`環境変数を確認（あなたがやること - 最重要）**
5. 📋 変更をGitHubにプッシュ（あなたがやること）
6. 📋 Vercelで再デプロイ（あなたがやること）

**最も重要なのは、Vercelの`SHOPIFY_APP_URL`環境変数が正しく設定されていることです。**

これで、`Invalid URL. Refusing to redirect`エラーとリダイレクトループは解決するはずです。


