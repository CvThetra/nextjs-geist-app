import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET all artworks with filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const artist = searchParams.get('artist')

    const where = {
      AND: [
        category ? { category: { name: category } } : {},
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        artist ? { user: { username: artist } } : {}
      ]
    }

    const artworks = await prisma.artwork.findMany({
      where,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(artworks)
  } catch (error) {
    console.error('Error fetching artworks:', error)
    return NextResponse.json(
      { error: 'Eserler yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// POST new artwork
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { title, description, imageUrl, categoryId, userId, price, stock } = data

    // Validate required fields
    if (!title || !imageUrl || !categoryId || !userId || !price) {
      return NextResponse.json(
        { error: 'Tüm gerekli alanları doldurunuz' },
        { status: 400 }
      )
    }

    const artwork = await prisma.artwork.create({
      data: {
        title,
        description,
        imageUrl,
        categoryId,
        userId,
        price,
        stock: stock || 1,
        saleStatus: 'available'
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(artwork, { status: 201 })
  } catch (error) {
    console.error('Error creating artwork:', error)
    return NextResponse.json(
      { error: 'Eser oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT update artwork
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Eser ID\'si gereklidir' },
        { status: 400 }
      )
    }

    const data = await request.json()
    const { title, description, imageUrl, categoryId, price, stock, saleStatus } = data

    const artwork = await prisma.artwork.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        imageUrl,
        categoryId,
        price,
        stock,
        saleStatus
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(artwork)
  } catch (error) {
    console.error('Error updating artwork:', error)
    return NextResponse.json(
      { error: 'Eser güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE artwork
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Eser ID\'si gereklidir' },
        { status: 400 }
      )
    }

    await prisma.artwork.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json(
      { message: 'Eser başarıyla silindi' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting artwork:', error)
    return NextResponse.json(
      { error: 'Eser silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
