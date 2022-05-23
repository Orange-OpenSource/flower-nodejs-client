module.exports.sleep = function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s*1000));
};