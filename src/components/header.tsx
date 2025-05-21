"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This will be replaced with actual auth state

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-black">
            Dijital Sanat
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/gallery" className="text-gray-600 hover:text-black">
              Galeri
            </Link>
            <Link href="/artists" className="text-gray-600 hover:text-black">
              Sanatçılar
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-black">
              Kategoriler
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" className="text-gray-600 hover:text-black">
                  <Link href="/favorites">Favoriler</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-black">
                      Hesabım
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Link href="/profile" className="w-full">
                        Profilim
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/my-artworks" className="w-full">
                        Eserlerim
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/settings" className="w-full">
                        Ayarlar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <button className="w-full text-left" onClick={() => setIsLoggedIn(false)}>
                        Çıkış Yap
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Giriş Yap</Link>
                </Button>
                <Button asChild className="bg-black text-white hover:bg-gray-800">
                  <Link href="/auth/register">Üye Ol</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
