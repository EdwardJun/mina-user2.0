<template>
    <div class="container">
        <div class="scroll-box">
            <scroll-view class="scroll-view" scroll-x style="width: auto;overflow:hidden;">
                <div class="item-menu">
                    <div class="item-menu-list" v-for="(menuItem, menuIndex) in items" :key="menuIndex">
                        <a href="" class="item-menu-link" :class="{ active: menuIndex == selectedIndex }" @click="goAnchor(menuIndex)">{{menuItem.menu_name}}</a>
                        <p class="indicator" v-if="menuIndex == selectedIndex"></p>
                    </div>
                </div>
            </scroll-view>
        </div>
        <scroll-view class="content" scroll-y="true" :style="{height: contentHeight + 'px'}" :scroll-into-view="toAnchorViewID">
            <div class="item-content-wrap" v-for="(menuItem, index) in items" :key="index">
                <div :id="anchorPrefix+index" class="content-header">
                    {{menuItem.menu_name}}
                </div>
                <div class="recommen-con">
                        <div class="recommen-border">
                            <img class="recommen-img" src="/static/img/test2.jpg" alt="">
                            <div class="recommen-shade">面部spa</div>
                            <div class="recommen-footer">
                                <span class="recommen-footer-left"><span class="yuan">￥</span>698</span>
                                <span class="recommen-footer-right">120分钟</span>
                            </div>
                        </div>
                        <div class="recommen-border">
                            <img class="recommen-img" src="/static/img/test2.jpg" alt="">
                            <div class="recommen-shade">面部spa</div>
                            <div class="recommen-footer">
                                <span class="recommen-footer-left"><span class="yuan">￥</span>698</span>
                                <span class="recommen-footer-right">120分钟</span>
                            </div>
                        </div>
                        <div class="recommen-border">
                            <img class="recommen-img" src="/static/img/test2.jpg" alt="">
                            <div class="recommen-shade">面部spa</div>
                            <div class="recommen-footer">
                                <span class="recommen-footer-left"><span class="yuan">￥</span>698</span>
                                <span class="recommen-footer-right">120分钟</span>
                            </div>
                        </div>
                        <div class="recommen-border">
                            <img class="recommen-img" src="/static/img/test2.jpg" alt="">
                            <div class="recommen-shade">面部spa</div>
                            <div class="recommen-footer">
                                <span class="recommen-footer-left"><span class="yuan">￥</span>698</span>
                                <span class="recommen-footer-right">120分钟</span>
                            </div>
                        </div>
                    </div>
            </div>
            <div class="content-footer"></div>
        </scroll-view>
    </div>
</template>

<script>
    import onShareAppMessage from '@/components/onShareAppMessage'

    export default {
        data() {
            return {
                toAnchorViewID: 'anchor-0',
                selectedIndex: 0, //当前选中下标
                anchorPrefix: 'anchor-',
                contentHeight: 1000,
                items: [
                    {
                        menu_name: "各式按摩",
                        items_list: []
                    },
                    {
                        menu_name: "大堂足浴",
                        items_list: []
                    },
                    {
                        menu_name: "SPA",
                        items_list: []
                    },
                    {
                        menu_name: "酒水",
                        menu_id: "drinks",
                        items_list: []
                    },
                    {
                        menu_name: " 零食",
                        items_list: []
                    },
                    {
                        menu_name: "VIP",
                        items_list: []
                    }
                ]
            }
        },
        mixins: [onShareAppMessage],
        components: {},
        methods: {
            goAnchor(selector) {
                console.log(">>>>>>>>>>>>>>>", 'anchor-'+selector)
                this.toAnchorViewID = this.anchorPrefix + selector
                this.selectedIndex = selector
            }
        },
        mounted() {
            let that = this
            // iphoneX标记
            that.isIphoneX = /iPhone X/.test(that.$store.state.systemInfo.model)
            // 计算出当前rpx倍数
            that.rpx = 2 * (that.$store.state.systemInfo.windowWidth * that.$store.state.systemInfo.pixelRatio) / (750 * that.$store.state.systemInfo.pixelRatio)
            // 消息区高度调整
            that.contentHeight = that.$store.state.systemInfo.screenHeight - 64 * that.rpx - 95 - (that.isIphoneX ? 54 : 0)
        },
        created() {
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        background-color: #FFFFFF;

        .scroll-box {
            height: 90px;
            width: 100%;
            overflow: hidden;
            background: #fff;
            white-space: nowrap;

            .scroll-view {
                height: 57px;
                margin: 23px 0px 0px 0px;
                .item-menu-list {
                    position: relative;
                    display: inline-block;
                    height: 57px;
                    box-pack: center;
                    margin-right: 10px;
                    .item-menu-link {
                        margin: 0px 25px;
                        height: 52px;
                        text-align: center;
                        font-size: 28px;
                        line-height: 28px;
                        color: #000000;

                        &:link {
                            background-color: #FFFFFF;
                        }
                        &:visited {
                            background-color: #FFFFFF;
                        }
                        &:hover {
                            background-color: #FFFFFF;
                        }
                        &:active {
                            background-color: #FFFFFF;
                        }
                    }

                    .active {
                        color: #ff6666;
                    }

                    .indicator {
                        background-color: #ff6666;
                        width: 30px;
                        height: 5px;
                        margin: -8px auto 0px;
                    }
                }
            }
        }
        .content {
            background-color: #FFFFFF;
            text-align: center;
            .item-content-wrap {
                .content-header {
                    position: relative;
                    margin: 38px 0px;
                    height: 30px;
                    width: 180px;
                    font-size: 30px;
                    line-height: 30px;
                    color: #333333;
                    display: inline-block;

                    &:before, &:after {
                        content: '';
                        position: absolute;
                        height: 1px;
                        width: 46px;
                        background-color: #333333;
                        display: inline-block;
                    }
                    &:before {
                        left: -46px;
                        top: 15px;
                    }
                    &:after {
                        right: -46px;
                        top: 15px;
                    }
                }

                .recommen-con {
                    padding: 0px 0 0 38px;
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: -30px;
                    text-align: left;
                    .recommen-border {
                        flex: 1;
                        flex: 0 0 323px;
                        position: relative;
                        width: 323px;
                        height: 406px;
                        box-shadow: 4px 6px 10px rgb(182, 180, 180);
                        margin-right: 30px;
                        margin-top: 30px;
                        .recommen-img {
                            width: 323px;
                            height: 321px;
                        }
                        .recommen-shade {
                            box-sizing: border-box;
                            position: absolute;
                            bottom: 85px;
                            padding-left: 15px;
                            width: 100%;
                            height: 57px;
                            line-height: 57px;
                            font-size: 31px;
                            color: #FFFFFF;
                            background-color: #616161;
                            opacity: 0.7;
                            filter: alpha(opacity=70);
                        }
                        .recommen-footer {
                            position: absolute;
                            top: 321px;
                            width: 100%;
                            height: 85px;
                            line-height: 85px;
                            display: flex;
                            align-items: baseline;
                            .recommen-footer-left {
                                flex: 1;
                                margin-left: 14px;
                                font-size: 37px;
                                color: #ff8c85;
                                .yuan {
                                    font-size: 23px;
                                }
                            }
                            .recommen-footer-right {
                                flex: 1;
                                text-align: right;
                                margin-right: 10px;
                                font-size: 23px;
                                color: #616161;
                            }
                        }
                    }
                }
            }

            .content-footer {
                background-color: #FFFFFF;
                height: 100px;
            }
        }
    }

</style>
