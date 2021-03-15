/**
 * @module toolbox/net
 */

/**
 * @namespace utf8
 */
const utf8 = {
  /**
     * encode string to UTF-8
     * @memberof utf8
     * @param {String} string
     */
  encode (string) {
    string = string.replace(/\r\n/g, '\n')
    var utftext = ''
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n)
      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }
    }
    return utftext
  },
  /**
     * decode string from UTF-8
     * @memberof utf8
     * @param {String} string
     */
  decode (utftext) {
    var str = ''
    var i = 0
    var c1 = 0; var c2 = 0; var c3 = 0
    var utlen = utftext.length
    while (i < utlen) {
      c1 = utftext.charCodeAt(i)
      if (c1 < 128) {
        str += String.fromCharCode(c1)
        i++
      } else if ((c1 > 191) && (c1 < 224)) {
        c2 = utftext.charCodeAt(i + 1)
        str += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63))
        i += 2
      } else {
        c2 = utftext.charCodeAt(i + 1)
        c3 = utftext.charCodeAt(i + 2)
        str += String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) |
                    (c3 & 63))
        i += 3
      }
    }
    return str
  }
}

const PathHandler = {
  get (target, prop) {
    // console.log(typeof prop, prop)
    if (typeof prop === 'string' && prop >= 0 && prop < target.length) {
      return decodeURIComponent(target[prop])
    }
    switch (prop) {
      case 'shift':
        return () => decodeURIComponent(target.shift())
      case 'pop':
        return () => decodeURIComponent(target.pop())
      case 'push':
        return (p) => target.push(encodeURIComponent(p))
    }
    return target[prop]
  },
  set (target, prop, value) {
    if (typeof prop === 'string' && prop >= 0 && prop < target.length) {
      // console.log(prop, value)
      target[prop] = encodeURIComponent(value)
    } else {
      target[prop] = value
    }
    return target[prop]
  }
}

/**
 * Path class
 */
class Path {
  /**
   * construct Path object from string
   * @param {String} path
   */
  constructor (path) {
    const list = path.split('/')
    if (list.length > 1 && list[0].length === 0) {
      this._absolute = true
      list.shift()
    } else {
      this._absolute = false
    }
    if (list.length > 0 && list[list.length - 1].length === 0) {
      this._directory = true
      list.pop()
    } else {
      this._directory = false
    }
    // this._list = list.map(p => encodeURIComponent(decodeURIComponent(p)))
    this._list = []
    this.elements = new Proxy(this._list, PathHandler)
    list.forEach(p => this.elements.push(decodeURIComponent(p)))
  }

  get length () {
    return this._list.length
  }

  get absolute () {
    return this._absolute
  }

  set absolute (a) {
    if (a) {
      this._absolute = true
    } else {
      this._absolute = false
    }
  }

  get directory () {
    return this._directory
  }

  set directory (d) {
    if (d) {
      this._directory = true
    } else {
      this._directory = false
    }
  }

  toString () {
    return (this._absolute ? '/' : '') + this._list.join('/') + (this._list.length > 0 && this._directory ? '/' : '')
  }
}

class Query {
  constructor (query) {
    const l = query.split('&')
    const kvr = new RegExp('^([^=]*)(=(.*))?$')
    this._q = []
    for (const e of l) {
      const m = kvr.exec(e)
      if (m && m[1] && m[1].length > 0) {
        this.addProperty(decodeURIComponent(m[1]), m[3] ? decodeURIComponent(m[3]) : undefined)
      }
    }
    this.str = query
  }

  propertyKeys () {
    const k = {}
    for (const q of this._q) {
      const key = decodeURIComponent(q[0])
      k[key] = k[key] ? (k[key] + 1) : 1
    }
    return Reflect.ownKeys(k)
  }

  getProperty (name) {
    const prop = encodeURIComponent(name)
    const val = []
    for (const p of this._q) {
      if (p[0] === prop) {
        val.push(p[1] ? p[1] : true)
      }
    }
    switch (val.length) {
      case 0: return undefined
      case 1: return decodeURIComponent(val[0])
    }
    return val.map(v => decodeURIComponent(v))
  }

  addProperty (name, value) {
    const prop = encodeURIComponent(name)
    const val = value ? encodeURIComponent(value) : false
    this._q.push([prop, val])
  }

  setProperty (name, value) {
    const prop = encodeURIComponent(name)
    const q = this._q.filter(p => p[0] !== prop)
    if (Array.isArray(value)) {
      for (const val of value.map(v => encodeURIComponent(v))) {
        q.push([prop, val])
      }
    } else {
      const val = value ? encodeURIComponent(value) : false
      q.push([prop, val])
    }
    this._q = q
  }

  toString () {
    return this._q.map(q => q[0] + (q[1] ? ('=' + q[1]) : '')).join('&')
  }
}

const urire = new RegExp('^(([^:/?#]+):)?(//((([^/?#@]*)@)?((\\[([0-9a-f\\:]*)\\])|([^/?#@:]*))(:([0-9]*))?))?([^?#]*)(\\?([^#]*))?(#(.*))?$')

class URL {
  constructor (url) {
    const rp = urire.exec(url)
    if (!rp) {
      throw 'not a URL: ' + url
    }
    // console.log(rp)
    this._scheme = rp[2]
    // this._authority = rp[4];
    this._credential = rp[6] ? decodeURIComponent(rp[6]) : undefined
    this._host = rp[7]
    this._port = rp[12]
    this._path = rp[13] ? new Path(rp[13]) : new Path('')
    this._query = rp[15] ? new Query(rp[15]) : new Query('')
    this.fragment = rp[17] ? decodeURIComponent(rp[17]) : rp[16] ? '' : undefined
  }

  get scheme () {
    return this._scheme
  }

  set scheme (scheme) {
    this._scheme = scheme
  }

  get credential () {
    if (this._credential) {
      return decodeURIComponent(this._credential)
    }
    return undefined
  }

  set credential (credential) {
    if (credential) {
      this._credential = encodeURIComponent(credential)
    } else {
      this._credential = undefined
    }
  }

  get host () {
    // TODO punycode
    return this._host
  }

  set host (host) {
    // TODO punycode
    this._host = host
  }

  get port () {
    return this._port
  }

  set port (port) {
    const p = parseInt(port)
    this._port = (p > 0 && p < 65536) ? ('' + p) : undefined
  }

  get path () {
    return this._path
  }

  set path (path) {
    this._path = new Path(path.toString())
  }

  get query () {
    return this._query
  }

  set query (query) {
    this._query = new Query(query.toString())
  }

  get fragment () {
    if (this._fragment) {
      return decodeURI(this._fragment)
    }
    return undefined
  }

  set fragment (fragment) {
    if (fragment) {
      this._fragment = encodeURI(fragment)
    } else {
      this._fragment = undefined
    }
  }

  toString () {
    var str = ''
    if (this._scheme && this._scheme.length > 0) {
      str = this._scheme + ':'
    }
    if (this._host && this._host.length > 0) {
      str += '//'
      if (this._credential && this._credential.length > 0) {
        str += this._credential + '@'
      }
      str += this._host
      if (this._port && this._port.length > 0) {
        str += ':' + this._port
      }
    }
    if (this._path.length > 0) {
      this._path.absolute = true
    }
    str += this._path
    if (this._query._q.length > 0) {
      str += '?' + this._query
    }
    if (this._fragment) {
      str += '#' + this._fragment
    }
    return str
  }
}

export default { utf8, Path, Query, URL }
