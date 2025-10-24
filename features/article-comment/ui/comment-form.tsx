'use client'
import { useActionState, useEffect, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createArticleComment } from '@/features/article-comment/actions'
import CommentEditor, { CommentEditorRef } from './comment-editor'
import { mutate } from 'swr'
import { useArticleCommentStore } from './store/useArticleCommentStore'
import { AlertCircleIcon, X } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'

interface ArticleCommentFormProps {
  needLogin?: boolean
  initialData: any | null
}

export const CommentForm: React.FC<ArticleCommentFormProps> = ({
  needLogin = false,
  initialData: article,
}) => {
  const { user } = useSession()
  const userRoles = user?.roles || []
  const { replayTo, setReplayTo } = useArticleCommentStore()
  const { toast } = useToast()
  const initialState = {
    success: false,
    message: null,
    errors: {},
    values: {},
  }

  const formRef = useRef<HTMLFormElement>(null)
  const editorRef = useRef<CommentEditorRef>(null)

  const actionHandler = createArticleComment.bind(null, String(article?.id))
  const [state, dispatch, isPending] = useActionState(
    actionHandler as any,
    initialState
  )

  useEffect(() => {
    if (state.message) {
      toast({
        variant: state.success ? 'default' : 'destructive',
        description: state.message,
      })
    }

    if (state.success) {
      setReplayTo(null)
      // بعد از dispatch موفق:
      mutate(`/api/comments?article=${article.id}`)

      // خالی کردن ادیتور
      editorRef.current?.clear()
    }
  }, [state])

  if (!article || article == undefined)
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>مقاله مربوطه پاک شده است.</AlertTitle>
      </Alert>
    )

  if (needLogin) {
    if (!user)
      return <p className="py-2 text-center">برای ارسال نظر لطفا وارد شوید</p>
    const canCreate = can(userRoles, 'articleComment.create')
    if (!canCreate) return <></>
  }
  return (
    <>
      <form
        action={dispatch}
        ref={formRef}
        className="space-y-8 w-full sticky bottom-0 p-4"
      >
        <input type="hidden" name="locale" value="fa" readOnly />
        <input type="hidden" name="parent" value={replayTo?.id ?? ''} />
        {replayTo && (
          <div className="flex justify-between items-center border md:rounded-2xl py-1 px-3 bg-white dark:bg-neutral-900 md:shadow-sm ">
            <div>پاسخ به {replayTo?.author?.name || 'ناشناس'}</div>
            <Button
              type="button"
              role="button"
              size="icon"
              variant="ghost"
              onClick={() => setReplayTo(null)}
            >
              <X size={16} />
            </Button>
          </div>
        )}
        <CommentEditor
          placeholder="نظر خود را بنویسید..."
          ref={editorRef}
          name="contentJson"
          isPending={isPending}
        />
      </form>
    </>
  )
}
