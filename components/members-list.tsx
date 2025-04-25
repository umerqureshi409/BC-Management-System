"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Search, Trash2 } from "lucide-react"

interface Member {
  id: string
  name: string
  username: string
  email: string
  phone: string
}

export default function MembersList() {
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Load members from localStorage
    if (typeof window !== "undefined") {
      const storedMembers = JSON.parse(localStorage.getItem("members") || "[]")
      setMembers(storedMembers)
    }
  }, [])

  const handleDeleteMember = (id: string) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      // Remove member from list
      const updatedMembers = members.filter((member) => member.id !== id)
      setMembers(updatedMembers)

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("members", JSON.stringify(updatedMembers))

        // Also remove all payments associated with this member
        const payments = JSON.parse(localStorage.getItem("payments") || "[]")
        const updatedPayments = payments.filter((payment: any) => payment.memberId !== id)
        localStorage.setItem("payments", JSON.stringify(updatedPayments))
      }

      toast({
        title: "Member deleted",
        description: "Member has been removed successfully",
      })
    }
  }

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm),
  )

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search members..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <p className="text-slate-500">
          {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"} found
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.username}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMember(member.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-slate-500">
                  No members found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
