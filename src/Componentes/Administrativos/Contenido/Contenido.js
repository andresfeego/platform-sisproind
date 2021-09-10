import React, { Component } from 'react'
import "./Contenido.scss"
import MenuAdmin from './MenuAdmin'
import Estudiantes from './estudiantes/Estudiantes'
import Instructores from './instructores/Instructores'
import Cursos from './cursos/Cursos'
import Bitacora from './bitacora/Bitacora'


export default class Contenido extends Component {

    constructor(props) {
        super(props)

        this.state = {
            estado: 1,
            grado: null
        }
    }

    cambiarEstado(nuevoEstado) {
        this.setState({
            estado: nuevoEstado
        })
    }


    cambiarGrado(nuevoGrado) {
        this.setState({
            grado: nuevoGrado
        })
    }


    renderContenido() {
        switch (this.state.estado) {
            case 1:
                return <MenuAdmin fun={this} />
                break;

            case 2:
                return <Estudiantes fun={this} />
                break;

            case 3:
                return <Instructores fun={this} />
                break;

            case 4:
                return <Cursos fun={this} />
                break;

            case 5:
                return <Bitacora fun={this} />
                break;

            default:
                break;
        }
    }

    render() {
        return (
            <div className="ContenidoUsuario">
                {this.renderContenido()}
            </div>
        )
    }
}
