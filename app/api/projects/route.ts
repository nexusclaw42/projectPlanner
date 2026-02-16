import { NextRequest, NextResponse } from 'next/server'

// Mock data for Vercel deployment (SQLite doesn't work on serverless)
const mockProjects = [
  {
    id: '1',
    name: 'House Screener',
    description: 'UK property search tool with amenity filtering',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Coffee Product',
    description: 'Building a new coffee product',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: '2nd Brain System',
    description: 'Personal knowledge management system',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(mockProjects)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const project = {
      id: Date.now().toString(),
      name: body.name,
      description: body.description,
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockProjects.push(project)
    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
