import { NextResponse } from 'next/server'
import { backupMemoryFiles, listFiles, findOrCreateFolder, syncProjectToDrive } from '@/lib/drive'

export async function POST() {
  try {
    const result = await backupMemoryFiles()
    return NextResponse.json({ 
      success: true, 
      message: `Backed up ${result.length} files`,
      files: result.map(f => ({ name: f.name, id: f.id }))
    })
  } catch (error) {
    console.error('Backup failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Backup failed' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const files = await listFiles()
    return NextResponse.json({ files })
  } catch (error) {
    console.error('List failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'List failed' 
    }, { status: 500 })
  }
}
