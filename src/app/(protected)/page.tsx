import { getMyTodos } from "@/lib/todo";
import { TodoApp } from "@/components/TodoApp";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// AWSへデプロイした時にこのページがダイナミックレンダリングなことを明示する
export const dynamic = "force-dynamic";

export default async function Home() {
  // ログイン者のUserId取得
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const userId = session.user.id;

  // ログイン者のTodoを表示
  const todos = await getMyTodos(userId);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <TodoApp todos={todos} />
    </main>
  );
}
