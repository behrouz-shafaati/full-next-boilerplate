/**
استفاده از Async Local Storage (ALS)

این دقیقاً برای همین ساخته شده:

برای هر request یک فضای جدا دارد

داده‌ها بین تمام Server Componentهای آن درخواست Shared هستند

بعد از پایان رندر از بین می‌روند

100٪ server-only

100٪ سازگار با SSG + SSR + Server Actions 
*/

import { AsyncLocalStorage } from 'async_hooks'

export type BannerInfo = {
  id: string
  title: string
  image: string
}

type RegistryData = {
  displayedCampaigns: string[] // campain id
}

const requestStorage = new AsyncLocalStorage<RegistryData>()

export class RequestStorage {
  static runForRequest<T>(callback: () => T) {
    return requestStorage.run({ displayedCampaigns: [] }, callback)
  }

  static addDisplayedCampaign(campaignIds: string[]) {
    const store = requestStorage.getStore()
    if (!store) throw new Error('Request storage used outside request context')

    store.displayedCampaigns.push(...campaignIds)
  }

  static getDisplayedCampaigns() {
    const store = requestStorage.getStore()
    return store ? store.displayedCampaigns : []
  }
}
