# 実際の解決方法

## 重要な発見

1. **`shopify app dev clean`が成功しました**
   - 開発プレビューが停止され、アクティブなバージョンが復元されました
   - これは、開発セッションが残っていた可能性を示しています

2. **Shopify CLIの既知のバグ**
   - Shopify CLIのバージョン3.69.0以降、`shopify.app.toml`内のリダイレクトURLが新しいトンネルURLで置き換えられず、古いURLが残る問題が報告されています

3. **アプリのバージョン情報にURLが保存されている可能性**
   - Shopify Adminが表示するURLは、**アプリのバージョン情報**から取得される可能性があります
   - 新しいバージョンを作成し、それをActiveにする必要があるかもしれません

## 実際の解決方法

### ステップ1: 開発セッションをクリーンアップ（完了）

```bash
shopify app dev clean
```

✅ これで、開発プレビューが停止され、アクティブなバージョンが復元されました。

### ステップ2: アプリのバージョンを確認

```bash
shopify app versions list
```

このコマンドで、どのバージョンがActiveになっているか確認できます。

### ステップ3: 新しいバージョンをデプロイしてActiveにする

```bash
# 新しいバージョンをデプロイ
shopify app deploy --no-release --force

# 新しいバージョンをActiveにする
shopify app release
```

**重要**: `shopify app deploy`だけでは不十分です。`shopify app release`で新しいバージョンをActiveにする必要があります。

### ステップ4: Vercelの環境変数を確認

Vercelダッシュボードで、`SHOPIFY_APP_URL`が`https://v0-vibe-shifter.vercel.app`になっているか確認してください。

### ステップ5: Partnersダッシュボードの設定を確認

Partnersダッシュボードで、実際に設定が保存されているか確認してください。

## 私の以前の説明の問題点

以前、私は「Shopify Adminはアプリのインストール時にURLを保存し、再インストールしない限り更新されない」と説明しましたが、**これは間違っていた可能性があります**。

実際には：

1. **アプリのバージョン情報**にURLが保存されている
2. 新しいバージョンを作成し、それをActiveにする必要がある
3. `shopify app deploy`だけでは不十分で、`shopify app release`が必要

## まとめ

1. ✅ `shopify app dev clean`を実行（完了）
2. ✅ `shopify app versions list`でバージョンを確認
3. ✅ `shopify app deploy --no-release --force`で新しいバージョンをデプロイ
4. ✅ `shopify app release`で新しいバージョンをActiveにする
5. ✅ Vercelの環境変数を確認
6. ✅ Partnersダッシュボードの設定を確認

これで、古いURLが表示される問題は解決するはずです。

