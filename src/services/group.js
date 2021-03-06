import dayjs from 'dayjs'

const db = wx.cloud.database({ env: 'snail-4607b6' })
const GroupModal = db.collection('Groups')
const AccountModal = db.collection('Accounts')

/**
 * 添加类型
 * @param {userId, logo, name, description}
 */
export async function addGroup(data) {
  try {
    const groups = await GroupModal.where({
      user_id: data.userId,
      name: data.name
    }).get()
    if (groups.data.length > 0) {
      return {
        head: { code: -1, message: '您已拥有该类型名称，请改换' },
        body: { data: groups.data }
      }
    }
    const result = await GroupModal.add({
      data: {
        user_id: data.userId,
        logo: data.logo,
        name: data.name,
        description: data.description,
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    const res = await GroupModal.doc(result._id).get()
    return {
      head: { code: 1, message: '添加类型成功' },
      body: { data: res.data }
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * 获取所有类型
 * @param {userId}
 */
export async function queryGroups(userId) {
  try {
    const groups = await GroupModal.where({
      user_id: userId
    }).get()

    return {
      head: { code: 1, message: '获取账号类型成功' },
      body: { data: groups.data }
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * 编辑类型
 * @param {id, userId, logo, name, description}
 */
export async function updateGroup(data) {
  try {
    await GroupModal.doc(data.id).update({
      data: {
        logo: data.logo,
        name: data.name,
        description: data.description,
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    const res = await GroupModal.doc(data.id).get()
    return {
      head: { code: 1, message: '编辑类型成功' },
      body: { data: res.data }
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * 删除类型
 * @param {id}
 */
export async function deleteGroup(id) {
  try {
    const accounts = await AccountModal.where({
      group_id: id
    }).get()
    for (let account of accounts.data) {
      await AccountModal.doc(account._id).remove()
    }
    const result = await GroupModal.doc(id).remove()
    return {
      head: { code: 1, message: '删除类型成功' },
      body: { data: result }
    }
  } catch (err) {
    console.log(err)
  }
}
