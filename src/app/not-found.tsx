import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mt-4">Sayfa Bulunamadı</h2>
        <p className="text-gray-600 mt-4 mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. Ana sayfaya dönerek devam edebilirsiniz.
        </p>
        <Button asChild className="bg-black text-white hover:bg-gray-800">
          <Link href="/">
            Ana Sayfaya Dön
          </Link>
        </Button>
      </div>
    </div>
  )
}
