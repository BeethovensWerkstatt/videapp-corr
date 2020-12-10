
/**
 * @namespace toolbox
 */

/**
 * create UUID (v4)
 * @memberOf toolbox
 * @returns {String} - unique UUID
 */
function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export /**
 * toolbox
 * @memberof toolbox
 */ default { uuidv4 }
