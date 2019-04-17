const factor = 1000
const START_DOT = 1484194326700000

/**
 *以秒毫为单位, 13 位 + 1000以内的随机数
 * @returns {number}
 */
export function createId() {
  return new Date() * factor + Math.floor(Math.random() * factor * factor) - START_DOT
}
