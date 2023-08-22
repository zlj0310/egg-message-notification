/*
 * @Author: lijun.zhu@huijie-inc.com
 * @Date: 2023-08-21 10:02:41
 * @LastEditors: lijun.zhu@huijie-inc.com
 * @LastEditTime: 2023-08-22 10:18:31
 * @Description: 
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/sentry/webhook', controller.sentry.recvSentryWebhook);
};
