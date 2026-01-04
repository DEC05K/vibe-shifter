# GitHubにプッシュする手順（ステップバイステップ）

## 📋 このガイドについて

このガイドでは、プロジェクトをGitHubにプッシュする手順を、**初心者にもわかりやすく**、**1つずつ**説明します。

## ✅ 事前確認

まず、現在の状態を確認しましょう。

### 1. Gitがインストールされているか確認

ターミナルで以下のコマンドを実行してください：

```bash
git --version
```

**期待される結果**: `git version 2.x.x` のような表示

**エラーが出る場合**: Gitをインストールする必要があります（Macには通常標準でインストールされています）

### 2. プロジェクトディレクトリに移動

```bash
cd /Users/hakkow_h/delivery-gift-lite
```

## 📝 ステップ1: 変更を確認してコミット

### 1-1. 現在の状態を確認

```bash
git status
```

このコマンドで、変更されたファイルや追加されたファイルが表示されます。

### 1-2. すべての変更を追加

```bash
git add .
```

このコマンドは、**すべての変更をGitに追加**します。

**何が追加される？**
- 新しく作成したファイル（`vercel.json`、`VERCEL_SETUP_STEPS.md`など）
- 変更したファイル（`prisma/schema.prisma`、`package.json`など）

**何が追加されない？**
- `.env`ファイル（機密情報のため）
- `node_modules`フォルダ（大きすぎるため）
- `.gitignore`に記載されているファイル

### 1-3. コミット（変更を保存）

```bash
git commit -m "Prepare for Vercel deployment"
```

このコマンドは、追加した変更を「コミット」という形で**保存**します。

**`-m`の後の文字列について**:
- これは「コミットメッセージ」と呼ばれます
- この変更が何のためのものか、簡単に説明します
- 例: `"Vercelデプロイの準備"`、`"PostgreSQLに変更"`など、何でもOKです

## 🌐 ステップ2: GitHubでリポジトリを作成

### 2-1. GitHubにログイン

1. **ブラウザでGitHubにアクセス**
   - https://github.com を開く

2. **ログイン**
   - アカウントをお持ちでない場合は、先にアカウントを作成してください

### 2-2. 新しいリポジトリを作成

1. **右上の「+」ボタンをクリック**
   - 画面右上に「+」ボタンがあります
   - クリックして、「New repository」を選択

2. **リポジトリの情報を入力**
   - **Repository name**: `delivery-gift-lite`
     - 任意の名前でOKです
     - 例: `my-shopify-app`、`delivery-gift`など
   - **Description**: （空欄でもOK）
     - 例: `Shopify app for delivery gift`
   - **Public / Private**: どちらでもOK
     - **Private推奨**（コードを非公開にしたい場合）
     - **Public**（コードを公開しても良い場合）

3. **⚠️ 重要な設定**
   - **「Initialize this repository with a README」**: ✅ **チェックを外す**
   - **「Add .gitignore」**: ✅ **選択しない**
   - **「Choose a license」**: ✅ **選択しない**
   
   **理由**: 既にファイルがあるため、空のリポジトリを作成する必要があります

4. **「Create repository」をクリック**

### 2-3. 接続方法を確認

リポジトリが作成されると、以下のような画面が表示されます：

```
Quick setup — if you've done this kind of thing before
or
https://github.com/YOUR_USERNAME/delivery-gift-lite.git
```

**「…or push an existing repository from the command line」**のセクションを探してください。

以下のようなコマンドが表示されます：

```bash
git remote add origin https://github.com/YOUR_USERNAME/delivery-gift-lite.git
git branch -M main
git push -u origin main
```

**重要**: `YOUR_USERNAME`の部分を、**あなたのGitHubユーザー名**に置き換えてください。

**例**:
- GitHubユーザー名が `hakkow` の場合：
  ```bash
  git remote add origin https://github.com/hakkow/delivery-gift-lite.git
  ```

## 🔗 ステップ3: GitHubリポジトリに接続

ターミナルで、以下のコマンドを実行してください：

```bash
git remote add origin https://github.com/YOUR_USERNAME/delivery-gift-lite.git
```

**YOUR_USERNAMEをあなたのGitHubユーザー名に置き換えてください**

**例**:
```bash
git remote add origin https://github.com/hakkow/delivery-gift-lite.git
```

**エラーが出る場合**:
- 「remote origin already exists」というエラーが出る場合：
  ```bash
  git remote remove origin
  git remote add origin https://github.com/YOUR_USERNAME/delivery-gift-lite.git
  ```

## 🌿 ステップ4: ブランチ名をmainに変更

```bash
git branch -M main
```

このコマンドは、現在のブランチ名を`main`に変更します。

**なぜ必要？**
- GitHubの標準的なブランチ名は`main`です
- 古いプロジェクトでは`master`という名前の場合があります

## 📤 ステップ5: GitHubにプッシュ

```bash
git push -u origin main
```

このコマンドは、ローカルのコードをGitHubに**アップロード（プッシュ）**します。

### 認証が求められる場合

初回の場合、以下のような認証情報を求められる場合があります：

```
Username for 'https://github.com': YOUR_USERNAME
Password for 'https://YOUR_USERNAME@github.com': 
```

**入力方法**:
1. **Username**: GitHubのユーザー名を入力
2. **Password**: 
   - **通常のパスワードでは動作しない場合があります**
   - **Personal Access Token**が必要な場合があります（下記参照）

### Personal Access Tokenの作成方法

パスワードの代わりに、Personal Access Tokenを使用する必要がある場合があります。

1. **GitHubにログイン**
2. **Settingsに移動**
   - 右上のプロフィール画像をクリック
   - 「Settings」を選択
3. **Developer settingsに移動**
   - 左側のメニューで「Developer settings」をクリック
4. **Personal access tokensに移動**
   - 「Personal access tokens」> 「Tokens (classic)」を選択
5. **新しいトークンを生成**
   - 「Generate new token」> 「Generate new token (classic)」をクリック
6. **トークンの設定**
   - **Note**: `Vercel deployment`（任意の名前）
   - **Expiration**: `90 days`（任意）
   - **Select scopes**: `repo`にチェック ✅
7. **「Generate token」をクリック**
8. **トークンをコピー**
   - ⚠️ **重要**: このトークンは一度しか表示されません。必ずコピーして保存してください
9. **パスワードの代わりに入力**
   - `git push`を実行した際に、パスワードを求められたら、このトークンを貼り付けます

## ✅ ステップ6: プッシュの確認

### 6-1. GitHubのリポジトリページを確認

1. **ブラウザでリポジトリページを開く**
   - https://github.com/YOUR_USERNAME/delivery-gift-lite にアクセス
   - （YOUR_USERNAMEをあなたのユーザー名に置き換えてください）

2. **ファイルが表示されているか確認**
   - `vercel.json`、`package.json`、`app/`フォルダなどが表示されていれば成功です！

### 6-2. ターミナルで確認

```bash
git status
```

**期待される結果**:
```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

この表示が出れば、プッシュは成功しています！

## 🎉 完了！

これで、GitHubにプッシュが完了しました！

## 📚 次のステップ

GitHubにプッシュが完了したら、`VERCEL_SETUP_STEPS.md`の**「ステップ3: Vercelにデプロイ」**に進んでください。

## ❓ よくある質問

### Q: プッシュした後、ファイルを変更したらどうすればいい？

A: 以下のコマンドで再度プッシュできます：

```bash
git add .
git commit -m "変更内容の説明"
git push
```

### Q: .envファイルもプッシュされる？

A: いいえ、`.gitignore`に記載されているため、プッシュされません。これは正常な動作です（機密情報を保護するため）。

### Q: node_modulesもプッシュされる？

A: いいえ、`.gitignore`に記載されているため、プッシュされません。これは正常な動作です（ファイルサイズが大きすぎるため）。

### Q: エラーが出た場合はどうすればいい？

A: エラーメッセージをコピーして、Googleで検索するか、`GITHUB_PUSH_GUIDE.md`の「トラブルシューティング」セクションを参照してください。

## 📝 まとめ

1. ✅ `git add .` - ファイルを追加
2. ✅ `git commit -m "メッセージ"` - コミット
3. ✅ GitHubでリポジトリを作成
4. ✅ `git remote add origin https://github.com/...` - リモートを追加
5. ✅ `git branch -M main` - ブランチ名を変更
6. ✅ `git push -u origin main` - プッシュ

これで完了です！


