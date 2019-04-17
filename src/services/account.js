import dayjs from 'dayjs'
const db = wx.cloud.database()
const AccountModal = db.collection('Accounts')

// 获取账号信息
export function queryAccountById(id) {
  return AccountModal.doc(id).get()
}

// 获取用户的所有账号
export function queryAccountByUserId(userId) {
  return AccountModal.where({
    user_id: userId
  }).get()
}

// 获取一个分组中的账号
export function queryAccountByGroupId(groupId) {
  return AccountModal.where({
    group_id: groupId
  }).get()
}

// 获取用户的所有星标账号
export function queryAccountByFlag(userId) {
  return AccountModal.where({
    user_id: userId,
    flag: 1
  }).get()
}

// 通过账号获取用户账号
export function queryAccountByNumber(data) {
  return AccountModal.where({
    user_id: data.userId,
    group_id: data.groupId,
    group_name: data.groupName,
    number: data.number
  }).get()
}

// 添加账号
export function addAccount(data) {
  return AccountModal.add({
    data: {
      user_id: data.userId,
      title: data.title,
      group_id: data.groupId,
      group_name: data.groupName,
      number: data.number,
      password: data.password,
      flag: 0,
      description: data.description,
      hidden: data.hidden,
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  })
}

// 更新账号
export function updateAccount(data) {
  return AccountModal.doc(data._id).update({
    data: {
      title: data.title,
      group_id: data.group_id,
      group_name: data.group_name,
      number: data.number,
      password: data.password,
      flag: data.flag,
      hidden: data.hidden,
      description: data.description,
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  })
}

// 删除账号
export function deleteAccount(id) {
  return AccountModal.doc(id).remove()
}
