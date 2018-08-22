<script>
    export default {
        created() {
            // 调用API从本地缓存中获取数据
            const logs = wx.getStorageSync('logs') || []
            logs.unshift(Date.now())
            wx.setStorageSync('logs', logs)
            wx.getLocation({
                type: 'gcj02', // gcj02 返回国测局坐标，可用于wx.openLocation的坐标
                success: res => {
                    wx.setStorageSync('location', res)
                }
            })
            console.log('app created and cache logs by setStorageSync')
        }
    }
</script>

<style>

</style>
