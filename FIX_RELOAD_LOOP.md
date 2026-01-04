# リロードループの修正

## 問題

- 自動でリロードを繰り返す
- リロードを止めたら「Unexpected Server Error」と表示された

## 原因

認証エラーが発生した際に、Shopifyの認証フローがリダイレクトを試みますが、認証が失敗すると再度同じページにリダイレクトされ、それがループになっていました。

## 実施した修正

1. **`app/routes/app.tsx`の`loader`を修正**
   - 認証エラーのハンドリングを追加
   - エラーが発生した場合、適切に再スローしてShopifyの認証フローに任せる

2. **`app/routes/app._index.tsx`の`loader`を修正**
   - 認証エラーのハンドリングを追加
   - ショップ情報の取得エラーも適切にハンドリング
   - エラーが発生した場合、適切に再スローしてShopifyの認証フローに任せる

## あなたがやるべきこと

### ステップ1: 変更をGitHubにプッシュ

```bash
cd /Users/hakkow_h/delivery-gift-lite
git add .
git commit -m "Fix reload loop: improve error handling in authentication"
git push
```

### ステップ2: Vercelで再デプロイ

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **再デプロイ**
   - 「Deployments」タブを開く
   - 最新のデプロイの「...」メニューから「Redeploy」を選択
   - または、GitHubにプッシュすると自動的に再デプロイされます

### ステップ3: アプリが正常に動作するか確認

1. **VercelのURLにアクセス**
   - https://v0-vibe-shifter.vercel.app にアクセス
   - アプリが正常に表示されるか確認

2. **Shopify Adminでアプリを開く**
   - https://admin.shopify.com/store/gift-app-test-01/apps/delivery-gift-lite にアクセス
   - アプリが正常に表示されるか確認
   - リロードループが発生しないか確認
   - 「Free Plan」バッジと「Upgrade to PRO」ボタンが表示されるか確認

3. **エラーが出ないか確認**
   - ブラウザのコンソールでエラーが出ていないか確認
   - アプリが正常に動作するか確認

## まとめ

1. ✅ `app/routes/app.tsx`の`loader`を修正（完了）
2. ✅ `app/routes/app._index.tsx`の`loader`を修正（完了）
3. 📋 変更をGitHubにプッシュ（あなたがやること）
4. 📋 Vercelで再デプロイ（あなたがやること）
5. 📋 アプリが正常に動作するか確認（あなたがやること）

これで、リロードループの問題は解決するはずです！

