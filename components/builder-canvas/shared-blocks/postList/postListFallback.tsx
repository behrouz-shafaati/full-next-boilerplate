// کامپوننت نمایشی فال بک بلاک
import React from 'react'
import { Block } from '../../types'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { PostListColumn } from './designs/PostListColumn'
import { PostListRow } from './designs/PostListRow'
import PostImageCard from './designs/ImageCard'
import PostOverlayCard from './designs/OverlayCard'
import PostHorizontalCard from './designs/ArticalHorizontalCard'

type PostListProps = {
  posts: Post[]
  blockData: {
    id: string
    type: 'postList'
    content: {
      tags: Option[]
      categories: Option[]
    }
    settings: {
      design: 'simple' | 'parallax'
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostListFallback = ({
  posts,
  blockData,
  ...props
}: PostListProps) => {
  const locale = 'fa'
  const { content, settings } = blockData

  let showMoreHref = 'archive'
  // showMoreHref =
  //   selectedTag != ''
  //     ? showMoreHref + '/' + buildUrlFromFilters({ tags: [selectedTag] })
  //     : showMoreHref

  let postItems = []

  switch (settings?.cardDesign) {
    case 'overly-card':
      postItems = posts.map((post) => {
        return <PostOverlayCard key={post.id} post={post} options={settings} />
      })
      break
    case 'horizontal-card':
      postItems = posts.map((post) => {
        return (
          <PostHorizontalCard key={post.id} post={post} options={settings} />
        )
      })
      break
    default:
      postItems = posts.map((post) => {
        return <PostImageCard key={post.id} post={post} options={settings} />
      })
  }
  switch (settings?.listDesign) {
    case 'row':
      return (
        <PostListRow
          posts={posts}
          blockData={blockData}
          showMoreHref={showMoreHref}
          postItems={postItems}
          {...props}
        />
      )
    default:
      return (
        <PostListColumn
          posts={posts}
          postItems={postItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          {...props}
        />
      )
  }
}
