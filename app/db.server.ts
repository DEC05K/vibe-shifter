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
  
  // データベース接続の検証ログ（デバッグ用）
  if (process.env.NODE_ENV === "production") {
    const dbUrl = process.env.DATABASE_URL;
    const maskedUrl = dbUrl.replace(/:[^:@]+@/, ":****@"); // パスワードをマスク
    console.log("DATABASE_URL configured:", maskedUrl);
  }
}

// PrismaClientのインスタンス管理（シングルトンパターン）
// Vercelのサーバーレス環境では、グローバル変数を使用してインスタンスを再利用することで、
// prepared statementの競合を防ぎます
const prisma: PrismaClient =
  global.prismaGlobal ??
  (global.prismaGlobal = new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "error", "warn"],
  }));

export default prisma;
