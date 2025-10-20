import categoryCtrl from '@/features/category/controller'
import pageCtrl from '@/features/page/controller'
import articleCtrl from '@/features/article/controller'

export type RevalidatePathProp = {
  feature:
    | 'category'
    | 'article'
    | 'articleComment'
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
  async getAllPagesPaths() {
    return (await pageCtrl.getAllSlugs()).map(({ slug }) => encodeURI(slug))
  }

  async getAllArticlesPaths() {
    return (await articleCtrl.getAllSlugs()).map(({ slug }) => encodeURI(slug))
  }

  async getBlogPath() {
    return ['blog']
  }

  async getAllCategoriessPaths() {
    return (await categoryCtrl.getAllSlugs()).map(({ slug }) => encodeURI(slug))
  }

  async getAllPaths() {
    return [
      '/',
      ...(await this.getAllPagesPaths()),
      ...(await this.getAllArticlesPaths()),
      ...(await this.getAllCategoriessPaths()),
      ...(await this.getBlogPath()),
    ]
  }

  async getAllPathesNeedRevalidate(
    revalidate: RevalidatePathProp
  ): Promise<string[]> {
    if (!revalidate) return []
    let pathes = []
    console.log('#7677 in revalidate:', revalidate)
    const { feature, slug } = revalidate
    if (Array.isArray(slug)) {
      for (const path of slug) {
        if (typeof path === 'string' && path.trim() !== '') {
          pathes.push(encodeURI(path))
        }
      }
    } else if (typeof slug === 'string' && slug.trim() !== '') {
      pathes.push(encodeURI(slug))
    }

    switch (feature) {
      case 'article':
      case 'menu':
      case 'category':
      case 'page':
      case 'template':
      case 'templatePart':
      case 'settings': {
        return [...(await this.getAllPaths()), ...pathes]
      }
      case 'articleComment':
        return [...pathes]
      case 'tag':
      case 'city':
      case 'country':
      case 'province':
      case 'shippingAddress':
      case 'user':
    }
    return []
  }
}

const revalidatePathCtrl = new controller()
export default revalidatePathCtrl
