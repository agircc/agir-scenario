"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { LoginForm, RegisterForm, type LoginFormData, type RegisterFormData } from "@/components/auth"

export default function HomePage() {
  const { data: session, status } = useSession()
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      router.push('/scenarios')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (session?.user) {
    return null
  }

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials")
      } else {
        router.push("/scenarios")
      }
    } catch {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      if (response.ok) {
        setError("Registration successful! Please sign in.")
        setRegisteredEmail(data.email)
        setIsLogin(true)
      } else {
        const responseData = await response.json()
        setError(responseData.message || "Registration failed")
      }
    } catch {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setLoading(false)
    if (!isLogin) {
      setRegisteredEmail("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              onClick={switchMode}
              disabled={loading}
              className="p-0 h-auto font-medium text-primary hover:text-primary/80"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Button>
          </p>
        </div>

        {isLogin ? (
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            error={error}
            initialEmail={registeredEmail}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  )
}