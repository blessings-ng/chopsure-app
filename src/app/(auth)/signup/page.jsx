"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function SignupPage() {
  const pathname = usePathname()
  const isSignup = pathname.includes("signup")

  return (
    <div
      className={cn(
        "w-[320px] transition-all duration-500 delay-300",
        isSignup ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      )}
    >
      <h2 className="text-2xl font-semibold text-white mb-2">
        Create account
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        Sign up to get started with the platform
      </p>

      <Input placeholder="Full name" className="mb-3" />
      <Input placeholder="Email address" className="mb-3" />
      <Input type="password" placeholder="Password" className="mb-4" />

      <Button className="w-full bg-orange-500 hover:bg-orange-600">
        Sign up
      </Button>
    </div>
  )
}
