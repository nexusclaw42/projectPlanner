import { NextRequest, NextResponse } from 'next/server'

// Mock data storage (in-memory for Vercel)
const mockItems: any[] = []

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Find and update item
    const itemIndex = mockItems.findIndex(item => item.id === id)
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    mockItems[itemIndex] = {
      ...mockItems[itemIndex],
      ...body,
      id, // keep original id
    }
    
    return NextResponse.json(mockItems[itemIndex])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const itemIndex = mockItems.findIndex(item => item.id === id)
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    mockItems.splice(itemIndex, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
