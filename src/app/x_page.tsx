import { getAllTodos } from "@/lib/todo";
import { TodoApp } from "@/components/TodoApp";

export default async function Home() {
  const todos = await getAllTodos();

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* 重要：コンポーネントTodoAppを todosへ依存させる
                つまりtodosが変化したら、TodoAppは再描画される */}
      <TodoApp todos={todos} />
    </main>
  );
}
