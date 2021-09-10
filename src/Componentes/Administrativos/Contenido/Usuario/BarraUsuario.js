import React, { Component } from 'react'
import "./BarraUsuario.scss"
import "./BarraUsuario_mobile.scss"
import { connect } from 'react-redux'
import BotonMenuUsuario from './BotonMenuUsuario'


class BarraUsuario extends Component {

    constructor(props) {
        super(props)

        this.state = {
            usuarioE: this.props.usuario
        }
    }


    setUsuario(usuario) {
        this.setState({
            usuarioE: usuario
        })
    }

    renderContenido() {
        const usuario = this.props.usuario
        if (usuario != "") {
            return (
                <div className="barraUsuario">
                    <div className="txtnombre">
                        {usuario.nombre + " " + usuario.apellido}
                    </div>
                    <BotonMenuUsuario usuario={usuario} fun={this} />
                </div>

            )
        } else {
            return null
        }
    }
    render() {
        return (
            this.renderContenido()
        )
    }
}

const mapStateToProps = (state) => {
    return {
        usuario: state.usuario
    }
}

export default connect(mapStateToProps)(BarraUsuario);