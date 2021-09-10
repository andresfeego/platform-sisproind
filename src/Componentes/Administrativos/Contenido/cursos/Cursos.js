import React, { Component } from 'react'
import AgregarCurso from './AgregarCurso';
import Curso from './Curso';
import DetalleCurso from './DetalleCurso';
import SearchSharpIcon from '@material-ui/icons/SearchSharp';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import Cargando from '../../../../Inicialized/Cargando';
import { Input } from '@material-ui/core';
import { zfill } from '../../../../Inicialized/FuncionesGlobales';

var buscar

export default class Cursos extends Component {


    constructor(props) {
        super(props)

        this.state = {
            contenido: 1,
            curso: "",
            listado: "init",
            listadoOriginal: [],
            busqueda: "",
            buscando: false
        }
    }




    componentDidMount() {
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', this.onBackButtonEvent);
        this.getCursos()
    }

    onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!this.isBackButtonClicked) {
            this.props.fun.cambiarEstado(1)
        }
    }

    getCursos() {

        request
            .get('/responseSisproind/cursos')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.error, "Imposible cargar listado de cursos, intente mas tarde")
                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        nuevoMensaje(tiposAlertas.warn, "Hay 0 cursos para esta lista")
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

    cambiarContenido(cont) {
        this.setState({
            contenido: cont
        })
    }

    setCurso(cur) {
        this.setState({
            curso: cur
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
                                    <Input className="inputform" type="text" placeholder="Buscar por id o nombre del curso" value={this.state.busqueda} name="busqueda" onChange={this.onChange} />
                                </div>
                                <div className="btnFiltros" onClick={() => this.abrirFiltros()}>
                                    <SearchSharpIcon className="icon" />
                                    Filtros
                                </div>
                            </div>

                            <AgregarCurso fun={this} />

                        </div>,

                        <div className="listado">
                            <h1>Listado cursos</h1>
                            {this.renderListado()}
                        </div>
                    ]
                )

            case 2:


                return (
                    <div className="listado">
                        <span onClick={() => this.cambiarContenido(1)} className="volverAtras">{"◀️ Volver al listado"}</span>
                        <h1>Detalle curso</h1>
                        <DetalleCurso curso={this.state.curso} fun={this} />
                    </div>
                )

            default:
                alert("default");
                break;
        }
    }



    renderListado() {
        if (this.state.listado == "init") {
            return <Cargando />
        } else {
            if (this.state.listado == "vacio") {
                return <span>No hay cursos para este listado</span>
            } else {
                return (
                    <div className="listado">
                        {this.state.listado.map((item) => <Curso fun={this} key={item.id} curso={item} />)}

                    </div>
                )
            }
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
                var nombre = item.nombreTema + " - " + item.nombreLinea
                var idCurso = item.siglaTema + " " + zfill(item.id, 3)
                if (prepBus.test(nombre) || prepBus.test(idCurso)) {
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
