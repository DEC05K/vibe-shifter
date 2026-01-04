# PDF変換ガイド

`PROJECT_SPECIFICATION.md`をPDFに変換する方法

## 方法1: ブラウザで開いてPDFとして保存（最も簡単）

1. **Markdownファイルをブラウザで開く**
   - VS Codeで`PROJECT_SPECIFICATION.md`を開く
   - 右クリック → 「Open Preview」または「Markdown Preview」
   - または、Markdown Preview拡張機能を使用

2. **PDFとして保存**
   - ブラウザで表示されたら、`Cmd + P`（Mac）または`Ctrl + P`（Windows）
   - 「送信先」で「PDFとして保存」を選択
   - 「保存」をクリック

## 方法2: VS Code拡張機能を使用

1. **Markdown PDF拡張機能をインストール**
   - VS Codeの拡張機能タブを開く
   - 「Markdown PDF」を検索してインストール

2. **PDFに変換**
   - `PROJECT_SPECIFICATION.md`を開く
   - `Cmd + Shift + P`（Mac）または`Ctrl + Shift + P`（Windows）
   - 「Markdown PDF: Export (pdf)」を選択

## 方法3: pandocを使用（コマンドライン）

### pandocのインストール

```bash
# Homebrewを使用
brew install pandoc

# または、MacTeXを使用（より大きなインストール）
brew install --cask mactex
```

### PDFに変換

```bash
cd /Users/hakkow_h/delivery-gift-lite
pandoc PROJECT_SPECIFICATION.md -o PROJECT_SPECIFICATION.pdf --pdf-engine=xelatex
```

## 方法4: オンラインツールを使用

1. **Markdown to PDF Converter**
   - https://www.markdowntopdf.com/ にアクセス
   - `PROJECT_SPECIFICATION.md`の内容をコピー＆ペースト
   - 「Convert to PDF」をクリック
   - PDFをダウンロード

2. **Dillinger**
   - https://dillinger.io/ にアクセス
   - `PROJECT_SPECIFICATION.md`の内容をコピー＆ペースト
   - 「Export as」→「PDF」を選択

## 推奨方法

**方法1（ブラウザで開いてPDFとして保存）**が最も簡単で、追加のツールをインストールする必要がありません。

---

## 注意事項

- PDFに変換する際は、フォントやレイアウトが適切に表示されることを確認してください
- 長いドキュメントの場合は、ページ区切りを確認してください
- コードブロックが正しく表示されることを確認してください

