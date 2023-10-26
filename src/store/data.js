export default {
    state:{
        dataPath: '',
        templateId: 1,
        reload: 0,
    },
    mutations: {
        setDataPath(state, newPath){
            state.dataPath = newPath
        },
        setTemplateId(state, newId){
            state.templateId = newId
        },
        setreload(state, val){
            state.reload = val
        }
    }
}