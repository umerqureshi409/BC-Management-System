"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Member {
  id: string
  name: string
  username: string
}

export default function RecordPaymentForm() {
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load members from localStorage
    if (typeof window !== "undefined") {
      const storedMembers = JSON.parse(localStorage.getItem("members") || "[]")
      setMembers(storedMembers)
    }

    // Set default date to today
    const today = new Date().toISOString().split("T")[0]
    setDate(today)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Get existing payments
      const existingPayments = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("payments") || "[]") : []

      // Create new payment
      const newPayment = {
        id: Date.now().toString(),
        memberId: selectedMemberId,
        amount: Number.parseFloat(amount),
        date,
        notes,
      }

      // Add to payments list
      const updatedPayments = [...existingPayments, newPayment]
      if (typeof window !== "undefined") {
        localStorage.setItem("payments", JSON.stringify(updatedPayments))
      }

      toast({
        title: "Payment recorded",
        description: "Payment has been recorded successfully",
      })

      // Reset form
      setSelectedMemberId("")
      setAmount("")
      setNotes("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Payment</CardTitle>
        <CardDescription>Record a new payment from a BC member</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member">Select Member</Label>
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} ({member.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (PKR)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Payment Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Recording Payment..." : "Record Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
