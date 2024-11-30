'use server'

import { createConnection, createConnection2 } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export type Game = {
  app_id: number
  name: string
  release_date: string
  required_age: string
  price: number
  windows: string
  mac: string
  linux: string
}

export async function getGamesFromDb1(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit
  const conn = await createConnection()

  const [rows] = await conn.query(
  `SELECT * FROM games LIMIT ${limit} OFFSET ${offset}`
  );

  const [countResult] = await conn.execute('SELECT COUNT(*) as count FROM games')
  const totalCount = (countResult as any)[0].count

  await conn.end()

  return {
    games: rows as Game[],
    totalPages: Math.ceil(totalCount / limit)
  }
}

export async function getGamesFromDb2(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit
  const conn = await createConnection2()
  
  const [rows] = await conn.query(
  `SELECT * FROM games LIMIT ${limit} OFFSET ${offset}`
  );
  
  const [countResult] = await conn.execute('SELECT COUNT(*) as count FROM games')
  const totalCount = (countResult as any)[0].count
  
  await conn.end()
  
  return {
    games: rows as Game[],
    totalPages: Math.ceil(totalCount / limit)
  }
}

export async function updateGame(db: number, gameId: number, data: Partial<Game>) {
  const conn = db === 1 ? await createConnection() : await createConnection2()
  
  const setClauses = Object.keys(data)
    .map(key => `${key} = ?`)
    .join(', ')
  
  const values = [...Object.values(data), gameId]
  
  await conn.execute(
    `UPDATE games SET ${setClauses} WHERE app_id = ?`,
    values
  )
  
  await conn.end()
  revalidatePath('/')
}

export async function deleteGame(db: number, gameId: number) {
  const conn = db === 1 ? await createConnection() : await createConnection2()
  
  await conn.execute(
    'DELETE FROM games WHERE app_id = ?',
    [gameId]
  )
  
  await conn.end()
  revalidatePath('/')
}

