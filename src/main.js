import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import router from './router/index.js'
import router from './router'
import store from './store'
import './api/mock'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App),
  created(){
    this.$store.commit('addMenu', router)
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      // console.log('页面重新加载');
      let storet = sessionStorage.getItem("store");
      // console.log(storet);
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(storet == null ? '' : storet)))
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      // console.log('页面被刷新');
      let state = JSON.stringify(this.$store.state)
      sessionStorage.setItem("store", state == null ? '' : state)
    })
  }
}).$mount('#app')
