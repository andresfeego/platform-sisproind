import request from 'superagent';
import store from './localStore.js';

export function agregarEventoBitacora(idTipoEvento, descripcion, idUsuarioSistema){
    
    if(idUsuarioSistema == undefined){
        idUsuarioSistema = store.getState().usuario.id
    }

    request
                .post('/responseSisproind/agregarEventoBitacora')
                .send({idTipoEvento: idTipoEvento, descripcion: descripcion, idUsuarioSistema: idUsuarioSistema})
                .set('accept', 'json')
                .end((err, res) => {
                        if (err) {
                            console.log(err);

                        } else {

                        }
                });
}



