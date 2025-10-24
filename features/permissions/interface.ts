export type Permission =
  | 'all'

  // ===== ARTICLE_COMMENT =====
  | 'articleComment.view.any'
  | 'articleComment.view.own'
  | 'articleComment.create'
  | 'articleComment.delete.any'
  | 'articleComment.delete.own'
  | 'articleComment.moderate.any'
  | 'articleComment.moderate.own'

  // ===== SETTINS =====
  | 'settings.view.any'
  | 'settings.view.own'
  | 'settings.moderate.any'
  | 'settings.moderate.own'

  // ===== ARTICLE =====
  | 'article.view.any'
  | 'article.view.own'
  | 'article.create'
  | 'article.edit.any'
  | 'article.edit.own'
  | 'article.publish.any'
  | 'article.publish.own'
  | 'article.delete.any'
  | 'article.delete.own'

  // ===== USER =====
  | 'user.view.any'
  | 'user.view.own'
  | 'user.create'
  | 'user.edit.any'
  | 'user.edit.own'
  | 'user.delete.any'
  | 'user.delete.own'

  // ===== CATEGORY =====
  | 'category.view.any'
  | 'category.view.own'
  | 'category.create'
  | 'category.edit.any'
  | 'category.edit.own'
  | 'category.publish.any'
  | 'category.delete.any'
  | 'category.delete.own'

  // ===== TAG =====
  | 'tag.view.any'
  | 'tag.view.own'
  | 'tag.create'
  | 'tag.edit.any'
  | 'tag.edit.own'
  | 'tag.publish.any'
  | 'tag.publish.own'
  | 'tag.delete.any'
  | 'tag.delete.own'

  // ===== MENU =====
  | 'menu.view.any'
  | 'menu.view.own'
  | 'menu.create'
  | 'menu.edit.any'
  | 'menu.edit.own'
  | 'menu.publish.any'
  | 'menu.delete.any'
  | 'menu.delete.own'

  // ===== PAGE =====
  | 'page.view.any'
  | 'page.view.own'
  | 'page.view.own'
  | 'page.create'
  | 'page.edit.any'
  | 'page.edit.own'
  | 'page.publish.any'
  | 'page.delete.any'
  | 'page.delete.own'

  // ===== TEMPLATE & TEMPLATE_PART =====
  | 'template.view.any'
  | 'template.view.own'
  | 'template.view.own'
  | 'template.create'
  | 'template.edit.any'
  | 'template.edit.own'
  | 'template.publish.any'
  | 'template.delete.any'
  | 'template.delete.own'
