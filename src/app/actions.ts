"use server";
import { addTodo, deleteTodo, doneTodo } from "@/lib/todo";
import { revalidatePath } from "next/cache";

export const addTodoAction = async (title: string) => {
  // DB操作
  await addTodo(title);

  // UI操作（ルートページのキャッシュ todosを廃棄して再作成）
  revalidatePath("/");
};

export const doneTodoAction = async (id: number) => {
  // DB操作
  await doneTodo(id);

  // UI操作（ルートページのキャッシュ todosを廃棄して再作成）
  revalidatePath("/");
};

export const deleteTodoAction = async (id: number) => {
  // DB操作
  await deleteTodo(id);

  // UI操作（ルートページのキャッシュ todosを廃棄して再作成）
  revalidatePath("/");
};