<script>
    export default {
        // 设置页面转发
        onShareAppMessage(res) {
            console.log(res)
            return {
                title: '小摩豆会所',
                path: '/pages/index/main',
                imageUrl: 'http://mprelease-1252973237.cossh.myqcloud.com/resource/shareImg.png'
            }
        }
    }
</script>
