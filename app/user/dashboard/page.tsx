"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import UserHeader from "@/components/user-header"
import UserPaymentHistory from "@/components/user-payment-history"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, CreditCard, Calendar, Download, TrendingUp } from "lucide-react"

interface Member {
  id: string
  name: string
  username: string
  email: string
  phone: string
}

interface Payment {
  id: string
  memberId: string
  amount: number
  date: string
  notes: string
}

interface BCCycle {
  id: string
  name: string
  amount: number
  frequency: string
  startDate: string
  endDate: string
  status: string
  members: string[]
}

export default function UserDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<Member | null>(null)
  const [userPayments, setUserPayments] = useState<Payment[]>([])
  const [userCycles, setUserCycles] = useState<BCCycle[]>([])
  const [totalPaid, setTotalPaid] = useState(0)
  const [nextPaymentDate, setNextPaymentDate] = useState<string | null>(null)
  const [nextPaymentAmount, setNextPaymentAmount] = useState<number | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const userLoggedIn = sessionStorage.getItem("userLoggedIn")
    const userDataString = sessionStorage.getItem("currentUser")

    if (!userLoggedIn || !userDataString) {
      toast({
        title: "Access denied",
        description: "Please login to access your dashboard",
        variant: "destructive",
      })
      router.push("/user/login")
      return
    }

    try {
      const userData = JSON.parse(userDataString)
      setCurrentUser(userData)

      // Get user payments
      const allPayments = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("payments") || "[]") : []
      const filteredPayments = allPayments.filter((payment: Payment) => payment.memberId === userData.id)

      // Sort payments by date (newest first)
      filteredPayments.sort((a: Payment, b: Payment) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setUserPayments(filteredPayments)

      // Calculate total paid
      const total = filteredPayments.reduce((sum: number, payment: Payment) => sum + Number(payment.amount), 0)
      setTotalPaid(total)

      // Get user BC cycles
      const allCycles = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("bcCycles") || "[]") : []
      const userActiveCycles = allCycles.filter(
        (cycle: BCCycle) =>
          cycle.members.includes(userData.id) && (cycle.status === "active" || cycle.status === "upcoming"),
      )
      setUserCycles(userActiveCycles)

      // Calculate next payment date (for demo purposes)
      if (userActiveCycles.length > 0) {
        const today = new Date()
        const nextMonth = new Date()
        nextMonth.setDate(today.getDate() + 30)
        setNextPaymentDate(nextMonth.toISOString().split("T")[0])

        // Use the amount from the first active cycle
        setNextPaymentAmount(userActiveCycles[0].amount)
      }

      setIsLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      })
      router.push("/user/login")
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
      <UserHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Welcome, {currentUser?.name}</h1>
          <p className="text-slate-600 dark:text-slate-300">View your payment history and upcoming payments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-purple-100 dark:border-slate-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
                <CardDescription>Amount you've contributed</CardDescription>
              </div>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{totalPaid.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">Across all BC cycles</p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-slate-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Payment Count</CardTitle>
                <CardDescription>Number of payments made</CardDescription>
              </div>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userPayments.length}</p>
              <p className="text-xs text-slate-500 mt-1">Total payments recorded</p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-slate-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Active Cycles</CardTitle>
                <CardDescription>BC cycles you're part of</CardDescription>
              </div>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userCycles.length}</p>
              <p className="text-xs text-slate-500 mt-1">Ongoing BC committees</p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-slate-700">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
                <CardDescription>Date of your last payment</CardDescription>
              </div>
              <Download className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {userPayments.length > 0 ? new Date(userPayments[0].date).toLocaleDateString() : "No payments"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {userPayments.length > 0 ? `₹${userPayments[0].amount.toLocaleString()}` : ""}
              </p>
            </CardContent>
          </Card>
        </div>

        {nextPaymentDate && nextPaymentAmount && (
          <Card className="mb-8 border-purple-100 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-slate-50 dark:from-slate-800 dark:to-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Next Payment Due</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Your next payment of <span className="font-bold">₹{nextPaymentAmount.toLocaleString()}</span> is due
                    on <span className="font-bold">{new Date(nextPaymentDate).toLocaleDateString()}</span>
                  </p>
                </div>
                <Link href="/user/payments">
                  <Button className="bg-purple-600 hover:bg-purple-700 group">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {userCycles.map((cycle) => {
            const progress = calculateCycleProgress(cycle.startDate, cycle.endDate)
            return (
              <Card key={cycle.id} className="border-purple-100 dark:border-slate-700">
                <CardHeader>
                  <CardTitle>{cycle.name}</CardTitle>
                  <CardDescription>
                    {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Amount:</span>
                    <span className="font-medium">₹{cycle.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Frequency:</span>
                    <span className="font-medium capitalize">{cycle.frequency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Status:</span>
                    <span className="font-medium capitalize">{cycle.status}</span>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {userCycles.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-slate-500 mb-4">You are not part of any active BC cycles</p>
                <p className="text-sm text-slate-400">Contact the admin to join a BC cycle</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Payment History</CardTitle>
            <CardDescription>Complete record of all your contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <UserPaymentHistory payments={userPayments} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function calculateCycleProgress(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = new Date().getTime()

  if (now < start) return 0
  if (now > end) return 100

  const total = end - start
  const elapsed = now - start
  return Math.round((elapsed / total) * 100)
}
