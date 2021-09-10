import React, { Component } from 'react'
import "./Estudiantes.scss"
import "./Estudiantes_mobile.scss"
import SearchSharpIcon from '@material-ui/icons/SearchSharp';
import AgregarEstudiante from './AgregarEstudiante';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import DetalleEstudiante from './DetalleEstudiante';
import Estudiante from './Estudiante';
import Cargando from '../../../../Inicialized/Cargando';
import { Input } from '@material-ui/core';

var buscar

export default class Estudiantes extends Component {



    constructor(props) {
        super(props)

        this.state = {
            contenido: 1,
            idEstudiante: "",
            listado: "init",
            listadoOriginal: [],
            busqueda: "",
            buscando: false
        }
    }




    componentDidMount() {
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', this.onBackButtonEvent);
        this.getEstudiantes()
    }

    getEstudiantes() {

        request
            .get('/responseSisproind/estudiantes')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.error, "Imposible cargar listado de estudiantes, intente mas tarde")
                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        nuevoMensaje(tiposAlertas.warn, "Hay 0 estudiantes para esta lista")
                        this.setState({
                            listado: "vacio",
                        })
                    } else {
                        this.setState({
                            listado: respuestaLogin,
                            listadoOriginal: respuestaLogin,
                        })
                    }
                }
            });
    }

    renderListado() {
        if (this.state.listado == "init") {
            return <Cargando />
        } else {
            if (this.state.listado == "vacio") {
                return <span>No hay estudiantes para este listado</span>
            } else {
                return (
                    <div className="listado">
                        {this.state.listado.map((item) => <Estudiante fun={this} key={item.id} estudiante={item} />)}

                    </div>
                )
            }
        }
    }

    onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!this.isBackButtonClicked) {
            this.props.fun.cambiarEstado(1)
        }
    }

    cambiarContenido(cont) {
        this.setState({
            contenido: cont
        })
    }

    setEstudiante(est) {
        this.setState({
            idEstudiante: est
        })
    }


    renderContenido() {
        switch (this.state.contenido) {
            case 1:

                let visible = ""
                if (this.state.buscando == true) {
                    visible = "visible"
                }

                return (
                    [
                        <div className="barraUp">
                            <span onClick={() => this.props.fun.cambiarEstado(1)} className="volverAtras">{"◀️ Volver al menú"}</span>

                            <div className="filtrosContainer buElement">
                                <div className={"filtros " + visible}>
                                    <Input className="inputform" type="text" placeholder="Buscar por nombre o documento" value={this.state.busqueda} name="busqueda" onChange={this.onChange} />
                                </div>
                                <div className="btnFiltros" onClick={() => this.abrirFiltros()}>
                                    <SearchSharpIcon className="icon" />
                                    Filtros
                                </div>
                            </div>

                            <AgregarEstudiante fun={this} />

                        </div>,

                        <div className="listado">
                            <h1>Listado estudiantes</h1>
                            {this.renderListado()}
                        </div>
                    ]
                )

            case 2:
                return (
                    <div className="listado">
                        <span onClick={() => this.cambiarContenido(1)} className="volverAtras">{"◀️ Volver al listado"}</span>
                        <h1>Detalle estudiante</h1>
                        <DetalleEstudiante idEstudiante={this.state.idEstudiante} fun={this} />
                    </div>
                )

            default:
                alert("default");
                break;
        }
    }

    onChange = e => {

        clearTimeout(buscar)
        var value = e.target.value
        this.setState({
            [e.target.name]: value
        })

        buscar = setTimeout(() => this.buscar(value), 500);

    }

    buscar(busqueda) {
        this.setState({
            listado: "init",
        })

        if (busqueda == "") {

            this.setState({
                listado: this.state.listadoOriginal,
            })

        } else {
            var prepBus = new RegExp(busqueda, 'i'); // preparando termino de busqueda
            let estudiantesAuxi = this.state.listadoOriginal.filter((item) => {
                if (prepBus.test(item.id) || prepBus.test(item.nombres) || prepBus.test(item.apellidos)) {
                    return true
                } else {
                    return false
                }
            });
            if (estudiantesAuxi.length == 0) {
                estudiantesAuxi = "vacio"
            }
            this.setState({
                listado: estudiantesAuxi,
            })

        }
    }

    abrirFiltros() {
        this.setState({
            buscando: !this.state.buscando,
            busqueda: "",
            listado: this.state.listadoOriginal
        })
    }


    render() {


        return (
            <div className="estudianteAdmin">


                {this.renderContenido()}


            </div>
        )
    }
}
