import { backupMemoryFiles } from './lib/drive'

async function runBackup() {
  try {
    console.log('Starting daily memory backup...')
    const result = await backupMemoryFiles()
    console.log(`✓ Backed up ${result.length} files to Google Drive`)
    process.exit(0)
  } catch (error) {
    console.error('Backup failed:', error)
    process.exit(1)
  }
}

runBackup()
