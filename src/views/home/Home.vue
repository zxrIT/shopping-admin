<script setup lang="ts">
import LeftNavigate from "@/components/LeftNav/LeftNavigate.vue";
import Footer from "@/components/footer/Footer.vue";
import Header from "@/components/Header/Header.vue";
</script>

<template>
    <div class="homeContainer">
        <div class="leftNavigateContainer">
            <LeftNavigate/>
        </div>
        <div class="contextContainer">
            <div class="headerContainer">
                <Header/>
            </div>
            <div class="context">
                <RouterView/>
            </div>
            <div class="footerContainer">
                <Footer/>
            </div>
        </div>
    </div>
</template>

<style scoped>
.homeContainer {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;

    .leftNavigateContainer {
        flex: 1;
        height: 100%;
        background-color: #545B64;
    }

    .contextContainer {
        background-color: #eeeeee;
        flex: 6;
        height: 100%;
        display: flex;
        flex-direction: column;

        .headerContainer {
            width: 100%;
            flex: 1;
        }

        .context {
            width: 100%;
            flex: 12;
        }

        .footerContainer {
            width: 100%;
            flex: 1;
        }
    }
}
</style>