"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Download, Printer } from "lucide-react"

interface ReceiptProps {
  payment: {
    id: string
    memberId: string
    amount: number
    date: string
    notes: string
  }
  member: {
    name: string
    email: string
    phone: string
  }
}

export default function ReceiptGenerator({ payment, member }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Payment Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .receipt { border: 1px solid #ccc; padding: 20px; max-width: 500px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 20px; }
                .logo { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                .title { font-size: 18px; color: #666; }
                .info { margin: 20px 0; }
                .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .label { font-weight: bold; color: #666; }
                .value { text-align: right; }
                .amount { font-size: 24px; text-align: center; margin: 20px 0; font-weight: bold; }
                .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
                .divider { border-top: 1px dashed #ccc; margin: 20px 0; }
                @media print {
                  .receipt { border: none; }
                }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
              <script>
                window.onload = function() { window.print(); window.close(); }
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    }
  }

  const handleDownload = () => {
    setIsGenerating(true)

    try {
      if (receiptRef.current) {
        const receiptHTML = receiptRef.current.innerHTML
        const blob = new Blob(
          [
            `
          <html>
            <head>
              <title>Payment Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .receipt { border: 1px solid #ccc; padding: 20px; max-width: 500px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 20px; }
                .logo { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                .title { font-size: 18px; color: #666; }
                .info { margin: 20px 0; }
                .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .label { font-weight: bold; color: #666; }
                .value { text-align: right; }
                .amount { font-size: 24px; text-align: center; margin: 20px 0; font-weight: bold; }
                .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
                .divider { border-top: 1px dashed #ccc; margin: 20px 0; }
              </style>
            </head>
            <body>
              ${receiptHTML}
            </body>
          </html>
        `,
          ],
          { type: "text/html" },
        )

        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `receipt-${payment.id}.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({
          title: "Receipt downloaded",
          description: "Receipt has been downloaded successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download receipt",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-purple-100 dark:border-slate-700">
      <CardHeader>
        <CardTitle>Payment Receipt</CardTitle>
        <CardDescription>Receipt for payment made on {new Date(payment.date).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={receiptRef}
          className="receipt bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6"
        >
          <div className="header">
            <div className="logo flex justify-center items-center">
              <CreditCard className="h-6 w-6 text-purple-600 mr-2" />
              <span>BC System</span>
            </div>
            <div className="title">Payment Receipt</div>
          </div>

          <div className="divider"></div>

          <div className="info">
            <div className="info-row">
              <span className="label">Receipt No:</span>
              <span className="value">{payment.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="info-row">
              <span className="label">Date:</span>
              <span className="value">{new Date(payment.date).toLocaleDateString()}</span>
            </div>
            <div className="info-row">
              <span className="label">Member Name:</span>
              <span className="value">{member.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Contact:</span>
              <span className="value">{member.phone}</span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="amount">PKR {payment.amount.toLocaleString()}</div>

          {payment.notes && (
            <div className="info">
              <div className="info-row">
                <span className="label">Notes:</span>
                <span className="value">{payment.notes}</span>
              </div>
            </div>
          )}

          <div className="divider"></div>

          <div className="footer">
            <p>Thank you for your payment!</p>
            <p>BC System - Developed by Umer Qureshi</p>
            <p>This is a computer generated receipt and does not require a signature.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrint} className="flex items-center">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button
          onClick={handleDownload}
          disabled={isGenerating}
          className="bg-purple-600 hover:bg-purple-700 flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Download"}
        </Button>
      </CardFooter>
    </Card>
  )
}
