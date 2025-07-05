export interface MenuItem {
  id: string
  label: string
  url: string
  icon?: string
  subMenu?: MenuItem[] // فقط یکی مجاز است (ما در اجرا کنترل می‌کنیم)
}
