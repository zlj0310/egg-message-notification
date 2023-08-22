/*
 * @Author: lijun.zhu@huijie-inc.com
 * @Date: 2023-08-21 10:04:48
 * @LastEditors: lijun.zhu@huijie-inc.com
 * @LastEditTime: 2023-08-22 15:33:39
 * @Description:
 */
'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');
const CircularJSON = require('circular-json');

/**
 * 对当前时间进行格式化
 */
const fmtDateTime = () => {
  const date = new Date();

  const month = String(date.getMonth() + 1).padStart(2,'0');
  const hour = String(date.getHours()).padStart(2,'0');
  const minute = String(date.getMinutes()).padStart(2,'0');

  return `${date.getFullYear()}-${month}-${date.getDate()} ${hour}:${minute}`;
};

class SentryController extends Controller {
  /**
   * 接收Sentry发送过来的Webhook
   */
  async recvSentryWebhook() {
    const { ctx } = this;
    const { request: { body } } = ctx;
    const error = body.data && body.data.error || {};

    ctx.logger.info('====body====',body);
    ctx.logger.info('====error====',error);

    const ROBOT_DATA = {
      msgtype: 'markdown',
      markdown: {
        content: `<font color=\"warning\">${'error'}</font>发生错误:
                  > 错误原因: <font color=\"info\">${error.title}</font>
                  > 错误时间: <font color=\"info\">${fmtDateTime()}</font>
                  > 错误级别: <font color=\"${error.level === 'error' ? '#FF0000' : '#D99E37'}\">${error.level}</font>
                  > 错误链接: [查看日志](${error.web_url})`,
      },
    };

    const result = error.title && await axios({
      url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=9dbba44d-bb37-43f6-9f26-6d8eb4ab9b0c',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify(ROBOT_DATA),
    });

    ctx.body = {
      status: 'success',
      data: CircularJSON.stringify(result),
      msg: '提醒成功',
    };
  }
}

module.exports = SentryController;
