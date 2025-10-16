import categoryCtrl from '@/features/category/controller'
import pageCtrl from '@/features/page/controller'
import articleCtrl from '@/features/article/controller'
import { revalidatePath } from 'next/cache'

export type RevalidatePathProp = {
  feature:
    | 'category'
    | 'article'
    | 'page'
    | 'template'
    | 'templatePart'
    | 'menu'
    | 'settings'
    | 'tag'
    | 'city'
    | 'country'
    | 'province'
    | 'shippingAddress'
    | 'user'
  slug?: string | string[]
}

class controller {
  async revalidateAllPagesPaths() {
    const pageSlugs = await pageCtrl.getAllSlugs()
    for (const { slug } of pageSlugs) {
      revalidatePath(slug)
    }
  }

  async revalidateAllArticlesPaths() {
    const articleSlugs = await articleCtrl.getAllSlugs()
    for (const { slug } of articleSlugs) {
      revalidatePath(slug)
    }
  }

  async revalidateBlogPath() {
    revalidatePath('blog')
  }

  async revalidateAllCategoriessPaths() {
    const categorySlugs = await categoryCtrl.getAllSlugs()
    for (const { slug } of categorySlugs) {
      revalidatePath(slug)
    }
  }

  async revalidateAllPaths() {
    await this.revalidateAllPagesPaths()
    await this.revalidateAllArticlesPaths()
    await this.revalidateAllCategoriessPaths()
  }

  async revalidate(revalidate: RevalidatePathProp) {
    if (!revalidate) return
    console.log('#7677 in revalidate:', revalidate)
    const { feature, slug } = revalidate
    if (Array.isArray(slug)) {
      for (const path of slug) {
        if (typeof path === 'string' && path.trim() !== '') {
          revalidatePath(encodeURI(path))
        }
      }
    } else if (typeof slug === 'string' && slug.trim() !== '') {
      revalidatePath(encodeURI(slug))
    }

    switch (feature) {
      case 'article': {
        this.revalidateBlogPath()
        break
      }
      case 'menu': {
        this.revalidateAllPaths()
        break
      }
      case 'category':
      case 'page':
      case 'template': {
        this.revalidateAllPaths()
        break
      }
      case 'templatePart': {
        this.revalidateAllPaths()
        break
      }
      case 'settings': {
        this.revalidateAllPaths()
        break
      }
      case 'tag':
      case 'city':
      case 'country':
      case 'province':
      case 'shippingAddress':
      case 'user':
    }
  }
}

const revalidatePathCtrl = new controller()
export default revalidatePathCtrl
