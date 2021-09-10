import {createStore, combineReducers} from 'redux'

function usuarioReducer(state=[],action){
    switch (action.type) {
        case 'SET_USUARIO':  
            return action.usuario;
        
        case 'CLEAR_USUARIO': 
            return [];
    

        default:
            return state;
    }
}


let rootReducer = combineReducers({
    usuario: usuarioReducer
});

export default createStore(rootReducer);