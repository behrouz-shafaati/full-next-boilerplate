// کامپوننت نمایشی فال بک بلاک
import React from 'react'
import { Block } from '../../types'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { PostListColumn } from './designs/list/PostListColumn'
import { PostListRow } from './designs/list/PostListRow'
import PostImageCard from './designs/card/ImageCard'
import PostOverlayCard from './designs/card/OverlayCard'
import PostHorizontalCard from './designs/card/ArticalHorizontalCard'
import { PostListHeroVertical } from './designs/list/PostListHeroVertical'
import { PostListSpotlight } from './designs/list/PostListSpotlight'
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
