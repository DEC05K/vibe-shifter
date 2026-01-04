# Prismaスキーマ不一致エラーの修正

## エラー内容

```
Unknown argument `firstName`. Available options are marked with ?.
```

## 原因

Prismaスキーマ（`prisma/schema.prisma`）とマイグレーションファイル（`prisma/migrations/20240530213853_create_session_table/migration.sql`）の間に不一致がありました。

- **マイグレーションファイル**には以下のフィールドが含まれています：
  - `firstName`
  - `lastName`
  - `email`
  - `accountOwner`
  - `locale`
  - `collaborator`
  - `emailVerified`
  - `refreshToken`
  - `refreshTokenExpires`

- **Prismaスキーマ**にはこれらのフィールドがありませんでした

これにより、Shopifyのセッションストレージがこれらのフィールドを保存しようとしたときにエラーが発生していました。

## 実施した修正

1. **`prisma/schema.prisma`を修正**
   - マイグレーションファイルと一致するように、不足しているフィールドを追加

2. **Prisma Clientを再生成**
   - `npx prisma generate`を実行

3. **データベースのスキーマを更新**
   - `npx prisma db push`を実行

## あなたがやるべきこと

### ステップ1: 変更をGitHubにプッシュ

```bash
cd /Users/hakkow_h/delivery-gift-lite
git add .
git commit -m "Fix schema mismatch: add missing Session fields"
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
   - 「Free Plan」バッジと「Upgrade to PRO」ボタンが表示されるか確認

3. **エラーが出ないか確認**
   - ブラウザのコンソールでエラーが出ていないか確認
   - アプリが正常に動作するか確認

## まとめ

1. ✅ `prisma/schema.prisma`を修正（完了）
2. ✅ Prisma Clientを再生成（完了）
3. ✅ データベースのスキーマを更新（完了）
4. 📋 変更をGitHubにプッシュ（あなたがやること）
5. 📋 Vercelで再デプロイ（あなたがやること）
6. 📋 アプリが正常に動作するか確認（あなたがやること）

これで、HTTP ERROR 500は解決するはずです！


