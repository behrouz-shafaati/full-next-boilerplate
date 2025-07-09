import PostList from '../list'

type props = {
  query: string
  page?: string | number
}

export default function DefaultPageBlog({ page, query }: props) {
  return (
    <div className="max-w-6xl m-auto py-4">
      <PostList page={Number(page)} query={query} />
    </div>
  )
}
