import dayjs from 'dayjs'
const db = wx.cloud.database({ env: 'snail-4607b6' })
const FeedbackModal = db.collection('Feedbacks')

/**
 * 提交问题反馈
 */
export async function postFeedback(data) {
  const res = await FeedbackModal.add({
    data: {
      title: data.title,
      content: data.content,
      imgUrl: data.imgUrl,
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  })
  return {
    head: { code: 1, message: '反馈成功' },
    body: { data: res }
  }
}
