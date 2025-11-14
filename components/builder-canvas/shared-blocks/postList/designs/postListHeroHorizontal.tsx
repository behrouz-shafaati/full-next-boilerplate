'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { getTranslation } from '@/lib/utils'
import { Block } from '@/components/builder-canvas/types'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { PostCover } from '@/components/post/cover'
import { PostTitle } from '@/components/post/title'
import PostHorizontalCard from './ArticalHorizontalCard'
import { PostExcerpt } from '@/components/post/excerpt'
import { useDeviceType } from '@/hooks/use-device-type'
import PostOverlayCard from './OverlayCard'
import PostImageCard from './ImageCard'
import VerticalPostCard from '@/components/post/vertical-card'

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

export const PostListHeroHorizontal = ({
  posts,
  showMoreHref,
  postItems,
  blockData,
  ...props
}: PostListProps) => {
  const { settings } = blockData
  const firstPost = posts[0]

  return (
    <div className="container mx-auto p-4" {...props}>
      {/* Layout: desktop: 2col | mobile: stacked */}
      <div className="flex flex-col">
        {/* Right column — active item */}
        <div className=" w-full h-fit overflow-hidden">
          <PostOverlayCard
            key={firstPost.id}
            post={firstPost}
            options={{
              showExcerpt: false,
              titleClasses: '!text-4xl',
              aspectRatio: '16 / 9',
            }}
            direction={'column'}
          />
        </div>

        {/* Left column — playlist list */}
        <div className={`relative w-[95%]  p-4 -mt-14 m-auto z-10 round`}>
          {/* پس‌زمینه شیشه‌ای */}
          <div
            className="absolute inset-0 bg-white/10 backdrop-blur-md"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)',
              maskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)',
            }}
          ></div>
          <div className=" flex flex-col md:flex-row gap-2 justify-center ">
            {posts.slice(1, 5).map((post) => (
              <VerticalPostCard
                key={post.id}
                post={post}
                options={{ showExcerpt: false }}
                className={'shadow'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
