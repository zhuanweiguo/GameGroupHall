'use strict';

let uniID = require('uni-id')
exports.main = async (event, context) => {
  uniID = uniID.createInstance({
    context
  })

  let params = event.params || {}
  let res = {}

  switch (event.action) {
    case 'register': {
      const {
        username,
        password
      } = params
      res = await uniID.register({
        username,
        password
      });
      break;
    }
    case 'login': {
      const {
        username,
        password
      } = params
      res = await uniID.login({
        username,
        password
      });
      break;
    }
    case 'loginByWeixin': {
      const {
        code
      } = params
      res = await uniID.loginByWeixin({
        code
      });
      break;
    }
    case 'loginByAlipay': {
      const {
        code
      } = params
      res = await uniID.loginByAlipay({
        code
      });
      break;
    }
    default:
      res = {
        code: 403,
        msg: '非法访问'
      }
      break;
  }

  //返回数据给客户端
  return res
};
