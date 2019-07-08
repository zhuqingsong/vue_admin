var crypto = require('crypto');
let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;

module.exports = {
  md5: function (text) {
    return crypto.createHash('md5').update(text).digest('hex');
  },
  secretOrKey: "zqs",
  validatePhone: (rule, value, callback) => {
    if (!value) {
      return callback(new Error("号码不能为空!!"));
    }
    if (!phoneReg.test(value)) {
      callback(new Error("格式有误"));
    } else {
      callback();
    }
  }
};