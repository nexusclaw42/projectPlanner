'use client'

import dynamic from 'next/dynamic'

const KanbanBoard = dynamic(
  () => import('@/components/kanban-board').then(mod => mod.KanbanBoard),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-screen">Loading...</div> }
)

export default function Home() {
  return <KanbanBoard />
}
