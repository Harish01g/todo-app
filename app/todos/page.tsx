"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function Todos() {
  const [task, setTask] = useState("")
  const [todos, setTodos] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [message, setMessage] = useState("")

  const remainingTodos = todos.filter(
  (todo) => !todo.completed
).length

  async function fetchTodos(userId: string) {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      alert(error.message)
    } else {
      setTodos(data || [])
    }
  }

  async function addTodo() {
    if (!user) {
      alert("Please login first")
      return
    }

     if (!task.trim()) {
  setMessage("Please enter a todo")
  setTimeout(() => setMessage(""), 2000)
  return
}

    const { error } = await supabase
      .from("todos")
      .insert({
        task: task,
        user_id: user.id,
      })

    if (error) {
      alert(error.message)
    } else {
      setTask("")
        setMessage("Todo added successfully!")
       setTimeout(() => setMessage(""), 2000)
        await fetchTodos(user.id)
    }
  }

  async function toggleTodo(id: number, completed: boolean) {
  setTodos((currentTodos) =>
    currentTodos.map((todo) =>
      todo.id === id
        ? { ...todo, completed: !completed }
        : todo
    )
  )

  const { error } = await supabase
    .from("todos")
    .update({ completed: !completed })
    .eq("id", id)

  if (error) {
    alert(error.message)

    // Put it back if database update fails
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: completed }
          : todo
      )
    )
  }
}

 async function deleteTodo(id: number) {

  if (!confirm("Are you sure you want to delete this todo?")) return
  const oldTodos = todos

  setTodos((currentTodos) =>
    currentTodos.filter((todo) => todo.id !== id)
  )

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)

  if (error) {
    alert(error.message)
    setTodos(oldTodos)
  }
}

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()

      if (data.user) {
        setUser(data.user)
        await fetchTodos(data.user.id)
      } else {
        window.location.href = "/"
      }
    }

    loadUser()
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold text-center mb-2">
  My Todos 📝
</h1>

<p className="text-center text-gray-500 mb-6">
  Keep track of what you need to get done.
</p>

      {user && (
        <p className="text-center text-sm text-gray-500 mb-6">
          Logged in as: {user.email}
        </p>
      )}

      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg">
        {message && (
           <p className="text-center text-sm text-green-600 mb-4">
           {message}
            </p>
          )}

       <input
  className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
  placeholder="What needs to be done?"
  value={task}
  onChange={(e) => setTask(e.target.value)}
/>

        <button
          className="w-full bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
          onClick={addTodo}
        >
          Add Todo
        </button>

          <p className="text-sm text-gray-500 mb-3">
  {remainingTodos} remaining •{" "}
  {todos.length - remainingTodos} completed
</p>
        <ul className="mt-6 space-y-3">
          {todos.length === 0 ? (
  <p className="text-center text-gray-400 mt-6">
    No todos yet. Add your first task! 🎯
  </p>
) : (
  <ul className="mt-6 space-y-3">
    {todos.map((todo) => (
      <li
        key={todo.id}
        className="bg-gray-50 p-4 rounded-lg shadow flex items-center gap-3 hover:shadow-md transition"
      >
        <input
          type="checkbox"
          className="w-5 h-5"
          checked={todo.completed}
          onChange={() =>
            toggleTodo(todo.id, todo.completed)
          }
        />

        <span
          className={`flex-1 ${
            todo.completed
              ? "line-through text-gray-400"
              : "text-gray-800"
          }`}
        >
          {todo.task}
        </span>

        <button
          className="ml-auto bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
          onClick={() => deleteTodo(todo.id)}
        >
          Delete
        </button>
      </li>
    ))}
  </ul>
)}
        </ul>

        <button
          className="w-full mt-6 bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg"
          onClick={logout}
        >
          Log Out
        </button>

      </div>
    </main>
  )
}