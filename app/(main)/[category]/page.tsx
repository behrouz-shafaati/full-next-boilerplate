import DefaultPageBlog from '@/features/post/ui/page'

interface PageProps {
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const { query = '', page = '1' } = resolvedSearchParams

  return <DefaultPageBlog query={query} page={page} />
}
