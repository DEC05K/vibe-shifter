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

// 環境変数の検証
const requiredEnvVars = {
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
  SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL,
  SCOPES: process.env.SCOPES,
  DATABASE_URL: process.env.DATABASE_URL,
};

// 必須環境変数のチェック
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.error("Missing required environment variables:", missingEnvVars.join(", "));
}

// 環境変数からURLを取得し、検証
let appUrl = process.env.SHOPIFY_APP_URL || "";

// URLの検証と正規化
if (appUrl) {
  try {
    // URLが有効か確認
    const url = new URL(appUrl);
    // httpsであることを確認
    if (url.protocol !== "https:") {
      console.error(`SHOPIFY_APP_URL must use https protocol. Current: ${appUrl}`);
      appUrl = "";
    } else {
      // 末尾のスラッシュを削除
      appUrl = appUrl.replace(/\/$/, "");
    }
  } catch (error) {
    console.error(`Invalid SHOPIFY_APP_URL: ${appUrl}`, error);
    appUrl = "";
  }
}

if (!appUrl) {
  console.error("SHOPIFY_APP_URL is not set or invalid. This will cause authentication issues.");
  // 本番環境では、appUrlが必須なので、エラーを投げる
  if (process.env.NODE_ENV === "production") {
    throw new Error("SHOPIFY_APP_URL is required in production environment");
  }
}

// PrismaSessionStorageを初期化
// 重要: tableNameパラメータには、Prisma Clientのモデル名を指定する必要があります
// Prisma Clientでは、モデル名が"Session"の場合、prisma.session（小文字）としてアクセスできます
// データベースのテーブル名は@@map("Session")で指定されているため、大文字の"Session"が使用されます
// しかし、PrismaSessionStorageのtableNameパラメータには、Prisma Clientのモデル名（小文字の"session"）を指定する必要があります
const prismaSessionStorage = new PrismaSessionStorage(prisma, {
  tableName: "session", // Prisma Clientのモデル名（小文字）を指定
});

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: "2024-10",
  scopes: process.env.SCOPES?.split(",") || [],
  appUrl: appUrl || "https://v0-vibe-shifter.vercel.app", // フォールバックURLを設定
  authPathPrefix: "/auth",
  sessionStorage: prismaSessionStorage,
  distribution: AppDistribution.AppStore,
  restResources,
  billing: {
    [MONTHLY_PLAN]: {
      amount: 9.99,
      currencyCode: "USD",
      interval: BillingInterval.Every30Days,
      test: true, // 開発中は true にしておかないと、本当に請求されてしまいます！
    },
  } as any,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/app/uninstalled",
    },
  },
  hooks: {
    afterAuth: async ({ session }: { session: any }) => {
      shopify.registerWebhooks({ session });
    },
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
} as any);

export default shopify;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;