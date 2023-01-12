export default {
    state:{
        dataPath: '',
        templateId: 1,
    },
    mutations: {
        setDataPath(state, newPath){
            state.dataPath = newPath
        },
        setTemplateId(state, newId){
            state.templateId = newId
        },
    }
}