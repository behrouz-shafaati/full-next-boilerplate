import { PageItem } from '../types/page'

export const initialPage: PageItem[] = [
  {
    id: '1',
    title: 'Home',
    url: '/',
    icon: 'home',
    children: [],
  },
  {
    id: '2',
    title: 'Shop',
    url: '/shop',
    icon: 'shopping-bag',
    children: [
      {
        id: '3',
        title: 'Clothing',
        url: '/shop/clothing',
        icon: 'shirt',
        children: [],
      },
    ],
  },
]
