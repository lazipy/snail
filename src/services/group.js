import dayjs from 'dayjs'
const db = wx.cloud.database()
const GroupModal = db.collection('Groups')
const AccountModal = db.collection('Accounts')

// 获取分组信息
export function queryGroupById(id) {
  return GroupModal.doc(id).get()
}

// 获取用户的所有分组
export function queryGroupByUserId(userId) {
  return GroupModal.where({
    user_id: userId
  }).get()
}

// 获取用户某名称的所有分组
export function queryGroupByName(data) {
  return GroupModal.where({
    user_id: data.userId,
    name: data.name
  }).get()
}

// 添加分组
export function addGroup(data) {
  return GroupModal.add({
    data: {
      user_id: data.userId,
      logo: data.logo || null,
      name: data.name,
      description: data.description,
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  })
}

// 更新分组
export function updateGroup(data) {
  return GroupModal.doc(data.id).update({
    data: {
      logo: data.logo || null,
      name: data.name,
      description: data.description,
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  })
}

// 删除分组
export async function deleteGroup(id) {
  const res = await AccountModal.where({
    group_id: id
  }).get()
  const accounts = res.data
  for (let account of accounts) {
    await AccountModal.doc(account._id).remove()
  }
  return GroupModal.doc(id).remove()
}
