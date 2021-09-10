import React, { Component } from 'react'
import MatriculaEstNoReg from './MatriculaEstNoReg'
import MatriculaEstReg from './MatriculaEstReg'
import "./VentanaMatriculas.scss"
import "./VentanaMatriculas_mobile.scss"

export default class VentanaMatriculas extends Component {

    constructor(props) {
        super(props)

        this.state = {
            estado: 1
        }
    }

    cambiarEstado(est) {
        this.setState({
            estado: est
        })
    }

    renderMenuMatriculas() {
        return (
            <div className="panelMatricula">

                <div className="btnMatricula" onClick={() => this.cambiarEstado(2)}>
                    Ya estoy registrado
                </div>

                <div className="btnMatricula" onClick={() => this.cambiarEstado(3)}>
                    Aun no estoy registrado
                </div>

            </div>
        )
    }

    renderContenido(estado) {
        switch (this.state.estado) {
            case 1:
                return this.renderMenuMatriculas()
                break;

            case 2:
                return <div className="panelMatricula">
                    <span onClick={() => this.cambiarEstado(1)} className="volverAtras">{"◀️ Atras"}</span>
                    <MatriculaEstReg />
                </div>
                break;

            case 3:
                return <div className="panelMatricula">
                    <span onClick={() => this.cambiarEstado(1)} className="volverAtras">{"◀️ Atras"}</span>
                    <MatriculaEstNoReg />
                </div>
                break;

            default:
                break;
        }
    }
    render() {
        return (
            <div className="VentanaMatriculas">
                {this.renderContenido()}
            </div>
        )
    }
}
