export const getters = {
    getName(state){
        return state.name;
    },
    getRootName(state,getters,rootState){
        return rootState.name;
    }
}