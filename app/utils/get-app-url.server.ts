/**
 * ランタイムで最新のCloudflare Tunnel URLを取得するユーティリティ
 * これにより、shopify.app.tomlやPartnersダッシュボードの設定に依存せず、
 * 常に最新のURLを使用できます
 */

import { readFileSync } from "fs";
import { join } from "path";

/**
 * 最新のCloudflare Tunnel URLを取得
 * .shopify/dev-bundle/manifest.jsonから動的に読み取ります
 */
export function getLatestAppUrl(): string {
  try {
    // .shopify/dev-bundle/manifest.jsonから最新URLを取得（最優先）
    // これは、shopify app devが起動するたびに最新のURLに更新される
    const manifestPath = join(process.cwd(), ".shopify", "dev-bundle", "manifest.json");
    const manifestContent = readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(manifestContent);

    // app_homeモジュールからapp_urlを取得
    const appHomeModule = manifest.modules?.find(
      (module: any) => module.type === "app_home"
    );

    if (appHomeModule?.config?.app_url) {
      console.log("📋 getLatestAppUrl: manifest.jsonから取得:", appHomeModule.config.app_url);
      return appHomeModule.config.app_url;
    }

    // フォールバック: 正規表現でURLを抽出
    const urlMatch = manifestContent.match(/https:\/\/[^"]*trycloudflare\.com/);
    if (urlMatch && urlMatch[0]) {
      console.log("📋 getLatestAppUrl: 正規表現で取得:", urlMatch[0]);
      return urlMatch[0];
    }
  } catch (error) {
    console.warn("⚠️ getLatestAppUrl: manifest.jsonの読み取りに失敗:", error);
  }

  // 環境変数が設定されている場合は使用（フォールバック）
  if (process.env.SHOPIFY_APP_URL) {
    console.log("📋 getLatestAppUrl: 環境変数から取得:", process.env.SHOPIFY_APP_URL);
    return process.env.SHOPIFY_APP_URL;
  }

  // 最終的なフォールバック: 空文字列（shopify-app-remixがデフォルトを使用）
  console.warn("⚠️ getLatestAppUrl: URLを取得できませんでした");
  return "";
}

/**
 * リダイレクトURLを生成
 */
export function getRedirectUrl(path: string = ""): string {
  const baseUrl = getLatestAppUrl();
  if (!baseUrl) {
    return path;
  }
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

