export const mutations = {
    changeName(state,str){
        state.name = str
    },
    changeDrinkType(state,arr){
        state.drinkType = arr;
    },
    changeDrinkData(state,obj){
        state.drinkData[obj.key] = obj;
    }
}