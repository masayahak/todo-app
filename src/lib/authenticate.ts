"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { addUser } from "@/lib/user";
import { authSchema } from "@/lib/schema";
import { redirect } from "next/navigation";

export type ActionState = {
  message?: string;
  errors?: {
    username?: string[];
    password?: string[];
    form?: string; // フォーム全体のエラー（認証失敗など）
  };
};

export async function authenticate(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const mode = formData.get("mode") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // ★ 1. Zodでバリデーション実行
  const validatedFields = authSchema.safeParse({
    username,
    password,
  });

  // 検証失敗なら、エラー情報を返して終了
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // ★ 2. 以降は validatedFields.data を使う (型安全)
  const safeUsername = validatedFields.data.username;
  const safePassword = validatedFields.data.password;

  try {
    if (mode === "register") {
      const result = await addUser(safeUsername, safePassword);
      if (result && !result.success) {
        // ユーザー重複などのエラーは form に入れる
        return { errors: { form: result.error || "登録失敗" } };
      }
    }

    await signIn("credentials", {
      username: safeUsername,
      password: safePassword,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { errors: { form: "ユーザー名またはパスワードが違います。" } };
        default:
          return { errors: { form: "認証エラーが発生しました。" } };
      }
    }
    // Auth.jsのリダイレクトエラーは再スローする必要がある
    throw error;
  }

  // ここに到達することはないが、TypeScriptの型チェックのため
  redirect("/");
}
