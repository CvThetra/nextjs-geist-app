import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { artworks: true }
        }
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Kategoriler yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// POST new category
export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Kategori adı gereklidir' },
        { status: 400 }
      )
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Bu kategori zaten mevcut' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        description
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Kategori oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT update category
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Kategori ID\'si gereklidir' },
        { status: 400 }
      )
    }

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Kategori adı gereklidir' },
        { status: 400 }
      )
    }

    // Check if updated name conflicts with existing category
    const existingCategory = await prisma.category.findFirst({
      where: {
        AND: [
          {
            name: {
              equals: name,
              mode: 'insensitive'
            }
          },
          {
            id: {
              not: parseInt(id)
            }
          }
        ]
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Bu kategori adı zaten kullanımda' },
        { status: 400 }
      )
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description
      },
      include: {
        _count: {
          select: { artworks: true }
        }
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Kategori güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE category
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Kategori ID\'si gereklidir' },
        { status: 400 }
      )
    }

    // Check if category has artworks
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { artworks: true }
        }
      }
    })

    if (category?._count.artworks > 0) {
      return NextResponse.json(
        { error: 'Bu kategoride eserler bulunduğu için silinemez' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json(
      { message: 'Kategori başarıyla silindi' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Kategori silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
