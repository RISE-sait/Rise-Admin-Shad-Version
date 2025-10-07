"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, Plus, MoreHorizontal, Trash2, AlertCircle } from "lucide-react";

const TASK_REGEX = new RegExp("^[\\p{L}\\p{N}\\s.,'!&()\\-:]{3,120}$", "u");

interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  dueTime?: string;
}

const STORAGE_KEY = "dashboardTodos";

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as TodoItem[];
          return parsed.map((t) => ({
            ...t,
            createdAt: new Date(t.createdAt),
          }));
        } catch {
          // ignore parse errors and fall back to defaults
        }
      }
    }
    return [];
  });
  const [newTask, setNewTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);

  const validateTask = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setInputError("Task is required.");
      return false;
    }

    if (trimmed.length < 3) {
      setInputError("Tasks must be at least 3 characters long.");
      return false;
    }

    if (!TASK_REGEX.test(trimmed)) {
      setInputError(
        "Use letters, numbers, spaces, or . , ' ! & ( ) - : characters only."
      );
      return false;
    }

    setInputError(null);
    return true;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos]);

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const addTodo = () => {
    if (!validateTask(newTask)) {
      return;
    }

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      task: newTask.trim(),
      completed: false,
      priority: "medium",
      createdAt: new Date(),
    };

    setTodos([...todos, newTodo]);
    setNewTask("");
    setInputError(null);
    setIsAdding(false);
  };

  const updatePriority = (id: string, priority: "low" | "medium" | "high") => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, priority } : todo))
    );
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const pendingHighPriority = todos.filter(
    (todo) => !todo.completed && todo.priority === "high"
  ).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 border-red-200 bg-red-50";
      case "medium":
        return "text-amber-500 border-amber-200 bg-amber-50";
      case "low":
        return "text-green-500 border-green-200 bg-green-50";
      default:
        return "text-gray-500 border-gray-200 bg-gray-50";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Today's To-Do
          </CardTitle>
          <div className="flex items-center gap-2">
            {pendingHighPriority > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                {pendingHighPriority} urgent
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {completedCount}/{totalCount}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`relative flex items-center gap-3 p-2 pl-4 rounded-lg border transition-all ${
              todo.completed ? "bg-muted/30 border-muted" : "border-border"
            }`}
          >
            <div
              className={`absolute left-0 top-0 h-full w-1 rounded-l ${
                todo.priority === "high"
                  ? "bg-red-500"
                  : todo.priority === "medium"
                    ? "bg-amber-500"
                    : "bg-green-500"
              }`}
            />
            <Checkbox
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
              className={
                todo.priority === "high" && !todo.completed
                  ? "border-red-400"
                  : ""
              }
            />

            <div className="flex-1 min-w-0">
              <label
                htmlFor={`todo-${todo.id}`}
                className={`text-sm cursor-pointer block ${
                  todo.completed
                    ? "line-through text-muted-foreground"
                    : "font-medium"
                }`}
              >
                {todo.task}
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 ${getPriorityColor(todo.priority)}`}
                >
                  {todo.priority}
                </Badge>
                {todo.dueTime && (
                  <span className="text-xs text-muted-foreground">
                    {todo.dueTime}
                  </span>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => updatePriority(todo.id, "high")}
                >
                  Set High Priority
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updatePriority(todo.id, "medium")}
                >
                  Set Medium Priority
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updatePriority(todo.id, "low")}
                >
                  Set Low Priority
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}

        {isAdding ? (
          <>
            <div className="flex items-center gap-2 p-2 border rounded-lg">
              <Input
                value={newTask}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewTask(value);

                  if (inputError) {
                    validateTask(value);
                  }
                }}
                placeholder="Enter new task..."
                className="flex-1 h-8"
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTodo();
                  if (e.key === "Escape") {
                    setIsAdding(false);
                    setNewTask("");
                    setInputError(null);
                  }
                }}
                autoFocus
              />
              <Button
                size="sm"
                onClick={addTodo}
                disabled={!newTask.trim() || !!inputError}
              >
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setNewTask("");
                  setInputError(null);
                }}
              >
                Cancel
              </Button>
            </div>
            {inputError && (
              <p className="text-xs text-red-500 px-1">{inputError}</p>
            )}
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-dashed"
            onClick={() => {
              setIsAdding(true);
              setInputError(null);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}

        {todos.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{todos.filter((t) => !t.completed).length} remaining</span>
              <button
                onClick={() => setTodos(todos.filter((t) => !t.completed))}
                className="hover:text-foreground transition-colors"
                disabled={completedCount === 0}
              >
                Clear completed ({completedCount})
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
