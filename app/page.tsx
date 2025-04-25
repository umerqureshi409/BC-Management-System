import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CreditCard, Users, Calendar, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-slate-800">BC System</h1>
            <Badge variant="outline" className="ml-2">
              Pro
            </Badge>
          </div>
          <div className="space-x-2">
            <Link href="/admin/login">
              <Button variant="outline">Admin Login</Button>
            </Link>
            <Link href="/user/login">
              <Button className="bg-purple-600 hover:bg-purple-700">Member Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100">Premium BC Management</Badge>
            <h2 className="text-5xl font-bold text-slate-800 mb-4">
              Manage Your Committee System <span className="text-purple-600">Effortlessly</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A modern platform to manage your committee system with advanced features, analytics, and secure payment
              tracking
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Card className="border-purple-100 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <CardTitle>Admin Portal</CardTitle>
                </div>
                <CardDescription>Powerful tools to manage members and track payments</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-purple-100 p-1 rounded-full">
                      <svg className="h-3 w-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-slate-600">Add and manage BC members with ease</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-purple-100 p-1 rounded-full">
                      <svg className="h-3 w-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-slate-600">Record and track payments with detailed history</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-purple-100 p-1 rounded-full">
                      <svg className="h-3 w-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-slate-600">Generate detailed reports and analytics</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-purple-100 p-1 rounded-full">
                      <svg className="h-3 w-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-slate-600">Manage multiple BC cycles simultaneously</span>
                  </li>
                </ul>
                <Link href="/admin/login">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 group">
                    Admin Login
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-purple-100 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <CardTitle>Member Portal</CardTitle>
                </div>
                <CardDescription>Easy access to your payment history and status</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-purple-100 p-1 rounded-full">
                      <svg className="h-3 w-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-slate-600">View your complete payment history</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-purple-100 p-1 rounded-full">
                      <svg className="h-3 w-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-slate-600">Download payment receipts instantly</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-purple-100 p-1 rounded-full">
                      <svg className="h-3 w-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-slate-600">Receive payment reminders and notifications</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-purple-100 p-1 rounded-full">
                      <svg className="h-3 w-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-slate-600">Manage your profile and preferences</span>
                  </li>
                </ul>
                <Link href="/user/login">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 group">
                    Member Login
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-center mb-6">Why Choose Our BC Management System?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Secure & Reliable</h4>
                <p className="text-slate-600">Your data is encrypted and securely stored with regular backups</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">User Friendly</h4>
                <p className="text-slate-600">Intuitive interface designed for ease of use by all members</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Advanced Features</h4>
                <p className="text-slate-600">Multiple BC cycles, analytics, and automated notifications</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-semibold text-slate-800">BC System</span>
            </div>
            <div className="text-slate-600 text-center md:text-right">
              <p>© {new Date().getFullYear()} BC Management System. All rights reserved.</p>
              <p className="text-sm mt-1">Developed by Umer Qureshi</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
