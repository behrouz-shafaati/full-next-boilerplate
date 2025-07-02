import { Post } from '../../interface'
import VerticalCard from './VerticalCard'
import HorizontalCard from './HorizontalCard'

type Props = {
  post: Post
  variant?: 'Horizon' | 'Vertical'
}

const PostCard = ({ post, variant = 'Vertical' }: Props) => {
  const cardProps = {
    imageUrl: post?.image?.src,
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
  }
  return variant === 'Horizon' ? (
    <HorizontalCard {...cardProps} />
  ) : (
    <VerticalCard {...cardProps} />
  )
}

export default PostCard
