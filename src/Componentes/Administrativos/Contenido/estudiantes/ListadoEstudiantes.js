import React, { Component } from 'react'
import request from 'superagent'
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast'
import Cargando from '../../../../Inicialized/Cargando'
import Estudiante from './Estudiante'

export default class ListadoEstudiantes extends Component {

    constructor(props) {
        super(props)

        this.state = {
            listado: "init",
        }
    }

    componentDidMount() {
        this.getEstudiantes()
    }

    getEstudiantes() {

        request
            .get('/responseSisproind/estudiantes')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.error, "Imposible cargar listado de estudiantes, intente mas tarde")
                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        nuevoMensaje(tiposAlertas.warn, "Hay 0 estudiantes para esta lista")
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
                return <span>No hay estudiantes para este listado</span>
            } else {
                return (
                    <div className="listado">
                        {this.state.listado.map((item) => <Estudiante fun={this.props.fun} fun2={this} key={item.id} estudiante={item} />)}

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
