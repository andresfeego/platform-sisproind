import React, { Component } from 'react'
import "./Header.scss"
import "./Header_mobile.scss"
import { Link } from 'react-router-dom';

export default class Header extends Component {


    generadorClases(btnMenu) {
        if (this.props.match.params.idSeccion == btnMenu) {
            return "activo"
        } else {
            return ""
        }
    }

    irAweb() {
        window.open("https://sisproind.com/web", "_self")
    }

    render() {

        const idSeccion = this.props.match.params.idSeccion

        return (
            <div className="headerPlataforma">
                <div className="upHeader">
                    <img src={require("../image/general/LOGO SISPROIND 200.png")} alt="LOGO SISPROIND 200" className="logoSisproind" />
                    <div className="menu">
                        <span className={"btnMenu " + this.generadorClases("web")} onClick={() => this.irAweb()}>WEB</span>
                        <Link to="/administrativos" className={"btnMenu " + this.generadorClases("administrativos")}>ADMINISTRATIVOS</Link>
                        <Link to="/certificados" className={"btnMenu " + this.generadorClases("certificados")}>CERTIFICADOS</Link>
                        <Link to="/matriculas" className={"btnMenu " + this.generadorClases("matriculas")}>MATRICULAS</Link>
                    </div>
                </div>
                <div className="downHeader">
                    <div className="tituloSeccion">
                        {idSeccion == "administrativos" || idSeccion == "matriculas" || idSeccion == "certificados" ?
                            this.props.match.params.idSeccion.toUpperCase()
                            :
                            [
                                "Sección no encontrada",
                                <div className="seccionNoEncontrada">
                                    "La sección <strong> {this.props.match.params.idSeccion} </strong> no corresponde a ningúna en nuestro sistema, por favor revise la url que esta ingresando"
                                </div>
                            ]
                        }
                    </div>
                </div>
            </div>
        )
    }
}
