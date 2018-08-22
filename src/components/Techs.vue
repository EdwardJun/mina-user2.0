<template>
    <div class="techs-page">
        <view class="scroll-box">
            <div class="category">
                <span class="category-title">{{ techTitle }}</span>
                <span class="category-all" @click="toAppoint('tech')">{{ checkAllText }}</span>
            </div>
            <scroll-view class="scroll-view" scroll-x style="width: auto;overflow:hidden;">
                <div class="item-tech">
                    <navigator :open-type="openType" class="item-tech-list" v-for="(techItem,techIndex) in techData" :key="techIndex" :url="'/pages/techDetail/main?techId='+techItem.id">
                        <img class="tech-pic" :src="techItem.avatarUrl || '/static/img/tech_radiu_default.png'" alt="">
                        <div class="tech-number">{{techItem.serialNo}}</div>
                    </navigator>
                </div>
            </scroll-view>
        </view>
    </div>
</template>
<script>
    import Modo from 'modo-ui'
    import store from '@/store/index'
    const Api = Modo.Api
    
    export default {
        props: {
            techData: {
                type: Array
            },
            techTitle: {
                type: String
            },
            checkAllText: {
                type: String
            },
            openType: {
                type: String
            }
        },
        methods: {
            toAppoint (type) {
                store.commit('setToAppointType', type)
                Api.switchTab(`/pages/appoint/main`)
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "~asset/css/_value";

    .techs-page{
        .scroll-box {
            width: 100%;
            height: 341px;
            overflow: hidden;
            background: #fff;
            white-space: nowrap;
            margin-top: 20px;
            .scroll-view {
                height: 216px;
                padding-left: 30px;
                .item-tech {
                    .item-tech-list {
                        position: relative;
                        margin-right: 30px;
                        display: inline-block;
                        text-align: center;
                        background-color: transparent;
                        .tech-pic {
                            width: 150px;
                            height: 150px;
                            border-radius: 50%;
                        }
                        .tech-number {
                            margin: 0 auto;
                            margin-top: 10px;
                            line-height: 41px;
                            font-size: 28px;
                            color: #9b9b9b;
                        }
                    }
                }
            }
        }
    }
</style>