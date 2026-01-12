"use client";

import type React from "react";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authenticate } from "@/lib/authenticate";

type AuthMode = "login" | "register";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [state, dispatch, isPending] = useActionState(authenticate, {
    message: undefined,
    errors: {},
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {mode === "login" ? "ログイン" : "新規ユーザー登録"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "ユーザー名とパスワードを入力してください"
            : "アカウントを作成するための情報を入力してください"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">ユーザー名</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="user123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
            {/* ★ユーザー名のエラー表示 */}
            {state.errors?.username && (
              <p className="text-xs text-red-500 font-medium">
                {state.errors.username[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6} // HTML5バリデーション
            />
            {/* ★パスワードのエラー表示 */}
            {state.errors?.password && (
              <p className="text-xs text-red-500 font-medium">
                {state.errors.password[0]}
              </p>
            )}{" "}
          </div>
          <input type="hidden" name="mode" value={mode} />
          {/* ★全体のエラー（ログイン失敗など）表示 */}
          {state.errors?.form && (
            <div className="rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-300">
              {state.errors.form}
            </div>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                {/* animate-spin クラスで回転させます */}
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "login" ? "ログイン中..." : "登録中..."}
              </>
            ) : mode === "login" ? (
              "ログイン"
            ) : (
              "新規ユーザー作成"
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <p>
              アカウントをお持ちでないですか？{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                新規登録
              </button>
            </p>
          ) : (
            <p>
              すでにアカウントをお持ちですか？{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                ログイン
              </button>
            </p>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 mb-4 text-xs text-center text-muted-foreground">
          <div className="mb-2">
            <span>Developed by </span>
            <a
              href="https://hakamata-soft.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-900 hover:underline"
            >
              HakamataSoft
            </a>
          </div>

          <div className="flex text-xs items-center justify-center gap-2">
            <span className="text-muted-foreground">Powered by</span>
            {/* Next.js のブランドカラー (黒/白) */}
            <span className="bg-black text-white px-2 py-0.5 rounded font-bold">
              Next.js
            </span>
            <span className="text-gray-800">&</span>
            {/* Tailwind CSS のブランドカラー (シアン) */}
            <span className="bg-cyan-500 text-white px-2 py-0.5 rounded font-bold">
              Tailwind CSS
            </span>
          </div>
        </footer>
      </CardContent>
    </Card>
  );
}
