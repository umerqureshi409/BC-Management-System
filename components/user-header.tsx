"use client"

import { useState } from "react"
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

export default function UserHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [notificationCount, setNotificationCount] = useState(2)

  const handleLogout = () => {
    // Clear user session
    sessionStorage.removeItem("userLoggedIn")
    sessionStorage.removeItem("currentUser")

    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })

    // Redirect to home
    router.push("/")
  }

  const clearNotifications = () => {
    setNotificationCount(0)
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read",
    })
  }

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/user/dashboard" className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <span className="text-xl font-bold text-slate-800 dark:text-white">BC Member</span>
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/user/dashboard"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/user/payments"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Payments
            </Link>
            <Link
              href="/user/receipts"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Receipts
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
                    <DropdownMenuItem>
                      <div className="flex flex-col">
                        <span className="font-medium">Payment reminder</span>
                        <span className="text-sm text-slate-500">Your next payment of ₹5,000 is due in 3 days</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex flex-col">
                        <span className="font-medium">Payment confirmed</span>
                        <span className="text-sm text-slate-500">Your payment of ₹5,000 has been received</span>
                      </div>
                    </DropdownMenuItem>
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
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Member Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/user/profile")}>
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
                  href="/user/dashboard"
                  className="block py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/user/payments"
                  className="block py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Payments
                </Link>
              </li>
              <li>
                <Link
                  href="/user/receipts"
                  className="block py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Receipts
                </Link>
              </li>
              <li>
                <Link
                  href="/user/profile"
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
