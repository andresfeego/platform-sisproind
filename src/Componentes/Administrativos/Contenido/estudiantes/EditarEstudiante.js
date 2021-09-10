import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { Component } from 'react'
import request from 'superagent';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora';

export default class EditarEstudiante extends Component {


    constructor(props) {
        super(props)
        const estudiante = this.props.estudiante
        this.state = {
            open: false,
            tipoDocumento: estudiante.tipoDoc,
            cedula: estudiante.id,
            nombres: estudiante.nombres,
            apellidos: estudiante.apellidos,
            email: estudiante.email,
            telefonos: [],

            auxiTelefono: "",
            tiposDocumento: []

        };
    };

    componentDidMount() {
        this.getTipoDocumento()
        this.getTelefonosEstudiante()
    }

    getTipoDocumento() {
        request
            .get('/responseSisproind/tipoDocumento')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        tiposDocumento: respuestaLogin,
                    })
                }
            });
    }

    getTelefonosEstudiante() {
        request
            .get('/responseSisproind/telEstXid/' + this.props.estudiante.id)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        telefonos: respuestaLogin,
                    })
                }
            });
    }


    handleClickOpen = () => {
        const estudiante = this.props.estudiante

        this.setState({
            open: true,
            tipoDocumento: estudiante.tipoDoc,
            cedula: estudiante.id,
            nombres: estudiante.nombres,
            apellidos: estudiante.apellidos,
            email: estudiante.email,
            auxiTelefono: "",
        })
        this.getTelefonosEstudiante()
    };


    handleClickClose = () => {
        this.setState({
            open: false,
            tipoDocumento: 0,
            cedula: "",
            nombres: "",
            apellidos: "",
            email: "",
            telefonos: [],
            auxiTelefono: "",
        })
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }

    eliminarTelefono(idTelefono) {
        nuevoMensaje(tiposAlertas.cargando, "Eliminando telefono")
        request
            .post('/responseSisproind/eliminarTelEstudiante')
            .send({ idTelefono: idTelefono })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {

                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar telefono", 3000)

                } else {

                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Telefono eliminado")
                    agregarEventoBitacora(9, "id estudiante: " + this.props.estudiante.id + " - telefono: " + this.state.telefonos.find(item => item.id === idTelefono).numero)
                    this.getTelefonosEstudiante()

                }
            });
    }

    guardarTelefono() {
        return new Promise((resolve, reject) => {
            request
                .post('/responseSisproind/agregarTelEstudiante')
                .send({ idEstudiante: this.state.cedula, telefono: this.state.auxiTelefono })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {

                        reject("Error al guardar telefono")

                    } else {
                        agregarEventoBitacora(16, "id estudiante: " + this.props.estudiante.id + " - telefono: " + this.state.auxiTelefono)
                        resolve()

                    }
                });
        })
    }

    agregarTelefono() {
        if (this.state.auxiTelefono == "") {
            nuevoMensaje(tiposAlertas.warn, "No has insertado ningun telefono en el espacio telefono")
        } else {
            var expr = /^([0-9])*$/;

            if (!expr.test(this.state.auxiTelefono)) {
                nuevoMensaje(tiposAlertas.error, "El formato del telefono es incorrecto, solo se aceptan numeros")
            } else {

                nuevoMensaje(tiposAlertas.cargando, "Guardando telefono")
                this.guardarTelefono().then(() => {

                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Telefono guardado")

                    this.setState({
                        auxiTelefono: ""
                    })

                    this.getTelefonosEstudiante()

                }).catch((error) => {
                    nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
                })

            }

        }
    }

    validarInfo() {

        return new Promise((resolve, reject) => {
            if (this.state.tipoDocumento == 0) {
                reject("Debes escoger una opción en tipo de documento")
            } else {
                if (this.state.nombres == "") {
                    reject("Ingresa un nombre")
                } else {
                    if (this.state.apellidos == "") {
                        reject("Ingresa un apellido")
                    } else {
                        if (this.state.email == "") {
                            reject("Ingresa un correo electronico")
                        } else {
                            var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                            if (!expr.test(this.state.email)) {
                                reject("El formato de correo es incorrecto Ej: usuario@empresa.com");
                            } else {
                                if (this.state.telefonos.length == 0) {
                                    reject("Debes agregar al menos un número telefonico para el estudiante");
                                } else {
                                    resolve()
                                }
                            }
                        }
                    }
                }
            }
        })

    }

    guardar() {

        return new Promise((resolve, reject) => {
            request
                .post('/responseSisproind/editarEstudiante')
                .send({ idEstudiante: this.state.cedula, tipoDoc: this.state.tipoDocumento, nombres: this.state.nombres, apellidos: this.state.apellidos, email: this.state.email })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {

                        reject("Error al guardar información")

                    } else {
                        agregarEventoBitacora(10, "id estudiante: " + this.state.cedula)
                        resolve()

                    }
                });
        })
    }

    onSubmit = async () => {
        nuevoMensaje(tiposAlertas.cargando, "Editando Estudiante")
        this.validarInfo().then(() => {
            this.guardar().then(() => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Edición exitosa")
                this.handleClickClose()
                this.props.fun2.getEstudiantes()

            }).catch((error) => {
                nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
            })

        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
        })
    }

    abrirEdicion() {
        this.handleClickOpen()
        this.props.fun.handleClickClose()
    }


    render() {
        return (
            <React.Fragment>

                <MenuItem onClick={() => this.abrirEdicion()}>Editar</MenuItem>

                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Editar Estudiante</div></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>

                                <FormControl >
                                    <InputLabel htmlFor="max-width">Tipo de documento</InputLabel>
                                    <Select className="inputform" autoFocus value={0} onChange={this.onChange} value={this.state.tipoDocumento} inputProps={{ name: 'tipoDocumento', id: 'tipoDocumento' }} >
                                        <MenuItem key={0} value={0}>Seleccione tipo de documento</MenuItem>
                                        {this.state.tiposDocumento.map((tipo) => <MenuItem key={tipo.id} value={tipo.id}>{tipo.documento}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <Input className="inputform" type="text" placeholder="Número de documento" disabled={true} value={this.state.cedula} name="cedula" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Nombres" value={this.state.nombres} name="nombres" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Apellidos" value={this.state.apellidos} name="apellidos" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="E-mail" value={this.state.email} name="email" onChange={this.onChange} />

                                <span className="nombreListado">Telefonos:</span>
                                <div className="listaTelefonos">
                                    {this.state.telefonos.length == 0 ?
                                        <span>No se han agregado telefonos</span>
                                        :
                                        this.state.telefonos.map((telefono) => <div className="telefono" key={telefono.id}> {telefono.numero} <div className="eliminarTelefono" onClick={() => this.eliminarTelefono(telefono.id)}> <HighlightOffOutlinedIcon /> </div></div>)
                                    }
                                </div>

                                <div className="agregarTelefono">
                                    <Input className="inputform" type="text" placeholder="telefono" value={this.state.auxiTelefono} name="auxiTelefono" onChange={this.onChange} />
                                    <div className="inputform submit" onClick={() => this.agregarTelefono()}> Agregar </div>
                                </div>

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
