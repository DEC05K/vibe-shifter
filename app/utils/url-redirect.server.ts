/**
 * URLリダイレクトハンドラー
 * 古いURLへのリクエストを最新のURLにリダイレクトします
 */

import { getLatestAppUrl } from "./get-app-url.server";

/**
 * リクエストが古いURLからのものかチェックし、必要に応じてリダイレクト
 */
export function handleUrlRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const latestUrl = getLatestAppUrl();

  if (!latestUrl) {
    return null;
  }

  const latestUrlObj = new URL(latestUrl);
  const requestHost = url.hostname;

  // 古いCloudflare Tunnel URLのパターンをチェック
  // trycloudflare.comドメインで、かつ最新URLと異なる場合
  if (
    requestHost.includes("trycloudflare.com") &&
    requestHost !== latestUrlObj.hostname
  ) {
    // 最新URLにリダイレクト
    const redirectUrl = new URL(request.url);
    redirectUrl.hostname = latestUrlObj.hostname;
    redirectUrl.protocol = latestUrlObj.protocol;

    console.log(`🔄 古いURLから最新URLにリダイレクト: ${requestHost} -> ${latestUrlObj.hostname}`);

    return Response.redirect(redirectUrl.toString(), 307); // 307 Temporary Redirect
  }

  return null;
}

/**
 * リクエストURLが最新URLと一致するかチェック
 */
export function isLatestUrl(request: Request): boolean {
  const url = new URL(request.url);
  const latestUrl = getLatestAppUrl();

  if (!latestUrl) {
    return true; // URLが取得できない場合は、チェックをスキップ
  }

  const latestUrlObj = new URL(latestUrl);
  return url.hostname === latestUrlObj.hostname;
}

