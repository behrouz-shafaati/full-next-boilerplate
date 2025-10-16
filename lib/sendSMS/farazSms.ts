import axios from 'axios'

const FARAZ_SMS_API_KEY = process.env.FARAZ_SMS_API_KEY // کلید API
const FARAZ_SMS_SENDER = process.env.FARAZ_SMS_SENDER // شماره ارسال‌کننده (مثلاً خط خدماتی)

export async function sendSms(to: string, message: string) {
  try {
    const response = await axios.post(
      'https://rest.ippanel.com/v1/messages',
      {
        originator: FARAZ_SMS_SENDER,
        recipients: [to],
        message: message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `AccessKey ${FARAZ_SMS_API_KEY}`,
        },
      }
    )

    return response.data
  } catch (error: any) {
    console.error('SMS Send Error:', error.response?.data || error.message)
    throw new Error('پیامک ارسال نشد')
  }
}

export async function sendSmsVerifyFarazSms(to: string, code: string) {
  try {
    const base_url = `https://edge.ippanel.com/v1`
    const from_number = `+983000505`
    const patternCode = `trna8e9b3t`
    const apiKey = `6VKwn_Ht3si3cK-POjHyO7Xc2EiHCCQFIkxy6sbllzc=`
    const response = await axios.post(
      `${base_url}/api/send`,
      {
        sending_type: 'pattern',
        from_number, // شماره فرستنده خدماتی
        code: patternCode, // کد الگو که در پنل ساخته‌ای
        recipients: [to], // شماره گیرنده
        // مقادیر جایگزینی در الگو
        params: {
          'verification-mobile-code': code,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${apiKey}`,
        },
      }
    )

    return { success: true, message: 'پیامک با موفقیت ارسال شد' }
  } catch (error: any) {
    console.error('❌ SMS Send Error:', error.response?.data || error.message)
    return { success: false, message: 'ارسال پیامک با مشکل مواجه شد' }
  }
}
