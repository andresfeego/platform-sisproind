import React, { Component } from 'react'
import request from 'superagent';
import "./DetalleEstudiante.scss"
import "./DetalleEstudiante_mobile.scss"
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import Cargando from '../../../../Inicialized/Cargando';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora';

export default class DetalleEstudiante extends Component {

    constructor(props) {
        super(props)

        this.state = {
            estudiante: "",
            tiposDocumento: [],
            telefonos: [],
        }
    }




    componentDidMount() {
        this.getEstudiante()
        this.getTipoDocumento()
        this.getTelefonos()
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', this.onBackButtonEvent);
    }

    getEstudiante() {
        request
            .get('/responseSisproind/estudianteXid/' + this.props.idEstudiante)
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
                            estudiante: "",
                        })
                    } else {
                        this.setState({
                            estudiante: respuestaLogin[0],
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
            .get('/responseSisproind/telEstXid/' + this.props.idEstudiante)
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


    activarDesactivarEstudiante(estudiante) {
        let accion = 1
        if (estudiante.activo == 1) {
            accion = 0
        }

        let labelActivar = "Activar "

        if (accion == 0) {
            labelActivar = "Desactivar "
        }

        request
            .post('/responseSisproind/actDesEstu')
            .set('accept', 'json')
            .send({ accion: accion, id: estudiante.id })
            .end((err, res) => {
                if (err) {
                    nuevoMensaje(tiposAlertas.error, "Error al " + labelActivar + " estudiante" + err, 3000)
                } else {
                    nuevoMensaje(tiposAlertas.success, "Estudiante actualizado", 1000)
                    let accionLetra = "Activado"
                    if (accion == 0) {
                        accionLetra = "Desactivado"
                    }
                    agregarEventoBitacora(8, "id estudiante: " + estudiante.id + " - accion: " + accionLetra)
                    this.getEstudiante()
                }
            });

    }

    render() {
        var estudiante = this.state.estudiante

        if (estudiante != "") {
            let ActDes = "desactivar"
            let estado = "Activo"
            if (estudiante.activo == 0) {
                ActDes = "Activar"
                estado = "Inactivo"
            }
            return (


                <div className="detalleEstudiante">

                    <div className="editarEstado">

                        <span className="estado" >Estado actual: {estado}</span>

                        <div className="btnEditarEstadoCurso" onClick={() => this.activarDesactivarEstudiante(estudiante)}>

                            {estudiante.activo == 0 ?
                                <SentimentSatisfiedAltIcon className="icon" />
                                :
                                <SentimentDissatisfiedIcon className="icon" />
                            }

                            {ActDes}

                        </div>

                    </div>

                    <div className="datosPersonales">

                        <h3>Datos Personales</h3>

                        {estudiante.urlImage == "" ?
                            <img src={require("../../../../image/general/estudiantes.png")} alt="" className="imagenPerfil" />
                            :
                            <img src={"http://www.sisproind.com/plataforma/image/estudiantes/" + estudiante.urlImage} alt="" />
                        }

                        <span><strong>Tipo documento: </strong> {this.renderTipoDocumento(estudiante.tipoDoc)} </span>
                        <span><strong>Documento: </strong> {estudiante.id} </span>
                        <span><strong>Nombres: </strong> {estudiante.nombres} </span>
                        <span><strong>Apellidos: </strong> {estudiante.apellidos} </span>
                        <span><strong>Correo electrónico: </strong> <a href={"mailto:" + estudiante.email}> {estudiante.email} </a> </span>
                        {this.renderTelefonos()}

                    </div>

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
