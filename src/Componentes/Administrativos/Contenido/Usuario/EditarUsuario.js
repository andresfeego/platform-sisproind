import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, MenuItem } from '@material-ui/core';
import React, { Component } from 'react'
import request from 'superagent';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import { connect } from 'react-redux'
import { saveUsuario } from '../../../../Inicialized/Actions';

class EditarUsuario extends Component {

    constructor(props) {
        super(props);
        const usuario = this.props.usuario
        this.state = {
            open: false,

            nombres: usuario.nombre,
            apellidos: usuario.apellido,
            correo: usuario.email
        }
    }

    handleClickOpen = (event) => {

        const usuario = this.props.usuario
        this.setState({
            open: true,

            nombres: usuario.nombre,
            apellidos: usuario.apellido,
            correo: usuario.email
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
            if (this.state.nombres == '') {
                reject("Ingresa un nombre para el usuario")
            } else {
                if (this.state.apellidos == '') {
                    reject("Ingresa un apellido para el usuario")
                } else {
                    if (this.state.correo == '') {
                        reject("Ingresa un correo para este usuario")
                    } else {
                        var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                        if (!expr.test(this.state.correo)) {
                            reject("El formato de correo es incorrecto Ej: usuario@empresa.com");
                        } else {
                            resolve()
                        }
                    }
                }

            }

        })
    }

    editarUsuario() {
        return new Promise((resolve, reject) => {
            request
                .post('/responseSisproind/usuarioSistema/editarUsuario')
                .send({ id: this.props.usuario.id, nombre: this.state.nombres, apellido: this.state.apellidos, email: this.state.correo })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        reject(err)
                    } else {
                        agregarEventoBitacora(30, "id usuario: " + this.props.usuario.id, this.props.usuario.id)
                        this.handleClickClose()
                        this.props.usuario.nombre = this.state.nombres
                        this.props.usuario.apellido = this.state.apellidos
                        this.props.usuario.email = this.state.correo
                        this.props.saveUsuario(this.props.usuario)
                        this.props.fun2.setUsuario(this.props.usuario)
                        resolve()
                    }
                });
        })
    }

    onSubmit = async () => {
        nuevoMensaje(tiposAlertas.cargando, "Editando usuario")
        this.validarInfo().then(() => {
            this.editarUsuario().then(() => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Usuario actulizado")
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

                <MenuItem onClick={() => this.abrir()}>Editar</MenuItem>

                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Editar usuario</div></DialogTitle>

                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>
                                <Input className="inputform" type="text" placeholder="Id" value={this.props.usuario.id} name="id" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Nombres" value={this.state.nombres} name="nombres" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Apellidos" value={this.state.apellidos} name="apellidos" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Correo" value={this.state.correo} name="correo" onChange={this.onChange} />

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


const mapStateToProps = (state) => {
    return {
        usuario: state.usuario
    }
}

const mapDispatchToProps = {
    saveUsuario

}

export default connect(mapStateToProps, mapDispatchToProps)(EditarUsuario);