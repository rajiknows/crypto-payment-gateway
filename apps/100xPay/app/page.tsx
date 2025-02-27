import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-12 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-blue-900 sm:text-6xl">Welcome to 100xPay</h1>
            <p className="text-xl text-blue-700">The easiest way to accept crypto payments for your business</p>
          </div>

          <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
            <Card className="overflow-hidden border-2 border-blue-100 shadow-md transition-all hover:shadow-lg">
              <CardContent className="p-0">
                <Link href="/setup-merchant">
                  <div className="flex h-full flex-col items-center justify-center space-y-4 p-8">
                    <div className="rounded-full bg-blue-100 p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-blue-600"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-blue-900">Setup Merchant Account</h2>
                    <p className="text-blue-600">Create your account and get started</p>
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-blue-100 shadow-md transition-all hover:shadow-lg">
              <CardContent className="p-0">
                <Link href="/demo-payment">
                  <div className="flex h-full flex-col items-center justify-center space-y-4 p-8">
                    <div className="rounded-full bg-blue-100 p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-blue-600"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="10 8 16 12 10 16 10 8" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-blue-900">Demo Payment Flow</h2>
                    <p className="text-blue-600">See how payments work in action</p>
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                      Try Demo <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 flex items-center justify-center">
            <div className="rounded-lg bg-blue-50 p-6 text-center">
              <h3 className="text-lg font-medium text-blue-900">Already a merchant?</h3>
              <p className="mt-2 text-blue-600">Sign in to your dashboard to manage payments</p>
              <Button
                variant="outline"
                className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

