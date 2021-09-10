import React, { Component } from 'react'
import request from 'superagent';
import Cargando from '../../../../Inicialized/Cargando';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import AgregarInstructor from './AgregarInstructor';
import DetallesInstructor from './DetallesInstructor';
import Instructor from './Instructor';


export default class Instructores extends Component {

    constructor(props) {
        super(props)

        this.state = {
            contenido: 1,
            idInstructor: "",
            listado: "init",
        }
    }


    componentDidMount() {
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', this.onBackButtonEvent);
        this.getInstructores()
    }

    getInstructores() {

        request
            .get('/responseSisproind/instructores')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    nuevoMensaje(tiposAlertas.error, "Imposible cargar listado de instructores, intente mas tarde")
                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        nuevoMensaje(tiposAlertas.warn, "Hay 0 instructores para esta lista")
                        this.setState({
                            listado: "vacio",
                        })
                    } else {
                        this.setState({
                            listado: respuestaLogin,
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
                return <span>No hay instructores para este listado</span>
            } else {
                return (
                    <div className="listado">
                        {this.state.listado.map((item) => <Instructor fun={this} key={item.id} instructor={item} />)}

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

    setInstructor(inst) {
        this.setState({
            idInstructor: inst
        })
    }

    renderContenido() {
        switch (this.state.contenido) {
            case 1:
                return (
                    [
                        <div className="barraUp">
                            <span onClick={() => this.props.fun.cambiarEstado(1)} className="volverAtras">{"◀️ Volver al menú"}</span>

                            <AgregarInstructor fun={this} />

                        </div>,

                        <div className="listado">
                            <h1>Listado instructores</h1>
                            {this.renderListado()}
                        </div>

                    ]
                )

            case 2:
                return (
                    //detalle instructor
                    <div className="listado">
                        <span onClick={() => this.cambiarContenido(1)} className="volverAtras">{"◀️ Volver al listado"}</span>
                        <h1>Detalle instructor</h1>
                        <DetallesInstructor idInstructor={this.state.idInstructor} fun={this} />
                    </div>
                )

            default:
                alert("default");
                break;
        }
    }


    render() {
        return (
            <div className="estudianteAdmin">


                {this.renderContenido()}


            </div>
        )
    }
}
