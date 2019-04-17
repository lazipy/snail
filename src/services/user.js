import dayjs from 'dayjs'
import { addGroup } from './group'
import { createInvite } from './invites'
const db = wx.cloud.database()
const UserModal = db.collection('Users')

// 通过id 获取用户信息
export function queryUserById(id) {
  return UserModal.doc(id).get()
}

// 获取用户信息
export async function queryUserInfo() {
  const res = await wx.cloud.callFunction({name: 'login'})
  const result = await queryUserByOpenId(res.result.openid)
  if (result.data.length > 0) {
    return result.data[0]
  } else {
    return null
  }
}

// 通过openid 获取用户信息
export function queryUserByOpenId(openId) {
  return UserModal.where({
    _openid: openId
  }).get()
}

// 登录
export async function login(data) {
  const res = await wx.cloud.callFunction({name: 'login'})
  const response = await queryUserByOpenId(res.result.openid)
  let result = response.data[0]
  if (response.data.length === 0) {
    result = await UserModal.add({
      data: {
        name: data.name,
        mobile: data.mobile,
        avatar: data.avatar,
        gender: data.gender,
        city: data.city,
        province: data.province,
        country: data.country,
        status: 'init',
        account_total: 10,
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    await addGroup({
      userId: result._id,
      logo: '',
      name: '工作',
      description: '工作相关的账号信息'
    })
    await addGroup({
      userId: result._id,
      logo: '',
      name: '发票',
      description: '发票相关的账号信息'
    })
    await addGroup({
      userId: result._id,
      logo: '',
      name: '游戏账号',
      description: '游戏相关的账号信息'
    })
    await addGroup({
      userId: result._id,
      logo: '',
      name: '其他',
      description: '其他相关的账号信息'
    })
    if (data.shareId) {
      await createInvite({
        fromId: data.shareId,
        toId: result._id
      })
      const shareInfo = await queryUserById(data.shareId)
      console.log(shareInfo)
      await wx.cloud.callFunction({
        name: 'account_total',
        data: {
          _id: shareInfo.data._id,
          account_total: shareInfo.data.account_total + 1,
          updatedA_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      })
    }
    result = await queryUserById(result._id)
    result = result.data
  }
  return result
}

// 更新用户信息
export function updateUser(data) {
  return UserModal.doc(data.id).update({
    data: {
      name: data.name,
      mobile: data.mobile,
      avatar: data.avatar,
      gender: data.gender,
      city: data.city,
      province: data.province,
      country: data.country,
      status: data.status,
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  })
}

// 更新账号上限数
export function updateAccountTotal(data) {
  return UserModal.doc(data.id).update({
    data: {
      account_total: data.account_total,
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  })
}
