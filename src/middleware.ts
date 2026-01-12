import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const { nextUrl } = req;

  const isOnLoginPage = nextUrl.pathname === "/login";

  // 1. ログイン済みならログインページはパスして、ルートページを表示 (逆流防止)
  if (isOnLoginPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return null;
  }

  // 2. 未ログインユーザーはログインページへリダイレクト
  if (!isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return NextResponse.redirect(
      // 元のURLをcallbackUrlとして渡すと親切
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return null; // 通過許可
});

// auth関数実行対象
export const config = {
  // api, static, image, favicon 等を除外
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
