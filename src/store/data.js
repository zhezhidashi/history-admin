export default {
    state: {
        path: '',
        templateId: 1,
        nodeTableData:[],
    },
    mutations: {
        setPath(state, newPath){
            state.path = newPath
        },
        setTemplateId(state, newId){
            state.templateId = newId
        },
        addTableData(state, item){
            state.nodeTableData.push(item)
        }
    }
}