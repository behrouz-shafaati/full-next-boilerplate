'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useMemo, useState } from 'react'
import { Block } from '../../types'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { PostListColumn } from './designs/PostListColumn'
import { buildUrlFromFilters } from '@/lib/utils'
import { PostListRow } from './designs/PostListRow'
import PostImageCard from './designs/ImageCard'
import PostOverlayCard from './designs/OverlayCard'
import PostHorizontalCard from './designs/ArticalHorizontalCard'
import { PostListHeroVertical } from './designs/postListHeroVertical'
import { PostListSpotlight } from './designs/postListSpotlight'
import { PostListHeroHorizontal } from './designs/PostListHeroHorizontal'
import VerticalPostCard from '@/components/post/vertical-card'
import BannerGroup from '../AdSlot/BannerGroup'
import PostHorizontalSmallCard from './designs/PostHorizontalSmallCard'
import { useSearchParams } from 'next/navigation'
import { getCategoryAction } from '@/features/category/actions'
import { getTagAction } from '@/features/tag/actions'
import { getPosts } from '@/features/post/actions'

type PostListProps = {
  posts: Post[]
  blockData: {
    id: string
    type: 'postList'
    content: {
      usePageCategory: boolean
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
  randomMap: boolean[]
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostList = React.memo(
  ({ posts: posts, randomMap, blockData, ...props }: PostListProps) => {
    const locale = 'fa'
    const { pageSlug } = props ? props : { pageSlug: null }
    const { id, content, settings } = blockData
    const [_posts, setPosts] = useState(posts)
    const searchParams = useSearchParams()

    const bannerSettings = useMemo(() => ({ settings: { aspect: '4/1' } }), [])

    let queryParams = content?.tags || []
    if (settings?.showNewest == true)
      queryParams = [{ label: 'تازه‌ها', slug: '' }, ...queryParams]

    const selectedTag = searchParams.get('tag') || ''

    useEffect(() => {
      const fetchData = async () => {
        let posts = {}
        let filters = {}

        if (content?.usePageCategory && pageSlug) {
          // logic to handle usePageCategory and pageSlug
          const category = await getCategoryAction({ slug: pageSlug })
          filters = { categories: [category.id], ...filters }
        } else {
          const categoryIds =
            content?.categories?.map((category: Option) => category.value) || {}

          //       // اگر دسته ای انتخاب شده است روی  فیلتر اعمال شود
          if (categoryIds?.length > 0)
            filters = { categories: categoryIds, ...filters }
        }

        const selectedTagExistInItems = queryParams?.some(
          (tag) => tag.slug === selectedTag
        )
        //     // اگر تگ انتخاب شده و ثبت شده در نوار آدرس در آیتم های این لیست نیست کاری انجام نشود
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

      //   // fetchData  باعث تغیر در جایگاه نمایش کارت عمودی میشود. این جایگاه به صورت شانسی انتخاب میشود و موجب کاهش پرفورمنس میشود
      fetchData()
    }, [selectedTag])

    const tagSlugs = content?.tags?.map((tag: Option) => tag.slug) || []
    const categorySlugs =
      content?.categories?.map((category: Option) => category.slug) || []
    let showMoreHref = '/archive'

    if (tagSlugs.length > 0)
      showMoreHref =
        showMoreHref + '/' + buildUrlFromFilters({ tags: tagSlugs })

    if (content?.usePageCategory && pageSlug) {
      showMoreHref =
        showMoreHref + '/' + buildUrlFromFilters({ categories: [pageSlug] })
    } else {
      if (categorySlugs.length > 0)
        showMoreHref =
          showMoreHref +
          '/' +
          buildUrlFromFilters({ categories: categorySlugs })
    }

    // showMoreHref = showMoreHref + `?page=1&perPage=${showMoreHref.length || 6}`
    // selectedTag از نوار آدرس مرورگر خوانده میشود
    showMoreHref =
      selectedTag != ''
        ? showMoreHref + '/' + buildUrlFromFilters({ tags: [selectedTag] })
        : showMoreHref

    const postItems = useMemo(() => {
      const advertisingAfter = blockData?.settings?.advertisingAfter || 0
      let adIndex = 0
      return _posts.map((post, index) => {
        adIndex += 1
        let flgShowBanner = false
        if (advertisingAfter == adIndex) {
          flgShowBanner = true
          adIndex = 0
        }

        const flgShowVertical = randomMap[index]

        switch (blockData?.settings?.cardDesign) {
          case 'overly-card':
            return (
              <React.Fragment key={post.id}>
                <PostOverlayCard
                  key={post.id}
                  post={post}
                  options={settings}
                  direction={settings?.listDesign}
                />
                {flgShowBanner && (
                  <BannerGroup
                    blockData={{
                      id: `${id}${index}`,
                      settings: { aspect: '4/1', countOfBanners: 1 },
                    }}
                  />
                )}
              </React.Fragment>
            )
          case 'horizontal-card':
            return (
              <React.Fragment key={post.id}>
                {flgShowVertical ? (
                  <VerticalPostCard
                    key={post.id}
                    post={post}
                    options={{ showExcerpt: false }}
                    className="border-b"
                  />
                ) : (
                  <PostHorizontalCard
                    key={post.id}
                    post={post}
                    options={settings}
                  />
                )}
                {flgShowBanner && (
                  <BannerGroup
                    blockData={{
                      id: `${id}${index}`,
                      settings: { aspect: '4/1', countOfBanners: 1 },
                    }}
                  />
                )}
              </React.Fragment>
            )
          case 'horizontal-card-small':
            return (
              <React.Fragment key={post.id}>
                <PostHorizontalSmallCard
                  key={post.id}
                  post={post}
                  options={settings}
                />
                {flgShowBanner && (
                  <BannerGroup
                    blockData={{
                      id: `${id}${index}`,
                      settings: { aspect: '4/1', countOfBanners: 1 },
                    }}
                  />
                )}
              </React.Fragment>
            )
          default:
            return (
              <React.Fragment key={post.id}>
                <PostImageCard key={post.id} post={post} options={settings} />
                {flgShowBanner && (
                  <BannerGroup
                    blockData={{
                      id: `${id}${index}`,
                      settings: { aspect: '4/1', countOfBanners: 1 },
                    }}
                  />
                )}
              </React.Fragment>
            )
        }
      })
    }, [_posts, blockData, randomMap, bannerSettings])
    switch (settings?.listDesign) {
      case 'column':
        return (
          <PostListColumn
            posts={_posts}
            postItems={postItems}
            blockData={blockData}
            showMoreHref={showMoreHref}
            {...props}
          />
        )
      case 'heroVertical':
        return (
          <PostListHeroVertical
            posts={_posts}
            postItems={postItems}
            blockData={blockData}
            showMoreHref={showMoreHref}
            {...props}
          />
        )
      case 'heroHorizontal':
        return (
          <PostListHeroHorizontal
            posts={_posts}
            postItems={postItems}
            blockData={blockData}
            showMoreHref={showMoreHref}
            {...props}
          />
        )
      case 'spotlight':
        return (
          <PostListSpotlight
            posts={_posts}
            postItems={postItems}
            blockData={blockData}
            showMoreHref={showMoreHref}
            {...props}
          />
        )
      default: // case 'row':
        return (
          <PostListRow
            posts={_posts}
            blockData={blockData}
            showMoreHref={showMoreHref}
            postItems={postItems}
            {...props}
          />
        )
    }
  }
)

PostList.displayName = 'PostList'
