# マイグレートエラーの修正

## エラー内容

```
Error: P1001: Can't reach database server at `db.xxxxx.supabase.co:5432`
```

## 問題点

1. **`db.xxxxx.supabase.co`はプレースホルダー（例）です**
   - 実際のSupabaseのURLに置き換える必要があります
   - あなたのプロジェクトの実際のURLを取得する必要があります

2. **パスワードに特殊文字（`+`）が含まれている**
   - URLエンコードが必要です
   - `+` → `%2B`

## 解決方法

### ステップ1: Supabaseの実際の接続文字列を取得

1. **Supabaseのウェブサイトにアクセス**
   - https://supabase.com にログイン
   - あなたのプロジェクトを選択

2. **接続文字列を取得**
   - 左側のメニューから「Settings」（設定）をクリック
   - 「Database」（データベース）をクリック
   - 「Connection string」セクションを開く
   - **「Direct connection」（直接接続）を選択**
   - **「URI」を選択**
   - 表示された文字列をコピー
   - 例: `postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres`

**重要**: 
- `[YOUR-PASSWORD]`の部分を、あなたが設定したパスワードに置き換えてください
- `db.abcdefghijklmnop.supabase.co`の部分が、あなたのプロジェクトの実際のURLです

### ステップ2: パスワードの特殊文字をURLエンコード

パスワードに特殊文字（`+`、`@`、`#`、`%`など）が含まれている場合、URLエンコードが必要です。

**URLエンコード一覧**:
- `+` → `%2B`
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`
- ` ` (スペース) → `%20`

**例**: パスワードが `Blessinghamlet_315+` の場合
- `+` → `%2B`
- 結果: `Blessinghamlet_315%2B`

### ステップ3: 正しいコマンドを実行

ターミナルで、以下のコマンドを入力してEnterキーを押します：

```bash
DATABASE_URL="postgresql://postgres:Blessinghamlet_315%2B@db.あなたの実際のURL.supabase.co:5432/postgres" npx prisma migrate deploy
```

**重要**: 
- `Blessinghamlet_315%2B`の部分は、あなたのパスワードをURLエンコードしたもの
- `db.あなたの実際のURL.supabase.co`の部分は、Supabaseで取得した実際のURL

### ステップ4: 成功を確認

コマンドが成功すると、以下のようなメッセージが表示されます：

```
✅ Applied migration: 20240530213853_create_session_table
```

## よくあるエラーと解決方法

### エラー1: `Can't reach database server`

**原因**: 
- 接続文字列のURLが間違っている
- 直接接続用のURLを使用していない（接続プーリング用のURLを使用している）

**解決方法**:
- Supabaseの「Direct connection」のURLを使用する
- `pooler.supabase.com`ではなく、`db.xxxxx.supabase.co`を使用する

### エラー2: `Invalid password`

**原因**: 
- パスワードが間違っている
- 特殊文字がURLエンコードされていない

**解決方法**:
- パスワードを確認する
- 特殊文字をURLエンコードする

### エラー3: `Table already exists`

**原因**: 
- テーブルが既に存在する

**解決方法**:
- このエラーは無視して大丈夫です
- テーブルが既に作成されているので、問題ありません

## まとめ

1. ✅ Supabaseの実際の接続文字列を取得（Direct connection > URI）
2. ✅ パスワードの特殊文字をURLエンコード（`+` → `%2B`）
3. ✅ 正しいコマンドを実行
4. ✅ 成功を確認

これで、マイグレートが成功するはずです！


