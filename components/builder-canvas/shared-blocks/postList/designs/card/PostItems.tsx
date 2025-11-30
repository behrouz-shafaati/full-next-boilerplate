'use client'
import { Post } from '@/features/post/interface'
import React, { useEffect, useRef, useState } from 'react'
import PostOverlayCard from './OverlayCard'
import AdSlotBlock from '../../../AdSlot/AdSlotBlock'
import VerticalPostCardSkeleton from '@/components/post/skeleton/vertical-card-skeleton'
import VerticalPostCard from '@/components/post/vertical-card'
import ArticalHorizontalCardSkeleton from './skeleton/ArticalHorizontalCardSkeleton'
import PostHorizontalCard from './ArticalHorizontalCard'
import PostHorizontalSmallCard from './PostHorizontalSmallCard'
import PostImageCardSkeltone from './skeleton/ImageCardSkeleton'
import PostImageCard from './ImageCard'
import { SelectableTags } from '@/components/builder-canvas/components/SelectableTags'
import { getTagAction } from '@/features/tag/actions'
import { getPosts } from '@/features/post/actions'

type Props = {
  initialPosts: Post[]
  blockData: any
  randomMap: boolean[]
  filters?: Object
}

export default function PostItems({
  initialPosts = [],
  blockData,
  randomMap,
  filters = {},
}: Props) {
  const { id, content, settings } = blockData

  const firstLoad = useRef(true)
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState(initialPosts)
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (firstLoad.current === true) {
        firstLoad.current = false
        return
      }
      setLoading(true)
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
      setLoading(false)
    }
    fetchData()
  }, [selectedTag])

  const advertisingAfter = blockData?.settings?.advertisingAfter || 0
  let adIndex = 0

  let queryParamLS = content?.tags || []
  if (settings?.showNewest == true)
    queryParamLS = [{ label: 'تازه‌ها', slug: '' }, ...queryParamLS]
  return (
    <div>
      <div>
        <SelectableTags
          items={queryParamLS}
          setSelectedTag={setSelectedTag}
          className="p-2"
        />
      </div>
      {!loading && posts.length == 0 ? (
        <div className="w-full p-24 items-center text-center">
          داده ای وجود ندارد
        </div>
      ) : (
        (loading ? new Array(settings?.countOfPosts || 6).fill({}) : posts).map(
          (post, index) => {
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
                      <AdSlotBlock
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
                      loading ? (
                        <VerticalPostCardSkeleton />
                      ) : (
                        <VerticalPostCard
                          key={post.id}
                          post={post}
                          options={{ showExcerpt: false }}
                          className="border-b"
                        />
                      )
                    ) : loading ? (
                      <ArticalHorizontalCardSkeleton />
                    ) : (
                      <PostHorizontalCard
                        key={post.id}
                        post={post}
                        options={settings}
                      />
                    )}
                    {flgShowBanner && (
                      <AdSlotBlock
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
                      <AdSlotBlock
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
                    {loading ? (
                      <PostImageCardSkeltone />
                    ) : (
                      <PostImageCard
                        key={post.id}
                        post={post}
                        options={settings}
                      />
                    )}
                    {flgShowBanner && (
                      <AdSlotBlock
                        blockData={{
                          id: `${id}${index}`,
                          settings: { aspect: '4/1', countOfBanners: 1 },
                        }}
                      />
                    )}
                  </React.Fragment>
                )
            }
          }
        )
      )}
    </div>
  )
}
