<template>
    <div class="home-page">
        <div class="banner-bg">
            <div class="banner-top-bg"></div>
            <swiper @change="swiperChange" class="quickReplyBlock" autoplay circular interval="5000" duration="500" previous-margin="30px" next-margin="30px">
                <block v-for="(item,swiperIndex) in sliderPicList" :key="swiperIndex">
                    <swiper-item class="slide-item">
                        <image class="slide-image" :src="item.imageUrl || '/static/img/item_detail_default.png'" :class="swiperCurrent==swiperIndex ? 'active' : 'quiet'"/>
                    </swiper-item>
                </block>
            </swiper>
            <div class="club-item">
                <div>
                    <div class="name">
                        <img :src="clubData.imageUrl || '/static/img/club_default.png'" alt="" class="tradeMark">{{ clubData.name }}
                        <span><img class="map" src="/static/img/map.png"> {{ distance || '' }}</span>
                    </div>
                </div>
            </div>
        </div>
        <techs :tech-title="'推荐技师'" check-all-text="查看全部" :tech-data="techList" :open-type="openType"></techs>
        <div class="recommen">
            <div class="recommen-item">
                <div class="category">
                    <span class="category-title">推荐项目</span>
                    <span class="category-all" @click="toAppoint('item')">查看全部</span>
                </div>
                <div class="recommen-con"><!-- :url="'/pages/projectDetail/main'" -->
                    <div class="recommen-border" v-for="(item, index) in categoryItemListFilter" :key="index" @click="toProjectDetail(item.id)">
                        <span><img class="recommen-img" :src="item.imageUrl || '/static/img/item_default.png'" alt=""><i></i></span>
                        <div class="recommen-shade">{{ item.name }}</div>
                        <div class="recommen-footer">
                            <span class="recommen-footer-left"><span class="yuan">￥</span>{{ item.priceFen }}</span>
                            <span class="recommen-footer-right">{{ item.duration }}{{ item.durationUnit }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import onShareAppMessage from '@/components/onShareAppMessage'
    import techs from '@/components/Techs'
    import Modo from 'modo-ui'
    import Config from '@/utils/config'
    import Utils from '@/utils/common'
    import wxApi from '@/utils/wxApi'
    import store from '@/store/index'

    const Api = Modo.Api

    export default {
        components: {
            techs
        },
        data() {
            return {
                clubData: [], // 会所名称
                sliderPicList: [{imageUrl: '/static/img/item_detail_default.png'}], // 轮播图
                openType: 'navigate',
                techList: [], // 技师列表
                categoryItemList: [], // 推荐项目
                swiperCurrent: 0,
                latitude: '',
                longitude: '',
                distance: '',
                clubId: ''
            }
        },
        mixins: [onShareAppMessage],
        onShow () {
            wxApi.getExtConfig(res => { this.clubId = res.clubId })
        },
        mounted () {
            this.getClubData()
            this.getClubDistance()
            this.getCategoryItem()
        },
        computed: {
            categoryItemListFilter () {
                return this.categoryItemList.filter(item => {
                    item.priceFen =  Utils.toDecimal2((item.priceFen / 100))
                    return item
                })
            }
        },
        methods: {
            /**
             * 轮播图、会所logo、会所名称、会所电话、推荐技师
             */
            getClubData () {
                Utils.httpRequest(this, Config.url.CLUB_HOME_DATA, {
                    clubId: this.clubId
                }, 'get', true).then(data => {
                    data = data.respData
                    this.clubData = data.club
                    this.sliderPicList = data.sliderPic
                    this.techList = data.techs
                    store.commit('setClubData', data.club)
                })
            },
            /**
             * 距离
             */
            getClubDistance () {
                let location = store.state.location
                Utils.httpRequest(this, Config.url.CLUB_DISTANCE, {
                    clubId: this.clubId,
                    lat: location.latitude || '',
                    lon: location.longitude || ''
                }, 'get', true).then(data => {
                    let distance = data.respData.distance
                    this.distance = distance / 1000 > 1 ? (distance / 1000).toFixed(1) + ' km' : distance.toFixed(0) + ' m'
                    store.commit('setDistance', this.distance)
                })
            },
            /**
             * 推荐项目
             */
            getCategoryItem () {
                Utils.httpRequest(this, Config.url.RECOMMAND_CATEGORY_ITEM, {
                    clubId: this.clubId
                }, 'get', true).then(data => {
                    this.categoryItemList = data.respData
                })
            },
            swiperChange(e) {
                this.swiperCurrent = e.mp.detail.current
            },
            doClickToast() {
                Api.showToast('更多信息敬请期待')
            },
            toAppoint (type) {
                store.commit('setToAppointType', type)
                Api.switchTab(`/pages/appoint/main`)
            },
            toProjectDetail (itemId) {
                Api.navigateTo(`/pages/projectDetail/main?id=${itemId}`)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~asset/css/_value";

    .home-page {
        height: 100%;
        .banner-bg {
            position: relative;
            width: 100%;
            height: 465px;
            background: linear-gradient(#ececf0, #eeeef2, #fff);
            .banner-top-bg{
                width: 100%;
                height: 286px;
                position:absolute;
                background: url("~asset/img/bg_indextop.png");
                background-size: 750px 286px;
            }
            .quickReplyBlock {
                height: 380px;
                .slide-item{
                    // width: 670px;
                    width: 650px;
                    position: relative;
                    .slide-image {
                        width: 100%;
                        height: 360px;
                        // margin-left: 10px;
                        position: relative;
                        border-radius: 6px;
                    }
                }
                image.active {
                    transform: none;
                    transition: all 0.5s ease-in 0s;
                }
                image.quiet {
                    transform: scale(0.9);
                    transition: all 0.5s ease-in 0s;
                }
            }
            .club-item{
                >div{
                    &:nth-of-type(1){
                        line-height: 90px;
                        margin-left: 39px;
                        margin-right: 18px;
                        .name{
                            color: #4a4a4a;
                            font-size: 40px;
                            .tradeMark {
                                width: 56px;
                                height: 56px;
                                border-radius: 50%;
                                vertical-align: sub;
                                margin-right: 15px;
                                // background-color: #212121;
                            }
                            span{
                                float: right;
                                font-size: 24px;
                                color: #999;
                                .map{
                                    width: 24px;
                                    height: 24px;
                                }
                            }
                        }
                    }
                }
            }
        }
        .recommen {
            width: 100%;
            height: auto;
            background-color: #FFFFFF;
            margin-top: 20px;
            overflow: hidden;
            .recommen-item {
                .recommen-con {
                    padding: 0 30px;
                    .recommen-border {
                        position: relative;
                        margin-bottom: 40px;
                        float: left;
                        &:nth-child(even){
                            margin-left: 30px;
                        }
                        >span{
                            width: 330px;
                            height: 330px;
                            display: inline-block;
                            position: relative;
                            >i{
                                width: 100%;
                                height: 68px;
                                position: absolute;
                                bottom: 0;
                                background-image:linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
                                border-bottom-left-radius: 15px;
                                border-bottom-right-radius: 15px;
                            }
                            .recommen-img {
                                width: 100%;
                                height: 100%;
                                border-radius: 15px;
                            }
                        }
                        .recommen-shade {
                            width: 100%;
                            font-size: 36px;
                            color: #fff;
                            position: absolute;
                            bottom: 75px;
                            left: 20px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .recommen-footer {
                            width: 100%;
                            height: 50px;
                            line-height: 50px;
                            .recommen-footer-left {
                                font-size: 36px;
                                color: #e0404e;
                                font-weight: bold;
                            }
                            .recommen-footer-right {
                                float: right;
                                margin-right: 10px;
                                font-size: 26px;
                                color: #999999;
                            }
                        }
                    }
                }
            }
            .recommen-item:first-of-type {
                margin-top: 0;
            }
        }
    }
</style>
