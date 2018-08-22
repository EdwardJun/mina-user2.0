<!--电话弹窗-->
<template>
    <div class="tel-detail" v-if="show" :class="{ active: show, fadeOut: show}">
        <div class="wrap">
            <navigator class="tel" v-for="(tel, index) in telephone" :key="index" :href="'tel:' + tel">{{ tel }}</navigator>
            <navigator class="tel" :href="'tel'" @click="doChange(false)">取消</navigator>
        </div>
    </div>
</template>
<script>
    import eventHub from '@/utils/hub'
    export default {
        props: {
            telephone: {
                type: Array,
                default: []
            }
        },
        data () {
            return {
                show: false
            }
        },
        created () {
            eventHub.$on('change-tel-detail', this.doChange)
        },
        methods: {
            doChange (type) {
                this.show = type
            }
        },
        beforeDestroy () {
            eventHub.$off('change-tel-detail', this.doChange)
        }
    }
</script>
<style lang="scss" scoped>
    @keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    .tel-detail{
        transition: all .3s;
        animation-name: fadeIn;
        animation-duration: .5s;
        animation-fill-mode: both;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 5;
        background-color: rgba(0, 0, 0, .6);
        display: -webkit-box;
        display: -moz-box;
        -webkit-box-align: end;
        -moz-box-align: end;
        &.active{
            .wrap {
                transform: translateX(0);
            }
        }
        .wrap{
            > .tel{
                width: 650px;
                background-color: #fff;
                margin: 30px 50px;
                padding: 15px 0;
                color: #007aff;
                text-align: center;
                border-radius: 10px;
            }
        }
    }
</style>

