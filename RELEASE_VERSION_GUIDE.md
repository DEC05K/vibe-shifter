# バージョンをActiveにする手順

## エラー

`shopify app release`を実行した際に、`Missing required flag version`というエラーが出ました。

## 原因

`shopify app release`コマンドには、バージョン番号を指定する必要があります。

## 正しい手順

### ステップ1: 新しいバージョンをデプロイ

```bash
shopify app deploy --no-release --force
```

このコマンドで、新しいバージョンが作成されます。出力に、作成されたバージョン名が表示されます。

例：
```
New version created.

delivery-gift-lite-19 [1]

Next steps
  • Run `shopify app release --version=delivery-gift-lite-19` to release
    this version to users.
```

### ステップ2: 新しいバージョンをActiveにする

```bash
shopify app release --version=delivery-gift-lite-19
```

**重要**: `delivery-gift-lite-19`の部分を、実際に作成されたバージョン名に置き換えてください。

### ステップ3: バージョンを確認

```bash
shopify app versions list
```

最新のバージョンが`★ active`になっていることを確認してください。

## まとめ

1. ✅ `shopify app deploy --no-release --force`で新しいバージョンをデプロイ
2. ✅ `shopify app release --version=<バージョン名>`で新しいバージョンをActiveにする
3. ✅ `shopify app versions list`でバージョンを確認

これで、新しいバージョンがActiveになり、VercelのURLが使用されるようになります。

