<template>
    <div class="tech-detail-page">
        <div class="banner-tech">
            <swiper @change="swiperChange" class="swiper-slide" circular duration="500" previous-margin="100px" next-margin="100px">
                <block v-for="(item,swiperIndex) in albumList" :key="swiperIndex">
                    <swiper-item class="slide-item">
                        <image class="slide-image" :src="item.imageUrl || '/static/img/tech_slide_default.png'" :class="swiperCurrent==swiperIndex ? 'active' : 'quiet'"/>
                    </swiper-item>
                </block>
            </swiper>
            <div class="indicator-item">
                <block v-for="(item,dotsIndex) in albumList" :key="dotsIndex">
                    <view class="dot" :class="dotsIndex==swiperCurrent? 'active': ''"></view>
                </block>
            </div>
        </div>
        <!-- 技师资料 -->
        <div class="tech-info">
            <div>{{ techDetailData.serialNo }} <span>{{ techDetailData.name }}</span></div>
            <div class="tech-favorite">
                <span>喜欢123 <span> {{ techDetailData.favorite }}</span></span>
                <span>评分: <span> {{ techDetailData.star / 20 }}</span></span>
            </div>
            <div class="tech-desc" v-if="techDetailData.description">
                简介 <span>{{ techDetailData.description }}</span>
            </div>
        </div>
        
        <techs :tech-title="'更多技师'" check-all-text="" :tech-data="techList" :open-type="openType"></techs><!-- 技师列表 -->
        <comments :tech-comment-data="commentsData"></comments><!-- 评论列表 -->
        <div class="tech-placeholder"></div>
        <navigator open-type="switchTab" class="appoint-btn" url="/pages/mine/main">立即预约</navigator>
    </div>
</template>
<script>
    import Modo from 'modo-ui'
    import techs from '@/components/Techs'
    import comments from '@/components/Comments'
    import Utils from '@/utils/common'
    import Config from '@/utils/config'
    import wxApi from '@/utils/wxApi'

    const Api = Modo.Api
    export default {
        components: {
            comments,
            techs
        },
        data () {
            return {
                albumList: [],
                openType: 'redirect',
                techId: '',
                clubId: '',
                techList: [],
                commentsData: {},
                swiperCurrent: 0,
                techDetailData: {}
            }
        },
        onShow () {
            this.swiperCurrent = 0
            this.techId = this.$root.$mp.query.techId
            wxApi.getExtConfig(res => { this.clubId = res.clubId })
        },
        mounted () {
            this.getTechInfo()
            this.getOtherTech()
            this.getComments()
        },
        methods: {
            getTechInfo () {
                Utils.httpRequest(this, Config.url.TECH_DETAIL, {
                    techId: this.techId,
                }, 'get', true).then(data => {
                    data = data.respData
                    this.techDetailData = data
                    let albumList = data.album
                    this.albumList = albumList.length > 0 ? albumList : [{imageUrl: '/static/img/tech_slide_default.png'}]
                })
            },
            getOtherTech () {
                Utils.httpRequest(this, Config.url.TECH_LIST, {
                    clubId: this.clubId
                }, 'get', true).then(data => {
                    this.techList = data.respData
                })
            },
            getComments () {
                Utils.httpRequest(this, Config.url.EXCELLENCE_COMMENT, {
                    techId: this.techId,
                    page: 1
                }, 'get', true).then(data => {
                    this.commentsData = data.respData
                })
            },
            swiperChange(e) {
                if (e.mp.detail.source == 'touch') {
                    this.swiperCurrent = e.mp.detail.current
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "~asset/css/_value";

    .tech-detail-page{
        height: 100%;
        .banner-tech{
            height: 438px;
            background-color: #353535;
            padding-top: 30px;
            .swiper-slide{
                height: 385px;
                .slide-item{
                    width: 385px;
                    .slide-image {
                        width: 100%;
                        height: 100%;
                        position: relative;
                        border-radius: 10px;
                    }
                }
                image.active {
                    transform: none;
                    transition: all 0.3s ease-in 0s;
                }
                image.quiet {
                    transform: scale(0.75);
                    transition: all 0.3s ease-in 0s;
                }
            }
            .indicator-item{
                float: right;
                margin-right: 20px;
                .dot{
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: #d8d8d8;
                    display: inline-block;
                    margin-left: 8px;
                    &.active{
                        background-color: #fff;
                    }
                }
            }
        }
        .tech-info{
            text-align: center;
            padding-top: 20px;
            background-color: #fff;
            .tech-service{
                line-height: 50px;
                color: #999;
                font-size: 28px;
                letter-spacing: 2px;
            }
            .tech-favorite{
                height: 90px;
                line-height: 60px;
                >span{
                    font-size: 24px;
                    >span{
                        color: #f5a623;
                    }
                    &:nth-of-type(1){
                        &::before{
                            content: "";
                            display: inline-block;
                            width: 28px;
                            height: 28px;
                            background-image: url("~asset/img/like.png");
                            background-size: 100% 100%;
                            vertical-align: sub;
                            margin-right: 5px;
                        }
                    }
                    &:nth-of-type(2){
                        margin-left: 45px;
                        &::before{
                            content: "";
                            display: inline-block;
                            width: 28px;
                            height: 30px;
                            background-image: url("~asset/img/star.png");
                            background-size: 28px 28px;
                            vertical-align: sub;
                            margin-right: 5px;
                        }
                    }
                }
            }
            >div{
                &:nth-of-type(1){
                    height: 50px;
                    line-height: 50px;
                    color: #333;
                    font-size: 40px;
                    >span{
                        color: #4a4a4a;
                        font-size: 36px;
                    }
                }
            }
            .tech-desc{
                border-top: 1px solid #d8d8d8;
                color: #000;
                font-size: 36px;
                margin: 0 30px;
                padding-top: 40px;
                padding-bottom: 35px;
                font-weight: 700;
                >span{
                    width: 592px;
                    line-height: 45px;
                    display: inline-block;
                    color: #999;
                    font-size: 28px;
                    text-align: left;
                    vertical-align: text-top;
                    font-weight: 300;
                    margin-left: 15px;
                }
            }
        }
        .scroll-box {
            width: 100%;
            height: 330px;
            overflow: hidden;
            background: #fff;
            white-space: nowrap;
            margin-top: 20px;
            .scroll-title {
                width: 100%;
                height: 120px;
                line-height: 120px;
                display: flex;
                padding: 0 30px;
            }
            .scroll-view {
                height: 216px;
                padding-left: 30px;
                .item-tech {
                    .item-tech-list {
                        position: relative;
                        margin-right: 30px;
                        display: inline-block;
                        text-align: center;
                        .tech-pic {
                            width: 150px;
                            height: 150px;
                            border-radius: 50%;
                        }
                        .tech-number {
                            margin: 0 auto;
                            margin-top: 5px;
                            line-height: 41px;
                            font-size: 28px;
                            color: #9b9b9b;
                        }
                    }
                }
            }
        }
        span.title-desc{
            display: inline-block;
            flex: 1;
            color: #000;
            font-size: 36px;
            font-weight: 700;
            position: relative;
            margin-left: 20px;
            &:before{
                content: "";
                width: 6px;
                height: 32px;
                border-radius: 15px;
                background: url("~asset/img/01.png");
                background-size: 6px 32px;
                position: absolute;
                top: 50%;
                margin-top: -13px;
                left: -23px;
            }
        }
        span.all{
            flex: 0 0 150;
            color: #999;  
            font-size: 28px;
            margin-right: 45px;
            vertical-align: sub;
            img {
                width: 24px;
                height: 24px;
            }
        }
        .tech-placeholder{
            height: 98px;
            background-color: #fff;
        }
        .appoint-btn{
            height: 98px;
            line-height: 98px;
            text-align: center;
            font-size: 36px;
            color: #fff;
            background-color: #7a68e6;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
        }
    }
</style>