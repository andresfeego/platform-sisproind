import React, { Component } from 'react'

export default class Matriculado extends Component {
    render() {

        const nombreEstudiante = this.props.nombreEstudiante
        const curso = this.props.curso

        return (
            <div className="matriculado">
                <span>El estudiante <strong>{nombreEstudiante}</strong> se ha matriculado de forma correcta en el curso <strong>{curso.nombreTema + " - " + curso.nombreLinea}</strong></span>
                <img src={require("../../../../image/general/ok.png")} alt="" />
            </div>
        )
    }
}
