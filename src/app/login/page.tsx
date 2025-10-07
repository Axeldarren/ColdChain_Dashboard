import React from 'react'
import Link from 'next/link'

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl shadow-md bg-white dark:bg-[var(--color-dark-secondary)] p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to continue</p>
        </div>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[var(--color-dark-tertiary)] text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[var(--color-dark-tertiary)] text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="pt-2">
            <Link
              href="/home"
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login