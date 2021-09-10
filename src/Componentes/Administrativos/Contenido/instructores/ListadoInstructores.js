import React, { Component } from 'react'
import request from 'superagent';
import Cargando from '../../../../Inicialized/Cargando';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import Instructor from './Instructor';

export default class ListadoInstructores extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listado: "init",
        }
    }

    componentDidMount() {
        this.getInstructores()
    }

    getInstructores() {

        request
            .get('/responseSisproind/instructores')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.error, "Imposible cargar listado de instructores, intente mas tarde")
                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        nuevoMensaje(tiposAlertas.warn, "Hay 0 instructores para esta lista")
                        this.setState({
                            listado: "vacio",
                        })
                    } else {
                        this.setState({
                            listado: respuestaLogin,
                        })
                    }
                }
            });
    }

    renderListado() {
        if (this.state.listado == "init") {
            return <Cargando />
        } else {
            if (this.state.listado == "vacio") {
                return <span>No hay instructores para este listado</span>
            } else {
                return (
                    <div className="listado">
                        {this.state.listado.map((item) => <Instructor fun={this.props.fun} fun2={this} key={item.id} instructor={item} />)}

                    </div>
                )
            }
        }
    }


    render() {
        return (
            this.renderListado()
        )
    }
}
