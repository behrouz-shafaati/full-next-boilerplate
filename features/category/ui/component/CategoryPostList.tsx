import { getPosts } from '@/features/post/actions'
import categoryCtrl from '../../controller'
import PostList from '@/components/archive/PostList'

type Prop = {
  slug: string
}
export default async function CategoryPostList({ slug }: Prop) {
  const category = await categoryCtrl.find({ filters: { slug } })
  console.log('#2134 category:', category)
  if (category.data.length == 0) return <>دسته ی مورد نظر یافت نشد!</>
  const [postsResult] = await Promise.all([
    getPosts({
      filters: { categories: [category.data[0].id] },
    }),
  ])

  if (postsResult.data.length == 0)
    return <>هیچ مقاله ای با این دسته بندی ثبت نشده است!</>
  return <PostList posts={postsResult.data} />
}
