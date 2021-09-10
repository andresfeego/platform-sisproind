import React, { Component } from 'react'
import "./MenuAdmin.scss"
import "./MenuAdmin_mobile.scss"


export default class MenuAdmin extends Component {
    render() {
        return (
            <div className="menuAdministrativos" >
                
                <div className="ItemMenuUsu" id="IMestudiantes" onClick={()=> this.props.fun.cambiarEstado(2)} >
                    <img src={require("../../../image/general/estudiantes.png")} alt=""/>
                    <span>Estudiantes</span>
                </div>

                <div className="ItemMenuUsu" id="IMinstructores" onClick={()=> this.props.fun.cambiarEstado(3)} >
                    <img src={require("../../../image/general/instructores.png")} alt=""/>
                    <span>Instructores</span>
                </div>

                <div className="ItemMenuUsu" id="IMestudiantes" onClick={()=> this.props.fun.cambiarEstado(4)}>
                    <img src={require("../../../image/general/cursos.png")} alt=""/>
                    <span>Cursos</span>
                </div>

                <div className="ItemMenuUsu" id="IMestudiantes" onClick={()=> this.props.fun.cambiarEstado(5)}>
                    <img src={require("../../../image/general/bitacora.png")} alt=""/>
                    <span>Bitacora</span>
                </div>

            </div>
        )
    }
}
