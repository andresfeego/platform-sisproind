import React, { Component } from 'react'
import { getDb } from '../../../../Inicialized/ApiDb';
import Cargando from '../../../../Inicialized/Cargando'
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast'
import { buildAssetsUrl, buildFirmaUrl } from '../../../../Inicialized/BackendConfig';

export default class DetallesInstructor extends Component {

    constructor(props) {
        super(props)

        this.state = {
            instructor: "",
            tiposDocumento: [],
            telefonos: [],
            mostrarFirma: true,
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
        getDb('/responseSisproind/instructorXid/' + this.props.idInstructor)
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
                            mostrarFirma: true,
                        })
                    }
                }
            });
    }

    getTipoDocumento() {
        getDb('/responseSisproind/tipoDocumento')
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
        getDb('/responseSisproind/telInstXid/' + this.props.idInstructor)
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
            const firmaUrl = instructor.urlFirmaInstructor ? buildFirmaUrl(instructor.urlFirmaInstructor) : ""
            const imagenPerfil = instructor.urlImage == "" ?
                require("../../../../image/general/estudiantes.png") :
                buildAssetsUrl(`/image/estudiantes/${instructor.urlImage}`)

            if (firmaUrl) {
                console.log("Firma instructor URL:", firmaUrl)
            }

            return (


                <div className="detalleEstudiante">


                    <h3>Datos Personales</h3>

                    <img src={imagenPerfil} alt="" className="imagenPerfil" />

                    <span><strong>Tipo documento: </strong> {this.renderTipoDocumento(instructor.tipoDoc)} </span>
                    <span><strong>Documento: </strong> {instructor.id} </span>
                    <span><strong>Nombres: </strong> {instructor.nombres} </span>
                    <span><strong>Apellidos: </strong> {instructor.apellidos} </span>
                    <span><strong>Correo electrónico: </strong> <a href={"mailto:" + instructor.email} > {instructor.email} </a> </span>
                    {this.renderTelefonos()}

                    <br />

                    <h3>Firma</h3>
                    {this.state.mostrarFirma && firmaUrl !== "" ? (
                        <div style={{ width: '220px', height: '140px', borderRadius: '12px', border: '1px solid #ddd', overflow: 'hidden', background: '#fafafa' }}>
                            <img
                                src={firmaUrl}
                                alt="Firma instructor"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                onError={() => this.setState({ mostrarFirma: false })}
                            />
                        </div>
                    ) : (
                        <span>No hay firma registrada</span>
                    )}

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
