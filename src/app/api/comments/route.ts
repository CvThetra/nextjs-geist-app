import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET comments for an artwork
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const artworkId = searchParams.get('artworkId')

    if (!artworkId) {
      return NextResponse.json(
        { error: 'Eser ID\'si gereklidir' },
        { status: 400 }
      )
    }

    const comments = await prisma.comment.findMany({
      where: {
        artworkId: parseInt(artworkId)
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Yorumlar yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// POST new comment
export async function POST(request: Request) {
  try {
    const { userId, artworkId, comment } = await request.json()

    if (!userId || !artworkId || !comment) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurunuz' },
        { status: 400 }
      )
    }

    // Validate comment length
    if (comment.trim().length < 1) {
      return NextResponse.json(
        { error: 'Yorum boş olamaz' },
        { status: 400 }
      )
    }

    const newComment = await prisma.comment.create({
      data: {
        userId: parseInt(userId),
        artworkId: parseInt(artworkId),
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Yorum eklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE comment
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('id')
    const userId = searchParams.get('userId') // For authorization

    if (!commentId || !userId) {
      return NextResponse.json(
        { error: 'Yorum ve kullanıcı ID\'si gereklidir' },
        { status: 400 }
      )
    }

    // Check if user owns the comment or is an admin
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
      include: {
        user: {
          select: {
            id: true,
            role: true
          }
        }
      }
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Yorum bulunamadı' },
        { status: 404 }
      )
    }

    // Only allow comment owner or admin to delete
    if (comment.userId !== parseInt(userId) && comment.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    await prisma.comment.delete({
      where: { id: parseInt(commentId) }
    })

    return NextResponse.json(
      { message: 'Yorum başarıyla silindi' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Yorum silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT update comment
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('id')
    const userId = searchParams.get('userId') // For authorization

    if (!commentId || !userId) {
      return NextResponse.json(
        { error: 'Yorum ve kullanıcı ID\'si gereklidir' },
        { status: 400 }
      )
    }

    const { comment: updatedComment } = await request.json()

    if (!updatedComment || updatedComment.trim().length < 1) {
      return NextResponse.json(
        { error: 'Yorum boş olamaz' },
        { status: 400 }
      )
    }

    // Check if user owns the comment
    const existingComment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) }
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Yorum bulunamadı' },
        { status: 404 }
      )
    }

    if (existingComment.userId !== parseInt(userId)) {
      return NextResponse.json(
        { error: 'Bu yorumu düzenleme yetkiniz yok' },
        { status: 403 }
      )
    }

    const updated = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { comment: updatedComment },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Yorum güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
