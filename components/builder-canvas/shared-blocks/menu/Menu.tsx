import {
  Menu as MenuType,
  MenuTranslationSchema,
} from '@/features/menu/interface'
import HorizontalMenu from './designs/Horizontal'
import VerticalMenu from './designs/Vertical'

interface MainMenuProps {
  blockData: {
    content: { menuId: string }
    type: 'menu'
    settings: {}
  }
  widgetName: string
  menu: MenuType
}

function Menu({ blockData, widgetName, menu, ...props }: MainMenuProps) {
  menu.translations = menu?.translations || []

  const locale = 'fa'
  const translation: MenuTranslationSchema =
    menu?.translations?.find((t: MenuTranslationSchema) => t.lang === locale) ||
    menu?.translations[0] ||
    {}
  const items = translation.items
  const { settings } = blockData
  switch (settings?.design) {
    case 'vertical':
      return <VerticalMenu items={items} {...props} />
    default:
      return <HorizontalMenu items={items} {...props} />
  }
}

export default Menu
