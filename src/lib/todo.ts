"use server";

import { Todo } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export const getAllTodos = async (): Promise<Todo[]> => {
  const todos = await prisma.todo.findMany();
  return todos;
};

export const addTodo = async (タイトル: string) => {
  await prisma.todo.create({
    data: {
      タイトル,
    },
  });
};

export const doneTodo = async (id: number) => {
  await prisma.todo.update({
    where: {
      id,
    },
    data: {
      is完了: true,
    },
  });
};

export const deleteTodo = async (id: number) => {
  await prisma.todo.delete({
    where: {
      id,
    },
  });
};
