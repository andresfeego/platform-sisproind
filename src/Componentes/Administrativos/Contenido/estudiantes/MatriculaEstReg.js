import { Input } from '@material-ui/core';
import React, { Component } from 'react'
import request from 'superagent';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import Matriculado from './Matriculado';
import "./MatriculaEstReg.scss"
import "./MatriculaEstReg_mobile.scss"

export default class MatriculaEstReg extends Component {

    constructor(props) {
        super(props)

        this.state = {
            cedula: "",
            codigoTemp: "",
            matriculado: false,
            curso: "",
            estudiante: ""
        }
    }


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
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
                            reject("El usuario no existe")
                        } else {
                            const estudiante = respuestaLogin[0]
                            if (estudiante.activo == 0) {
                                reject("El estudiante se encuentra inactivo en nuestro sistema")
                            } else {
                                this.setState({
                                    estudiante: estudiante
                                })
                                resolve(estudiante)
                            }
                        }
                    }
                });
        })
    }

    validarUsuarioMatricula(curso, estudiante) {
        return new Promise((resolve, reject) => {

            request
                .post('/responseSisproind/validarEstParaMatricula')
                .send({ idEstudiante: estudiante.id, idCurso: curso.id })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        reject("Ocurrio un error al consultar, intenta de nuevo mas tarde. Detalles: " + err)
                    } else {

                        const respuestaLogin = JSON.parse(res.text);
                        if (respuestaLogin.length == 0) {
                            resolve()
                        } else {
                            reject("El estudiante ya se encuentra matriculado en este curso")
                        }
                    }

                });
        })
    }


    matricular(curso, estudiante) {
        return new Promise((resolve, reject) => {

            request
                .post('/responseSisproind/matricula')
                .send({ idCurso: curso.id, idEstudiante: estudiante.id })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        reject("Ocurrio un error al consultar, intenta de nuevo mas tarde. Detalles: " + err)
                    } else {
                        const respuestaLogin = JSON.parse(res.text);
                        agregarEventoBitacora(13, "id estudiante: " + estudiante.id + " id curso: " + curso.id, 0)
                        this.setState({
                            matriculado: true
                        })
                        resolve(respuestaLogin)
                    }
                });
        })
    }


    onSubmit = e => {
        e.preventDefault();
        if (this.state.cedula == "") {
            nuevoMensaje(tiposAlertas.error, "Ingrese un número de documento");
        } else {
            if (this.state.codigoTemp == "") {
                nuevoMensaje(tiposAlertas.error, "Ingrese un código de matricula");
            } else {
                nuevoMensaje(tiposAlertas.cargando, "Consultando curso...")
                this.consultar().then((curso) => {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Curso disponible para matricula " + curso.nombreTema + " - " + curso.nombreLinea)
                    nuevoMensaje(tiposAlertas.cargando, "Validando usuario")

                    this.validarUsuarioExistente().then((estudiante) => {

                        this.validarUsuarioMatricula(curso, estudiante).then(() => {
                            nuevoMensaje(tiposAlertas.cargadoSuccess, "Usuario valido para matricula " + estudiante.nombres + " " + estudiante.apellidos)
                            nuevoMensaje(tiposAlertas.cargando, "Generando matricula")
                            this.matricular(curso, estudiante).then(() => {
                                nuevoMensaje(tiposAlertas.cargadoSuccess, "Estudiante matriculado satisfactoriamente")
                            }).catch((error) => {
                                nuevoMensaje(tiposAlertas.cargadoError, error)
                            })
                        }).catch((error) => {
                            nuevoMensaje(tiposAlertas.cargadoError, error)
                        })

                    }).catch((error) => {
                        nuevoMensaje(tiposAlertas.cargadoError, error)
                    })

                }).catch((error) => {
                    nuevoMensaje(tiposAlertas.cargadoError, error)
                });
            }
        }


    }

    render() {
        const estudiante = this.state.estudiante
        const curso = this.state.curso

        return (
            <div className="backMatricula">
                {this.state.matriculado == false ?
                    <div className="formularioUniStep">
                        <form onSubmit={this.onSubmit}>
                            <Input className="inputform" type="text" placeholder="Número de documento" value={this.state.cedula} name="cedula" onChange={this.onChange} />
                            <Input className="inputform" type="text" placeholder="Código matricula" value={this.state.codigoTemp} name="codigoTemp" onChange={this.onChange} />

                            <Input className="inputform buttonUno" type="submit" value="Matricular" />
                        </form>
                    </div>
                    :
                    <Matriculado nombreEstudiante={estudiante.nombres + " " + estudiante.apellidos} curso={curso} />

                }
            </div>
        )
    }
}
