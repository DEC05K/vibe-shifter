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
// 重要: すべて小文字に統一してトラブルを回避
// - Prismaスキーマ: model Session { ... @@map("session") }
// - データベーステーブル名: "session" (小文字)
// - Prisma Clientアクセス: prisma.session (小文字)
// - PrismaSessionStorage tableName: "session" (小文字)

// デバッグ: Prisma Clientの状態を確認
console.log("=== PrismaSessionStorage Initialization ===");
console.log("Prisma Client instance:", prisma ? "exists" : "null");
console.log("Prisma Client type:", typeof prisma);
console.log("Prisma Client keys:", prisma ? Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')).slice(0, 10) : "N/A");
console.log("prisma.session:", typeof prisma.session);
console.log("prisma.session exists:", !!prisma.session);
console.log("prisma.session type:", prisma.session ? typeof prisma.session : "undefined");

// Prisma Clientが正しく初期化されているか確認
if (!prisma) {
  console.error("❌ CRITICAL: Prisma Client is null or undefined");
  throw new Error("Prisma Client is not properly initialized. prisma is null or undefined.");
}

if (!prisma.session) {
  console.error("❌ CRITICAL: prisma.session is not available");
  console.error("Available Prisma Client properties:", Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')).join(", "));
  console.error("Prisma Client constructor:", prisma.constructor?.name);
  
  // Prisma Clientが生成されていない可能性があるため、エラーを投げる
  throw new Error(
    "Prisma Client is not properly initialized. prisma.session is not available. " +
    "This usually means Prisma Client was not generated correctly. " +
    "Please run 'npx prisma generate' and redeploy."
  );
}

// テーブルの存在を確認（デバッグ用 - 非同期で実行）
prisma.session
  .count()
  .then((count) => {
    console.log("✅ Prisma session table exists. Record count:", count);
  })
  .catch((error) => {
    console.error("❌ Prisma session table check failed:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      name: error.name,
      stack: error.stack,
    });
  });

// PrismaSessionStorageを初期化
// 注意: PrismaSessionStorageは初期化時にテーブルの存在を確認するため、
// prisma.sessionが利用可能である必要があります
// また、データベース接続が確立されている必要があります

// データベース接続を確立（PrismaSessionStorageの初期化前に接続を確実にする）
console.log("Establishing database connection...");
prisma.$connect()
  .then(() => {
    console.log("✅ Database connection established");
  })
  .catch((error) => {
    console.error("❌ Failed to connect to database:", error);
    // 接続エラーでも続行（PrismaSessionStorageが接続を試みる）
  });

let prismaSessionStorage: PrismaSessionStorage;
try {
  console.log("Initializing PrismaSessionStorage with tableName: 'session'");
  console.log("PrismaSessionStorage options:", {
    tableName: "session",
    connectionRetries: 5, // デフォルトの2回から5回に増やす
    connectionRetryIntervalMs: 10000, // デフォルトの5秒から10秒に増やす
  });
  
  prismaSessionStorage = new PrismaSessionStorage(prisma, {
    tableName: "session", // Prisma Clientのモデル名（小文字）を指定
    connectionRetries: 5, // 接続リトライ回数を増やす（デフォルト: 2）
    connectionRetryIntervalMs: 10000, // リトライ間隔を増やす（デフォルト: 5000ms）
  });
  console.log("✅ PrismaSessionStorage initialized successfully");
  
  // 初期化後の状態を確認（非同期）
  prismaSessionStorage.isReady()
    .then((isReady) => {
      console.log("PrismaSessionStorage isReady:", isReady);
      if (!isReady) {
        console.error("⚠️ WARNING: PrismaSessionStorage is not ready");
      }
    })
    .catch((error) => {
      console.error("❌ PrismaSessionStorage isReady check failed:", error);
    });
} catch (error) {
  console.error("❌ CRITICAL: Failed to initialize PrismaSessionStorage");
  console.error("Error:", error);
  console.error("Error details:", {
    message: error instanceof Error ? error.message : String(error),
    name: error instanceof Error ? error.name : typeof error,
    stack: error instanceof Error ? error.stack : "No stack trace",
  });
  
  // エラーが発生しても、アプリは起動を続ける（後で接続を試みる）
  // ただし、セッションストレージは使用できない
  console.error("⚠️ WARNING: Continuing without PrismaSessionStorage. Session storage will not work.");
  throw error;
}

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