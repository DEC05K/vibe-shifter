# GitHubにプッシュする手順（初心者向け）

## 概要

このガイドでは、プロジェクトをGitHubにプッシュする手順を、初心者にもわかりやすく説明します。

## 前提条件

1. **GitHubアカウントを持っている**（持っていない場合は、https://github.com で作成）
2. **Gitがインストールされている**（通常、Macには標準でインストールされています）

## ステップ1: Gitがインストールされているか確認

ターミナルで以下のコマンドを実行してください：

```bash
git --version
```

`git version 2.x.x` のような表示が出れば、Gitがインストールされています。

もしエラーが出る場合は、Gitをインストールする必要があります。

## ステップ2: Gitリポジトリを初期化（まだの場合）

プロジェクトディレクトリで、以下のコマンドを実行してください：

```bash
cd /Users/hakkow_h/delivery-gift-lite
git init
```

これで、このプロジェクトがGitリポジトリとして管理されるようになります。

## ステップ3: ファイルを追加

すべてのファイルをGitに追加します：

```bash
git add .
```

このコマンドは、プロジェクト内のすべてのファイルをGitの管理下に追加します。

**注意**: `.gitignore`ファイルに記載されているファイル（`.env`、`node_modules`など）は追加されません。これは正常な動作です。

## ステップ4: 初回コミット

変更をコミット（保存）します：

```bash
git commit -m "Prepare for Vercel deployment"
```

このコマンドは、追加したファイルを「コミット」という形で保存します。`-m`の後の文字列は、このコミットの説明（メッセージ）です。

## ステップ5: GitHubでリポジトリを作成

1. **GitHubにログイン**
   - https://github.com にアクセス
   - ログイン

2. **新しいリポジトリを作成**
   - 右上の「+」ボタンをクリック
   - 「New repository」を選択

3. **リポジトリの設定**
   - **Repository name**: `delivery-gift-lite`（任意の名前でOK）
   - **Description**: （空欄でもOK）
   - **Public / Private**: どちらでもOK（Private推奨）
   - **⚠️ 重要**: 「Initialize this repository with a README」のチェックは**外す**（既にファイルがあるため）
   - 「Add .gitignore」も選択しない
   - 「Choose a license」も選択しない

4. **「Create repository」をクリック**

5. **接続方法を確認**
   - リポジトリが作成されると、接続方法が表示されます
   - 「…or push an existing repository from the command line」のセクションを確認
   - 以下のようなコマンドが表示されます：
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/delivery-gift-lite.git
     git branch -M main
     git push -u origin main
     ```
   - **YOUR_USERNAME**の部分を、あなたのGitHubユーザー名に置き換えてください

## ステップ6: GitHubリポジトリに接続

ターミナルで、以下のコマンドを実行してください：

```bash
# YOUR_USERNAMEをあなたのGitHubユーザー名に置き換えてください
git remote add origin https://github.com/YOUR_USERNAME/delivery-gift-lite.git
```

**例**:
- GitHubユーザー名が `hakkow` の場合：
  ```bash
  git remote add origin https://github.com/hakkow/delivery-gift-lite.git
  ```

## ステップ7: ブランチ名をmainに変更

```bash
git branch -M main
```

このコマンドは、現在のブランチ名を`main`に変更します（GitHubの標準的なブランチ名です）。

## ステップ8: GitHubにプッシュ

```bash
git push -u origin main
```

このコマンドは、ローカルのコードをGitHubにアップロード（プッシュ）します。

**初回の場合**:
- GitHubのユーザー名とパスワード（またはPersonal Access Token）を求められる場合があります
- ユーザー名とパスワードを入力してください

**Personal Access Tokenが必要な場合**:
- パスワードの代わりに、Personal Access Tokenが必要な場合があります
- 作成方法: GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic) > Generate new token
- スコープ: `repo`にチェック
- 生成されたトークンをコピーして、パスワードの代わりに入力

## ステップ9: プッシュの確認

1. **GitHubのリポジトリページをリロード**
   - https://github.com/YOUR_USERNAME/delivery-gift-lite にアクセス
   - ファイルが表示されていれば成功です！

2. **ターミナルで確認**
   ```bash
   git status
   ```
   - 「Your branch is up to date with 'origin/main'」と表示されれば成功です

## トラブルシューティング

### エラー: "remote origin already exists"

**原因**: 既にリモートリポジトリが設定されている

**解決方法**:
```bash
# 既存のリモートを削除
git remote remove origin

# 再度追加
git remote add origin https://github.com/YOUR_USERNAME/delivery-gift-lite.git
```

### エラー: "failed to push some refs"

**原因**: GitHubリポジトリに既にファイルがある（READMEなど）

**解決方法**:
```bash
# GitHubの内容を取得
git pull origin main --allow-unrelated-histories

# 再度プッシュ
git push -u origin main
```

### エラー: "authentication failed"

**原因**: 認証情報が正しくない

**解決方法**:
- Personal Access Tokenを使用する
- または、GitHub CLIを使用する

## 次のステップ

GitHubにプッシュが完了したら、`VERCEL_SETUP_STEPS.md`の「ステップ3: Vercelにデプロイ」に進んでください。

## よくある質問

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

## まとめ

1. `git init` - リポジトリを初期化
2. `git add .` - ファイルを追加
3. `git commit -m "メッセージ"` - コミット
4. GitHubでリポジトリを作成
5. `git remote add origin https://github.com/...` - リモートを追加
6. `git branch -M main` - ブランチ名を変更
7. `git push -u origin main` - プッシュ

これで完了です！


