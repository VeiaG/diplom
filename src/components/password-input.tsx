"use client"

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PasswordInputProps {
  id?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  maxLength?: number
}

export default function PasswordInput({ id, placeholder = "Введіть пароль" ,value,onChange,maxLength}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        id={id}
        placeholder={placeholder}
        className="pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-gray-500" />
        ) : (
          <Eye className="h-4 w-4 text-gray-500" />
        )}
      </Button>
    </div>
  )
}

