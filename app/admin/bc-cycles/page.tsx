"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import AdminHeader from "@/components/admin-header"
import BCCyclesManagement from "@/components/bc-cycles-management"

export default function BCCyclesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in
    const adminLoggedIn = sessionStorage.getItem("adminLoggedIn")

    if (!adminLoggedIn) {
      toast({
        title: "Access denied",
        description: "Please login to access the BC cycles",
        variant: "destructive",
      })
      router.push("/admin/login")
    } else {
      setIsLoading(false)
    }
  }, [router, toast])

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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">BC Cycles Management</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Create and manage your BC cycles and member participation
          </p>
        </div>

        <BCCyclesManagement />
      </main>
    </div>
  )
}
