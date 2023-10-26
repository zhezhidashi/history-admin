import Vue from 'vue'
import vuex from 'vuex'
import tab from './tab.js'
import data from './data'
import cookie from './cookie.js'

Vue.use(vuex)

export default new vuex.Store({
    modules: {
        tab,
        data,
        cookie
    },
})