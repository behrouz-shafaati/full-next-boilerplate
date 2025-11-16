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
import { PostListHeroVertical } from './designs/postListHeroVertical'
import { PostListSpotlight } from './designs/postListSpotlight'
import VerticalPostCard from '@/components/post/vertical-card'
import { Banner } from '../AdSlot/Banner'

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
  pageSlug: string | null
  categorySlug: string | null
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostListFallback = ({
  posts,
  blockData,
  pageSlug,
  categorySlug,
  ...props
}: PostListProps) => {
  const locale = 'fa'
  const { id, content, settings } = blockData

  let showMoreHref = 'archive'
  // showMoreHref =
  //   selectedTag != ''
  //     ? showMoreHref + '/' + buildUrlFromFilters({ tags: [selectedTag] })
  //     : showMoreHref

  let postItems = []
  const advertisingAfter = settings?.advertisingAfter
    ? settings?.advertisingAfter
    : 0
  let adIndex = 0
  postItems = posts.map((post, index) => {
    adIndex = adIndex + 1
    let flgShowBanner = false
    if (advertisingAfter == adIndex) {
      flgShowBanner = true
      adIndex = 0
    }

    const flgShowVertical = Math.random() < 0.1

    switch (settings?.cardDesign) {
      case 'overly-card':
        return (
          <>
            <PostOverlayCard
              key={post.id}
              post={post}
              options={settings}
              direction={settings?.listDesign}
            />
            {flgShowBanner && (
              <Banner
                blockData={{ settings: { aspect: '4/1' } }}
                banerSlotId={`${id}${index}`}
              />
            )}
          </>
        )
      case 'horizontal-card':
        return (
          <>
            {flgShowVertical ? (
              <VerticalPostCard
                key={post.id}
                post={post}
                options={{ showExcerpt: false }}
              />
            ) : (
              <PostHorizontalCard
                key={post.id}
                post={post}
                options={settings}
              />
            )}
            {flgShowBanner && (
              <Banner
                blockData={{ settings: { aspect: '4/1' } }}
                banerSlotId={`${id}${index}`}
              />
            )}
          </>
        )
      default:
        return (
          <>
            <PostImageCard key={post.id} post={post} options={settings} />
            {flgShowBanner && (
              <Banner
                blockData={{ settings: { aspect: '4/1' } }}
                banerSlotId={`${id}${index}`}
              />
            )}
          </>
        )
    }
  })

  switch (settings?.listDesign) {
    case 'column':
      return (
        <PostListColumn
          posts={posts}
          postItems={postItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          {...props}
        />
      )
    case 'hero':
      return (
        <PostListHeroVertical
          posts={posts}
          postItems={postItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          {...props}
        />
      )
    case 'spotlight':
      return (
        <PostListSpotlight
          posts={posts}
          postItems={postItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          {...props}
        />
      )
    default: // case 'row':
      return (
        <PostListRow
          posts={posts}
          blockData={blockData}
          showMoreHref={showMoreHref}
          postItems={postItems}
          {...props}
        />
      )
  }
}
