import { getTranslation } from '@/lib/utils'
import { Article } from '../../interface'
import { useEffect, useState } from 'react'
import { getArticles } from '../../actions'
import { CopyButton } from '@/components/ui/shadcn-io/copy-button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

type Props = {
  article: Article
  className?: string
}

export default function RelatedArticlesDashboard({
  article,
  className = '',
}: Props) {
  const [articles, setArticles] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      if (article) {
        const r = await getArticles({
          filters: { categories: { $in: article.categories } },
        })
        setArticles(r?.data)
      }
    }
    fetchData()
  }, [])
  if (articles.length == 0) return <></>
  return (
    <Card className={`${className}`}>
      <div className=" border-b p-4">پیشنهادات پیوند</div>
      <ScrollArea className="md:h-[calc(100vh/3)] ">
        {articles.map((article: Article, idx: number) => {
          const t = getTranslation({ translations: article.translations })
          return (
            <div
              className="flex justify-between items-center gap-2 px-4 py-1"
              key={idx}
            >
              <p className="m-0">{t?.title}</p>

              <CopyButton
                variant={'ghost'}
                type="button"
                content={article?.href}
                onCopy={() => console.log('Link copied!')}
                size="sm"
                title="کپی لینک"
              />
            </div>
          )
        })}
      </ScrollArea>
    </Card>
  )
}
