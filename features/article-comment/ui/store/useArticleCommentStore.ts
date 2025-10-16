import { create } from 'zustand'
import { ArticleComment } from '../../interface'

type State = {
  replayTo: ArticleComment | null
  setReplayTo: (articleComment: ArticleComment | null) => void
  getReplayTo: () => ArticleComment | null
}

export const useArticleCommentStore = create<State>((set, get) => ({
  replayTo: null,
  setReplayTo: (articleComment) => set({ replayTo: articleComment }),
  getReplayTo: () => {
    return get().replayTo
  },
}))
