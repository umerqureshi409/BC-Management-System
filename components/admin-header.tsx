"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Menu, X, CreditCard, Bell, User, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
}

export default function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [adminName, setAdminName] = useState("Admin")
  const router = useRouter()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    // Get admin data from session storage
    if (typeof window !== "undefined") {
      const adminData = sessionStorage.getItem("currentAdmin")
      if (adminData) {
        const admin = JSON.parse(adminData)
        setAdminName(admin.name || admin.username || "Admin")
      }

      // Get or initialize notifications
      const storedNotifications = localStorage.getItem("adminNotifications")

      if (!storedNotifications) {
        // Create some initial notifications
        const initialNotifications: Notification[] = [
          {
            id: "1",
            title: "New member joined",
            message: "Ahmed Khan has joined the BC system",
            date: new Date().toISOString(),
            read: false,
          },
          {
            id: "2",
            title: "Payment received",
            message: "PKR 5,000 received from Fatima Ali",
            date: new Date().toISOString(),
            read: false,
          },
          {
            id: "3",
            title: "BC cycle completed",
            message: "BC Cycle #2 has been completed successfully",
            date: new Date().toISOString(),
            read: false,
          },
        ]
        localStorage.setItem("adminNotifications", JSON.stringify(initialNotifications))
        setNotifications(initialNotifications)
        setNotificationCount(initialNotifications.filter((n) => !n.read).length)
      } else {
        const parsedNotifications = JSON.parse(storedNotifications)
        setNotifications(parsedNotifications)
        setNotificationCount(parsedNotifications.filter((n: Notification) => !n.read).length)
      }
    }
  }, [])

  const handleLogout = () => {
    // Clear admin session
    sessionStorage.removeItem("adminLoggedIn")
    sessionStorage.removeItem("currentAdmin")

    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })

    // Redirect to home
    router.push("/")
  }

  const clearNotifications = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }))

    setNotifications(updatedNotifications)
    setNotificationCount(0)

    if (typeof window !== "undefined") {
      localStorage.setItem("adminNotifications", JSON.stringify(updatedNotifications))
    }

    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read",
    })
  }

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <span className="text-xl font-bold text-slate-800 dark:text-white">BC Admin</span>
            <Badge variant="outline" className="ml-2">
              Pro
            </Badge>
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/bc-cycles"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              BC Cycles
            </Link>
            <Link
              href="/admin/reports"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Reports
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notificationCount > 0 ? (
                  <>
                    {notifications
                      .filter((n) => !n.read)
                      .map((notification) => (
                        <DropdownMenuItem key={notification.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{notification.title}</span>
                            <span className="text-sm text-slate-500">{notification.message}</span>
                            <span className="text-xs text-slate-400 mt-1">
                              {new Date(notification.date).toLocaleString()}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={clearNotifications} className="text-center cursor-pointer">
                      Mark all as read
                    </DropdownMenuItem>
                  </>
                ) : (
                  <div className="py-4 text-center text-slate-500">No new notifications</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{adminName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="mt-4 pb-2 md:hidden">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin/dashboard"
                  className="block py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/bc-cycles"
                  className="block py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  BC Cycles
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/reports"
                  className="block py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/profile"
                  className="block py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </li>
              <li className="flex items-center justify-between py-2">
                <span className="text-slate-600 dark:text-slate-300">Dark Mode</span>
                <ThemeToggle />
              </li>
              <li>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleLogout()
                  }}
                >
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
