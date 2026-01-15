"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client"; // ← これをインポート
import bcrypt from "bcryptjs";

export const getUserId = async (
  user: string,
  plainPassword: string
): Promise<string | null> => {
  const targetUser = await prisma.user.findUnique({
    where: {
      user: user,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!targetUser) return null;
  const isMatch = await bcrypt.compare(plainPassword, targetUser.password);
  return isMatch ? targetUser.id : null;
};

export const addUser = async (user: string, plainPassword: string) => {
  const password = await bcrypt.hash(plainPassword, 10);

  try {
    await prisma.user.create({
      data: { user, password },
    });
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          error: "そのユーザー名は既に使用されています",
        };
      }
    }
    throw error; // 想定外のエラーは投げ直す
  }
};
