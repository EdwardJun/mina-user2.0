// import ModoConfig from './config'
// import Utils from './common'

/**
 * 兼容方式 - 接口
 * 对于新增的 API，可以用以下代码来判断是否支持用户的手机。
 */
let showVersionTips = function() {
    // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
    return undefined
}

export default {
    getLocation() {
        return wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                res
            }
        })
    },
    // 获取ext.json文件内容
    getExtConfig(ext) {
        return wx.getExtConfig({
            success: function(res) {
                ext(res.extConfig)
            }
        })
    }
}

