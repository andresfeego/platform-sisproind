import { Input } from '@material-ui/core'
import React, { Component } from 'react'
import request from 'superagent'
import { agregarEventoBitacora } from '../../Inicialized/Bitacora'
import { nuevoMensaje, tiposAlertas } from '../../Inicialized/Toast'
import "./CajaCerificacion.scss"
import "./CajaCerificacion_mobile.scss"

export default class ValidacionDocumento extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            id: ""
        }
    }

consultar(){

    nuevoMensaje(tiposAlertas.cargando, "Consultando...")
    request
    .get('/responseSisproind/estudianteActivo/'+this.state.id)
    .set('accept', 'json')
    .end((err, res) => {
            if (err) {
                nuevoMensaje(tiposAlertas.cargadoError, "Ocurrio un error al consultar, intenta de nuevo mas tarde. Detalles: " + err)


            } else {
                
            const respuestaLogin =   JSON.parse(res.text);
                if (respuestaLogin.length == 0) {
                    nuevoMensaje(tiposAlertas.cargadoWarn, "No se encuentra el usuario")
                    agregarEventoBitacora(24, "id buscado: " + this.state.id, 0)
                } else {
                    const estudiante = respuestaLogin[0]

                    if (estudiante.activo == 0) {
                        agregarEventoBitacora(27, "id usuario: " + this.state.id, 0)
                        nuevoMensaje(tiposAlertas.cargadoWarn, "El usuario " + estudiante.nombres + " " + estudiante.apellidos + " se encuentra desactivado")
                    } else {
                        agregarEventoBitacora(25, "id estudiante: " + this.state.id, 0)
                        nuevoMensaje(tiposAlertas.cargadoSuccess, "Mostrando información")
                        this.props.fun.setEstudiante(estudiante)
                        this.props.fun.cambiarEstado(2)
                    }
                }
            }
    });
}


onChange = e =>{
    this.setState({
        [e.target.name]: e.target.value
    });
}

onSubmit = e => {
    e.preventDefault();
    if (this.state.id == "") {
        nuevoMensaje(tiposAlertas.error,"Ingrese un número de documento");
    }else{
            this.consultar();
    }

    
}

    
    render() {
        return (
            <div className="CajaCerificacion">
                <div className="back">
                    <h2>Verificación de certificados Sisproind</h2>
                    <div className="formularioLogin formulario">
                        <form onSubmit={this.onSubmit}>
                            <Input className="inputform" type="text" placeholder="Número de documento" value={this.state.id} name="id" onChange={this.onChange}/>
                            <Input className="inputform buttonUno" type="submit" value="Consultar"/>
                        </form>
                        <img src={require("../../image/general/certificado.png")} alt=""/>
                    </div>
                </div>
            </div>
        )
    }
}
