import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core'
import React, { Component } from 'react'
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora';

export default class EditarInstructor extends Component {

    constructor(props) {
        super(props)
        const instructor = this.props.instructor
        this.state = {
            open: false,
            tipoDocumento: instructor.tipoDoc,
            cedula: instructor.id,
            nombres: instructor.nombres,
            apellidos: instructor.apellidos,
            profesion: instructor.profesion,
            email: instructor.email,
            telefonos: [],

            auxiTelefono: "",
            tiposDocumento: []

        };
    };

    componentDidMount() {
        this.getTipoDocumento()
        this.getTelefonosInstructor()
    }


    handleClickOpen = () => {
        const instructor = this.props.instructor
        this.setState({
            open: true,
            tipoDocumento: instructor.tipoDoc,
            cedula: instructor.id,
            nombres: instructor.nombres,
            apellidos: instructor.apellidos,
            profesion: instructor.profesion,
            email: instructor.email,
        })
        this.getTelefonosInstructor()
        this.props.fun.handleClickClose()
    };

    handleClickClose = () => {
        this.setState({
            open: false,
            tipoDocumento: 0,
            cedula: "",
            nombres: "",
            apellidos: "",
            profesion: "",
            email: "",
            telefonos: [],

            auxiTelefono: "",
        })
    };

    getTelefonosInstructor() {
        request
            .get('/responseSisproind/telInstXid/' + this.props.instructor.id)
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


    guardarTelefono() {
        return new Promise((resolve, reject) => {
            request
                .post('/responseSisproind/agregarTelInstructor')
                .send({ idInstructor: this.state.cedula, telefono: this.state.auxiTelefono })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {

                        reject("Error al guardar telefono")

                    } else {
                        agregarEventoBitacora(17, "id instructor: " + this.state.cedula + " - telefono: " + this.state.auxiTelefono)
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

                    this.getTelefonosInstructor()

                }).catch((error) => {
                    nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
                })

            }

        }
    }


    eliminarTelefono(idTelefono) {
        nuevoMensaje(tiposAlertas.cargando, "Eliminando telefono")
        request
            .post('/responseSisproind/eliminarTelInstructor')
            .send({ idTelefono: idTelefono })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {

                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar telefono", 3000)

                } else {

                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Telefono eliminado")
                    agregarEventoBitacora(18, "id instructor: " + this.state.cedula + " - telefono: " + this.state.telefonos.find((item) => item.id === idTelefono).numero)
                    this.getTelefonosInstructor()

                }
            });
    }

    guardar() {

        return new Promise((resolve, reject) => {
            request
                .post('/responseSisproind/editarInstructor')
                .send({ id: this.state.cedula, tipoDoc: this.state.tipoDocumento, nombres: this.state.nombres, apellidos: this.state.apellidos, email: this.state.email, profesion: this.state.profesion })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {

                        reject("Error al guardar información")

                    } else {
                        agregarEventoBitacora(19, "id instructor: " + this.state.cedula)
                        resolve()

                    }
                });
        })
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
                                if (this.state.profesion == "") {
                                    reject("Ingresa una profesión para este instructor")
                                } else {
                                    if (this.state.telefonos.length == 0) {
                                        reject("Debes agregar al menos un número telefonico para el instructor");
                                    } else {
                                        resolve()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

    }

    onSubmit() {
        nuevoMensaje(tiposAlertas.cargando, "Editando Instructor")
        this.validarInfo().then(() => {
            this.guardar().then(() => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                this.handleClickClose()
                this.props.fun2.cambiarContenido(1)
                this.props.fun2.getInstructores()

            }).catch((error) => {
                nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
            })

        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
        })
    }


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }

    render() {
        return (
            <React.Fragment>

                <MenuItem onClick={() => this.handleClickOpen()}>Editar</MenuItem>

                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Editar Instructor</div></DialogTitle>
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

                                <Input className="inputform" type="text" disabled={true} placeholder="Número de documento" value={this.state.cedula} name="cedula" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Nombres" value={this.state.nombres} name="nombres" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Apellidos" value={this.state.apellidos} name="apellidos" onChange={this.onChange} />
                                <Input className="inputform" type="text" placeholder="Profesión" value={this.state.profesion} name="profesion" onChange={this.onChange} />
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
