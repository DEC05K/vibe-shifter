import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

// DATABASE_URLの検証
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Database operations will fail.");
} else {
  // DATABASE_URLが接続プーリング用のURL（pooler.supabase.com）の場合、警告を出力
  if (process.env.DATABASE_URL.includes("pooler.supabase.com")) {
    console.error("⚠️ WARNING: Using connection pooling URL (pooler.supabase.com). This may cause 'prepared statement already exists' errors.");
    console.error("Please use Direct connection URL (db.xxxxx.supabase.co) instead.");
  }
}

// Vercel（サーバーレス環境）では、シングルトンパターンを使用してPrismaClientのインスタンスを管理
// これにより、prepared statementのエラーを防ぎます
const prisma: PrismaClient = (() => {
  // 開発環境では、グローバル変数を使用してインスタンスを再利用
  if (process.env.NODE_ENV !== "production") {
    if (!global.prismaGlobal) {
      global.prismaGlobal = new PrismaClient({
        log: ["query", "error", "warn"],
      });
    }
    return global.prismaGlobal;
  }

  // 本番環境（Vercel）では、グローバル変数を使用してインスタンスを再利用
  // Vercelのサーバーレス環境では、同じコンテナが再利用される可能性があるため
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient({
      log: ["error"],
    });
  }
  return global.prismaGlobal;
})();

export default prisma;
