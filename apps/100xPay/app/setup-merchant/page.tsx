"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check, Copy, KeyRound } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SetupMerchant() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    publicKey: "",
    webhookUrl: "",
  })

  const [apiKey, setApiKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock API key generation
    setApiKey(`100x_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`)
  }

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <Link href="/" className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>

        {!apiKey ? (
          <Card className="border-2 border-blue-100 shadow-md">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-2xl text-blue-900">Setup Merchant Account</CardTitle>
              <CardDescription>Fill out the form below to create your merchant account</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publicKey">Public Key (Wallet Address)</Label>
                  <Input
                    id="publicKey"
                    name="publicKey"
                    placeholder="0x..."
                    required
                    value={formData.publicKey}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                  <Input
                    id="webhookUrl"
                    name="webhookUrl"
                    placeholder="https://your-site.com/webhook"
                    value={formData.webhookUrl}
                    onChange={handleChange}
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Create Merchant Account
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card className="border-2 border-blue-100 shadow-md">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-2xl text-blue-900">Account Created Successfully!</CardTitle>
                <CardDescription>Your merchant account has been set up</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Alert className="border-green-100 bg-green-50">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Success</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Your merchant account has been created. Keep your API key safe!
                  </AlertDescription>
                </Alert>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="apiKey">Your API Key</Label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Input id="apiKey" value={apiKey} readOnly className="bg-blue-50 pr-10 font-mono" />
                      <KeyRound className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      className="border-blue-200 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  {copied && <p className="text-sm text-green-600">Copied to clipboard!</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100 shadow-md">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-2xl text-blue-900">Next Steps</CardTitle>
                <CardDescription>Follow these steps to integrate 100xPay into your application</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="react">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="react">React</TabsTrigger>
                    <TabsTrigger value="nextjs">Next.js</TabsTrigger>
                    <TabsTrigger value="vanilla">Vanilla JS</TabsTrigger>
                  </TabsList>
                  <TabsContent value="react" className="mt-4 space-y-4">
                    <div className="rounded-md bg-slate-950 p-4">
                      <pre className="text-sm text-slate-50">
                        <code>{`// Install the package
npm install @100xpay/react

// In your component
import { PaymentButton } from '@100xpay/react';

function Checkout() {
  return (
    <PaymentButton 
      apiKey="${apiKey}"
      amount={100}
      currency="USDC"
      onSuccess={(txId) => console.log('Payment successful:', txId)}
    />
  );
}`}</code>
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="nextjs" className="mt-4 space-y-4">
                    <div className="rounded-md bg-slate-950 p-4">
                      <pre className="text-sm text-slate-50">
                        <code>{`// Install the package
npm install @100xpay/react

// In your Next.js component
'use client';

import { PaymentButton } from '@100xpay/react';

export default function Checkout() {
  return (
    <PaymentButton 
      apiKey="${apiKey}"
      amount={100}
      currency="USDC"
      onSuccess={(txId) => console.log('Payment successful:', txId)}
    />
  );
}`}</code>
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="vanilla" className="mt-4 space-y-4">
                    <div className="rounded-md bg-slate-950 p-4">
                      <pre className="text-sm text-slate-50">
                        <code>{`// Include the script
<script src="https://cdn.100xpay.com/js/v1.js"></script>

// Initialize payment
<div id="payment-container"></div>

<script>
  const pay100x = new Pay100X('${apiKey}');
  pay100x.mount('#payment-container', {
    amount: 100,
    currency: 'USDC',
    onSuccess: (txId) => console.log('Payment successful:', txId)
  });
</script>`}</code>
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

