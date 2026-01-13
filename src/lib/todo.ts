"use server";
import { Todo } from "@prisma/client";
import prisma from "@/lib/prisma";

export const getMyTodos = async (userId: string): Promise<Todo[]> => {
  const todos = await prisma.todo.findMany({
    where: {
      userId: userId,
    },
    orderBy: [{ is完了: "asc" }, { createdAt: "asc" }],
  });
  return todos;
};

export const addTodo = async (userId: string, タスク: string) => {
  await prisma.todo.create({
    data: {
      userId,
      タスク,
    },
  });
};

export const doneTodo = async (userId: string, id: number) => {
  await prisma.todo.update({
    where: {
      id,
      userId,
    },
    data: {
      is完了: true,
    },
  });
};

export const deleteTodo = async (userId: string, id: number) => {
  await prisma.todo.delete({
    where: {
      id,
      userId,
    },
  });
};
