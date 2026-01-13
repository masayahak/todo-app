"use server";
import { addTodo, deleteTodo, toggleTodo } from "@/lib/todo";
import { revalidatePath } from "next/cache";
import { signOut } from "@/lib/auth";
import { auth } from "@/lib/auth";

export const getUserId = async () => {
  // セッション切れ、または未ログインなら拒否
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("認証切れ、またはログインしていません");
  }
  const userId = session.user.id;
  return userId;
};

export const addTodoAction = async (title: string) => {
  // DB操作
  const userId = await getUserId();
  await addTodo(userId, title);

  // UI操作（ルートページのキャッシュ todosを廃棄して再作成）
  revalidatePath("/");
};

export const toggleTodoAction = async (id: number) => {
  // DB操作
  const userId = await getUserId();
  await toggleTodo(userId, id);

  // UI操作（ルートページのキャッシュ todosを廃棄して再作成）
  revalidatePath("/");
};

export const deleteTodoAction = async (id: number) => {
  // DB操作
  const userId = await getUserId();
  await deleteTodo(userId, id);

  // UI操作（ルートページのキャッシュ todosを廃棄して再作成）
  revalidatePath("/");
};

export const logoutAction = async () => {
  await signOut({ redirectTo: "/login" });
};
