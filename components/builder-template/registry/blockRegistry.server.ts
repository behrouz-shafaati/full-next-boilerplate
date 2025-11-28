// رجیستری مرکزی بلاک‌ها
// import { registerBlock } from '@/lib/block/singletonBlockRegistry'

import { ContentBlockDef_serverRender } from '../blocks/content_all/index.server'
import { ContentCategoryDescriptionBlockDef_serverRender } from '../blocks/content_category_description/index.server'
import { ContentPostAuthorCardBlockDef_serverRender } from '../blocks/content_post_author_card/index.server'
import { ContentPostBreadcrumbBlockDef_serverRender } from '../blocks/content_post_breadcrumb/index.server'
import { ContentPostCommentFormBlockDef_serverRender } from '../blocks/content_post_comment_form/index.server'
import { ContentPostCommentsBlockDef_serverRender } from '../blocks/content_post_comments/index.server'
import { ContentPostCommentsHeaderBlockDef_serverRender } from '../blocks/content_post_comments_header/index.server'
import { ContentPostContentBlockDef_serverRender } from '../blocks/content_post_content/index.server'
import { ContentPostCoverBlockDef_serverRender } from '../blocks/content_post_cover/index.server'
import { ContentPostMetadataBlockDef_serverRender } from '../blocks/content_post_metadata/index.server'
import { ContentPostShareBlockDef_serverRender } from '../blocks/content_post_share/index.server'
import { ContentPostTableContentBlockDef_serverRender } from '../blocks/content_post_tablecontent/index.server'
import { ContentPostTagsBlockDef_serverRender } from '../blocks/content_post_tags/index.server'
import { ContentPostTitleBlockDef_serverRender } from '../blocks/content_post_title/index.server'

export const serverRenderBuilderTemplateRegistry = {
  content_all: ContentBlockDef_serverRender, // تمام محتوا
  content_post_title: ContentPostTitleBlockDef_serverRender, // عنوان مطلب
  content_post_cover: ContentPostCoverBlockDef_serverRender, // پوستر مطلب
  content_post_metadata: ContentPostMetadataBlockDef_serverRender, // متادیتا مطلب
  content_post_content: ContentPostContentBlockDef_serverRender, // متن مطلب
  content_post_tablecontent: ContentPostTableContentBlockDef_serverRender, // فهرست مطالب
  content_post_comments: ContentPostCommentsBlockDef_serverRender, //  دیدگاه‌ها
  content_post_comment_form: ContentPostCommentFormBlockDef_serverRender, // فرم ارسال دیدگاه برای مطالب
  content_post_breadcrumb: ContentPostBreadcrumbBlockDef_serverRender, // مسیر ناوبری مطلب
  content_post_share: ContentPostShareBlockDef_serverRender, // دکمه‌های اشتراک‌گذاری مطلب
  content_post_tags: ContentPostTagsBlockDef_serverRender, // برچسب‌های مطلب
  content_post_author_card: ContentPostAuthorCardBlockDef_serverRender, // کارت نویسنده مطلب
  content_post_comments_header: ContentPostCommentsHeaderBlockDef_serverRender, // هدر دیدگاه‌های مطلب
  content_category_description: ContentCategoryDescriptionBlockDef_serverRender, // توضیحات دسته‌بندی
}

// registerBlock(blockRegistry)
