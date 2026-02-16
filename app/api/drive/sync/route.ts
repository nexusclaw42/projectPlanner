import { NextRequest, NextResponse } from 'next/server'
import { syncProjectToDrive } from '@/lib/drive'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectName, localPath } = body
    
    if (!projectName || !localPath) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing projectName or localPath' 
      }, { status: 400 })
    }
    
    const result = await syncProjectToDrive(projectName, localPath)
    return NextResponse.json({ 
      success: true, 
      message: `Synced ${result.length} files`,
      files: result.map(f => ({ name: f.name, id: f.id }))
    })
  } catch (error) {
    console.error('Sync failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Sync failed' 
    }, { status: 500 })
  }
}
