'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { getTranslation } from '@/lib/utils'
import { Block } from '@/components/builder-canvas/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PostCover } from '@/components/post/cover'
import { PostTitle } from '@/components/post/title'
import PostHorizontalCard from './ArticalHorizontalCard'
import { PostExcerpt } from '@/components/post/excerpt'
import { useDeviceType } from '@/hooks/use-device-type'
import PostOverlayCard from './OverlayCard'

type PostListProps = {
  posts: Post[]
  showMoreHref: string
  postItems: any
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
} & React.HTMLAttributes<HTMLDivElement>

export const PostListSpotlight = ({
  posts,
  showMoreHref,
  postItems,
  blockData,
  ...props
}: PostListProps) => {
  if (!posts?.length) return null
  const { settings } = blockData
  const firstPost = posts[0]
  const otherPosts = posts.slice(1)

  return (
    <div {...props}>
      <div className="w-full flex flex-col gap-6 my-6">
        {/* ---- Featured (اولی) ---- */}
        <PostOverlayCard
          post={firstPost}
          direction="column"
          options={settings}
        />

        {/* ---- Grid پایین ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherPosts.map((post) => {
            const t = getTranslation({ translations: post.translations })
            return (
              <PostOverlayCard
                post={post}
                direction="column"
                options={settings}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
