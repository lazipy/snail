import dayjs from 'dayjs'
import { vertifySmsCode } from './sms'

const db = wx.cloud.database({ env: 'snail-4607b6' })
const UserModal = db.collection('Users')
const GroupModal = db.collection('Groups')

/**
 * 注册
 * @param {mobile, code, type, userInfo}
 */
export async function registerUser(data) {
  try {
    // 校对验证码
    const res = await vertifySmsCode({ mobile: data.mobile, code: data.code, type: data.type })
    if (res.head.code !== 1) return res
    // 查询用户是否存在
    const users = await UserModal.where({
      mobile: data.mobile
    }).get()
    if (users.data.length > 0) {
      return {
        head: { code: -1, message: '该手机号已注册，请登录' },
        body: { data: users.data }
      }
    }
    // 注册用户
    await UserModal.add({
      data: {

      }
    })
  } catch (err) {
    console.log(err)
  }
}
