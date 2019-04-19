import dayjs from 'dayjs'

const db = wx.cloud.database({ env: 'snail-4607b6' })
const AccountModal = db.collection('Accounts')

/**
 * 添加账号
 * @param {userId, title, number, password, hidden, description, groupId, groupName}
 */
export async function addAccount(data) {
  try {
    const result = await AccountModal.add({
      data: {
        user_id: data.userId,
        title: data.title,
        number: data.number,
        password: data.password,
        hidden: data.hidden,
        description: data.description,
        group_id: data.groupId,
        group_name: data.groupName,
        flag: 0,
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    return {
      head: { code: 1, message: '添加账号成功' },
      body: { data: result }
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * 获取用户所有账号
 * @param {userId}
 */
export async function queryAccounts(userId) {
  try {
    const result = await AccountModal.where({
      user_id: userId
    }).orderBy('updated_at', 'desc').get()
    return {
      head: { code: 1, message: '获取用户账号成功' },
      body: { data: result.data }
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * 获取用户某类型下的所有账号
 * @param {userId, groupId}
 */
export async function queryGroupAccounts(data) {
  try {
    const result = await AccountModal.where({
      user_id: data.userId,
      group_id: data.groupId
    }).orderBy('updated_at', 'desc').get()
    return {
      head: { code: 1, message: '获取用户类型下的账号成功' },
      body: { data: result.data }
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * 获取用户所有的星标账号
 * @param {userId}
 */
export async function queryFlagAccounts(userId) {
  try {
    const result = await AccountModal.where({
      user_id: userId,
      flag: 1
    }).orderBy('updated_at', 'desc').get()
    return {
      head: { code: 1, message: '获取用户的星标账号成功' },
      body: { data: result.data }
    }
  } catch (err) {
    console.log(err)
  }
}
