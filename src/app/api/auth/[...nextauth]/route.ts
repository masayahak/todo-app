import { handlers } from "@/lib/auth"; // auth.ts で作った設定を読み込む

// GETリクエストもPOSTリクエストも、すべてNextAuthのhandlersにお任せする
export const { GET, POST } = handlers;
