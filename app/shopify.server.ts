import "@shopify/shopify-app-remix/adapters/node";
import {
  AppDistribution,
  BillingInterval,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-10";
import prisma from "./db.server";

export const MONTHLY_PLAN = "Monthly Subscription";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: "2024-10" as any,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  auth: {
    path: "/auth",
    callbackPath: "/auth/callback",
    loginPath: "/auth/login", // ← 追加
  },
  webhooks: {
    path: "/webhooks",
  } as any,
  sessionStorage: new PrismaSessionStorage(prisma, {
    tableName: "session",
  }),
  distribution: AppDistribution.AppStore,
  restResources: restResources as any,
  billing: {
    [MONTHLY_PLAN]: {
      amount: 9.99,
      currencyCode: "USD",
      interval: BillingInterval.Every30Days as any,
      test: true,
    },
  } as any,
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