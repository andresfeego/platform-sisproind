import React, { Component } from 'react'
import "./Login.scss"
import "./Login_mobile.scss"
import { Input } from '@material-ui/core';
import { tiposAlertas, nuevoMensaje } from "../../Inicialized/Toast";
import request from 'superagent';
import { connect } from 'react-redux';
import { saveUsuario } from '../../Inicialized/Actions';
import { agregarEventoBitacora } from '../../Inicialized/Bitacora';


class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            password: ''
        }
    }

    guardarSesion(usuario) {
        request
            .post('/responseSisproind/guardarSesion')
            .send({ pass: this.state.password, id: usuario.id })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    console.log(res.text)
                }
            });
    }

    login() {
        nuevoMensaje(tiposAlertas.cargando, "Validando...");
        request
            .get('/responseSisproind/usuariosSistema/' + this.state.id)
            .set('accept', 'json')
            .end((err, res) => {

                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al consultar usuario: " + err, 1000);

                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        agregarEventoBitacora(21, "credencial usada: " + this.state.id, 0)
                        nuevoMensaje(tiposAlertas.cargadoWarn, "Usuario no encontrado o desactivado");
                    } else {
                        const usuario = respuestaLogin[0];


                        if (usuario.pass == this.state.password) {
                            nuevoMensaje(tiposAlertas.cargadoSuccess, "Credenciales correctas", 1000);
                            if (usuario.pass == usuario.id) {
                                nuevoMensaje(tiposAlertas.warn, "Tienes la contraseña por defecto del sistema, debes cambiarla antes de continuar")
                                agregarEventoBitacora(28, "id usuario: " + usuario.id, 0)
                                setTimeout(function () {
                                    this.props.saveUsuario(usuario);
                                    this.props.fun.cambiarEstado(2);

                                }.bind(this), 1000);
                            } else {
                                if (usuario.pass == usuario.passTemp) {
                                    nuevoMensaje(tiposAlertas.warn, "Has ingresado con un código temporal, debes cambiar tu contraseña en este momento")
                                    agregarEventoBitacora(29, "id usuario: " + usuario.id + " - código temp: " + usuario.passTemp, 0)
                                    setTimeout(function () {
                                        this.props.fun.cambiarEstado(2);
                                        this.props.saveUsuario(usuario);

                                    }.bind(this), 1000);
                                } else {
                                    agregarEventoBitacora(23, "id usuario: " + usuario.id, usuario.id)
                                    this.guardarSesion(usuario)
                                    setTimeout(function () {
                                        this.props.fun.cambiarEstado(3);
                                        this.props.saveUsuario(usuario);


                                    }.bind(this), 1000);
                                }
                            }

                        } else {
                            nuevoMensaje(tiposAlertas.cargadoError, "Contraseña incorrecta");
                            agregarEventoBitacora(22, "id usuario: " + usuario.id, 0)
                            this.setState({
                                password: ""
                            })
                        }
                    }
                }


            });
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }


    onSubmit = e => {
        e.preventDefault();
        if (this.state.id == "") {
            nuevoMensaje(tiposAlertas.error, "Ingrese un usuario");
        } else {
            if (this.state.password == "") {
                nuevoMensaje(tiposAlertas.error, "Ingrese una contraseña");
            } else {
                this.login();

            }
        }


    }

    render() {
        return (
            <div className="Login">
                <div className="backLogin">
                    <h2>Inicio de sesión</h2>
                    <div className="formularioLogin">
                        <form onSubmit={this.onSubmit}>
                            <Input className="inputform" type="text" placeholder="Correo electrónico" value={this.state.id} name="id" onChange={this.onChange} />
                            <Input className="inputform" type="password" placeholder="Contraseña" value={this.state.password} name="password" onChange={this.onChange} />
                            <Input className="inputform buttonUno" type="submit" value="Iniciar sesión" />
                        </form>
                        <img src={require("../../image/general/candado.png")} alt="" />
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);