'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import { PostList } from './PostList'
import { Option } from '@/types'
import { getPosts } from '@/features/post/actions'
import EmptyBlock from '../../components/EmptyBlock'

type PostListBlockProps = {
  widgetName: string
  blockData: {
    id: string
    type: 'postList'
    content: {
      tags: Option[]
      categories: Option[]
    }
    settings: {
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export default function PostListBlockEditor({
  widgetName,
  blockData,
  ...props
}: PostListBlockProps) {
  const [posts, setPosts] = useState([])
  const { content, settings } = blockData

  useEffect(() => {
    const fetchData = async () => {
      const tagIds = content?.tags?.map((tag: Option) => tag.value)
      const categoryIds = content?.categories?.map((tag: Option) => tag.value)

      let filters
      if (settings?.showNewest == true) {
        filters = {}
      } else {
        filters = { tags: tagIds[0] }
      }

      if (categoryIds?.length > 0)
        filters = { categories: categoryIds, ...filters }

      const [result] = await Promise.all([
        getPosts({
          filters,
          pagination: { page: 1, perPage: settings?.countOfPosts || 6 },
        }),
      ])

      const posts = result.data
      setPosts(posts)
      console.log('#89782345 posts:', posts)
    }

    fetchData()
  }, [content, settings?.countOfPosts, settings?.showNewest])
  if (posts?.length == 0)
    return <EmptyBlock widgetName={widgetName} {...props} />
  return <PostList posts={posts} blockData={blockData} {...props} />
}
