"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import AdminHeader from "@/components/admin-header"
import MembersList from "@/components/members-list"
import AddMemberForm from "@/components/add-member-form"
import RecordPaymentForm from "@/components/record-payment-form"
import PaymentHistory from "@/components/payment-history"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight, Users, CreditCard, Calendar, TrendingUp } from "lucide-react"
import BCCyclesManagement from "@/components/bc-cycles-management"

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalCollections: 0,
    recentPayments: 0,
    pendingPayments: 0,
    collectionProgress: 0,
    memberGrowth: 0,
  })

  useEffect(() => {
    // Check if admin is logged in
    const adminLoggedIn = sessionStorage.getItem("adminLoggedIn")

    if (!adminLoggedIn) {
      toast({
        title: "Access denied",
        description: "Please login to access the admin dashboard",
        variant: "destructive",
      })
      router.push("/admin/login")
    } else {
      // Load data and calculate stats
      const members = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("members") || "[]") : []
      const payments = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("payments") || "[]") : []
      const cycles = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("bcCycles") || "[]") : []

      // Calculate recent payments (last 24 hours)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const recentPayments = payments.filter((payment: any) => {
        const paymentDate = new Date(payment.date)
        return paymentDate >= yesterday
      }).length

      // Calculate total collections
      const totalCollections = payments.reduce((sum: number, payment: any) => sum + Number(payment.amount), 0)

      // Calculate collection progress based on active cycles
      const activeCycles = cycles.filter((cycle: any) => cycle.status === "active")
      let targetCollection = 100000 // Default target

      if (activeCycles.length > 0) {
        targetCollection = activeCycles.reduce((sum: number, cycle: any) => {
          return sum + cycle.amount * cycle.members.length
        }, 0)
      }

      const collectionProgress = Math.min(Math.round((totalCollections / targetCollection) * 100), 100)

      // Calculate member growth
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      // For demo purposes, assume 15% growth if we don't have historical data
      const memberGrowth = 15

      // Calculate pending payments based on active cycles
      let pendingPayments = 0

      if (activeCycles.length > 0) {
        // For each active cycle, count members who haven't made a payment in the current month
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()

        activeCycles.forEach((cycle: any) => {
          cycle.members.forEach((memberId: string) => {
            const memberHasPaidThisMonth = payments.some((payment: any) => {
              const paymentDate = new Date(payment.date)
              return (
                payment.memberId === memberId &&
                paymentDate.getMonth() === currentMonth &&
                paymentDate.getFullYear() === currentYear
              )
            })

            if (!memberHasPaidThisMonth) {
              pendingPayments++
            }
          })
        })
      }

      setStats({
        totalMembers: members.length,
        totalCollections,
        recentPayments,
        pendingPayments,
        collectionProgress,
        memberGrowth,
      })

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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Welcome back, Umer! Here's an overview of your BC system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-purple-100 dark:border-slate-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <CardDescription>Registered users</CardDescription>
              </div>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold">{stats.totalMembers}</p>
                <span className="text-xs font-medium text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stats.memberGrowth}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Compared to last month</p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-slate-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
                <CardDescription>Amount collected</CardDescription>
              </div>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold">PKR {stats.totalCollections.toLocaleString()}</p>
                <span className="text-xs font-medium text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  12%
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{stats.collectionProgress}%</span>
                </div>
                <Progress value={stats.collectionProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-slate-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Recent Payments</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </div>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold">{stats.recentPayments}</p>
                {stats.recentPayments > 0 ? (
                  <span className="text-xs font-medium text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Active
                  </span>
                ) : (
                  <span className="text-xs font-medium text-amber-600 flex items-center">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">Payments received today</p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-slate-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <CardDescription>Awaiting collection</CardDescription>
              </div>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold">{stats.pendingPayments}</p>
                <span className="text-xs font-medium text-amber-600 flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  Attention needed
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Members with pending payments</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="add-member">Add Member</TabsTrigger>
            <TabsTrigger value="record-payment">Record Payment</TabsTrigger>
            <TabsTrigger value="payment-history">Payment History</TabsTrigger>
            <TabsTrigger value="bc-cycles">BC Cycles</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-0">
            <MembersList />
          </TabsContent>

          <TabsContent value="add-member" className="mt-0">
            <AddMemberForm />
          </TabsContent>

          <TabsContent value="record-payment" className="mt-0">
            <RecordPaymentForm />
          </TabsContent>

          <TabsContent value="payment-history" className="mt-0">
            <PaymentHistory />
          </TabsContent>

          <TabsContent value="bc-cycles" className="mt-0">
            <BCCyclesManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
