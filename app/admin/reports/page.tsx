"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import AdminHeader from "@/components/admin-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function ReportsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [paymentData, setPaymentData] = useState<any[]>([])
  const [memberData, setMemberData] = useState<any[]>([])
  const [cycleData, setCycleData] = useState<any[]>([])

  useEffect(() => {
    // Check if admin is logged in
    const adminLoggedIn = sessionStorage.getItem("adminLoggedIn")

    if (!adminLoggedIn) {
      toast({
        title: "Access denied",
        description: "Please login to access the reports",
        variant: "destructive",
      })
      router.push("/admin/login")
      return
    }

    // Load data for reports
    if (typeof window !== "undefined") {
      const members = JSON.parse(localStorage.getItem("members") || "[]")
      const payments = JSON.parse(localStorage.getItem("payments") || "[]")
      const cycles = JSON.parse(localStorage.getItem("bcCycles") || "[]")

      // Process payment data by month
      const paymentsByMonth: Record<string, number> = {}
      payments.forEach((payment: any) => {
        const date = new Date(payment.date)
        const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`
        paymentsByMonth[monthYear] = (paymentsByMonth[monthYear] || 0) + payment.amount
      })

      const paymentChartData = Object.entries(paymentsByMonth)
        .map(([month, amount]) => ({
          month,
          amount,
        }))
        .sort((a, b) => {
          const [aMonth, aYear] = a.month.split(" ")
          const [bMonth, bYear] = b.month.split(" ")
          return new Date(`${aMonth} 1, ${aYear}`).getTime() - new Date(`${bMonth} 1, ${bYear}`).getTime()
        })

      // Process member data for pie chart
      const membersByStatus = [
        {
          name: "Active",
          value: members.filter((m: any) => {
            // Check if member is in any active cycle
            return cycles.some((c: any) => c.status === "active" && c.members.includes(m.id))
          }).length,
        },
        {
          name: "Inactive",
          value:
            members.length -
            members.filter((m: any) => {
              return cycles.some((c: any) => c.status === "active" && c.members.includes(m.id))
            }).length,
        },
      ]

      // Process cycle data
      const cyclesByStatus = [
        { name: "Active", value: cycles.filter((c: any) => c.status === "active").length },
        { name: "Completed", value: cycles.filter((c: any) => c.status === "completed").length },
        { name: "Upcoming", value: cycles.filter((c: any) => c.status === "upcoming").length },
      ]

      setPaymentData(paymentChartData)
      setMemberData(membersByStatus)
      setCycleData(cyclesByStatus)
      setIsLoading(false)
    }
  }, [router, toast])

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading reports...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Reports & Analytics</h1>
          <p className="text-slate-600 dark:text-slate-300">View detailed reports and analytics for your BC system</p>
        </div>

        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="payments">Payment Reports</TabsTrigger>
            <TabsTrigger value="members">Member Analytics</TabsTrigger>
            <TabsTrigger value="cycles">BC Cycle Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Payment Collections</CardTitle>
                <CardDescription>Total payments collected per month in PKR</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {paymentData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paymentData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" angle={-45} textAnchor="end" height={70} />
                      <YAxis label={{ value: "Amount (PKR)", angle: -90, position: "insideLeft" }} />
                      <Tooltip formatter={(value) => `PKR ${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="amount" name="Payment Amount" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-slate-500">No payment data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Member Status</CardTitle>
                  <CardDescription>Active vs Inactive members</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {memberData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={memberData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {memberData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => value} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-slate-500">No member data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Member Participation</CardTitle>
                  <CardDescription>Members per BC cycle</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {typeof window !== "undefined" && JSON.parse(localStorage.getItem("bcCycles") || "[]").length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={JSON.parse(localStorage.getItem("bcCycles") || "[]").map((cycle: any) => ({
                          name: cycle.name,
                          members: cycle.members.length,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="members" name="Number of Members" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-slate-500">No cycle data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cycles" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>BC Cycle Status</CardTitle>
                  <CardDescription>Status distribution of BC cycles</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {cycleData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={cycleData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {cycleData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => value} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-slate-500">No cycle data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>BC Cycle Values</CardTitle>
                  <CardDescription>Total value of each BC cycle in PKR</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {typeof window !== "undefined" && JSON.parse(localStorage.getItem("bcCycles") || "[]").length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={JSON.parse(localStorage.getItem("bcCycles") || "[]").map((cycle: any) => ({
                          name: cycle.name,
                          value: cycle.amount * cycle.members.length,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis label={{ value: "Amount (PKR)", angle: -90, position: "insideLeft" }} />
                        <Tooltip formatter={(value) => `PKR ${value.toLocaleString()}`} />
                        <Legend />
                        <Bar dataKey="value" name="Total Value" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-slate-500">No cycle data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
