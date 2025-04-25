"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Calendar, Plus, Edit, Trash2 } from "lucide-react"

interface BCCycle {
  id: string
  name: string
  amount: number
  frequency: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "upcoming"
  members: string[]
}

export default function BCCyclesManagement() {
  const [cycles, setCycles] = useState<BCCycle[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  // Form state
  const [cycleName, setCycleName] = useState("")
  const [cycleAmount, setCycleAmount] = useState("")
  const [cycleFrequency, setCycleFrequency] = useState("monthly")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  useEffect(() => {
    // Load BC cycles from localStorage
    if (typeof window !== "undefined") {
      const storedCycles = JSON.parse(localStorage.getItem("bcCycles") || "[]")
      setCycles(storedCycles)

      // Load members
      const storedMembers = JSON.parse(localStorage.getItem("members") || "[]")
      setMembers(storedMembers)
    }

    // Set default dates
    const today = new Date()
    setStartDate(today.toISOString().split("T")[0])

    const sixMonthsLater = new Date()
    sixMonthsLater.setMonth(today.getMonth() + 6)
    setEndDate(sixMonthsLater.toISOString().split("T")[0])
  }, [])

  const handleCreateCycle = () => {
    setIsLoading(true)

    try {
      // Create new BC cycle
      const newCycle: BCCycle = {
        id: Date.now().toString(),
        name: cycleName,
        amount: Number.parseFloat(cycleAmount),
        frequency: cycleFrequency,
        startDate,
        endDate,
        status: new Date(startDate) > new Date() ? "upcoming" : "active",
        members: selectedMembers,
      }

      // Add to cycles list
      const updatedCycles = [...cycles, newCycle]
      setCycles(updatedCycles)

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("bcCycles", JSON.stringify(updatedCycles))
      }

      toast({
        title: "BC Cycle created",
        description: "New BC cycle has been created successfully",
      })

      // Reset form
      setCycleName("")
      setCycleAmount("")
      setCycleFrequency("monthly")
      setSelectedMembers([])
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create BC cycle",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCycle = (id: string) => {
    if (window.confirm("Are you sure you want to delete this BC cycle?")) {
      // Remove cycle from list
      const updatedCycles = cycles.filter((cycle) => cycle.id !== id)
      setCycles(updatedCycles)

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("bcCycles", JSON.stringify(updatedCycles))
      }

      toast({
        title: "BC Cycle deleted",
        description: "BC cycle has been deleted successfully",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "upcoming":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-100"
    }
  }

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()

    if (now < start) return 0
    if (now > end) return 100

    const total = end - start
    const elapsed = now - start
    return Math.round((elapsed / total) * 100)
  }

  const getMemberName = (memberId: string) => {
    const member = members.find((m) => m.id === memberId)
    return member ? member.name : "Unknown"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">BC Cycles</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" /> Create New Cycle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New BC Cycle</DialogTitle>
              <DialogDescription>Set up a new BC cycle with members and payment details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cycle-name">Cycle Name</Label>
                <Input
                  id="cycle-name"
                  placeholder="Enter cycle name"
                  value={cycleName}
                  onChange={(e) => setCycleName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cycle-amount">Amount per Member (PKR)</Label>
                  <Input
                    id="cycle-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={cycleAmount}
                    onChange={(e) => setCycleAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cycle-frequency">Payment Frequency</Label>
                  <Select value={cycleFrequency} onValueChange={setCycleFrequency}>
                    <SelectTrigger id="cycle-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Select Members</Label>
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                  {members.length > 0 ? (
                    members.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          id={`member-${member.id}`}
                          checked={selectedMembers.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMembers([...selectedMembers, member.id])
                            } else {
                              setSelectedMembers(selectedMembers.filter((id) => id !== member.id))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={`member-${member.id}`} className="text-sm">
                          {member.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No members available</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateCycle}
                disabled={isLoading || !cycleName || !cycleAmount || selectedMembers.length === 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Creating..." : "Create Cycle"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cycles.length > 0 ? (
          cycles.map((cycle) => (
            <Card key={cycle.id} className="border-purple-100 dark:border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{cycle.name}</CardTitle>
                    <CardDescription>
                      {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(cycle.status)}>
                    {cycle.status.charAt(0).toUpperCase() + cycle.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Amount per Member:</span>
                  <span className="font-medium">PKR {cycle.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Frequency:</span>
                  <span className="font-medium capitalize">{cycle.frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Members:</span>
                  <span className="font-medium">{cycle.members.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Total Value:</span>
                  <span className="font-medium">PKR {(cycle.amount * cycle.members.length).toLocaleString()}</span>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{calculateProgress(cycle.startDate, cycle.endDate)}%</span>
                  </div>
                  <Progress value={calculateProgress(cycle.startDate, cycle.endDate)} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="outline" size="sm" className="text-xs">
                  <Calendar className="mr-1 h-3 w-3" /> View Schedule
                </Button>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => handleDeleteCycle(cycle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-slate-500 mb-4">No BC cycles found</p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Cycle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {cycles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Member Participation</CardTitle>
            <CardDescription>Members participating in active BC cycles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Participating Cycles</TableHead>
                  <TableHead>Total Contribution</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => {
                  const memberCycles = cycles.filter((cycle) => cycle.members.includes(member.id))
                  const totalContribution = memberCycles.reduce((sum, cycle) => sum + cycle.amount, 0)

                  return (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>
                        {memberCycles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {memberCycles.map((cycle) => (
                              <Badge key={cycle.id} variant="outline" className="text-xs">
                                {cycle.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          "None"
                        )}
                      </TableCell>
                      <TableCell>PKR {totalContribution.toLocaleString()}</TableCell>
                      <TableCell>
                        {memberCycles.length > 0 ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
