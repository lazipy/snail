import dayjs from 'dayjs'
const db = wx.cloud.database()
const InviteModal = db.collection('Invites')

// 创建邀请
export function createInvite(data) {
  return InviteModal.add({
    data: {
      from_id: data.fromId,
      to_id: data.toId,
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  })
}

// 通过 from_id 获取邀请条数
export function queryInvitesById(userId) {
  return InviteModal.where({
    from_id: userId
  }).get()
}
