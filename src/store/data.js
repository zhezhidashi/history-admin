export default {
    state:{
        dataPath: '',
        templateId: 1,
        nodeTableData:[],
    },
    mutations: {
        setDataPath(state, newPath){
            state.dataPath = newPath
        },
        setTemplateId(state, newId){
            state.templateId = newId
        },
        addTableData(state, item){
            state.nodeTableData.push(item)
        }
    }
}