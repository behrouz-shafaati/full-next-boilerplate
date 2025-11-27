'use client'
// کامپوننت نمایشی بلاک
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Block } from '../../types'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { PostListColumn } from './designs/list/PostListColumn'
import { buildUrlFromFilters } from '@/lib/utils'
import { PostListRow } from './designs/list/PostListRow'
import PostImageCard from './designs/card/ImageCard'
import PostOverlayCard from './designs/card/OverlayCard'
import PostHorizontalCard from './designs/card/ArticalHorizontalCard'
import { PostListHeroVertical } from './designs/list/PostListHeroVertical'
import { PostListSpotlight } from './designs/list/PostListSpotlight'
import { PostListHeroHorizontal } from './designs/list/PostListHeroHorizontal'
import VerticalPostCard from '@/components/post/vertical-card'
import BannerGroup from '../AdSlot/BannerGroup'
import PostHorizontalSmallCard from './designs/card/PostHorizontalSmallCard'
import { getPosts } from '@/features/post/actions'
import { getTagAction } from '@/features/tag/actions'

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
  categorySlug: string | null
  randomMap: boolean[]
  searchParams?: any
  filters?: Object
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostList = ({
  posts: posts,
  randomMap,
  blockData,
  searchParams = {},
  filters,
  ...props
}: PostListProps) => {
  const locale = 'fa'
  const { categorySlug } = props ? props : { categorySlug: null }
  const { id, content, settings } = blockData
  const firstLoad = useRef(true)
  const [selectedTag, setSelectedTag] = useState('')
  const [_posts, setPosts] = useState(posts)

  useEffect(() => {
    const fetchData = async () => {
      if (firstLoad.current === true) {
        firstLoad.current = false
        return
      }
      let _filters
      if (selectedTag != '') {
        const tag = await getTagAction({ slug: selectedTag })
        _filters = { ...filters, tags: [tag.id] }
      } else {
        _filters = filters
      }
      const [result] = await Promise.all([
        getPosts({
          filters: _filters,
          pagination: { page: 1, perPage: settings?.countOfPosts || 6 },
        }),
      ])
      const posts = result.data
      setPosts(posts)
    }
    fetchData()
  }, [selectedTag])

  // const searchParams = useSearchParams()

  const bannerSettings = useMemo(() => ({ settings: { aspect: '4/1' } }), [])

  let queryParams = content?.tags || []
  if (settings?.showNewest == true)
    queryParams = [{ label: 'تازه‌ها', slug: '' }, ...queryParams]

  // const selectedTag = searchParams.get('tag') || ''

  // useEffect(() => {
  //   const fetchData = async () => {
  //     let posts = {}
  //     let filters = {}

  //     if (content?.usePageCategory && categorySlug) {
  //       // logic to handle usePageCategory and categorySlug
  //       const category = await getCategoryAction({ slug: categorySlug })
  //       filters = { categories: [category.id], ...filters }
  //     } else {
  //       const categoryIds =
  //         content?.categories?.map((category: Option) => category.value) || {}

  //       //       // اگر دسته ای انتخاب شده است روی  فیلتر اعمال شود
  //       if (categoryIds?.length > 0)
  //         filters = { categories: categoryIds, ...filters }
  //     }

  //     const selectedTagExistInItems = queryParams?.some(
  //       (tag) => tag.slug === selectedTag
  //     )
  //     //     // اگر تگ انتخاب شده و ثبت شده در نوار آدرس در آیتم های این لیست نیست کاری انجام نشود
  //     if (!selectedTagExistInItems) return
  //     if (selectedTag !== '') {
  //       const tag = await getTagAction({ slug: selectedTag })
  //       filters = { tags: [tag.id], ...filters }
  //       posts = await getPosts({
  //         filters,
  //         pagination: { page: 1, perPage: settings?.countOfPosts || 6 },
  //       })
  //       setPosts(posts.data)
  //     } else {
  //       posts = await getPosts({
  //         filters,
  //         pagination: { page: 1, perPage: settings?.countOfPosts || 6 },
  //       })
  //       setPosts(posts.data)
  //     }
  //   }

  //   //   // fetchData  باعث تغیر در جایگاه نمایش کارت عمودی میشود. این جایگاه به صورت شانسی انتخاب میشود و موجب کاهش پرفورمنس میشود
  //   fetchData()
  // }, [selectedTag])

  const tagSlugs = content?.tags?.map((tag: Option) => tag.slug) || []
  const categorySlugs =
    content?.categories?.map((category: Option) => category.slug) || []
  let showMoreHref = '/archive'

  if (tagSlugs.length > 0)
    showMoreHref = showMoreHref + '/' + buildUrlFromFilters({ tags: tagSlugs })

  if (content?.usePageCategory && categorySlug) {
    showMoreHref =
      showMoreHref + '/' + buildUrlFromFilters({ categories: [categorySlug] })
  } else {
    if (categorySlugs.length > 0)
      showMoreHref =
        showMoreHref + '/' + buildUrlFromFilters({ categories: categorySlugs })
  }

  // showMoreHref = showMoreHref + `?page=1&perPage=${showMoreHref.length || 6}`
  // selectedTag از نوار آدرس مرورگر خوانده میشود
  // showMoreHref =
  //   selectedTag != ''
  //     ? showMoreHref + '/' + buildUrlFromFilters({ tags: [selectedTag] })
  //     : showMoreHref

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

  // const postItems =  postItemsFun()
  switch (settings?.listDesign) {
    case 'column':
      return (
        <PostListColumn
          posts={_posts}
          postItems={postItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          setSelectedTag={setSelectedTag}
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
          postItems={postItems}
          blockData={blockData}
          showMoreHref={showMoreHref}
          searchParams={searchParams}
          setSelectedTag={setSelectedTag}
          {...props}
        />
      )
  }
}

PostList.displayName = 'PostList'
