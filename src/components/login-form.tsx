'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"
import { signIn, useSession } from "next-auth/react"
// import Link from "next/link"
import { useRouter } from "next/navigation"
import PasswordInput from "./password-input"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter();
  useEffect(()=>{
    if(status === "authenticated"){
      router.push("/")
    }
  }, [status,router])

  // query params
  const handleLogin = async (e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(!email || !password){
      toast.warning("Логін або пароль не можуть бути пустими")
      return;
    }
    const result = await signIn("credentials", {
      email,
      password,
      redirect:false,
    })
    if(result?.code){
      // console.log('result', result)
      toast.error("Помилка входу", {
        description: result.code 
      })
      return;
    }
    router.push("/")

    
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Вітаю</CardTitle>
          <CardDescription>
            Введіть ваші дані для входу
          </CardDescription>
        </CardHeader>
        <CardContent>
           <form className="grid gap-6" onClick={handleLogin}>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                  />

                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Пароль</Label>
                    {/* <Link
                      href="/reset-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link> */}
                  </div>
                  <PasswordInput
                    value={password}
                    onChange={setPassword}
                    id="password"
                    placeholder="Password"
                  />
                </div>
                <Button 
                  type='submit'
                className="w-full">
                  Увійти
                </Button>
              </form>
        </CardContent>
      </Card>
    </div>
  )
}
