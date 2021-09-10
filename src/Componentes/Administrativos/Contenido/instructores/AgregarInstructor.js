import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core'
import React, { Component } from 'react'
import PersonAddSharpIcon from '@material-ui/icons/PersonAddSharp';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora';

export default class AgregarInstructor extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false,
            tipoDocumento: 0,
            cedula: "",
            nombres: "",
            apellidos: "",
            profesion: "",
            email: "",
            telefonos: [],

            auxiTelefono: "",
            tiposDocumento: []

        };
    };

    componentDidMount() {
        this.getTipoDocumento()
    }


    handleClickOpen = () => {
        this.setState({
            open: true,
        })
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

    agregarTelefono = e => {
        if (this.state.auxiTelefono == "") {
            nuevoMensaje(tiposAlertas.warn, "No has insertado ningun telefono en el espacio telefono")
        } else {
            var expr = /^([0-9])*$/;

            if (!expr.test(this.state.auxiTelefono)) {
                nuevoMensaje(tiposAlertas.error, "El formato del telefono es incorrecto, solo se aceptan numeros")
            } else {
                var telefono = { id: (this.state.telefonos.length + 1), numero: this.state.auxiTelefono }
                this.state.telefonos.push(telefono)
                console.log(this.state.telefonos)
                this.setState({
                    auxiTelefono: ""
                })
            }

        }
    }

    eliminarTelefono(idTelefono) {
        var listaTelefonos = this.state.telefonos
        listaTelefonos.map((item, index) => {
            if (item.id == idTelefono) {
                listaTelefonos.splice(index, 1)
            }
        })

        this.setState({
            telefonos: listaTelefonos
        })
    }


    agregarTelefono = e => {
        if (this.state.auxiTelefono == "") {
            nuevoMensaje(tiposAlertas.warn, "No has insertado ningun telefono en el espacio telefono")
        } else {
            var expr = /^([0-9])*$/;

            if (!expr.test(this.state.auxiTelefono)) {
                nuevoMensaje(tiposAlertas.error, "El formato del telefono es incorrecto, solo se aceptan numeros")
            } else {
                var telefono = { id: (this.state.telefonos.length + 1), numero: this.state.auxiTelefono }
                this.state.telefonos.push(telefono)
                this.setState({
                    auxiTelefono: ""
                })
            }

        }
    }

    eliminarTelefono(idTelefono) {
        var listaTelefonos = this.state.telefonos
        listaTelefonos.map((item, index) => {
            if (item.id == idTelefono) {
                listaTelefonos.splice(index, 1)
            }
        })

        this.setState({
            telefonos: listaTelefonos
        })
    }


    guardar() {

        return new Promise((resolve, reject) => {
            request
                .post('/responseSisproind/crearInstructor')
                .send({ id: this.state.cedula, tipoDoc: this.state.tipoDocumento, nombres: this.state.nombres, apellidos: this.state.apellidos, email: this.state.email, profesion: this.state.profesion, telefonos: this.state.telefonos })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {

                        reject("Error al guardar información")

                    } else {
                        agregarEventoBitacora(14, "id instructor: " + this.state.cedula)
                        resolve()

                    }
                });
        })
    }


    validarInstructorExistente() {
        return new Promise((resolve, reject) => {
            request
                .get('/responseSisproind/instructorExiste/' + this.state.cedula)
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        reject("Error al consultar si instructor existe en la base de datos")
                    } else {

                        const respuestaLogin = JSON.parse(res.text);
                        if (respuestaLogin.length == 0) {
                            resolve()
                        } else {
                            reject("El documento ya esta en uso para el instructor " + respuestaLogin[0].nombres + " " + respuestaLogin[0].apellidos)
                        }
                    }
                });
        })
    }

    validarInfo() {

        return new Promise((resolve, reject) => {
            if (this.state.tipoDocumento == 0) {
                reject("Debes escoger una opción en tipo de documento")

            } else {
                if (this.state.cedula == "") {
                    reject("No has ingresado número de documento")

                } else {
                    var expr = /^([0-9])*$/;
                    if (!expr.test(this.state.cedula)) {
                        reject("El formato de número de documento es invalido, solo se aceptan números")
                    } else {

                        this.validarInstructorExistente().then(() => {

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
                                                    reject("Debes agregar al menos un número telefonico para el estudiante");
                                                } else {
                                                    resolve()
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }).catch((error) => {
                            reject(error)
                        })


                    }
                }
            }
        })

    }

    onSubmit() {
        nuevoMensaje(tiposAlertas.cargando, "Creando Instructor")
        this.validarInfo().then(() => {
            this.guardar().then(() => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                this.handleClickClose()
                this.props.fun.cambiarContenido(1)
                this.props.fun.getInstructores()

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
                <Box className="btnAgregar buElement" onClick={() => this.handleClickOpen()}>
                    <PersonAddSharpIcon className="icon" />
                    Nuevo Instructor
                </Box>


                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Nuevo Instructor</div></DialogTitle>
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

                                <Input className="inputform" type="text" placeholder="Número de documento" value={this.state.cedula} name="cedula" onChange={this.onChange} />
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

                        <Button color="primary" onClick={() => this.handleClickClose()}>
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}
