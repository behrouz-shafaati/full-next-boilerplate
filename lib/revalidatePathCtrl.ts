import categoryCtrl from '@/features/category/controller'
import pageCtrl from '@/features/page/controller'
import postCtrl from '@/features/post/controller'

export type RevalidatePathProp = {
  feature:
    | 'category'
    | 'post'
    | 'postComment'
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
    | 'campaign'
    | 'form'
    | 'formSubmission'
  slug?: string | string[]
}

class controller {
  async getAllPagesPaths() {
    return (await pageCtrl.getAllSlugs()).map(({ slug }) => encodeURI(slug))
  }

  async getAllPostsPaths() {
    return (await postCtrl.getAllSlugs()).map(({ slug }) => encodeURI(slug))
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
      ...(await this.getAllPostsPaths()),
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
      case 'post':
      case 'menu':
      case 'category':
      case 'page':
      case 'template':
      case 'templatePart':
      case 'form':
      case 'settings': {
        return [...(await this.getAllPaths()), ...pathes]
      }
      case 'postComment':
      case 'formSubmission':
        return [...pathes]
      case 'campaign':
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
