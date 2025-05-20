export interface MenuItem {
  id: string
  title: string
  url: string
  icon?: string
  children?: MenuItem[] // فقط یکی مجاز است (ما در اجرا کنترل می‌کنیم)
}
