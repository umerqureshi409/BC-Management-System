"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download } from "lucide-react"

interface Member {
  id: string
  name: string
  username: string
}

interface Payment {
  id: string
  memberId: string
  amount: number
  date: string
  notes: string
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMemberId, setFilterMemberId] = useState("")

  useEffect(() => {
    // Load payments and members from localStorage
    if (typeof window !== "undefined") {
      const storedPayments = JSON.parse(localStorage.getItem("payments") || "[]")
      const storedMembers = JSON.parse(localStorage.getItem("members") || "[]")

      // Sort payments by date (newest first)
      storedPayments.sort((a: Payment, b: Payment) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setPayments(storedPayments)
      setMembers(storedMembers)
    }
  }, [])

  const getMemberName = (memberId: string) => {
    const member = members.find((m) => m.id === memberId)
    return member ? member.name : "Unknown Member"
  }

  const filteredPayments = payments.filter((payment) => {
    const memberName = getMemberName(payment.memberId)
    const matchesSearch =
      memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm) ||
      new Date(payment.date).toLocaleDateString().includes(searchTerm)

    const matchesMember = filterMemberId ? payment.memberId === filterMemberId : true

    return matchesSearch && matchesMember
  })

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["Date", "Member", "Amount", "Notes"]
    const rows = filteredPayments.map((payment) => [
      new Date(payment.date).toLocaleDateString(),
      getMemberName(payment.memberId),
      payment.amount.toString(),
      payment.notes,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("href", url)
    a.setAttribute("download", `payment-history-${new Date().toISOString().split("T")[0]}.csv`)
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3 space-y-2">
          <label className="text-sm font-medium">Filter by Member</label>
          <Select value={filterMemberId} onValueChange={setFilterMemberId}>
            <SelectTrigger>
              <SelectValue placeholder="All Members" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search payments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button variant="outline" className="w-full md:w-auto flex items-center gap-2" onClick={exportToCSV}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{getMemberName(payment.memberId)}</TableCell>
                  <TableCell>PKR {payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.notes || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-slate-500">
                  No payments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
