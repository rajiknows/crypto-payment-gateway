"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, Loader2, Wallet } from "lucide-react"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Mock available tokens
const AVAILABLE_TOKENS = [
  { id: "usdc", name: "USDC", logo: "/placeholder.svg?height=24&width=24", balance: "1,245.00" },
  { id: "usdt", name: "USDT", logo: "/placeholder.svg?height=24&width=24", balance: "532.50" },
  { id: "dai", name: "DAI", logo: "/placeholder.svg?height=24&width=24", balance: "789.25" },
  { id: "eth", name: "ETH", logo: "/placeholder.svg?height=24&width=24", balance: "2.45" },
]

type PaymentStatus = "idle" | "connecting" | "selecting" | "processing" | "success"

export default function DemoPayment() {
  const [status, setStatus] = useState<PaymentStatus>("idle")
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const connectWallet = () => {
    setStatus("connecting")
    // Simulate connection delay
    setTimeout(() => {
      setStatus("selecting")
    }, 1500)
  }

  const processPayment = () => {
    setStatus("processing")

    // Simulate payment processing with progress
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 10
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setStatus("success")
        }, 500)
      }
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="container mx-auto max-w-md py-8">
        <Link href="/" className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>

        <Card className="border-2 border-blue-100 shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-2xl text-blue-900">Demo Payment</CardTitle>
            <CardDescription>Experience the 100xPay payment flow</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              {status === "idle" && (
                <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center">
                  <div className="rounded-full bg-blue-100 p-6">
                    <Wallet className="h-12 w-12 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">Connect Your Wallet</h3>
                    <p className="mt-2 text-blue-600">Connect your crypto wallet to start the payment process</p>
                  </div>
                  <Button onClick={connectWallet} className="mt-4 bg-blue-600 hover:bg-blue-700">
                    Connect Wallet
                  </Button>
                </div>
              )}

              {status === "connecting" && (
                <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">Connecting Wallet</h3>
                    <p className="mt-2 text-blue-600">Please approve the connection in your wallet...</p>
                  </div>
                </div>
              )}

              {status === "selecting" && (
                <div className="space-y-6">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <h3 className="font-medium text-blue-900">Payment Amount</h3>
                    <p className="mt-1 text-2xl font-bold text-blue-900">100 USDC</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-blue-900">Select Payment Method</h3>
                    <RadioGroup value={selectedToken || ""} onValueChange={setSelectedToken}>
                      {AVAILABLE_TOKENS.map((token) => (
                        <div
                          key={token.id}
                          className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                            selectedToken === token.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={token.id} id={token.id} />
                            <img src={token.logo || "/placeholder.svg"} alt={token.name} className="h-6 w-6" />
                            <Label htmlFor={token.id} className="cursor-pointer font-medium">
                              {token.name}
                            </Label>
                          </div>
                          <div className="text-sm text-gray-500">Balance: {token.balance}</div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Button
                    onClick={processPayment}
                    disabled={!selectedToken}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                  >
                    Pay 100 USDC
                  </Button>
                </div>
              )}

              {status === "processing" && (
                <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center">
                  <div className="w-full space-y-4">
                    <h3 className="text-xl font-semibold text-blue-900">Processing Payment</h3>
                    <Progress value={progress} className="h-2 w-full" />
                    <p className="text-blue-600">
                      {progress < 30 && "Initiating transaction..."}
                      {progress >= 30 && progress < 60 && "Confirming with blockchain..."}
                      {progress >= 60 && progress < 90 && "Waiting for confirmation..."}
                      {progress >= 90 && "Finalizing payment..."}
                    </p>
                  </div>
                </div>
              )}

              {status === "success" && (
                <div className="space-y-6">
                  <Alert className="border-green-100 bg-green-50">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Payment Successful!</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Your payment of 100 USDC has been processed successfully.
                    </AlertDescription>
                  </Alert>

                  <div className="rounded-lg bg-blue-50 p-4">
                    <h3 className="font-medium text-blue-900">Transaction Details</h3>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Amount</span>
                        <span className="font-medium">100 USDC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment Method</span>
                        <span className="font-medium">{selectedToken ? selectedToken.toUpperCase() : "USDC"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Transaction ID</span>
                        <span className="font-mono text-xs">0x71c...9e3f</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {status === "success" && (
              <div className="flex w-full justify-between">
                <Button variant="outline" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button onClick={() => setStatus("idle")} className="bg-blue-600 hover:bg-blue-700">
                  Try Again
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

