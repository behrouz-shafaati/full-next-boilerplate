import { BreadCrumb } from '@/components/breadcrumb'
import PostTable from '@/components/tables/post'
const breadcrumbItems = [{ title: 'مطالب', link: '/dashboard/categories' }]

interface PageProps {
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}

async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const { query = '', page = '1' } = resolvedSearchParams

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <PostTable query={query} page={Number(page)} />
    </div>
  )
}

export default Page

// import { BreadCrumb } from '@/components/breadcrumb'
// import PostTable from '@/components/tables/post'
// import { headers } from 'next/headers'

// const breadcrumbItems = [{ title: 'مطالب', link: '/dashboard/posts' }]

// const Page = async () => {
//   const headersList = await headers()

//   const protocol = headersList.get('x-forwarded-proto') || 'http'
//   const host = headersList.get('host') || 'localhost:3000'
//   const path = headersList.get('x-invoke-path') || '/dashboard/posts'
//   const url = new URL(`${protocol}://${host}${path}`)

//   const page = Number(url.searchParams.get('page')) || 1
//   const query = url.searchParams.get('query') || ''

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <BreadCrumb items={breadcrumbItems} />
//       <PostTable query={query} page={page} />
//     </div>
//   )
// }

// export default Page
