'use client'

import { useState, useEffect } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Plus, Calendar, Tag, Folder } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string | null
  status: string
}

interface Item {
  id: string
  title: string
  description: string | null
  type: string
  status: string
  priority: string
  tags: string
  dueDate: string | null
  projectId: string | null
  parentId: string | null
  project: Project | null
  subtasks: Item[]
}

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-100' },
  { id: 'todo', title: 'To Do', color: 'bg-blue-50' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-50' },
  { id: 'done', title: 'Done', color: 'bg-green-50' },
]

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-orange-100 text-orange-800',
  low: 'bg-gray-100 text-gray-800',
}

export function KanbanBoard() {
  const [items, setItems] = useState<Item[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [newItemOpen, setNewItemOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    priority: 'medium',
    projectId: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [itemsRes, projectsRes] = await Promise.all([
        fetch('/api/items'),
        fetch('/api/projects'),
      ])
      const itemsData = await itemsRes.json()
      const projectsData = await projectsRes.json()
      setItems(itemsData)
      setProjects(projectsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    if (source.droppableId === destination.droppableId) return

    const newStatus = destination.droppableId
    
    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item.id === draggableId ? { ...item, status: newStatus } : item
      )
    )

    // Update in database
    try {
      await fetch(`/api/items/${draggableId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
    } catch (error) {
      console.error('Failed to update item:', error)
      fetchData() // Revert on error
    }
  }

  const createItem = async () => {
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newItem,
          status: 'todo',
          projectId: newItem.projectId || null,
        }),
      })
      if (res.ok) {
        setNewItemOpen(false)
        setNewItem({ title: '', description: '', priority: 'medium', projectId: '' })
        fetchData()
      }
    } catch (error) {
      console.error('Failed to create item:', error)
    }
  }

  const getItemsByStatus = (status: string) =>
    items.filter((item) => item.status === status && !item.parentId)

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between bg-white">
        <div>
          <h1 className="text-2xl font-bold">2nd Brain</h1>
          <p className="text-sm text-gray-500">Track memories, documents, and tasks</p>
        </div>
        <Dialog open={newItemOpen} onOpenChange={setNewItemOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Enter title..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Enter description..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={newItem.priority}
                  onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
                  className="w-full border rounded-md p-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Project</label>
                <select
                  value={newItem.projectId}
                  onChange={(e) => setNewItem({ ...newItem, projectId: e.target.value })}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">No Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={createItem} className="w-full">
                Create Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 p-6 min-w-max">
            {COLUMNS.map((column) => (
              <div key={column.id} className="w-80">
                <Card className={`${column.color} border-0`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      {column.title}
                      <Badge variant="secondary">
                        {getItemsByStatus(column.id).length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Droppable droppableId={column.id}>
                      {(provided) => (
                        <ScrollArea className="h-[calc(100vh-220px)]">
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="space-y-3"
                          >
                            {getItemsByStatus(column.id).map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <Card className="bg-white cursor-grab active:cursor-grabbing">
                                      <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                          <h3 className="font-medium text-sm">
                                            {item.title}
                                          </h3>
                                          <Badge
                                            className={PRIORITY_COLORS[item.priority]}
                                            variant="secondary"
                                          >
                                            {item.priority}
                                          </Badge>
                                        </div>
                                        {item.description && (
                                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                            {item.description}
                                          </p>
                                        )}
                                        <div className="flex flex-wrap gap-2 mt-3">
                                          {item.project && (
                                            <Badge variant="outline" className="text-xs">
                                              <Folder className="w-3 h-3 mr-1" />
                                              {item.project.name}
                                            </Badge>
                                          )}
                                          {item.tags &&
                                            item.tags.split(',').map((tag) => (
                                              <Badge
                                                key={tag}
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                <Tag className="w-3 h-3 mr-1" />
                                                {tag.trim()}
                                              </Badge>
                                            ))}
                                        </div>
                                        {item.dueDate && (
                                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(item.dueDate).toLocaleDateString()}
                                          </div>
                                        )}
                                        {item.subtasks.length > 0 && (
                                          <div className="mt-2 text-xs text-gray-500">
                                            {item.subtasks.filter((s) => s.status === 'done').length}/{item.subtasks.length} subtasks
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </ScrollArea>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}
