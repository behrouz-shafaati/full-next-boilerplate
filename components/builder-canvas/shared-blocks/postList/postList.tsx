'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import Autoplay from 'embla-carousel-autoplay'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { PostListColumn } from './designs/PostListColumn'

import { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import { useSearchParams } from 'next/navigation'
import { getPosts } from '@/features/post/actions'
import { getTagAction } from '@/features/tag/actions'
import { buildUrlFromFilters } from '@/lib/utils'
import { PostListRow } from './designs/PostListRow'
import PostImageCard from './designs/ImageCard'
import PostOverlayCard from './designs/OverlayCard'
import PostHorizontalCard from './designs/ArticalHorizontalCard'
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
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostList = ({ posts, blockData, ...props }: PostListProps) => {
  const locale = 'fa'
  const { id, content, settings } = blockData
  const [_posts, setPosts] = useState(posts)
  const searchParams = useSearchParams()

  let queryParams = content?.tags || []
  if (settings?.showNewest == true)
    queryParams = [{ label: 'تازه‌ها', slug: '' }, ...queryParams]

  const selectedTag = searchParams.get('tag') || ''
  console.log('###234234 selectedTag:', selectedTag)
  useEffect(() => {
    const fetchData = async () => {
      let posts = {}
      let filters = {}
      const categoryIds =
        content?.categories?.map((tag: Option) => tag.value) || {}
      const selectedTagExistInItems = queryParams?.some(
        (tag) => tag.slug === selectedTag
      )

      // اگر دسته ای انتخاب شده است روی  فیلتر اعمال شود
      if (categoryIds?.length > 0)
        filters = { categories: categoryIds, ...filters }

      // اگر تگ انتخاب شده و ثبت شده در نوار آدرس در آیتم های این لیست نیست کاری انجام نشود
      if (!selectedTagExistInItems) return
      if (selectedTag !== '') {
        const tag = await getTagAction({ slug: selectedTag })
        filters = { tags: [tag.id], ...filters }
        posts = await getPosts({
          filters,
          pagination: { page: 1, perPage: settings?.countOfPosts || 6 },
        })
        setPosts(posts.data)
      } else {
        posts = await getPosts({
          filters,
          pagination: { page: 1, perPage: settings?.countOfPosts || 6 },
        })
        setPosts(posts.data)
      }
    }
    fetchData()
  }, [selectedTag])

  const OPTIONS: EmblaOptionsType = {
    dragFree: settings?.dragFree == false ? false : true,
    loop: settings?.loop,
    direction: settings?.rtl ? 'rtl' : 'ltr',
  }
  const plugins: EmblaPluginType[] = [
    Autoplay({
      playOnInit: settings?.autoplay == false ? false : true,
      delay: settings?.delay * 1000 || 5000,
    }),
  ]
  let showMoreHref = 'archive'
  showMoreHref =
    selectedTag != ''
      ? showMoreHref + '/' + buildUrlFromFilters({ tags: [selectedTag] })
      : showMoreHref

  let postItems = []

  const advertisingAfter = settings?.advertisingAfter
    ? settings?.advertisingAfter
    : 0
  let adIndex = 0
  postItems = _posts.map((post, index) => {
    adIndex = adIndex + 1
    let flgShowBanner = false
    if (advertisingAfter == adIndex) {
      flgShowBanner = true
      adIndex = 0
    }
    switch (settings?.cardDesign) {
      case 'overly-card':
        return (
          <>
            <PostOverlayCard key={post.id} post={post} options={settings} />
            {flgShowBanner && (
              <Banner
                blockData={{ settings: { aspect: '4/1' } }}
                banerSlotId={`${id}${index}`}
              />
            )}
          </>
        )
        break
      case 'horizontal-card':
        return (
          <>
            <PostHorizontalCard key={post.id} post={post} options={settings} />
            {flgShowBanner && (
              <Banner
                blockData={{ settings: { aspect: '4/1' } }}
                banerSlotId={`${id}${index}`}
              />
            )}
          </>
        )
        break
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
    case 'row':
      return (
        <PostListRow
          posts={_posts}
          blockData={blockData}
          showMoreHref={showMoreHref}
          postItems={postItems}
          {...props}
        />
      )
    default:
      return (
        <PostListColumn
          posts={_posts}
          postItems={postItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          {...props}
        />
      )
  }
}
