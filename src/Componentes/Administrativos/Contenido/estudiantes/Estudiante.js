import React, { Component } from 'react'
import BotonMenuEstudiante from './BotonMenuEstudiante'
import "./Estudiante.scss"
import "./Estudiante_mobile.scss"

export default class Estudiante extends Component {


    render() {
        const estudiante = this.props.estudiante
        var activo = "inactivo"
        if (estudiante.activo == 1) {
            activo = ""
        }

        return (
            <div className="estudiante">

                <div className={"identificacion " + activo}>
                    {estudiante.id}
                </div>

                <div className="nombres">
                    {estudiante.nombres + " " + estudiante.apellidos}
                </div>

                <BotonMenuEstudiante estudiante={estudiante} fun={this.props.fun} />

            </div>
        )
    }
}
