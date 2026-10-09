// assert.js
const assert = {
  equal(actual, expected, message) {
    if (actual === expected) {
      console.log(`✅ [通过] ${message}`);
    } else {
      console.error(`❌ [失败] ${message}。预期: ${expected}, 实际: ${actual}`);
    }
  },
  true(value, message) {
    if (value) {
      console.log(`✅ [通过] ${message}`);
    } else {
      console.error(`❌ [失败] ${message}`);
    }
  },
  throws(fn, expectedMsg, message) {
    try {
      fn();
      console.error(`❌ [失败] ${message}。没有抛出异常。`);
    } catch (e) {
      if (e.message.includes(expectedMsg)) {
        console.log(`✅ [通过] ${message}`);
      } else {
        console.error(`❌ [失败] ${message}。异常信息不匹配: ${e.message}`);
      }
    }
  }
};