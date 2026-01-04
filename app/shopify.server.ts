import "@shopify/shopify-app-remix/adapters/node";
import {
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
  BillingInterval,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-10";
import prisma from "./db.server";

export const MONTHLY_PLAN = "Monthly Subscription";

// 環境変数の検証（最低限必要なものだけチェック）
const requiredEnvVars = [
  "SHOPIFY_API_KEY",
  "SHOPIFY_API_SECRET",
  "SHOPIFY_APP_URL",
  "SCOPES",
  "DATABASE_URL"
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  // 本番環境では致命的なのでエラーを投げる
  if (process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
  }
}

// PrismaSessionStorageの初期化
// Vercel(Serverless)環境での接続遅延やコールドスタートに対応するための設定
const storage = new PrismaSessionStorage(prisma, {
  tableName: "session", // 重要: 小文字で統一
  connectionRetries: 10, // 接続リトライ回数を増やす
  connectionRetryIntervalMs: 2000, // リトライ間隔を2秒に
});

// Shopifyアプリの設定
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: "2024-10", // エラー回避のため直接指定
  scopes: process.env.SCOPES?.split(","),
  
  // 重要: 環境変数を優先し、設定がない場合はVercelのURLをフォールバックとして使用
  // これにより「Invalid URL」エラー（住所不一致）を防ぎます
  appUrl: process.env.SHOPIFY_APP_URL || "https://v0-vibe-shifter.vercel.app",
  
  auth: {
    path: "/auth",
    callbackPath: "/auth/callback",
  },
  webhooks: {
    path: "/webhooks",
  },
  sessionStorage: storage,
  distribution: AppDistribution.AppStore,
  restResources,
  billing: {
    [MONTHLY_PLAN]: {
      amount: 9.99,
      currencyCode: "USD",
      interval: BillingInterval.Every30Days,
      test: true, // 開発中は true
    },
  },
  hooks: {
    afterAuth: async ({ session }) => {
      shopify.registerWebhooks({ session });
    },
  },
  future: {
    unstable_newEmbeddedAuthStrategy: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;