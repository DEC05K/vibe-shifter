# Supabase IP Allowlist エラーの解決方法

## 問題の本質

エラーログから、以下の2つの問題が確認されました：

1. **接続プールのタイムアウト**
   ```
   Timed out fetching a new connection from the connection pool
   (Current connection pool timeout: 10, connection limit: 5)
   ```

2. **IPアドレス許可リストエラー（根本原因）**
   ```
   FATAL: Address not in tenant allow_list: {3, 91, 94, 207}
   ```

**Vercelのサーバーレス関数が実行されるIPアドレスが、Supabaseの許可リストに含まれていません。**

## 解決方法

### 方法1: SupabaseのNetwork Restrictionsを無効化（推奨）

1. **Supabaseダッシュボードにログイン**
   - https://supabase.com/dashboard にアクセス
   - プロジェクトを選択

2. **Settings → Network Restrictions に移動**
   - 左側のメニューから「Settings」をクリック
   - 「Network Restrictions」を選択

3. **IP Allowlistを無効化**
   - 「Restrict connections to specific IP addresses」のチェックを**外す**
   - または、「Allow all IP addresses」を選択

4. **変更を保存**
   - 「Save」ボタンをクリック

### 方法2: VercelのIPアドレス範囲を許可リストに追加

VercelのIPアドレス範囲は動的に変わるため、この方法は推奨されません。ただし、セキュリティ要件でIP制限が必要な場合：

1. **VercelのIPアドレス範囲を確認**
   - Vercelのドキュメント: https://vercel.com/docs/security/deployment-protection#ip-addresses
   - または、Vercelサポートに問い合わせ

2. **SupabaseのNetwork Restrictionsに追加**
   - Settings → Network Restrictions
   - 「Add IP address」をクリック
   - VercelのIPアドレス範囲を追加

### 方法3: SupabaseのConnection Poolingを使用（非推奨）

以前のエラーで「prepared statement already exists」エラーが発生していたため、この方法は推奨されません。

## 確認手順

1. **SupabaseのNetwork Restrictionsを無効化**
2. **Vercelで再デプロイ**
3. **Runtime Logsを確認**
   - `FATAL: Address not in tenant allow_list`エラーが消えることを確認
   - `✅ Database connection established`が表示されることを確認

## セキュリティに関する注意

- **開発環境**: IP制限を無効化しても問題ありません
- **本番環境**: セキュリティ要件に応じて、適切なIP制限を設定してください
  - Supabaseの接続はSSL/TLSで暗号化されているため、IP制限がなくても安全です
  - ただし、組織のセキュリティポリシーでIP制限が必須の場合は、VercelのIPアドレス範囲を許可リストに追加してください

## 期待される結果

Network Restrictionsを無効化すると：

- ✅ `FATAL: Address not in tenant allow_list`エラーが消える
- ✅ データベース接続が確立される
- ✅ `PrismaSessionStorage isReady: true`になる
- ✅ OAuth認証が正常に動作する


