import { google } from 'googleapis'
import { readFileSync } from 'fs'
import path from 'path'

// Load credentials from JSON key file
const KEY_PATH = process.env.GOOGLE_DRIVE_KEY_PATH || '/data/nexusclaw42-gdrive-key.json'
const PARENT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1U246YmyqsSQLJfzgbEVOhKO5lQ-TOCVb'

let driveClient: any = null

export function getDriveClient() {
  if (driveClient) return driveClient

  const credentials = JSON.parse(readFileSync(KEY_PATH, 'utf-8'))
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  })

  driveClient = google.drive({ version: 'v3', auth })
  return driveClient
}

export async function listFiles(folderId: string = PARENT_FOLDER_ID) {
  const drive = getDriveClient()
  
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType, webViewLink, createdTime)',
  })
  
  return res.data.files || []
}

export async function createFolder(name: string, parentId: string = PARENT_FOLDER_ID) {
  const drive = getDriveClient()
  
  const fileMetadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentId],
  }
  
  const res = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id, name, webViewLink',
  })
  
  return res.data
}

export async function findOrCreateFolder(name: string, parentId: string = PARENT_FOLDER_ID) {
  const drive = getDriveClient()
  
  // Check if folder exists
  const res = await drive.files.list({
    q: `'${parentId}' in parents and name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name, webViewLink)',
  })
  
  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0]
  }
  
  // Create new folder
  return createFolder(name, parentId)
}

export async function uploadFile(
  name: string,
  content: string | Buffer,
  mimeType: string = 'text/plain',
  folderId: string = PARENT_FOLDER_ID
) {
  const drive = getDriveClient()
  
  const fileMetadata = {
    name,
    parents: [folderId],
  }
  
  const media = {
    mimeType,
    body: typeof content === 'string' ? Buffer.from(content) : content,
  }
  
  const res = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, name, webViewLink',
  })
  
  return res.data
}

export async function syncProjectToDrive(
  projectName: string,
  localPath: string,
  dateFolder?: string
) {
  // Find or create project folder
  const projectFolder = await findOrCreateFolder(projectName)
  
  let targetFolderId = projectFolder.id!
  
  // If date folder specified, create subfolder
  if (dateFolder) {
    const dateSubfolder = await findOrCreateFolder(dateFolder, projectFolder.id!)
    targetFolderId = dateSubfolder.id!
  }
  
  // Read local files and upload
  const fs = await import('fs')
  const files = fs.readdirSync(localPath)
  
  const uploaded = []
  for (const file of files) {
    const filePath = path.join(localPath, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isFile()) {
      const content = fs.readFileSync(filePath)
      const result = await uploadFile(file, content, 'text/plain', targetFolderId)
      uploaded.push(result)
    }
  }
  
  return uploaded
}

export async function backupMemoryFiles() {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const memoryPath = '/data/.openclaw/workspace/memory'
  const fs = await import('fs')
  
  // Check if memory folder exists
  if (!fs.existsSync(memoryPath)) {
    console.log('No memory folder found')
    return []
  }
  
  // Find or create Backups folder
  const backupsFolder = await findOrCreateFolder('Backups')
  
  // Create today's backup folder
  const todayFolder = await findOrCreateFolder(today, backupsFolder.id!)
  
  // Upload all memory files
  const files = fs.readdirSync(memoryPath)
  const uploaded = []
  
  for (const file of files) {
    const filePath = path.join(memoryPath, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isFile()) {
      const content = fs.readFileSync(filePath)
      const result = await uploadFile(file, content, 'text/plain', todayFolder.id!)
      uploaded.push(result)
    }
  }
  
  console.log(`Backed up ${uploaded.length} files to Drive/Backups/${today}/`)
  return uploaded
}
