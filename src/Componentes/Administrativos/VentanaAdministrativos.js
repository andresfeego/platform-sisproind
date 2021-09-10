import React, { Component } from 'react'
import { connect } from 'react-redux';
import Login from './Login'
import CambioPass from './CambioPass'
import Contenido from './Contenido/Contenido'
import { saveUsuario } from '../../Inicialized/Actions';
import request from 'superagent';
import Cargando from '../../Inicialized/Cargando';
import { nuevoMensaje, tiposAlertas } from '../../Inicialized/Toast';

class VentanaAdministrativos extends Component {

    constructor(props) {
        super(props);
        var estado = 4
        this.state = {
            estado: estado
        }
    }

    componentDidMount() {
        this.getSesion()
    }

    getSesion() {
        request
            .get('/responseSisproind/getSession')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {


                    if (res.text == "sin usuario") {
                        this.setState({
                            estado: 1
                        })
                    } else {

                        try {
                            const respuestaLogin = JSON.parse(res.text);
                            const usuario = respuestaLogin[0]
                            this.props.saveUsuario(usuario);

                        } catch (error) {
                            nuevoMensaje(tiposAlertas.warn, res.text)
                            this.setState({
                                estado: 1
                            })

                        }
                    }

                }
            });
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.estado != 2) {
            if (nextProps.usuario.id) {
                this.setState({
                    estado: 3
                })
            } else {
                this.setState({
                    estado: 1
                })
            }

        }
    }


    cambiarEstado(estado) {
        this.setState({
            estado: estado
        })
    }

    renderVentana() {
        switch (this.state.estado) {
            case 1:
                return <Login fun={this} />
                break;

            case 2:
                return <CambioPass fun={this} />
                break;

            case 3:
                return <Contenido fun={this} />
                break;

            case 4:
                return <Cargando />
                break;

            default:
                break;
        }
    }

    render() {
        return (
            this.renderVentana()
        )
    }
}


const mapStateToProps = (state) => {
    return {
        usuario: state.usuario
    }
}

const mapDispatchToProps = {
    saveUsuario

}


export default connect(mapStateToProps, mapDispatchToProps)(VentanaAdministrativos);