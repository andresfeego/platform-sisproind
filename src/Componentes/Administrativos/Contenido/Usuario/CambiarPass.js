import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, MenuItem } from '@material-ui/core';
import React, { Component } from 'react'
import request from 'superagent';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';

export default class CambiarPass extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,

            passwordA: '',
            password1: '',
            password2: ''
        }
    }

    handleClickOpen = (event) => {
        this.setState({
            open: true,
            passwordA: '',
            password1: '',
            password2: ''
        })
        this.props.fun.handleClickClose()
    };

    handleClickClose = () => {
        this.setState({
            open: false,

        })
    };


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    validarInfo() {
        return new Promise((resolve, reject) => {
            if (this.state.passwordA == '') {
                reject("Ingresa tu contraseña antigua");
            } else {

                if (this.state.password1 == '') {
                    reject("Ingresa la nueva contraseña");
                } else {

                    if (this.state.password2 == '') {
                        reject("Repite tu contraseña");
                    } else {
                        if (this.state.password1 != this.state.password2) {
                            reject("Las contraseñas no coinciden");
                        } else {
                            if (this.props.usuario.pass != this.state.passwordA) {
                                reject("la contraseña antigua es incorrecta")
                            } else {
                                resolve()
                            }
                        }

                    }
                }
            }

        })
    }

    guardarSesion(usuario) {
        request
            .post('/responseSisproind/guardarSesion')
            .send({ pass: this.state.password1, id: usuario.id })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {
                    console.log(res.text)
                }
            });
    }


    cambiarContrasena() {
        return new Promise((resolve, reject) => {
            request
                .post('/responseSisproind/usuarioSistema/cambiarContrasena')
                .send({ pass: this.state.password1, id: this.props.usuario.id })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        reject(err)
                    } else {
                        this.guardarSesion(this.props.usuario)
                        agregarEventoBitacora(20, "id usuario: " + this.props.usuario.id, this.props.usuario.id)
                        this.handleClickClose()
                        resolve()
                    }
                });
        })
    }

    onSubmit = async () => {
        nuevoMensaje(tiposAlertas.cargando, "Cambiando contraseña")
        this.validarInfo().then(() => {
            this.cambiarContrasena().then(() => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Contraseña actulizada")
            }).catch((error) => {
                nuevoMensaje(tiposAlertas.cargadoError, error)
            })

        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error)
        })

    }


    abrir() {
        this.handleClickOpen()
        this.props.fun.handleClickClose()
    }


    render() {
        return (
            <React.Fragment>

                <MenuItem onClick={() => this.abrir()}>Cambiar contraseña</MenuItem>

                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Detalle Estudiante</div></DialogTitle>

                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>
                                <Input className="inputform" type="password" placeholder="Contraseña antigua" value={this.state.passwordA} name="passwordA" onChange={this.onChange} />
                                <Input className="inputform" type="password" placeholder="Nueva contraseña" value={this.state.password1} name="password1" onChange={this.onChange} />
                                <Input className="inputform" type="password" placeholder="Repite nueva contraseña" value={this.state.password2} name="password2" onChange={this.onChange} />
                                {this.state.password1 != this.state.password2 && this.state.password1 != '' && this.state.password2 != '' ? <span style={{ color: "red" }}>No son identicas !</span> : null}

                            </form>
                        </div>
                    </DialogContent>

                    <DialogActions>

                        <Button color="primary" onClick={() => this.onSubmit()}>
                            Guardar
                        </Button>

                        <Button color="primary" onClick={this.handleClickClose}>
                            Cerrar
                        </Button>

                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}
