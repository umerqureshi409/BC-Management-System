"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { verifyPassword, hashPassword } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize admin accounts if they don't exist
  useEffect(() => {
    const initializeAdmins = async () => {
      if (typeof window !== "undefined") {
        // Get existing admins or create empty array
        let admins = JSON.parse(localStorage.getItem("admins") || "[]")

        // Check if we need to initialize admin
        if (admins.length === 0) {
          // Create Umer admin account
          const umerPasswordHash = await hashPassword("helloworld")
          const umerAdmin = {
            id: "admin-1",
            username: "umer",
            passwordHash: umerPasswordHash,
            name: "Umer Qureshi",
            email: "umer@example.com",
          }

          // Add admin
          admins = [umerAdmin]

          // Save to localStorage
          localStorage.setItem("admins", JSON.stringify(admins))

          // Remove old admin key for clean slate
          localStorage.removeItem("admin")

          console.log("Admin account initialized")
        } else {
          // Filter out any admin/admin123 accounts if they exist
          admins = admins.filter((admin: any) => admin.username !== "admin")
          localStorage.setItem("admins", JSON.stringify(admins))
        }

        setIsInitialized(true)
      }
    }

    initializeAdmins()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Get admin data from localStorage
      const admins = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("admins") || "[]") : []

      // Find admin with matching username
      const admin = admins.find((a: any) => a.username === username)

      // Verify credentials
      if (admin && (await verifyPassword(password, admin.passwordHash))) {
        // Set admin session
        sessionStorage.setItem("adminLoggedIn", "true")
        sessionStorage.setItem("currentAdmin", JSON.stringify(admin))

        toast({
          title: "Login successful",
          description: `Welcome back, ${admin.name || admin.username}!`,
        })

        // Redirect to admin dashboard
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertDescription>Login with: umer / helloworld</AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/" className="text-slate-500 hover:text-slate-800">
                Back to Home
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
