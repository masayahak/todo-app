"use client";

import type React from "react";
import { useState } from "react";
import { Todo } from "@prisma/client";
import { Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  addTodoAction,
  toggleTodoAction,
  deleteTodoAction,
  logoutAction,
} from "@/app/(protected)/actions";
import { TodoList } from "./TodoList";
import { useRouter } from "next/navigation";


type PropsType = {
  todos: Todo[];
};

export const TodoApp = ({ todos }: PropsType) => {
  const [newTodo, setNewTodo] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  const router = useRouter();
  
  // --- アクション ---
  const handleAdd = async () => {
    const title = newTodo.trim();
    if (title === "") return;
    try {
      await addTodoAction(title);
      setNewTodo("");
    } catch (e) {
      router.replace("/login");
      router.refresh();
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") await handleAdd();
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleTodoAction(id);
    } catch (e) {
      router.replace("/login");
      router.refresh();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodoAction(id);
    } catch (e) {
      router.replace("/login");
      router.refresh();
    }
  };

  // 「完了したタスクも表示」をチェック／チェックオフ
  const filteredTodos = showCompleted
    ? todos
    : todos.filter((todo) => !todo.is完了);

  const completedCount = todos.filter((todo) => todo.is完了).length;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">ToDoリスト</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutAction()}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-1" />
            ログアウト
          </Button>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          {completedCount} / {todos.length} 完了
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 入力エリア */}
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="新しいタスクを入力..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleAdd} size="icon">
            <Plus className="h-4 w-4" />
            <span className="sr-only">タスクを追加</span>
          </Button>
        </div>

        {/* フィルター操作 */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="showCompleted"
            checked={showCompleted}
            onCheckedChange={(checked) => setShowCompleted(checked === true)}
          />
          <label
            htmlFor="showCompleted"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            完了したタスクも表示
          </label>
        </div>

        {/* ★ リスト表示 */}
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};
