export interface PageItem {
  id: string
  title: string
  url: string
  icon?: string
  children?: PageItem[] // فقط یکی مجاز است (ما در اجرا کنترل می‌کنیم)
}
