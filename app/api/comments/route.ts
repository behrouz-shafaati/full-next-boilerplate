// import { cookies } from 'next/headers'
// import { decrypt } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getArticleComments } from '@/features/article-comment/actions'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const articleId = searchParams.get('article')

    if (!articleId) {
      return NextResponse.json(
        { error: 'articleId is required' },
        { status: 400 }
      )
    }

    //   const cookieStore = await cookies()
    // const session = cookieStore.get('session')?.value
    // if (!session) {
    //   return Response.json(null)
    // }
    // return Response.json(await decrypt(session))

    const commentsResult = await getArticleComments({
      filters: { article: articleId },
    })
    return NextResponse.json(commentsResult)
  } catch (err) {
    console.error('Error fetching comments:', err)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
