import { getPosts } from '@/features/post/actions'
import categoryCtrl from '../../controller'
import PostHorizontalCard from '@/components/builder-canvas/shared-blocks/PostList/designs/ArticalHorizontalCard'

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
    return <>هیچ مطلب ای با این دسته بندی ثبت نشده است!</>
  const posts = postsResult.data
  const postItems = posts.map((post) => {
    return (
      <PostHorizontalCard
        key={post.id}
        post={post}
        options={{ showExcerpt: true }}
      />
    )
  })
}
