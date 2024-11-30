import {getGamesFromDb1, getGamesFromDb2} from './actions'
import {GamesList} from '@/components/games-list'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

export default async function Page({
                                     searchParams,
                                   }: {
  searchParams: { page?: string; db?: string }
}) {
  const currentPage = Number(searchParams.page) || 1
  const currentDb = searchParams.db === '2' ? '2' : '1'

  const {games: gamesDb1, totalPages: totalPagesDb1} = await getGamesFromDb1(currentPage)
  const {games: gamesDb2, totalPages: totalPagesDb2} = await getGamesFromDb2(currentPage)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Games Database</h1>

      <Tabs defaultValue={currentDb} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="1">Games before 2021</TabsTrigger>
          <TabsTrigger value="2">Games on and after 2021</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <GamesList
            games={gamesDb1}
            currentPage={currentPage}
            totalPages={totalPagesDb1}
            dbNumber={1}
          />
        </TabsContent>
        <TabsContent value="2">
          <GamesList
            games={gamesDb2}
            currentPage={currentPage}
            totalPages={totalPagesDb2}
            dbNumber={2}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

