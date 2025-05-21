"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dijital Sanat</h3>
            <p className="text-gray-600 text-sm">
              Modern ve etkileyici dijital sanat galerisi. Sanatçılar ve sanatseverler için benzersiz bir platform.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/gallery" className="text-gray-600 hover:text-black text-sm">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-gray-600 hover:text-black text-sm">
                  Sanatçılar
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-black text-sm">
                  Kategoriler
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Destek</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-black text-sm">
                  SSS
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-black text-sm">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-black text-sm">
                  Gizlilik Politikası
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">İletişim</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">
                Email: info@dijitalsanat.com
              </li>
              <li className="text-gray-600 text-sm">
                Tel: +90 (212) 123 45 67
              </li>
              <li className="text-gray-600 text-sm">
                Adres: İstanbul, Türkiye
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-12 pt-8">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Dijital Sanat Galerisi. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
