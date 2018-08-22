<template>
    <div class="projectDetail-page">
        <div class="project-banner">
            <swiper class="swiper-banner" @change="swiperChange($event)" :indicator-dots="slideBanner.indicatorDots" :autoplay="slideBanner.autoplay" :interval="slideBanner.interval" 
            :duration="slideBanner.duration" :circular="slideBanner.circular" :indicator-color="slideBanner.indicatorColor" :indicator-active-color="slideBanner.indicatorActiveColor">
                <block v-for="(imgItem, imgIndex) in slideBanner.imgUrls" :key="imgIndex">
                    <swiper-item>
                        <image :src="imgItem || '/static/img/item_detail_default.png'" class="slide-image" />
                    </swiper-item>
                </block>
            </swiper>
            <div v-if="slideBanner.isShowDoc" class="banner-track-mattle"></div>
            <div v-if="slideBanner.isShowDoc" class="dots">
                <block v-for="(item,dotsIndex) in slideBanner.imgUrls.length" :key="dotsIndex">
                    <view class="dot" :class="dotsIndex==slideBanner.swiperCurrent? 'active': ''"></view>
                </block>
            </div>
        </div>
        <div class="project-price-mes" v-if="itemDetailData">
            <p class="text-ellipsis">{{itemDetailData.name}}</p>
            <div>
                <span>{{itemPrice.price / 100}}<span> / {{itemPrice.duration || ''}}{{itemPrice.unitName}}</span></span>
                <span>已售{{itemDetailData.count}}件</span>
            </div>
        </div>
        <div class="split-div"></div>
        <div v-if="clubData.name" class="project-adress">
            <p>{{clubData.name || ''}}</p>
            <p>
                <img v-if="clubData.address" src="/static/img/locate_icon.png" alt="">
                <span>{{clubData.address || ''}}</span>
                <span v-if="distance">{{distance || ''}}</span>
            </p>
        </div> 
        <div v-if="clubData.name" class="split-div"></div>
        <div class="project-desc">
            <p class="title">项目介绍</p>
            <div class="con">
                <div v-html="itemDetailData.description"></div>
            </div>
        </div>
        <div class="reserve-btn">
            <navigator class="button" url="/pages/mine/main" open-type="switchTab">立即预约</navigator>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Modo from 'modo-ui'
    import onShareAppMessage from '@/components/onShareAppMessage'
    import Config from '@/utils/config'
    import Utils from '@/utils/common'
    import store from '@/store/index'

    export default {
        data() {
            return {
                slideBanner: {
                    indicatorDots: false,
                    autoplay: true,
                    interval: 2000,
                    duration: 500,
                    circular: true,
                    indicatorColor: '#D8D8D8',
                    indicatorActiveColor: '#FFFFFF',
                    swiperCurrent: 0,
                    imgUrls: [],
                    isShowDoc: true
                },
                itemDetailData: '',
                itemPrice: [],
                distance: '',
                clubData: '',
            }
        },
        mixins: [onShareAppMessage],
        components: {

        },
        created() {
        },
        mounted() {
            let that = this
            let itemId = Utils.getCurrentPageParam().id
            that.queryItemDetailData(itemId)
            that.distance = store.state.distance
            that.clubData = store.state.clubData
        },
        methods: {
            swiperChange (e) {
                let that = this
                let index = e.mp.detail.current
                that.slideBanner.swiperCurrent = index
            },
            queryItemDetailData(itemId) {
                let that = this

                Utils.httpRequest(this, Config.url.ITEM_DETAIL, {
                    itemId: itemId
                }, 'get', false, true).then(data => {
                    if (data.statusCode == 200) {
                        data = data.respData
                        that.itemDetailData = data
                        // 修改传递过来的图片样式修改
                        // let imgUrl = that.itemDetailData.description.toString().replace(/\<img/g, '<img style="width:100%;height:160px"')
                        // that.itemDetailData.description = imgUrl
                        that.slideBanner.imgUrls = that.itemDetailData.imageUrlList || ['/static/img/item_detail_default.png']
                        that.slideBanner.isShowDoc = that.itemDetailData.imageUrlList? true: false
                        that.itemPrice = that.itemDetailData.priceList[0].itemList[0]
                    }else {
                        that.slideBanner.isShowDoc = false
                        that.itemDetailData = ''
                        that.slideBanner.imgUrls = ['/static/img/item_detail_default.png']
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~asset/css/_global";
    
    ::-webkit-scrollbar{
        width: 0;
        height: 0;
        color: transparent;
    }
    .projectDetail-page {
        .project-banner {
            position: relative;
            width: 100%;
            height: 375px;
            .swiper-banner {
                width: 100%;
                height: 100%;
                .slide-image {
                    width: 100%;
                    height: 100%;
                }
            }
            .banner-track-mattle {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 88px;
                background-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%);
            }
            .dots {
                position: absolute;
                right: 22px;
                bottom: 25px;
                display: flex;
                justify-content: center;
                .dot {
                    margin: 0 8px;
                    width: 12px;
                    height: 12px;
                    background: rgba(216, 216, 216, 0.4);
                    border-radius: 50%;
                    transition: all .6s;
                }
                .dot.active {
                    background: white;
                }
            }
        }
        .project-price-mes {
            padding: 18px 34px 0 34px;
            width: 100%;
            height: 190px;
            @include boxSizing;
            &>p {
                width: 95%;
                font-size: 40px;
                color: #333333;
                letter-spacing: 0.36px;
                font-weight: bold;
                /* &>span {
                    font-size: 28px;
                    color: #4A4A4A;
                    letter-spacing: 0.26px;
                    font-weight: normal;
                } */
            }
            &>div {
                display: flex;
                align-items: center;
                margin-top: 24px;
                &>span:nth-of-type(1) {
                    font-size: 44px;
                    color: #E0404E;
                    &::before {
                        margin-left: -6px;
                        display: inline-block;
                        content: '￥';
                        margin-right: 30px;
                        width: 6px;
                        height: 6px;
                    }
                    &>span {
                        font-size: 28px;
                        color: #4A4A4A;
                        letter-spacing: 0.26px;
                    }
                }
                &>span:nth-of-type(2) {
                    line-height: 1;
                    flex: 1;
                    text-align: right;
                    margin: 18px 0 0 0;
                    font-size: 28px;
                    color: #9B9B9B;
                    letter-spacing: 0.26px;
                }
            }
        }
        .split-div {
            width: 100%;
            height: 20px;
            background-color: #EFEFEF;
        }
        .project-adress {
            width: 100%;
            // height: 162px;
            height: auto;
            padding: 32px;
            @include boxSizing;
            &>p:nth-of-type(1) {
                font-size: 38px;
                color: #4A4A4A;
                letter-spacing: 0.36px;
            }
            &>p:nth-of-type(2) {
                display: flex;
                // align-items: center;
                margin-top: 10px;
                &>img {
                    position: relative;
                    top: 10px;
                    width: 24px;
                    height: 24px;
                    margin-right: 20px;
                }
                &>span:nth-of-type(1) {
                    width: 73%;
                    font-size: 28px;
                    color: #9B9B9B;
                    letter-spacing: 0.26px;
                    text-align: justify;
                }
                &>span:nth-of-type(2) {
                    position: relative;
                    top: 5px;
                    flex: 1;
                    text-align: right;
                    font-size: 24px;
                    color: #9B9B9B;
                }
            }
        }
        .reserve-btn {
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 98px;
            &>.button {
                width: 100%;
                height: 98px;
                line-height: 98px;
                background-color: #7A68E6;
                font-size: 36px;
                color: #FFFFFF;
                letter-spacing: 0.78px;
                border-radius: 0;
                text-align: center;
            }
        }
        .project-desc {
            width: 100%;
            height: auto;
            padding: 30px;
            margin-bottom: 98px;
            @include boxSizing;
            .title {
                font-size: 36px;
                color: #000000;
                letter-spacing: 0.36px;
                font-weight: bold;
                &::before {
                    background: url("~asset/img/01.png");
                    position: relative;
                    display: inline-block;
                    content: '';
                    width: 6px;
                    height: 32px;
                    margin-right: 16px;
                    vertical-align: middle;
                    background-size: cover;
                }
            }
            .con {
                width: 100%;
                height: auto;
                margin: 25px 0 0 0;
                font-size: 28px;
                color: #4A4A4A;
                letter-spacing: 0.86px;
                text-align: justify;
                img {
                    width: 100%;
                    height: 360px;
                    margin-top: 28px;
                }
            }
        }
    }
</style>
