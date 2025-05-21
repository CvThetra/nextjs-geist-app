"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Dijital Sanat Galerisi
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Modern sanatın dijital dünyasını keşfedin. Benzersiz eserler, yetenekli sanatçılar ve sınırsız yaratıcılık.
          </p>
          <div className="space-x-4">
            <Button asChild className="bg-black text-white hover:bg-gray-800">
              <Link href="/gallery">Galeriyi Keşfet</Link>
            </Button>
            <Button asChild variant="outline" className="border-black text-black hover:bg-gray-100">
              <Link href="/auth/register">Üye Ol</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Özelliklerimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Dijital Sanat</CardTitle>
                <CardDescription>
                  Resim, heykel, fotoğraf ve daha fazlası
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Çeşitli kategorilerde benzersiz dijital sanat eserlerini keşfedin ve koleksiyonunuza ekleyin.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Sanatçı Profilleri</CardTitle>
                <CardDescription>
                  Yetenekli sanatçılarla tanışın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sanatçıların profillerini inceleyin, eserlerini görün ve onlarla iletişime geçin.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Kolay Satın Alma</CardTitle>
                <CardDescription>
                  Güvenli ve hızlı işlemler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Beğendiğiniz eserleri güvenli bir şekilde satın alın ve koleksiyonunuza ekleyin.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Hemen Başlayın
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Dijital sanat dünyasının bir parçası olun. Ücretsiz üye olun ve hemen keşfetmeye başlayın.
          </p>
          <Button asChild className="bg-black text-white hover:bg-gray-800">
            <Link href="/auth/register">Üye Ol</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
