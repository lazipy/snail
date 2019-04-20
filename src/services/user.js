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
    const res = await vertifySmsCode(data.mobile, data.code, data.type)
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
    const result = await UserModal.add({
      data: {
        name: data.userInfo.nickName,
        mobile: data.mobile,
        avatar: data.userInfo.avatarUrl,
        gender: data.userInfo.gender,
        city: data.userInfo.city,
        province: data.userInfo.province,
        country: data.userInfo.country,
        status: 'init',
        account_total: 10,
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    // 添加默认的分组
    await GroupModal.add({
      data: {
        user_id: result._id,
        logo: '../assets/img/work.png',
        name: '工作',
        description: '工作相关的账号',
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    await GroupModal.add({
      data: {
        user_id: result._id,
        logo: '../assets/img/card.png',
        name: '金融',
        description: '金融相关的账号',
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    await GroupModal.add({
      data: {
        user_id: result._id,
        logo: '../assets/img/game.png',
        name: '游戏',
        description: '游戏相关的账号',
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    await GroupModal.add({
      data: {
        user_id: result._id,
        logo: '',
        name: '其他',
        description: '其他相关的账号',
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    // 查询用户信息
    const userInfo = await UserModal.doc(result._id).get()
    return {
      head: { code: 1, message: '注册成功' },
      body: { data: userInfo.data }
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * 登录
 * @param {mobile, code, type}
 */
export async function userLogin(data) {
  try {
    // 校对验证码
    const res = await vertifySmsCode(data.mobile, data.code, data.type)
    if (res.head.code !== 1) return res
    // 查询用户是否存在
    const users = await UserModal.where({
      mobile: data.mobile
    }).get()
    if (users.data.length === 0) {
      return {
        head: { code: -1, message: '该手机号尚未注册，请前去注册' },
        body: { data: users.data }
      }
    } else {
      return {
        head: { code: 1, message: '登录成功' },
        body: { data: users.data[0] }
      }
    }
  } catch (err) {
    console.log(err)
  }
}
