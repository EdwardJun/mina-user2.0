/**
 *  通用方法库
 *  Created by LooooG on 2018/04/11.
 */

import ModoConfig from './config'
// import Api from './wxApi'
import eventHub from './hub'
import Modo from 'modo-ui'
const Api = Modo.Api

function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}


export default {
    /**
     * 扩展对象(重写原属性或方法)
     * means that properties in dest will be overwritten by the ones in src.
     *
     * @param {Object} dest
     * @param {Object} src
     * @param {Boolean} [merge]
     * @returns {Object} dest
     */
    extend(dest, src, merge) {
        let keys = Object.keys(src),
            i = 0
        while (i < keys.length) {
            if (!merge || (merge && dest[keys[i]] === undefined)) {
                dest[keys[i]] = src[keys[i]]
            }
            i++
        }
        return dest
    },

    /**
     * 合并对象(不重写原属性或方法)
     * means that properties that exist in dest will "not" be overwritten by src
     *
     * @param {Object} dest
     * @param {Object} src
     * @returns {Object} dest
     */
    merge(dest, src) {
        return extend(dest, src, true)
    },

    /**
     * 类继承
     * simple class inheritance
     *
     * @param {Function} child
     * @param {Function} base
     * @param {Object} [properties]
     */
    inherit(child, base, properties) {
        let baseP = base.prototype,
            childP

        childP = child.prototype = Object.create(baseP)
        childP.constructor = child
        childP._super = baseP

        if (properties) {
            extend(childP, properties)
        }
    },

    /**
     * 将json类型的参数转换成url
     * json data turn to url param string.
     * @param {json} jsondata
     * @returns {string}
     */
    json2param(jsondata) {
        let p = ''
        for (let x in jsondata) {
            if (p === '') {
                p = (typeof jsondata [x] !== 'object') ? p + x + "=" + jsondata[x] : p + x + "=" + JSON.stringify(jsondata[x])
            } else {
                p = (typeof jsondata [x] !== 'object') ? p + "&" + x + "=" + jsondata[x] : p + "&" + x + "=" + JSON.stringify(jsondata[x])
            }
        }
        return p
    },

    /**
     * 获取url中的参数
     * @param url
     * @param name
     * @returns {*}
     */
    getQueryString(url, name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        let r = url.substr(url.lastIndexOf("?") + 1).match(reg)
        if (r != null) {
            return decodeURI(r[2])
        }
        return null
    },

    json2Form(json) {
        let str = []
        for (let p in json) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]))
        }
        return str.join("&")
    },

    /**
     * url处理
     * @param url
     * @param param
     * @returns {*}
     */
    handleRequestUrl(url, param) {
        if (url.indexOf(`{`) === -1) {
            return url
        }
        for (let s in param) {
            if (url.indexOf(`{${s}}`)) {
                return url.replace(`{${s}}`, param[s])
            }
        }
        return url
    },

    /**
     * http Get请求
     * @param {Object} context
     * @param {String} url 请求地址
     * @param {Object} [param] 参数
     * @param {String} [type] 请求类型：get, post
     * @param {Boolean} [showLoading] 是否显示loading，默认显示
     * @param {Boolean} [showTips] 请求错误是否显示提示，默认显示
     * @returns {Promise}
     */
    async httpRequest(context, url, param, type = 'get', showLoading = false, showTips = true) {
        let tag = false,
            data = {},
            status = 200,
            message = 'ok',
            tips

        // 请求类型
        if (type !== 'get' && type !== 'post') {
            type = 'get'
        }
        // url预处理
        url = this.handleRequestUrl(url, param)
        // 参数处理
        param = Object.assign(this.getCommonParam(context.$store.state.token), param)
        if (type === 'post') {
            // Form Data参数数据处理
            param = this.json2Form(param)
        }

        console.log(ModoConfig.host + ModoConfig.baseUrl + url + '?' + JSON.stringify(param))
        showLoading && Api.showLoading('加载中...')
        await context.$http[type](url, param).then(response => {
            showLoading && Api.hideLoading()
            console.log('data: ', response.data)
            status = response.data.statusCode || 'unknown'
            if (typeof status === 'number' && status >= 200 && status <= 299) {
                tag = true
                data = response.data
            } else {
                tag = false
                message = response.data.msg || 'unknown'
                showTips && Api.showToast(`${message}`)
                console.log(status, message)
            }
        }).catch(err => {
            showLoading && Api.hideLoading()
            tag = false
            status = err.statusCode || err.status || 'unknown'
            message = err.msg || err.message || 'unknown'
            tips = message.indexOf('request:fail') === -1 ? `${message}：${status}` : '似乎已断开与互联网的连接'
            showTips && Api.showModal(tips, null, null, false)
            console.log(status, message)
            if (status === 401) {
                // token过期(抢登或其他情况导致过期)需要重新登录
                eventHub.$emit('logout')
            }
        })
        return new Promise(function (resolve, reject) {
            // tag ? resolve(data) : reject({status: status, message: message})
            tag ? resolve(data) : resolve({status: status, message: message})
        })
    },
    /**
     * 获取通用参数
     *
     * @param {String} [token]
     * @returns {{appType: string, timestamp: number, usertype: string}}
     */
    getCommonParam(token) {
        let param = {
            appType: ModoConfig.appType,
            timestamp: (+new Date()),
            usertype: ModoConfig.usertype,
            userType: ModoConfig.usertype,
            sessionType: 'mina',
            appVersion: 'mina.1.0.0'
        }
        token && (param.token = token)
        return param
    },
    /**
     * 时间格式化
     * @param date
     * @returns {string}
     */
    formatTime(date) {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()

        const t1 = [year, month, day].map(formatNumber).join('.')
        const t2 = [hour, minute, second].map(formatNumber).join(':')

        return `${t1} ${t2}`
    },
    /**
     * 时间格式化 2月8日 19:30
     * @param date
     * @returns {{date: string, time: string}}
     */
    formatTimeMinZh(date) {
        const month = date.getMonth() + 1
        const day = date.getDate()

        const hours = date.getHours() + ''
        const minutes = date.getMinutes() + ''

        return {date: `${month}月${day}日`, time: `${hours.length === 1 ? '0' + hours : hours}:${minutes.length === 1 ? '0' + minutes : minutes}`}
    },

    /**
     * 消息时间格式化
     * @param {number} time
     */
    formatMsgTime(time) {
        let date = (new Date()),
            today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
            yesterday = new Date(today - 24 * 3600 * 1000).getTime(),
            theDate = new Date(time),
            hours = theDate.getHours().toString(),
            minutes = theDate.getMinutes().toString()

        return theDate.getTime() < today ?
            yesterday <= theDate.getTime() ? '昨天' : (theDate.getMonth() + 1) + '月' + theDate.getDate() + '日' :
            `${hours.length === 1 ? '0' + hours : hours}:${minutes.length === 1 ? '0' + minutes : minutes}`
    },

    /**
     * 消息时间格式化 - 聊天界面
     * @param {number} time
     */
    formatMsgTimeInSess(time) {
        let date = (new Date()),
            today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
            yesterday = new Date(today - 24 * 3600 * 1000).getTime(),
            theDate = new Date(time),
            hours = theDate.getHours().toString(),
            minutes = theDate.getMinutes().toString(),
            desc = theDate.getTime() < today ?
                yesterday <= theDate.getTime() ? '昨天 ' : (theDate.getMonth() + 1) + '月' + theDate.getDate() + '日 ' : ''

        return `${desc}${hours.length === 1 ? '0' + hours : hours}:${minutes.length === 1 ? '0' + minutes : minutes}`
    },

    /**
     * 检测对象是否已定义
     * object is defined or not
     * @param {object|*} obj
     * @returns {boolean}
     */
    isDefined(obj) {
        return obj != null // 要同时判断 null 和 undefined
    },

    /**
     * 检测是否空对象
     * is empty object or not "{}"
     * @param {object} obj
     * @returns {boolean}
     */
    isEmptyObj(obj) {
        for (let s in obj) {
            return false
        }
        return true
    },

    /**
     * 检测Email地址是否合法
     * Email address format validation.
     * @param {string} str
     * @returns {boolean}
     */
    isEmail(str) {
        let reg = /^([a-zA-Z0-9]+[_|/_|/.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|/_|/.]?)*[a-zA-Z0-9]+(.[a-zA-Z]{2,3})$/
        return reg.test(str)
    },

    /**
     * 检测手机号码格式是否合法
     * Mobile phone format validation.
     * @param {string} str
     * @returns {boolean}
     */
    isPhone(str) {
        let reg = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/
        return reg.test(str)
    },

    /**
     * 将一个数组分成几个同等长度的数组
     * array[分割的原数组]
     * size[每个子数组的长度]
     */
    sliceArray(array, size) {
        let result = []
        for (let x = 0; x < Math.ceil(array.length / size); x++) {
            let start = x * size
            let end = start + size
            result.push(array.slice(start, end))
        }
        return result
    },

    /**
     * 强制保留2位小数，如：2，会在2后面补上00.即2.00
     * x[需要保留2位小数的值]
     */
    toDecimal2(x) {
        let f = parseFloat(x)
        if (isNaN(f)) {
            return false
        }
        f = Math.round(x * 100) / 100
        let s = f.toString()
        let rs = s.indexOf('.')
        if (rs < 0) {
            rs = s.length
            s += '.'
        }
        while (s.length <= rs + 2) {
            s += '0'
        }
        return s
    },

    /**
     * 获取当前 url 中携带的参数
     */
    getCurrentPageParam () {
        let pages = getCurrentPages() //获取加载的页面
        let currentPage = pages[pages.length-1] //获取当前页面的对象
        let options = currentPage.options
        return options
    }
    
}

