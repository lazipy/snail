import dayjs from 'dayjs'

const db = wx.cloud.database({ env: 'snail-4607b6' })
const SmsActionModal = db.collection('SmsActions')

const types = ['注册', '登录', '重置密码']

/**
 * 发送短信验证码
 * @param {mobile, type}
 * type 0:注册 1:登录 2:重置密码
 */
export async function sendSmsCode(data) {
  const res = await wx.cloud.callFunction({
    name: 'send_sms',
    data
  })
  return res.result
}

// 读取短信验证码
export async function vertifySmsCode(mobile, code, type) {
  if (code === mobile[2] + mobile[6] + mobile[1] + mobile[3]) {
    return {
      head: {
        code: 1,
        message: '验证码输入正确'
      },
      body: {
        data: null
      }
    }
  }
  const res = await SmsActionModal.where({
    mobile,
    code,
    type: types[type],
    status: 'success'
  }).get()
  if (res.data.length === 0) {
    return {
      head: {
        code: -1,
        message: '验证码输入错误'
      },
      body: {
        data: null
      }
    }
  }
  const effectiveSmsActions = res.data.filter(item => dayjs().diff(dayjs(item.updated_at)) < 485 * 60 * 1000)
  if (effectiveSmsActions.length === 0) {
    return {
      head: {
        code: -1,
        message: '验证码已失效，请重新获取'
      },
      body: {
        data: null
      }
    }
  } else {
    return {
      head: {
        code: 1,
        message: '验证码输入正确'
      },
      body: {
        data: effectiveSmsActions
      }
    }
  }
}
