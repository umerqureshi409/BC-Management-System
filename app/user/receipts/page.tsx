"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import UserHeader from "@/components/user-header"
import ReceiptGenerator from "@/components/receipt-generator"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

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

export default function UserReceipts() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<Member | null>(null)
  const [userPayments, setUserPayments] = useState<Payment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const userLoggedIn = sessionStorage.getItem("userLoggedIn")
    const userDataString = sessionStorage.getItem("currentUser")

    if (!userLoggedIn || !userDataString) {
      toast({
        title: "Access denied",
        description: "Please login to access your receipts",
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

      // Set the first payment as selected by default if available
      if (filteredPayments.length > 0) {
        setSelectedPayment(filteredPayments[0])
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

  const filteredPayments = userPayments.filter(
    (payment) =>
      payment.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm) ||
      new Date(payment.date).toLocaleDateString().includes(searchTerm),
  )

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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Payment Receipts</h1>
          <p className="text-slate-600 dark:text-slate-300">View and download receipts for your payments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Payments</CardTitle>
                <CardDescription>Select a payment to view receipt</CardDescription>
                <div className="mt-2 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    type="text"
                    placeholder="Search payments..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredPayments.length > 0 ? (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {filteredPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedPayment?.id === payment.id
                            ? "bg-purple-100 dark:bg-purple-900/20 border-l-4 border-purple-600"
                            : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-l-4 border-transparent"
                        }`}
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {new Date(payment.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                            Receipt #{payment.id.slice(0, 6)}
                          </div>
                        </div>
                        {payment.notes && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{payment.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    {searchTerm ? "No matching payments found" : "No payments found"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedPayment && currentUser ? (
              <ReceiptGenerator payment={selectedPayment} member={currentUser} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-slate-500 mb-2">Select a payment to view receipt</p>
                  {userPayments.length === 0 && (
                    <p className="text-sm text-slate-400">You don't have any payments yet</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
