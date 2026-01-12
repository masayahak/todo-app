import { z } from "zod";

export const authSchema = z.object({
  username: z
    .string()
    .min(3, { message: "ユーザー名は3文字以上で入力してください" })
    .max(40, { message: "ユーザー名は40文字以内で入力してください" }),
  password: z.string().min(6, { message: "パスワードは6文字以上必要です" }),
});
