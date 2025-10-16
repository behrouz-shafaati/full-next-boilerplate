// رجیستری مرکزی بلاک‌ها
import { registerBlock } from '@/components/builder-canvas/singletonBlockRegistry'
import { ContentBlockDef } from '../blocks/content_all'
import { ContentArticleTitleBlockDef } from '../blocks/content_article_title'
import { ContentArticleCoverBlockDef } from '../blocks/content_article_cover'
import { ContentArticleMetadataBlockDef } from '../blocks/content_article_metadata'
import { ContentArticleContentBlockDef } from '../blocks/content_article_content'
import { ContentArticleTableContentBlockDef } from '../blocks/content_article_tablecontent'
import { ContentArticleCommentsBlockDef } from '../blocks/content_article_comments'
import { ContentArticleCommentFormBlockDef } from '../blocks/content_article_comment_form'

export const blockRegistry = {
  content_all: ContentBlockDef, // تمام محتوا
  content_article_title: ContentArticleTitleBlockDef, // عنوان مقاله
  content_article_cover: ContentArticleCoverBlockDef, // پوستر مقاله
  content_article_metadata: ContentArticleMetadataBlockDef, // متادیتا مقاله
  content_article_content: ContentArticleContentBlockDef, // متادیتا مقاله
  content_article_tablecontent: ContentArticleTableContentBlockDef, // فهرست مقالات
  content_article_comments: ContentArticleCommentsBlockDef, //  دیدگاه‌ها
  content_article_comment_form: ContentArticleCommentFormBlockDef, // فرم ارسال دیدگاه برای مقالات
  // ...
}

registerBlock(blockRegistry)
