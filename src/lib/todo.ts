import { Todo } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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

export const toggleTodo = async (userId: string, id: number) => {
  const todo = await prisma.todo.findUnique({
    where: {
      id,
      userId,
    },
  });
  if (!todo) return;
  await prisma.todo.update({
    where: {
      id,
    },
    data: {
      is完了: !todo.is完了,
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
