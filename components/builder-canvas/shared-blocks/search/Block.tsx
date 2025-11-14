'use client'

import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import { Button } from '@/components/custom/button'
import { MoveLeft, Search as SearchIcon } from 'lucide-react'
import { computedStyles } from '../../utils/styleUtils'
import Modal from '@/components/modal/modal'
import Link from 'next/link'
import Search from '@/components/ui/search'
import PostHorizontalCard from '../PostList/designs/ArticalHorizontalCard'
import { useSearchParams, useRouter } from 'next/navigation'
import { getPosts } from '@/features/post/actions'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion } from 'framer-motion'

type Props = {
  blockData: {
    content: {}
    type: 'search'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement>

export const SearchBlock = ({ blockData, ...props }: Props) => {
  const locale = 'fa'
  const [open, setOpen] = useState(false)
  const [postResults, setPostResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  // query فعلی از آدرس
  const query = searchParams.get('query') || ''

  // گرفتن نتایج هر وقت query تغییر کرد
  useEffect(() => {
    if (!query) {
      setPostResults({})
      return
    }

    const fetchPosts = async () => {
      setLoading(true)
      try {
        const postResults = await getPosts({
          filters: { query },
          pagination: { page: 1, perPage: 10 },
        })
        setPostResults(postResults)
      } catch (err) {
        console.log('Search error:', err)
      }
      setLoading(false)
    }

    fetchPosts()
  }, [query])

  //  حالت خالی (بدون query)
  const EmptyQueryView = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <SearchIcon size={60} className="opacity-50" />
      </motion.div>
      <p className="mt-4 text-lg">عبارتی را در بخش جستجو وارد کنید...</p>
    </motion.div>
  )

  //  حالت Loading
  const LoadingView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-[40vh]"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"
      />
    </motion.div>
  )

  //  بخش نتایج
  const ResultsList = () => (
    <div className="p-2 col-span-4 md:col-span-3">
      <div className="flex flex-col m-auto  w-full space-y-4">
        {(postResults?.data || []).map((post, idx) => {
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <PostHorizontalCard
                query={query}
                post={post}
                options={{ showExcerpt: false }}
              />
            </motion.div>
          )
        })}
      </div>

      {/* صفحه‌بندی */}
      <div className="p-4 flex justify-center items-center">
        <Link
          href={`/search?page=${1}&perPage=10&query=${query}`}
          className="text-xs text-gray-600 dark:text-gray-300 font-normal flex flex-row items-center gap-2 w-full text-center justify-center p-4"
        >
          <span>مشاهده نتایج بیشتر</span>
          <MoveLeft size={20} className="text-primary" />
        </Link>
      </div>
    </div>
  )

  // ⬇ محتویات مودال
  const SearchModal = () => {
    return (
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-4 p-4">
          <Search placeholder="جستجو کنید ..." className="w-full " />
        </div>

        <ScrollArea className="flex flex-col m-auto justify-center w-full h-[90vh] md:h-[75vh]">
          {!query ? (
            <EmptyQueryView />
          ) : loading ? (
            <LoadingView />
          ) : postResults?.data?.length === 0 ? (
            <EmptyQueryView />
          ) : (
            <ResultsList />
          )}
        </ScrollArea>
      </div>
    )
  }

  return (
    <>
      <Modal
        content={<SearchModal />}
        isOpen={open}
        onCloseModal={() => setOpen(false)}
        size="medium"
        className="h-[100vh] md:h-[90vh]"
      />

      <Button
        variant="ghost"
        size="icon"
        style={{
          ...computedStyles(blockData?.styles || {}),
        }}
        className={`${blockData?.classNames?.manualInputs || ''}`}
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="w-4 h-4" />
      </Button>
    </>
  )
}
