import HelloUser from '@/components/HelloUser'
import StatCard from '@/components/stateCard'
import { Card } from '@/components/ui/card'
import LastArticleComments from '@/features/article-comment/ui/last-article-comments'
import { commentsUrl } from '@/features/article-comment/utils'
import LastArticles from '@/features/article/ui/last-alticles'
import { getStats } from '@/features/settings/controller'
import { FileText, MessageSquare, User } from 'lucide-react'

export default async function page() {
  const stats = await getStats()
  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <HelloUser />
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-4">
          <StatCard
            title="تعداد مقالات"
            value={stats.totalArticles}
            icon={<FileText />}
          />
          <StatCard
            title="مقالات منتشر شده این هفته"
            value={stats.publishedWeek}
            icon={<FileText />}
          />
          <StatCard
            title="تعداد کاربران"
            value={stats.totalUsers}
            icon={<User />}
          />
          <StatCard
            title="نظرات در انتظار"
            value={stats.pendingComments}
            icon={<MessageSquare />}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1  lg:grid-cols-2 gap-4">
          <Card className="p-4">
            <LastArticles query={''} page={Number(page)} />
          </Card>
          <Card className="p-4">
            <LastArticleComments
              filters={{ status: 'pending' }}
              refetchDataUrl={`${commentsUrl}?page=1&status=pending`}
              page={Number(page)}
            />
          </Card>
        </div>
      </div>
    </>
  )
}
