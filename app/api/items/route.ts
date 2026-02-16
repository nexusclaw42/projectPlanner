import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: {
        project: true,
        subtasks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const item = await prisma.item.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type || 'task',
        status: body.status || 'todo',
        priority: body.priority || 'medium',
        tags: body.tags || '',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        projectId: body.projectId || null,
        parentId: body.parentId || null,
        source: body.source || 'manual',
        filePath: body.filePath || null,
      },
      include: {
        project: true,
        subtasks: true,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}
