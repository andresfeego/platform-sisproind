import React, { Component } from 'react'
import request from 'superagent';
import Cargando from '../../../../Inicialized/Cargando';
import AgregarAlumnoCurso from './AgregarAlumnoCurso';
import "./DetalleCurso.scss"
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import EditarCurso from './EditarCurso';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import BookIcon from '@material-ui/icons/Book';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import { zfill } from '../../../../Inicialized/FuncionesGlobales';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');


const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
        color: theme.palette.common.black,
    },
    tooltip: {
        backgroundColor: theme.palette.common.black,
    },
}));

function BootstrapTooltip(props) {
    const classes = useStylesBootstrap();

    return <Tooltip arrow classes={classes} {...props} />;
}


export default class DetalleCurso extends Component {

    constructor(props) {
        super(props)

        this.state = {
            curso: this.props.curso,
            estudiantesEnCurso: null
        }
    }



    componentDidMount() {
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', this.onBackButtonEvent);
        this.getEstudiantesEnCurso()
    }

    onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!this.isBackButtonClicked) {
            this.props.fun.cambiarContenido(1)
        }
    }

    getEstudiantesEnCurso() {

        return new Promise((resolve, reject) => {

            request
                .get('/responseSisproind/estudianteXcurso/' + this.props.curso.id)
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        reject(err)

                    } else {

                        const respuestaLogin = JSON.parse(res.text);
                        this.setState({
                            estudiantesEnCurso: respuestaLogin,

                        })
                        resolve()

                    }
                });

        })
    }



    eliminarAlumnoDecurso(idEstudiante) {

        nuevoMensaje(tiposAlertas.cargando, "Eliminando alumno")

        request
            .post('/responseSisproind/eliminarAlumnoDecurso')
            .send({ idCurso: this.props.curso.id, idEstudiante: idEstudiante })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {

                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

                } else {

                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Eliminado de forma correcta del curso")
                    agregarEventoBitacora(4, "id estudiante: " + idEstudiante + " - id curso: " + zfill(this.props.curso.id, 3))
                    this.getEstudiantesEnCurso()

                }
            });

    }

    cambiarEstadoGraduado(estudiante) {

        let accion = 0

        if (estudiante.graduado == 0) {
            accion = 1
        }

        nuevoMensaje(tiposAlertas.cargando, "Cambiando estado de alumno en curso")

        request
            .post('/responseSisproind/cambiarEstadoGraduado')
            .send({ idCurso: this.props.curso.id, idEstudiante: estudiante.id, graduado: accion })
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {

                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

                } else {

                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Estado actualizado de forma correcta")
                    let accionLetra = "Graduado"
                    if (accion == 0) {
                        accionLetra = "No graduado"
                    }
                    agregarEventoBitacora(5, "id estudiante: " + estudiante.id + " - id curso: " + zfill(this.props.curso.id, 3) + " - acción: " + accionLetra)
                    this.getEstudiantesEnCurso()
                }
            });
    }


    renderListaAlumnos() {

        if (this.state.estudiantesEnCurso.length == 0) {
            return <span>No hay estudiantes en este curso</span>
        } else {
            return this.state.estudiantesEnCurso.map((item) =>
                <div className="estudiante">
                    <div className="texto">
                        {item.nombres + " " + item.apellidos + " - " + item.id}
                    </div>

                    {item.graduado == 0 ?
                        <BootstrapTooltip title="Click para cambiar estado a graduado">
                            <AssignmentLateIcon title="sxfgsdg" className="iconoNoGraduado" onClick={() => this.cambiarEstadoGraduado(item)} />
                        </BootstrapTooltip>
                        :
                        <BootstrapTooltip title="Click para cambiar estado a NO graduado">
                            <BookIcon className="iconoGraduado" onClick={() => this.cambiarEstadoGraduado(item)} />
                        </BootstrapTooltip>
                    }

                    <RemoveCircleOutlineIcon className="btnEliminar" onClick={() => this.eliminarAlumnoDecurso(item.id)} />
                </div>
            )
        }

    }


    render() {

        const curso = this.state.curso

        return (
            <div className="detalleCurso">

                <div className="datosCurso">
                    <EditarCurso curso={this.props.curso} fun={this} fun2={this.props.fun} detalles={true} />


                    <h3>{curso.siglaTema + " - " + zfill(curso.id, 3)}</h3>
                    <h2>{curso.nombreTema + " - " + curso.nombreLinea}</h2>
                    <p className={"estadoCurso " + curso.nombreEstado}>{curso.nombreEstado}</p>

                    <span><strong>Total horas: </strong> {curso.horas} </span>
                    <span><strong>Horas prácticas: </strong> {curso.horasPractica} </span>
                    <span><strong>horas teóricas: </strong> {curso.horasTeoria} </span>
                    <span><strong>Fecha creación: </strong> {moment(curso.fechaCreacion).format('LLLL')} </span>
                    <span><strong>Fecha Inicio: </strong>  {moment(curso.fechaInicio).format('LLLL')} </span>
                    <span><strong>Fecha Cierre: </strong>  {moment(curso.fechaCierre).format('LLLL')}  </span>

                </div>

                <div className="instructorDetalle">

                    {curso.urlImgIns == "" ?
                        <img src={require("../../../../image/general/estudiantes.png")} alt="" className="imagenPerfil" />
                        :
                        <img src={"http://www.sisproind.com/plataforma/image/instructores/" + curso.urlImgIns} alt="" />
                    }
                    <div className="txtDetallesInst">
                        <h5>Instructor</h5>
                        <span>{curso.nombreIns + " " + curso.apellidosIns}</span>
                        <span>{curso.profesion}</span>
                    </div>

                </div>




                <br />

                <AgregarAlumnoCurso curso={curso} fun={this} detalles={false} />

                <h3>Alumnos</h3>

                <div className="listadoAlumnos">
                    {this.state.estudiantesEnCurso == null ?
                        <Cargando />
                        :
                        this.renderListaAlumnos()
                    }
                </div>

            </div>
        )
    }
}
