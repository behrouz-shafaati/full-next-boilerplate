'use client'
import { useActionState, useEffect, useRef } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { createArticleComment } from '@/features/article-comment/actions'
import CommentEditor, { CommentEditorRef } from './comment-editor'
import { mutate } from 'swr'
import { useArticleCommentStore } from './store/useArticleCommentStore'
import { X } from 'lucide-react'
import { Button } from '@/components/custom/button'

interface ArticleCommentFormProps {
  initialData: any | null
}

export const CommentForm: React.FC<ArticleCommentFormProps> = ({
  initialData: article,
}) => {
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

  const actionHandler = createArticleComment.bind(null, String(article.id))
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

  return (
    <>
      <form
        action={dispatch}
        ref={formRef}
        className="space-y-8 w-full sticky bottom-0"
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
          ref={editorRef}
          name="contentJson"
          isPending={isPending}
        />
      </form>
    </>
  )
}
