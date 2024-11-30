'use client'

import {useState, useRef} from 'react'
import {useRouter} from 'next/navigation'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {deleteGame, type Game, updateGame} from '@/app/actions'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface GamesListProps {
  games: Game[]
  currentPage: number
  totalPages: number
  dbNumber: number
}

export function GamesList({games, currentPage, totalPages, dbNumber}: GamesListProps) {
  const router = useRouter()
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingGame) return

    const formData = new FormData(e.currentTarget)
    const data: Partial<Game> = {
      name: formData.get('name') as string,
      release_date: formData.get('release_date') as string,
      price: Number(formData.get('price')),
      required_age: formData.get('required_age') as string,
    }

    await updateGame(dbNumber, editingGame.app_id, data)
    setEditingGame(null)
    closeRef.current?.click()
    router.refresh()
  }

  const handleDelete = async (gameId: number) => {
    if (confirm('Are you sure you want to delete this game?')) {
      await deleteGame(dbNumber, gameId)
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Required Age</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.app_id}>
              <TableCell>{game.app_id}</TableCell>
              <TableCell>{game.name}</TableCell>
              <TableCell>{new Date(game.release_date).toLocaleDateString()}</TableCell>
              <TableCell>${game.price}</TableCell>
              <TableCell>{game.required_age}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setEditingGame(game)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Game</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            defaultValue={game.name}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="release_date">Release Date</Label>
                          <Input
                            id="release_date"
                            name="release_date"
                            type="date"
                            defaultValue={
                              editingGame?.release_date
                                ? new Date(editingGame.release_date)
                                  .toLocaleDateString('en-CA') // Format as YYYY-MM-DD in local time
                                : ''
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            defaultValue={game.price}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="required_age">Required Age</Label>
                          <Input
                            id="required_age"
                            name="required_age"
                            defaultValue={game.required_age}
                          />
                        </div>
                        <Button type="submit">Save Changes</Button>
                      </form>
                      <DialogClose ref={closeRef} className="hidden" />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(game.app_id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`/?page=${currentPage - 1}&db=${dbNumber}`}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          <PaginationItem>
            <span>Page {currentPage} of {totalPages}</span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={`/?page=${currentPage + 1}&db=${dbNumber}`}
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

