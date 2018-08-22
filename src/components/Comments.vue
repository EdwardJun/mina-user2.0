<!--评论列表-->
<template>
    <div class="tech-comments">
        <div class="tech-comments-title"> 
            <!-- <span class="title-desc">{{ techCommentData.description }}</span> -->
            <span class="title-desc">优质点评</span>
            <span class="all"><img src="/static/img/ic_right.png" alt=""></span>
        </div>
        <ul class="tech-comments-list">
            <li class="tech-comments-item" v-for="(commentItem, commentIndex) in techCommentData" :key="commentIndex">
                <div class="comments-top">
                    <div class="header"><img :src="commentItem.userInfo.avatarUrl"/></div>
                    <div class="grade">
                        <div>{{ commentItem.userInfo.name }} <div>{{ commentItem.createdAt }}</div></div>
                        <div>评分 <div><div :style="{ width: commentItem.rate + '%' }"></div></div></div>
                    </div>
                </div>
                <div class="comments-center" v-if="commentItem.comment">{{ commentItem.comment }}</div>
                <div class="comments-bottom" v-if="commentItem.impression">{{ commentItem.impression }}</div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        props: {
            techCommentData: {
                type: Object
            }
        },
        data () {
            return {
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "~asset/css/_value";

    .tech-comments{
        background-color: #fff;
        margin-top: 20px;
        overflow: hidden;
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
        .tech-comments-title {
            width: 100%;
            height: 120px;
            line-height: 120px;
            display: flex;
            padding: 0 30px;
        }
        ul.tech-comments-list{
            padding: 0 30px;
            li.tech-comments-item{
                padding-bottom: 60px;
                .comments-top{
                    position: relative;
                    >.header{
                        width: 88px;
                        height: 88px;
                        border-radius: 50%;
                        background: url("~asset/img/header.png");
                        background-size: 100% 100%;
                        display: inline-block;
                        >img{
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                    >.grade{
                        display: inline-block;
                        margin-left: 20px;
                        vertical-align: top;
                        >div{
                            &:nth-of-type(1){
                                height: 50px;
                                line-height: 50px;
                                color: #000;
                                font-size: 36px;
                                >div{
                                    font-size: 24px;
                                    color: #9b9b9b;
                                    position: absolute;
                                    right: 0;
                                    top: 7px;
                                }
                            }
                            &:nth-of-type(2){
                                height: 50px;
                                line-height: 50px;
                                font-size: 28px;
                                color: #9b9b9b;
                                >div{
                                    display: inline-block;
                                    width: 154px;
                                    height: 24px;
                                    background-image: url("~asset/img/stars.png");
                                    background-size: 154px 24px;
                                    margin-left: 10px;
                                    >div{
                                        width: 154px;
                                        height: 24px;
                                        background-image: url("~asset/img/stars_active.png");
                                        background-size: 154px 24px;
                                    }
                                }
                            }
                        }
                    }
                }
                .comments-center{
                    color: #4a4a4a;
                    font-size: 28px;
                    margin-left: 110px;
                    letter-spacing: 1px;
                    padding: 15px 0 10px;
                }
                .comments-bottom{
                    margin-left: 110px;
                    color: #7e74bd;
                    font-size: 24px;
                    margin-top: 5px;
                    &:before{
                        content: "";
                        display: inline-block;
                        width: 28px;
                        height: 28px;
                        vertical-align: middle;
                        background-image: url("~asset/img/label.png");
                        background-size: 100% 100%;
                        margin-right: 10px;
                    }
                }
            }
        }
    }
</style>