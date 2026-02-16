import { NextRequest, NextResponse } from 'next/server'

// Mock data for Vercel deployment
const mockItems = [
  // House Screener tasks
  { id: '1', title: 'Connect real property listings API', description: 'Sign up for Zoopla or Rightmove API', type: 'task', status: 'backlog', priority: 'high', tags: '', dueDate: null, projectId: '1', parentId: null, subtasks: [] },
  { id: '2', title: 'Integrate DfE Schools API', description: 'Add real school data with Ofsted ratings', type: 'task', status: 'backlog', priority: 'medium', tags: '', dueDate: null, projectId: '1', parentId: null, subtasks: [] },
  { id: '3', title: 'Add TfL transport data', description: 'Connect to TfL API for real-time transport info', type: 'task', status: 'backlog', priority: 'medium', tags: '', dueDate: null, projectId: '1', parentId: null, subtasks: [] },
  { id: '4', title: 'Build amenity filters', description: 'Use HERE Places API for amenity data', type: 'task', status: 'backlog', priority: 'low', tags: '', dueDate: null, projectId: '1', parentId: null, subtasks: [] },
  
  // Coffee Product tasks
  { id: '5', title: 'Define product concept', description: 'What type of coffee product?', type: 'task', status: 'backlog', priority: 'high', tags: '', dueDate: null, projectId: '2', parentId: null, subtasks: [] },
  { id: '6', title: 'Outline formulation requirements', description: 'Document taste profile and sourcing', type: 'task', status: 'backlog', priority: 'high', tags: '', dueDate: null, projectId: '2', parentId: null, subtasks: [] },
  { id: '7', title: 'Identify sourcing partners', description: 'Research coffee bean suppliers', type: 'task', status: 'backlog', priority: 'medium', tags: '', dueDate: null, projectId: '2', parentId: null, subtasks: [] },
  { id: '8', title: 'Create testing plan', description: 'Define testing criteria and timeline', type: 'task', status: 'backlog', priority: 'medium', tags: '', dueDate: null, projectId: '2', parentId: null, subtasks: [] },
  
  // 2nd Brain tasks
  { id: '9', title: 'Initialize Next.js project', description: 'Set up foundation with shadcn', type: 'task', status: 'done', priority: 'high', tags: '', dueDate: null, projectId: '3', parentId: null, subtasks: [] },
  { id: '10', title: 'Set up Prisma with SQLite', description: 'Configure database schema', type: 'task', status: 'done', priority: 'high', tags: '', dueDate: null, projectId: '3', parentId: null, subtasks: [] },
  { id: '11', title: 'Build kanban board UI', description: 'Create drag-and-drop kanban', type: 'task', status: 'done', priority: 'high', tags: '', dueDate: null, projectId: '3', parentId: null, subtasks: [] },
  { id: '12', title: 'Deploy to Vercel', description: 'Get the app live', type: 'task', status: 'in_progress', priority: 'high', tags: '', dueDate: null, projectId: '3', parentId: null, subtasks: [] },
  { id: '13', title: 'Add CRUD operations', description: 'Create, read, update, delete items', type: 'task', status: 'todo', priority: 'medium', tags: '', dueDate: null, projectId: '3', parentId: null, subtasks: [] },
  { id: '14', title: 'Add subtasks support', description: 'Allow nested tasks', type: 'task', status: 'todo', priority: 'medium', tags: '', dueDate: null, projectId: '3', parentId: null, subtasks: [] },
  
  // General improvements (no project)
  { id: '15', title: 'Configure Brave Search API', description: 'Add API key for market data', type: 'task', status: 'todo', priority: 'medium', tags: '', dueDate: null, projectId: null, parentId: null, subtasks: [] },
  { id: '16', title: 'Weekly project review rhythm', description: '15-min review every Friday', type: 'task', status: 'todo', priority: 'low', tags: '', dueDate: null, projectId: null, parentId: null, subtasks: [] },
]

export async function GET() {
  return NextResponse.json(mockItems)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const item = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      type: body.type || 'task',
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      tags: body.tags || '',
      dueDate: body.dueDate || null,
      projectId: body.projectId || null,
      parentId: body.parentId || null,
      subtasks: [],
    }
    mockItems.push(item)
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}
