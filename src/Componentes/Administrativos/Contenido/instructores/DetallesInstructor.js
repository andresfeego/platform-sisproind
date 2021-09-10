import React, { Component } from 'react'
import request from 'superagent'
import Cargando from '../../../../Inicialized/Cargando'
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast'

export default class DetallesInstructor extends Component {

    constructor(props) {
        super(props)

        this.state = {
            instructor: "",
            tiposDocumento: [],
            telefonos: [],
        }
    }

    componentDidMount() {
        this.getInstructor()
        this.getTipoDocumento()
        this.getTelefonos()
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', this.onBackButtonEvent);
    }

    getInstructor() {
        request
            .get('/responseSisproind/instructorXid/' + this.props.idInstructor)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.error, "Imposible cargar información para este estudiante, intente mas tarde")
                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        nuevoMensaje(tiposAlertas.warn, "No hay estudiante o se encuentra desactivado")
                        this.setState({
                            instructor: "",
                        })
                    } else {
                        this.setState({
                            instructor: respuestaLogin[0],
                        })
                    }
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

    getTelefonos() {
        request
            .get('/responseSisproind/telInstXid/' + this.props.idInstructor)
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

    onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!this.isBackButtonClicked) {
            this.props.fun.cambiarContenido(1)
        }
    }

    renderTelefonos() {
        if (this.state.telefonos.length == 0) {
            return null
        } else {
            return (
                this.state.telefonos.map((telefono) => <span><strong>Telefono: </strong> <a href={"tel:" + telefono.numero}> {telefono.numero} </a></span>
                )
            )
        }
    }

    renderTipoDocumento = (id) => {
        let tipodoc = ""
        this.state.tiposDocumento.map((item) => {
            if (item.id == id) {
                tipodoc = item.documento
            }
        })

        return tipodoc

    }


    render() {
        const instructor = this.state.instructor

        if (instructor != "") {
            return (


                <div className="detalleEstudiante">


                    <h3>Datos Personales</h3>

                    {instructor.urlImage == "" ?
                        <img src={require("../../../../image/general/estudiantes.png")} alt="" className="imagenPerfil" />
                        :
                        <img src={"http://www.sisproind.com/plataforma/image/estudiantes/" + instructor.urlImage} alt="" />
                    }

                    <span><strong>Tipo documento: </strong> {this.renderTipoDocumento(instructor.tipoDoc)} </span>
                    <span><strong>Documento: </strong> {instructor.id} </span>
                    <span><strong>Nombres: </strong> {instructor.nombres} </span>
                    <span><strong>Apellidos: </strong> {instructor.apellidos} </span>
                    <span><strong>Correo electrónico: </strong> <a href={"mailto:" + instructor.email} > {instructor.email} </a> </span>
                    {this.renderTelefonos()}

                    <br />


                    <h3>Cursos Activos</h3>
                    <br />
                    <h3>Cursos Culminado</h3>
                    <br />
                    <h3>Cursos No culminados</h3>
                    <br />
                </div>

            )

        } else {
            return <Cargando />
        }
    }
}
