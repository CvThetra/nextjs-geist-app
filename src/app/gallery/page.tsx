"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

type Artwork = {
  id: number
  title: string
  description: string
  imageUrl: string
  price: number
  artist: string
  category: string
}

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  // Dummy data - will be replaced with actual data from the database
  const dummyArtworks: Artwork[] = [
    {
      id: 1,
      title: "Dijital Soyut",
      description: "Modern soyut sanat eseri",
      imageUrl: "https://source.unsplash.com/random/800x600/?abstract",
      price: 1500,
      artist: "Ahmet Yılmaz",
      category: "Soyut"
    },
    // More artworks will be added here
  ]

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Sanat Galerisi</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Eser veya sanatçı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Kategoriler</SelectItem>
                <SelectItem value="abstract">Soyut Sanat</SelectItem>
                <SelectItem value="portrait">Portre</SelectItem>
                <SelectItem value="landscape">Manzara</SelectItem>
                <SelectItem value="digital">Dijital Sanat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyArtworks.map((artwork) => (
            <Card key={artwork.id} className="overflow-hidden border-2">
              <div className="aspect-square relative">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{artwork.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{artwork.description}</p>
                <p className="text-sm text-gray-500">Sanatçı: {artwork.artist}</p>
                <p className="text-sm text-gray-500">Kategori: {artwork.category}</p>
                <p className="font-bold mt-2">{artwork.price} TL</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="w-full mr-2">
                  Detaylar
                </Button>
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Satın Al
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" className="border-black text-black hover:bg-gray-100">
            Daha Fazla Göster
          </Button>
        </div>
      </div>
    </div>
  )
}
