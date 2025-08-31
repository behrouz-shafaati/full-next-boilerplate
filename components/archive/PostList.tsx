import { Post } from '@/features/post/interface'
import PostListItem from './default/post-list-item'

type Prop = {
  posts: Post[]
}
export default function PostList({ posts }: Prop) {
  return (
    <>
      {posts.map((post: Post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </>
  )
}
