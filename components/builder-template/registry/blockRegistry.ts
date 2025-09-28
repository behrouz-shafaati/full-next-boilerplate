// رجیستری مرکزی بلاک‌ها
import { registerBlock } from '@/components/builder-canvas/singletonBlockRegistry'
import { ContentBlockDef } from '../blocks/content_all'
import { ContentPostTitleBlockDef } from '../blocks/content_post_title'
import { ContentPostCoverBlockDef } from '../blocks/content_post_cover'
import { ContentPostMetadataBlockDef } from '../blocks/content_post_metadata'
import { ContentPostContentBlockDef } from '../blocks/content_post_content'
import { ContentPostTableContentBlockDef } from '../blocks/content_post_tablecontent'
import { ContentPostCommentsBlockDef } from '../blocks/content_post_comments'
import { ContentPostCommentFormBlockDef } from '../blocks/content_post_comment_form'

export const blockRegistry = {
  content_all: ContentBlockDef, // تمام محتوا
  content_post_title: ContentPostTitleBlockDef, // عنوان مطلب
  content_post_cover: ContentPostCoverBlockDef, // پوستر مطلب
  content_post_metadata: ContentPostMetadataBlockDef, // متادیتا مطلب
  content_post_content: ContentPostContentBlockDef, // متادیتا مطلب
  content_post_tablecontent: ContentPostTableContentBlockDef, // فهرست مطالب
  content_post_comments: ContentPostCommentsBlockDef, //  دیدگاه‌ها
  content_post_comment_form: ContentPostCommentFormBlockDef, // فرم ارسال دیدگاه برای مطالب
  // ...
}

registerBlock(blockRegistry)
