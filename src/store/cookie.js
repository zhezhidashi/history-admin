export default {
    state:{
        token: '',
    },
    mutations: {
        setToken(state, val){
            // console.log('settoken: ', val);
            state.token = val
        }
    }
}