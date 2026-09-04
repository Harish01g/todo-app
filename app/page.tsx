"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser()

      if (data.user) {
        router.push("/todos")
      }
    }

    checkUser()
  }, [router])

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Signup successful! Check your email.")
    }
  }

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      router.push("/todos")
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">

        {message && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-4">
            {message}
          </p>
        )}

        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Todo App
        </h1>

        <p className="text-center text-gray-500 dark:text-gray-300 mb-8">
          Organize your day, one task at a time.
        </p>

        <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
          Email
        </label>

        <input
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
          Password
        </label>

        <input
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex gap-3">

          <button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
            onClick={signUp}
          >
            Sign Up
          </button>

          <button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
            onClick={login}
          >
            Log In
          </button>

        </div>

      </div>
    </main>
  )
}