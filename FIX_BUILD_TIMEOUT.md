# ビルドタイムアウトの修正

## 問題

ビルドが19分以上かかっており、`prisma migrate deploy`でタイムアウトしている可能性が高いです。

## 実施した修正

1. **`package.json`の`build`スクリプトを修正**
   - `prisma migrate deploy`をビルドスクリプトから削除
   - `prisma generate`のみをビルド時に実行
   - `postinstall`スクリプトを追加して、`prisma generate`を確実に実行

2. **理由**
   - Prismaのマイグレートはデータベース接続が必要で、ビルド時にタイムアウトする可能性がある
   - `prisma generate`はデータベース接続が不要で、ビルド時に安全に実行できる
   - マイグレートは手動で実行するか、デプロイ後に実行する

## あなたがやるべきこと

### ステップ1: 変更をGitHubにプッシュ

```bash
cd /Users/hakkow_h/delivery-gift-lite
git add .
git commit -m "Fix build timeout: remove prisma migrate deploy from build script"
git push
```

### ステップ2: 現在のビルドをキャンセル（必要に応じて）

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **ビルドをキャンセル**
   - 「Deployments」タブを開く
   - 現在のデプロイの「...」メニューから「Cancel」を選択

### ステップ3: データベースのマイグレートを手動で実行

Prismaのマイグレートを手動で実行する必要があります：

```bash
# ローカルで実行（DATABASE_URL環境変数を設定して）
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres" npx prisma migrate deploy
```

**重要**: 
- Supabaseの直接接続用のURLを使用してください（`db.xxxxx.supabase.co`）
- 接続プーリング用のURL（`pooler.supabase.com`）は使用しないでください

### ステップ4: Vercelで再デプロイ

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com にログイン
   - プロジェクト `delivery-gift-lite` を選択

2. **再デプロイ**
   - 「Deployments」タブを開く
   - 「Redeploy」をクリック
   - または、GitHubにプッシュすると自動的に再デプロイされます

### ステップ5: ビルドログを確認

再デプロイ後、ビルドログを確認してください：

1. **Build Logsを確認**
   - `prisma generate`が実行されているか確認
   - `remix vite:build`が実行されているか確認
   - ビルドが成功するか確認（通常2-5分で完了）

2. **エラーが出ないか確認**
   - ビルドが成功するか確認
   - エラーメッセージが出ないか確認

## まとめ

1. ✅ `prisma migrate deploy`をビルドスクリプトから削除（完了）
2. ✅ `postinstall`スクリプトを追加（完了）
3. ✅ 変更をGitHubにプッシュ（あなたがやること）
4. ✅ データベースのマイグレートを手動で実行（あなたがやること）
5. ✅ Vercelで再デプロイ（あなたがやること）

これで、ビルドタイムアウトの問題は解決するはずです。ビルド時間は通常2-5分で完了するはずです。


