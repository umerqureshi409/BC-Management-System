"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import AdminHeader from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Admin {
  id: string
  username: string
  name: string
  email: string
}

export default function AdminProfile() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Check if admin is logged in
    const adminLoggedIn = sessionStorage.getItem("adminLoggedIn")
    const adminData = sessionStorage.getItem("currentAdmin")

    if (!adminLoggedIn || !adminData) {
      toast({
        title: "Access denied",
        description: "Please login to access your profile",
        variant: "destructive",
      })
      router.push("/admin/login")
      return
    }

    try {
      const parsedAdmin = JSON.parse(adminData)
      setAdmin(parsedAdmin)
      setName(parsedAdmin.name || "")
      setEmail(parsedAdmin.email || "")
      setIsLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      })
      router.push("/admin/login")
    }
  }, [router, toast])

  const handleSaveProfile = () => {
    if (!admin) return

    setIsSaving(true)

    try {
      // Update admin in localStorage
      if (typeof window !== "undefined") {
        const admins = JSON.parse(localStorage.getItem("admins") || "[]")
        const updatedAdmins = admins.map((a: Admin) => {
          if (a.id === admin.id) {
            return { ...a, name, email }
          }
          return a
        })

        localStorage.setItem("admins", JSON.stringify(updatedAdmins))

        // Update current admin in session storage
        const updatedAdmin = { ...admin, name, email }
        sessionStorage.setItem("currentAdmin", JSON.stringify(updatedAdmin))
        setAdmin(updatedAdmin)

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Admin Profile</h1>
          <p className="text-slate-600 dark:text-slate-300">Manage your account information</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={admin?.username || ""} disabled className="bg-slate-50" />
                <p className="text-xs text-slate-500">Username cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
