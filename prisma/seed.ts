import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create projects
  const houseScreener = await prisma.project.create({
    data: {
      name: 'House Screener',
      description: 'UK property search tool with amenity filtering — find homes by schools, commute, pubs, and more.',
      status: 'active',
    },
  })

  const coffeeProduct = await prisma.project.create({
    data: {
      name: 'Coffee Product',
      description: 'Building a new coffee product. Formulation help needed.',
      status: 'active',
    },
  })

  const secondBrain = await prisma.project.create({
    data: {
      name: '2nd Brain System',
      description: 'Personal knowledge management system with kanban board for tracking memories, documents, and tasks.',
      status: 'active',
    },
  })

  // Create items for House Screener
  await prisma.item.createMany({
    data: [
      {
        title: 'Review MVP architecture document',
        description: 'Go through mvp-architecture.md and confirm technical decisions',
        type: 'task',
        status: 'done',
        priority: 'high',
        projectId: houseScreener.id,
        source: 'file',
        filePath: 'projects/house-screener/mvp-architecture.md',
      },
      {
        title: 'Connect real property listings API',
        description: 'Sign up for Zoopla or Rightmove API, or implement scraping solution',
        type: 'task',
        status: 'todo',
        priority: 'high',
        projectId: houseScreener.id,
      },
      {
        title: 'Integrate DfE Schools API',
        description: 'Add real school data with Ofsted ratings',
        type: 'task',
        status: 'todo',
        priority: 'medium',
        projectId: houseScreener.id,
      },
      {
        title: 'Add TfL transport data',
        description: 'Connect to TfL API for real-time transport info',
        type: 'task',
        status: 'todo',
        priority: 'medium',
        projectId: houseScreener.id,
      },
      {
        title: 'Build amenity filters (gyms, pubs, supermarkets)',
        description: 'Use HERE Places API or similar for amenity data',
        type: 'task',
        status: 'todo',
        priority: 'low',
        projectId: houseScreener.id,
      },
    ],
  })

  // Create items for Coffee Product
  await prisma.item.createMany({
    data: [
      {
        title: 'Define product concept',
        description: 'What type of coffee product? (cold brew, specialty beans, pods, etc.)',
        type: 'task',
        status: 'todo',
        priority: 'high',
        projectId: coffeeProduct.id,
      },
      {
        title: 'Outline formulation requirements',
        description: 'Document taste profile, sourcing requirements, production constraints',
        type: 'task',
        status: 'todo',
        priority: 'high',
        projectId: coffeeProduct.id,
      },
      {
        title: 'Identify sourcing partners',
        description: 'Research coffee bean suppliers and roasting partners',
        type: 'task',
        status: 'todo',
        priority: 'medium',
        projectId: coffeeProduct.id,
      },
      {
        title: 'Create testing plan',
        description: 'Define testing criteria and timeline for product samples',
        type: 'task',
        status: 'todo',
        priority: 'medium',
        projectId: coffeeProduct.id,
      },
    ],
  })

  // Create items for 2nd Brain
  await prisma.item.createMany({
    data: [
      {
        title: 'Initialize Next.js project with shadcn/ui',
        description: 'Set up the foundation with TypeScript, Tailwind, and shadcn components',
        type: 'task',
        status: 'done',
        priority: 'high',
        projectId: secondBrain.id,
      },
      {
        title: 'Set up Prisma with SQLite',
        description: 'Configure database schema and migrations',
        type: 'task',
        status: 'done',
        priority: 'high',
        projectId: secondBrain.id,
      },
      {
        title: 'Build kanban board UI',
        description: 'Create drag-and-drop kanban with To Do / In Progress / Done columns',
        type: 'task',
        status: 'in_progress',
        priority: 'high',
        projectId: secondBrain.id,
      },
      {
        title: 'Add CRUD operations for items',
        description: 'Create, read, update, delete tasks with forms and dialogs',
        type: 'task',
        status: 'todo',
        priority: 'high',
        projectId: secondBrain.id,
      },
      {
        title: 'Implement subtasks support',
        description: 'Allow items to have nested subtasks',
        type: 'task',
        status: 'todo',
        priority: 'medium',
        projectId: secondBrain.id,
      },
      {
        title: 'Add tags and filtering',
        description: 'Tag system with filter sidebar',
        type: 'task',
        status: 'todo',
        priority: 'medium',
        projectId: secondBrain.id,
      },
      {
        title: 'Add search functionality',
        description: 'Full-text search across items using Fuse.js',
        type: 'task',
        status: 'todo',
        priority: 'low',
        projectId: secondBrain.id,
      },
    ],
  })

  // Create general improvement items (no project)
  await prisma.item.createMany({
    data: [
      {
        title: 'Configure Brave Search API',
        description: 'Add BRAVE_API_KEY for real-time market data in morning briefs',
        type: 'task',
        status: 'todo',
        priority: 'medium',
        source: 'memory',
      },
      {
        title: 'Establish weekly project review rhythm',
        description: '15-min review every Friday to track progress and adjust priorities',
        type: 'task',
        status: 'todo',
        priority: 'low',
        source: 'memory',
      },
    ],
  })

  // Create documents
  await prisma.document.createMany({
    data: [
      {
        name: 'House Screener README',
        path: 'projects/house-screener/README.md',
        type: 'md',
        projectId: houseScreener.id,
      },
      {
        name: 'MVP Architecture',
        path: 'projects/house-screener/mvp-architecture.md',
        type: 'md',
        projectId: houseScreener.id,
      },
      {
        name: 'API Research',
        path: 'projects/house-screener/api-research.md',
        type: 'md',
        projectId: houseScreener.id,
      },
      {
        name: 'Coffee Product README',
        path: 'projects/coffee-product/README.md',
        type: 'md',
        projectId: coffeeProduct.id,
      },
    ],
  })

  console.log('Seeding complete!')
  console.log(`Created projects: ${houseScreener.name}, ${coffeeProduct.name}, ${secondBrain.name}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
