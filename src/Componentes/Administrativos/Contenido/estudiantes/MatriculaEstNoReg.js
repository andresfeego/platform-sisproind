import { FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core'
import React, { Component } from 'react'
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import Matriculado from './Matriculado';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora';
import { zfill } from '../../../../Inicialized/FuncionesGlobales';

export default class MatriculaEstNoReg extends Component {

    constructor(props) {
        super(props)

        this.state = {
            tipoDocumento: 0,
            cedula: "",
            nombres: "",
            apellidos: "",
            email: "",
            telefonos: [],

            auxiTelefono: "",
            tiposDocumento: [],
            registrado: false,

            codigoTemp: "",
            matriculado: false,
            curso: "",
            estudiante: ""
        }
    }


    componentDidMount() {
        this.getTipoDocumento()
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


    validarUsuarioExistente() {
        return new Promise((resolve, reject) => {
            request
                .get('/responseSisproind/estudianteExiste/' + this.state.cedula)
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        reject("Error al consultar si usuario existe en la base de datos")
                    } else {

                        const respuestaLogin = JSON.parse(res.text);
                        if (respuestaLogin.length == 0) {
                            resolve()
                        } else {
                            reject("El documento ya esta en uso para el usuario " + respuestaLogin[0].nombres + " " + respuestaLogin[0].apellidos)
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

                        this.validarUsuarioExistente().then(() => {

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
                                                if (this.state.codigoTemp == "") {
                                                    reject("Ingresa un codigo de matricula")
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

    guardar() {

        return new Promise((resolve, reject) => {
            request
                .post('/responseSisproind/crearEstudiante')
                .send({ id: this.state.cedula, tipoDoc: this.state.tipoDocumento, nombres: this.state.nombres, apellidos: this.state.apellidos, email: this.state.email, telefonos: this.state.telefonos })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {

                        reject("Error al guardar información")

                    } else {
                        this.setState({
                            registrado: true
                        })
                        agregarEventoBitacora(11, "id estudiante: " + this.state.cedula, 0)
                        resolve()

                    }
                });
        })
    }


    matricular(curso) {
        return new Promise((resolve, reject) => {

            request
                .post('/responseSisproind/matricula')
                .send({ idCurso: curso.id, idEstudiante: this.state.cedula })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        reject("Ocurrio un error al consultar, intenta de nuevo mas tarde. Detalles: " + err)
                    } else {
                        const respuestaLogin = JSON.parse(res.text);
                        this.setState({
                            matriculado: true
                        })
                        agregarEventoBitacora(12, "id estudiante: " + this.state.cedula + " - id curso: " + zfill(curso.id, 3), 0)
                        resolve(respuestaLogin)
                    }
                });
        })
    }

    consultar() {
        return new Promise((resolve, reject) => {

            request
                .get('/responseSisproind/consultarMatriculaCurso/' + this.state.codigoTemp)
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        reject("Ocurrio un error al consultar, intenta de nuevo mas tarde. Detalles: " + err)
                    } else {

                        const respuestaLogin = JSON.parse(res.text);
                        if (respuestaLogin.length == 0) {
                            reject("El código de matricula no es valido")
                        } else {
                            const curso = respuestaLogin[0]

                            if (curso.estado != 2) {
                                reject("Este curso no se encuentra habilitado para matriculas")
                            } else {
                                this.setState({
                                    curso: curso
                                })
                                resolve(curso)
                            }
                        }
                    }
                });
        })
    }


    onSubmit = async (e) => {
        e.preventDefault();
        if (this.state.registrado) {
            if (this.state.codigoTemp == "") {
                nuevoMensaje(tiposAlertas.error, "Ingresa un código de matricula")
            } else {
                nuevoMensaje(tiposAlertas.cargando, "Consultando curso...")
                this.consultar().then((curso) => {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Curso disponible para matricula " + curso.nombreTema + " - " + curso.nombreLinea)
                    nuevoMensaje(tiposAlertas.success, "Usuario valido para matricula " + this.state.nombres + " " + this.state.apellidos)
                    nuevoMensaje(tiposAlertas.cargando, "Generando matricula")
                    this.matricular(curso).then((item) => {
                        nuevoMensaje(tiposAlertas.cargadoSuccess, "Estudiante matriculado satisfactoriamente")
                    }).catch((error) => {
                        nuevoMensaje(tiposAlertas.cargadoError, error)
                    })


                }).catch((error) => {
                    nuevoMensaje(tiposAlertas.cargadoError, error)
                });
            }
        } else {
            nuevoMensaje(tiposAlertas.cargando, "Creando Estudiante")
            this.validarInfo().then(() => {
                this.guardar().then(() => {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Estudiante creado con exito")
                    nuevoMensaje(tiposAlertas.cargando, "Consultando curso...")
                    this.consultar().then((curso) => {
                        nuevoMensaje(tiposAlertas.cargadoSuccess, "Curso disponible para matricula " + curso.nombreTema + " - " + curso.nombreLinea, 10000)
                        nuevoMensaje(tiposAlertas.success, "Usuario valido para matricula " + this.state.nombres + " " + this.state.apellidos, 10000)
                        nuevoMensaje(tiposAlertas.cargando, "Generando matricula")
                        this.matricular(curso).then((item) => {
                            nuevoMensaje(tiposAlertas.cargadoSuccess, "Estudiante matriculado satisfactoriamente", 10000)
                        }).catch((error) => {
                            nuevoMensaje(tiposAlertas.cargadoError, error)
                        })


                    }).catch((error) => {
                        nuevoMensaje(tiposAlertas.cargadoError, error)
                    });

                }).catch((error) => {
                    nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
                })

            }).catch((error) => {
                nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
            })
        }

    }


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }


    render() {

        const curso = this.state.curso

        return (
            <div className="backMatricula">
                {this.state.matriculado == false ?
                    <div className="formularioUniStep">
                        <form onSubmit={this.onSubmit}>

                            {this.state.registrado == false ?
                                <div>
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
                                </div>
                                :
                                <span>Usuario registrado con exito, por favor completa la matricula con el código correcto</span>
                            }

                            <Input className="inputform codTemp" type="text" placeholder="Código matricula" value={this.state.codigoTemp} name="codigoTemp" onChange={this.onChange} />
                            <Input className="inputform buttonUno matricular" type="submit" value="Registrar y matricular" />

                        </form>
                    </div>
                    :
                    <Matriculado nombreEstudiante={this.state.nombres + " " + this.state.apellidos} curso={curso} />

                }
            </div>
        )
    }
}
