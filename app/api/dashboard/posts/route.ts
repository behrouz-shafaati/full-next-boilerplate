import { NextResponse } from 'next/server'
import { parseQuery } from '@/lib/utils'
import articleCtrl from '@/features/article/controller'

export async function GET(req: Request) {
  try {
    const query = parseQuery(req)

    const articleResult = await articleCtrl.find(query)
    return NextResponse.json(articleResult)
  } catch (err) {
    console.error('Error fetching comments:', err)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
