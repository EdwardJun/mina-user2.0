<template>
    <div class="appoint-page">
        <scroll-view ref="pageScrollView" :style="{height: windowHeight + 'px'}" :scroll-top="pageScrollTop" style="white-space:nowrap;" :scroll-y="pageIsScroll" @scroll="doAppointPageScroll($event)">
            <div class="appoint-header">
                <div class="clearfix">
                    <img :src="clubData.imageUrl || '/static/img/club_default.png'" alt="">
                    <div class="right">
                        <p>{{clubData.name || ''}}</p>
                        <div>
                            <img src="/static/img/broadcast_icon.png" alt="">
                            <button class="to-contact-btn" open-type="contact">
                                <span>您有一张优惠卷待领取</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <img v-if="clubData.address" class="locate" src="/static/img/locate_icon.png" alt="">
                    <span>{{clubData.address || ''}}</span>
                    <span v-if="distance">{{distance || ''}}</span>
                </div>
            </div>
            <div class="appoint-main">
                <div class="top-nav">
                    <span :class="{active: navIndex==topNavIndex}" v-for="(navItem, navIndex) in topNavList" :key="navIndex" @click="setTopNavActive(navIndex)">{{navItem}}</span>
                </div>
                <div class="con">
                    <scroll-view class="con-nav" v-show="isShowProjectCon" scroll-x style="width: auto;overflow:hidden;">
                        <div v-for="(nav,index) in conNavList" :key="index" class="nav-item">
                            <a :class="{active: index==conNavIndex}" v-text="nav" @click="setConNavActive(index, nav)"></a>
                        </div>
                    </scroll-view>
                    <div class="tech-con" :class="{active: isShowTechCon}">
                        <div class="tech-item" v-for="(techItem, techIndex) in techDataList" :key="techIndex">
                            <div class="img-wrap" @click="toTechDetail(techItem.id)">
                                <img :src="techItem.avatarUrl || '/static/img/tech_default_new.png'" alt="">
                                <div class="bottom-track-mattle">
                                    <span class="text-ellipsis">{{techItem.serialNo}}号</span>
                                    <span><img class="star" src="/static/img/star_icon.png" />{{techItem.star}}</span>
                                </div>
                            </div>
                            <navigator class="button" url="/pages/mine/main" open-type="switchTab">预约</navigator>
                        </div>
                    </div>
                    <div class="project-con" :class="{active: isShowProjectCon}">
                        <div class="project-item" v-for="(item, index) in projectItemListFilter" :key="index" @click="toProjectDetail(item.id)">
                            <div class="img-wrap">
                                <img :src="item.imageUrl || '/static/img/item_default.png'" alt="">
                                <div class="bottom-track-mattle">
                                    <span class="text-ellipsis">{{item.name}}</span>
                                </div>
                            </div>
                            <div class="price-mes">
                                <span>￥{{item.priceFen}}</span>
                                <span>{{item.duration || ''}}{{item.durationUnit || ''}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </scroll-view>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Modo from 'modo-ui'
    import onShareAppMessage from '@/components/onShareAppMessage'
    import Config from '@/utils/config'
    import Utils from '@/utils/common'
    import wxApi from '@/utils/wxApi'
    import store from '@/store/index'

    const Api = Modo.Api

    export default {
        data() {
            return {
                topNavList: ['技师','项目'],
                topNavIndex: 0,
                isShowTechCon: true,
                isShowProjectCon: false,
                conNavList: ['全部'],
                conNavIndex: 0,
                projectItemList: [], // 显示当前的项目
                projectOriginItemList: [], // 全部项目
                returnItemData: [], // 返回的项目数据
                currPage: 0,
                pageSize: 10,
                techDataList: [],
                windowHeight: store.state.systemInfo.windowHeight,
                isAddData: false, // 数据是否正在加载
                isAddDataEnd: false, // 数据是否加载完毕
                pageScrollTop: 0,
                distance: '',
                clubData: '',
                clubId: '',
                toAppointType: store.state.toAppointType,
                isItemListFilter: true, // 是否需要进行过滤
                pageIsScroll: true // 屏幕是否可以滚动
            }
        },
        mixins: [onShareAppMessage],
        onShow() {
            let that = this
            that.toAppointType = store.state.toAppointType
            wxApi.getExtConfig(res => { this.clubId = res.clubId })
        },
        watch: {
            toAppointType () {
                this.beforeSetTopNav()
            }
        },
        mounted() {
            let that = this
            that.distance = store.state.distance
            that.clubData = store.state.clubData
            that.beforeSetTopNav()
        },
        computed: {
            projectItemListFilter () {
                if (this.isItemListFilter) {
                    return this.projectItemList.filter(item => {
                        item.priceFen =  Utils.toDecimal2((item.priceFen / 100))
                        this.isItemListFilter = false
                        return item
                    })
                } else {
                    return this.projectItemList
                }
            }
        },
        methods: {
            doClickToast() {
                Api.showToast('更多信息敬请期待')
            },
            beforeSetTopNav () {
                let that = this
                let index = 0
                if (this.clubId) {
                    if (that.toAppointType == 'tech') {
                        index = 0
                    } else if (that.toAppointType == 'item') {
                        index = 1
                    }
                    that.setTopNavActive(index)
                }
            },
            setTopNavActive (index) {
                let that = this
                that.topNavIndex = index
                that.pageScrollTop = 0
                if (index === 0) {
                    store.commit('setToAppointType', 'tech')
                    that.isShowTechCon = true
                    that.isShowProjectCon = false
                    if (!that.techDataList.length > 0) {
                        that.queryTechData(1)
                    }
                } else if (index === 1) {
                    store.commit('setToAppointType', 'item')
                    that.isShowTechCon = false
                    that.isShowProjectCon = true
                    if (!that.projectOriginItemList.length > 0) {
                        that.queryItemListData()
                    }
                }
            },
            setConNavActive (index, nav) {
                let that = this
                if (that.conNavIndex != index) {
                    that.projectItemList.splice(0)
                    that.conNavIndex = index
                    if (nav == '全部') {
                        that.projectOriginItemList.forEach((item, index) => {
                            Vue.set(that.projectItemList, index, that.projectOriginItemList[index])
                        })
                    } else {
                        let list = that.returnItemData[parseInt(index-1)].itemList
                        list.forEach((item, index) => {
                            Vue.set(that.projectItemList, index, item)
                        })
                    }
                }
            },
            toProjectDetail (id) {
                Api.navigateTo(`/pages/projectDetail/main?id=${id}`)
            },
            toTechDetail (id) {
                Api.navigateTo(`/pages/techDetail/main?techId=${id}`)
            },
            queryItemListData () {
                Api.showLoading('加载中', true)
                let that = this
                let itemList = []
                let finalItemList = []
                Utils.httpRequest(this, Config.url.ITEM_LIST, {
                    clubId: this.clubId
                }, 'get', false, true).then(data => {
                    if (data.statusCode == 200) {
                        data = data.respData
                        that.returnItemData = data
                        data.forEach((item, index) => {
                            that.conNavList.push(item.categoryBean.name) // nav列表
                            item.itemList.map((item, itemIndex) => {
                                that.projectOriginItemList.push(item)
                                that.projectItemList.push(item)
                            })
                        })
                        Api.hideLoading()
                    } else {
                        Api.showToast(data.msg)
                    }
                })
            },
            queryTechData (page) {
                let that = this
                page = page || that.currPage + 1
                that.isAddData = true

                Utils.httpRequest(this, Config.url.TECH_LIST, {
                    clubId: this.clubId,
                    page: page,
                    pageSize: this.pageSize
                }, 'get', true).then(data => {
                    if (data.statusCode == 200) {
                        that.currPage = page
                        data = data.respData
                        if (data.length < that.pageSize) {
                            that.isAddDataEnd = true
                        }

                        if (page == 1) {
                            that.techDataList = data
                        } else {
                            data.map((item, index) => {
                                that.techDataList.push(item)
                            })
                        }
                        that.isAddData = false
                        that.pageIsScroll = true
                    } else {
                        Api.showToast(data.msg)
                    }
                })
            },
            doAppointPageScroll (e) {
                let that = this
                let scrollObj = e.mp.detail
                if (!that.isAddData && !that.isAddDataEnd && scrollObj.scrollTop + that.windowHeight * 1.1 > scrollObj.scrollHeight) {
                    if (that.isShowTechCon) {
                        that.pageIsScroll = false
                        that.queryTechData()
                        that.pageScrollTop = scrollObj.scrollTop
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "~asset/css/_global";
    
    ::-webkit-scrollbar{
        width: 0;
        height: 0;
        color: transparent;
    }
    .appoint-page {
        .appoint-header {
            width: 100%;
            background-color: #ffffff;
            &>div:nth-of-type(1) {
                width: 100%;
                height: 168px;
                border: 1px solid #EFEFEF;
                padding: 24px;
                @include boxSizing;
                &>img {
                    width: 120px;
                    height: 120px;
                    float: left;
                    margin-right: 24px;
                }
                &>.right {
                    position: relative;
                    float: left;
                    height: 120px;
                    >p {
                        font-size: 36px;
                        color: #333333;
                        letter-spacing: 0.26px;
                        font-weight: bold;
                    }
                    >div {
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        display: flex;
                        align-items: center;
                        width: 342px;
                        height: 52px;
                        line-height: 52px;
                        background-color: #F9EBEA;
                        >img {
                            margin: 0 12px;
                            width: 24px;
                            height: 24px;
                        }
                        >.to-contact-btn {
                            width: 342px;
                            height: 52px;
                            line-height: 52px;
                            font-size: 26px;
                            color: #BD515B;
                            letter-spacing: 0.26px;
                            background-color: #F9EBEA;
                            border: 0px;
                            padding: 0;
                            margin-left: -15px;
                            &::after {
                                border: none;
                            }
                        }
                    }
                }
            }
            &>div:nth-of-type(2) {
                line-height: 1;
                display: flex;
                padding: 20px 24px;
                width: 100%;
                .locate {
                    position: relative;
                    width: 24px;
                    height: 24px;
                    line-height: 24px;
                    margin-right: 20px;
                }
                &>span:nth-of-type(1) {
                    width: 70%;
                    white-space: pre-wrap;
                    font-size: 24px;
                    color: #4A4A4A;
                    letter-spacing: 0.26px;
                }
                &>span:nth-of-type(2) {
                    position: relative;
                    flex: 1;
                    text-align: right;
                    margin-right: 48px;
                    font-size: 24px;
                    color: #9B9B9B;
                    letter-spacing: 0.26px;
                }
            }
        }
        .appoint-main {
            width: 100%;
            height: auto;
            margin-top: 20px;
            background-color: #ffffff;
            .top-nav {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 126px;
                padding: 20px 30px;
                border-bottom: 1px solid #F3F3F3;
                @include boxSizing;
                &>span {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 50%;
                    height: 100%;
                    border: 1px solid #7A68E6;
                    font-size: 32px;
                    color: #7A68E6;
                    letter-spacing: 0.24px;
                    &:nth-of-type(1) {
                        border-top-left-radius: 44px;
                        border-bottom-left-radius: 44px;
                        border-right: 0;
                    }
                    &:nth-of-type(2) {
                        border-top-right-radius: 44px;
                        border-bottom-right-radius: 44px;
                    }
                    &.active {
                        background-color: #7A68E6;
                        color: #ffffff;
                    }
                }
            }
            .con {
                .con-nav {
                    height: 70px;
                    margin-top: 10px;
                    overflow: hidden;
                    white-space: nowrap;
                    .nav-item {
                        display: inline-block;
                        margin-left: 40px;
                        height: 68px;
                        line-height: 68px;
                        box-sizing: border-box;
                        text-align: center;
                        &:last-child {
                            margin-right: 40px;
                        }
                        a {
                            position: relative;
                            font-size: 32px;
                            color: #333333;
                            letter-spacing: 0.24px;
                            font-weight: bold;
                            &.active {
                                color: #7A68E6;
                                &.active::after {
                                    position: absolute;
                                    left: 50%;
                                    bottom: 0;
                                    content: " ";
                                    display: inline-block;
                                    width: 34px;
                                    border: 3px solid #7A68E6;
                                    border-radius: 44px;
                                    margin: 0 0 0 -19px;
                                }
                            }
                        }
                    }
                }
                .tech-con {
                    flex-wrap: wrap;
                    width: 100%;
                    padding: 0 30px 30px 30px;
                    opacity: 0;
                    display: none;
                    &.active {
                        opacity: 1;
                        display: flex;
                    }
                    .tech-item {
                        width: 330px;
                        flex: 0 0 330px;
                        height: auto;
                        margin: 30px 30px 0 0;
                        .img-wrap {
                            position: relative;
                            width: 330px;
                            height: 330px;
                            >img {
                                width: 100%;
                                height: 100%;
                                border-radius: 15px;
                            }
                            .bottom-track-mattle {
                                position: absolute;
                                left: 0;
                                bottom: 0;
                                width: 100%;
                                height: 68px;
                                background-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%);
                                border-radius: 0 0 15px 15px;
                                &>span:nth-of-type(1) {
                                    position: absolute;
                                    left: 16px;
                                    bottom: 8px;
                                    width: 70%;
                                    font-size: 32px;
                                    color: #EFEFEF;
                                    letter-spacing: 0.24px;
                                }
                                &>span:nth-of-type(2) {
                                    position: absolute;
                                    right: 16px;
                                    bottom: 8px;
                                    font-size: 32px;
                                    color: #F5A623;
                                    letter-spacing: 0.24px;
                                    .star {
                                        width: 36px;
                                        height: 36px;
                                        vertical-align: text-bottom;
                                    }
                                }
                            }
                        }
                        &>.button {
                            margin: 20px auto;
                            width: 140px;
                            height: 56px;
                            line-height: 56px;
                            font-size: 32px;
                            color: #FFFFFF;
                            letter-spacing: 0.24px;
                            background-color: #7A68E6;
                            border-radius: 15px;
                            text-align: center;
                        }
                    }
                }
                .project-con {
                    flex-wrap: wrap;
                    width: 100%;
                    padding: 0 30px 30px 30px;
                    opacity: 0;
                    display: none;
                    &.active {
                        opacity: 1;
                        display: flex;
                    }
                    .project-item {
                        margin: 30px 30px 0 0;
                        width: 330px;
                        flex: 0 0 330px;
                        height: auto;
                        .img-wrap {
                            position: relative;
                            width: 330px;
                            height: 330px;
                            >img {
                                width: 100%;
                                height: 100%;
                                border-radius: 15px;
                            }
                            .bottom-track-mattle {
                                position: absolute;
                                left: 0;
                                bottom: 0;
                                width: 100%;
                                height: 68px;
                                background-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%);
                                border-radius: 0 0 15px 15px;
                                &>span {
                                    position: absolute;
                                    left: 16px;
                                    bottom: 8px;
                                    width: 330px;
                                    font-size: 36px;
                                    color: #EFEFEF;
                                    letter-spacing: 0.24px;
                                }
                            }
                        }
                        .price-mes {
                            display: flex;
                            align-items: center;
                            margin-top: 10px;
                            &>span:nth-of-type(1) {
                                font-size: 36px;
                                color: #E0404E;
                                letter-spacing: 0.24px;
                                font-weight: bold;
                            }
                            &>span:nth-of-type(2) {
                                flex: 1;
                                text-align: right;
                                font-size: 26px;
                                color: #999999;
                                letter-spacing: 0.26px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
