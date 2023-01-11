import Vue from 'vue'
import vuex from 'vuex'
import tab from './tab.js'
import data from './data'

Vue.use(vuex)

export default new vuex.Store({
    modules: {
        tab,
        data
    },
})