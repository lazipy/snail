const db = wx.cloud.database({ env: 'snail-4607b6' })
const HelpCenterModal = db.collection('HelpCenters')

/**
 * 获取帮助数据
 */
export async function getHelpCenters() {
  const res = await HelpCenterModal.get()
  return {
    head: { code: 1, message: '获取帮助中心数据成功' },
    body: { data: res.data }
  }
}
