
/**
 * create UUID (v4)
 * @module toolbox
 * @returns {String} - unique UUID
 */
function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const AtReId = new RegExp('^.*\\/([^\\/\\.]*)\\.json')
/**
 * extract id from URL. For example from
 * `https://api.beethovens-werkstatt.de/module3/xf07b16aa-ddbe-4548-9e78-0b3f1752bf0c.json`
 *
 * extract `xf07b16aa-ddbe-4548-9e78-0b3f1752bf0c`
 *
 * @memberof toolbox
 * @param {String} atid
 * @returns {String} - uuid part of url
 */
function atId (atid) {
  const m = AtReId.exec(atid)
  if (m && m[1]) {
    return m[1]
  }
  return null
}

/**
 * create roman numeral string
 *
 * taken from <https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript?page=1&tab=votes#tab-top>
 *
 * @memberof toolbox
 * @param {Number} num - number to convert
 */
function toRoman (num) {
  num = Math.floor(num)
  var val
  var s = ''
  var i = 0
  const v = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const r = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']

  /**
   * convert bif integer to roaman string
   * @param {Number} num - num > 39999
   */
  function toBigRoman (num) {
    var ret = ''
    var n1 = ''
    var rem = num
    while (rem > 1000) {
      var prefix = ''
      var suffix = ''
      var n = rem
      var s = '' + rem
      var magnitude = 1
      while (n > 1000) {
        n /= 1000
        magnitude *= 1000
        prefix += '('
        suffix += ')'
      }
      n1 = Math.floor(n)
      rem = s - (n1 * magnitude)
      ret += prefix + n1.toRoman() + suffix
    }
    return ret + rem.toRoman()
  }

  if (this - num || num < 1) num = 0
  if (num > 3999) return toBigRoman(num)

  while (num) {
    val = v[i]
    while (num >= val) {
      num -= val
      s += r[i]
    }
    ++i
  }
  return s
};

/**
 * data URL for desktop background image
 */
export const desktopTile = 'data:image/png;base64,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'

/**
 * data URL for transparent background image
 */
export const transpTile = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpVUqDnYo4pChOlkRFREnrUIRKpRaoVUHk0s/hCYNSYqLo+BacPBjserg4qyrg6sgCH6AuLk5KbpIif9LCi1iPDjux7t7j7t3gFAvM9XsGAVUzTLSibiYza2IgVd0IYIgpjEiMVOfTaWS8Bxf9/Dx9S7Gs7zP/Tl6lLzJAJ9IPMN0wyJeJ57ctHTO+8RhVpIU4nPiYYMuSPzIddnlN85FhwWeGTYy6TniMLFYbGO5jVnJUIkniKOKqlG+kHVZ4bzFWS1XWfOe/IWhvLa8xHWaA0hgAYtIQYSMKjZQhoUYrRopJtK0H/fw9zv+FLlkcm2AkWMeFaiQHD/4H/zu1iyMj7lJoTjQ+WLbH4NAYBdo1Gz7+9i2GyeA/xm40lr+Sh2Y+iS91tKiR0DvNnBx3dLkPeByB4g86ZIhOZKfplAoAO9n9E05oO8W6F51e2vu4/QByFBXyRvg4BAYKlL2mse7g+29/Xum2d8P1t9yzw89Uk4AAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflCRgJACLIUUf7AAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAARVJREFUeNrtwTEBAAAAwqD1T+1rCKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgDATwAAdgpQwQAAAAASUVORK5CYII='

const rexywh = new RegExp('xywh=(\\d+),(\\d+),(\\d+),(\\d+)')
/**
 * @param {String} xywh X-Y-W-H value
 * @returns {Object} with properties x, y, width, height
 */
function parsexywh (xywh) {
  const m = rexywh.exec(xywh)
  return {
    x: parseInt(m[1]),
    y: parseInt(m[2]),
    width: parseInt(m[3]),
    height: parseInt(m[4])
  }
}

/**
 * create image data URL
 */
function createImageFromText ({ width, height, text, x, y, f }) {
  const canvas = document.createElement('canvas')

  canvas.setAttribute('width', width)
  canvas.setAttribute('height', height)

  const ctx = canvas.getContext('2d')
  // console.log(f)
  ctx.font = f
  ctx.fillText(text, x, y)

  return canvas.toDataURL('jpg')
}

export default { uuidv4, atId, parsexywh, toRoman, createImageFromText, desktopTile }
