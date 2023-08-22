/*
 * @Author: lijun.zhu@huijie-inc.com
 * @Date: 2023-08-21 10:04:48
 * @LastEditors: lijun.zhu@huijie-inc.com
 * @LastEditTime: 2023-08-22 10:14:47
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

  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let hour = date.getHours();
  let min = date.getMinutes();

  month = month < 10 ? `0${month}` : month;
  hour = hour < 10 ? `0${hour}` : hour;
  min = min < 10 ? `0${min}` : min;

  return `${year}-${month}-${date.getDate()} ${hour}:${min}`;
};

class SentryController extends Controller {
  /**
   * 接收Sentry发送过来的Webhook
   */
  async recvSentryWebhook() {
    const { ctx } = this;
    const { request: { body } } = ctx;
    const error = body.data && body.data.error || {};

    ctx.logger.info(body);

    const ROBOT_DATA = {
      msgtype: 'markdown',
      markdown: {
        content: `<font color=\"warning\">${error.release || error.extra._productName}</font>发生错误:
                  > 错误原因: <font color=\"info\">${error.title}</font>
                  > 错误时间: <font color=\"info\">${fmtDateTime()}</font>
                  > 错误级别: <font color=\"${error.level === 'fatal' ? '#FF0000' : '#008000'}\">${error.level}</font>
                  > 错误链接: [查看日志](${error.web_url})`,
      },
    };

    const result = await axios({
      url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=9dbba44d-bb37-43f6-9f26-6d8eb4ab9b0c',
      method: 'GET',
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
