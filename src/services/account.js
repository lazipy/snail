import dayjs from 'dayjs'

const db = wx.cloud.database({ env: 'snail-4607b6' })
const AccountModal = db.collection('Accounts')
const GroupModal = db.collection('Groups')

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
    const res = await AccountModal.doc(result._id).get()
    return {
      head: { code: 1, message: '添加账号成功' },
      body: { data: res.data }
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * 添加好友分享的账号
 * @param {userId, title, number, password, hidden, description, groupName}
 */
export async function addShareAccount(data) {
  try {
    let groupId = ''
    const groups = await GroupModal.where({
      user_id: data.userId,
      name: data.groupName
    }).get()
    if (groups.data.length === 0) {
      let result = await GroupModal.add({
        data: {
          user_id: data.userId,
          logo: '',
          name: data.groupName,
          description: '暂无分类介绍',
          created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      })
      groupId = result._id
    } else {
      groupId = groups.data[0]._id
    }
    const result = await AccountModal.add({
      data: {
        user_id: data.userId,
        title: data.title,
        number: data.number,
        password: data.password,
        hidden: data.hidden,
        description: data.description,
        group_id: groupId,
        group_name: data.groupName,
        flag: 0,
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    const res = await AccountModal.doc(result._id).get()
    return {
      head: { code: 1, message: '添加账号成功' },
      body: { data: res.data }
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
    }).get()
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

/**
 * 星标账号
 * @param {userId}
 */
export async function flagAccount(id, flag) {
  try {
    const result = await AccountModal.doc(id).update({
      data: {
        flag,
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    return {
      head: { code: 1, message: '星标账号成功' },
      body: { data: result }
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * 编辑账号
 * @param {id, userId, title, number, password, hidden, description, groupId, groupName, flag}
 */
export async function editAccount(data) {
  try {
    await AccountModal.doc(data.id).update({
      data: {
        user_id: data.userId,
        title: data.title,
        number: data.number,
        password: data.password,
        hidden: data.hidden,
        description: data.description,
        group_id: data.groupId,
        group_name: data.groupName,
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    const res = await AccountModal.doc(data.id).get()
    return {
      head: { code: 1, message: '编辑账号成功' },
      body: { data: res.data }
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * 删除账号
 * @param {userId}
 */
export async function deleteAccount(id) {
  try {
    const result = await AccountModal.doc(id).remove()
    return {
      head: { code: 1, message: '该账号已删除' },
      body: { data: result }
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * 通过id获取账号信息
 * @param {accountId}
 */
export async function getAccountInfoById(accountId) {
  try {
    const result = await AccountModal.doc(accountId).get()
    return {
      head: { code: 1, message: '获取账号信息成功' },
      body: { data: result.data }
    }
  } catch (err) {
    console.log(err)
  }
}
