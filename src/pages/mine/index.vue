<template>
    <div class="mine-container">
        <div class="mine-hd">
            <div class="say-hi">Hi~我是安娜, 有问题随时联系我哟~</div>
            <div><img src="/static/img/service.png"></div>
        </div>
        <div class="service">
            <div class="service-time">{{ currTime }}</div>
            <div class="service-avatar"><div class="service-text">我猜你想找这些 :</div></div>
            <div class="service-category">
                <button class="to-contact-btn" open-type="contact"><div><span></span><div>在线预约</div></div></button>
                <button class="to-contact-btn" open-type="contact"><div><span></span><div>与技师聊天</div></div></button>
                <button class="to-contact-btn" open-type="contact"><div><span></span><div>了解更多</div></div></button>
            </div>
            <!-- <button open-type="contact">进入客服会话</button> -->
        </div>
    </div>
</template>

<script>
    import onShareAppMessage from '@/components/onShareAppMessage'
    import Utils from '@/utils/common'

    export default {
        data() {
            return {
                currTime: ''
            }
        },
        mixins: [onShareAppMessage],
        components: {
        },
        onShow () {
            this.currTime = Utils.formatTime(new Date())
        },
        methods: {
        }
    }
</script>

<style lang="scss" scoped>
    @import "~asset/css/_value";

    .mine-container {
        .mine-hd {
            width: 100%;
            height: 200px;
            background: linear-gradient(#7a68e6, #5144b5);
            position: relative;
            .say-hi{
                width: 504px;
                height: 64px;
                line-height: 64px;
                color: #fff;
                font-size: 28px;
                background-color: #958ade;
                text-align: center;
                border-top-left-radius: 40px;
                border-bottom-left-radius: 40px;
                border-bottom-right-radius: 50px;
                left: 40px;
                position: absolute;
                top: 85px;
            }
            >div{
                &:nth-of-type(2){
                    width: 198px;
                    height: 184px;
                    position: absolute;
                    right: 10px;
                    bottom: 0;
                    >img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
        .service{
            .service-time{
                line-height: 50px;
                font-size: 20px;
                color: #c1c1c1;
                text-align: center;
                margin-top: 20px;
            }
            .service-avatar{
                position: relative;
                &::before{
                    content: "";
                    position: absolute;
                    width: 84px;
                    height: 84px;
                    background: url("~asset/img/service_header.png");
                    background-size: 100% 100%;
                    top: 35px;
                    left: 20px;
                }
                .service-text{
                    width: 310px;
                    height: 104px;
                    line-height: 104px;
                    display: inline-block;
                    color: #333;
                    font-size: 32px;
                    background-color: #fff;
                    border-radius: 10px;
                    margin-left: 150px;
                    margin-top: 35px;
                    text-align: center;
                    position: relative;
                    &::before{
                        content: "";
                        position: absolute;
                        width: 20px;
                        height: 20px;
                        background-color: #fff;
                        left: -10px;
                        top: 30px;
                        transform: rotate(45deg);
                    }
                }
            }
            .service-category{
                margin-top: 40px;
                margin-left: 10px;
                .to-contact-btn {
                    width: 188px;
                    height: 188px;
                    background-color: #fff;
                    border-radius: 16px;
                    display: inline-block;
                    margin-left: 20px;
                    text-align: center;
                    padding: 0;
                    &::after {
                        border: none;
                    }
                    &:nth-of-type(2){
                        >div {
                            >span{
                                background: url("~asset/img/tech.png");
                                background-size: 100% 100%;
                            }
                        }
                    }
                    &:nth-of-type(3){
                        >div {
                            >span{
                                background: url("~asset/img/more.png");
                                background-size: 100% 100%;
                            }
                        }
                    }
                    >div{
                        width: 100%;
                        height: 100%;
                        text-align: center;
                        >span{
                            width: 100px;
                            height: 100px;
                            display: inline-block;
                            background: url("~asset/img/appoint.png");
                            background-size: 100% 100%;
                            margin: 20px 0 0;
                        }
                        >div{
                            position: relative;
                            top: -10px;
                            text-align: center;
                            font-size: 28px;
                            line-height: 1;
                            color: #333;
                        }
                    }
                }
                
            }
            button{
                margin-top: 30px;
            }
        }
    }
</style>
