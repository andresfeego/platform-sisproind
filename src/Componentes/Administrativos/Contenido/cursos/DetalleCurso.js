import React, { Component } from 'react'
import { getDb, setDb } from '../../../../Inicialized/ApiDb';
import Cargando from '../../../../Inicialized/Cargando';
import AgregarAlumnoCurso from './AgregarAlumnoCurso';
import "./DetalleCurso.scss"
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import EditarCurso from './EditarCurso';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import BookIcon from '@material-ui/icons/Book';
import SchoolIcon from '@material-ui/icons/School';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import { zfill } from '../../../../Inicialized/FuncionesGlobales';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora';
import moment from 'moment';
import 'moment/locale/es';
import VistaPdf from '../../../Certificados/VistaPdf';
import { pdf } from '@react-pdf/renderer';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import DiplomaDoc from '../../../Certificados/Diploma';

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
            estudiantesEnCurso: null,
            mostrandoDiploma: false,
            cargandoDiploma: false,
            cursoDiploma: null,
            progresoZip: {
                total: 0,
                actual: 0
            }
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

            getDb('/responseSisproind/estudianteXcurso/' + this.props.curso.id)
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

        setDb('/responseSisproind/eliminarAlumnoDecurso')
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

        setDb('/responseSisproind/cambiarEstadoGraduado')
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

    verDiplomaAlumno = (estudiante) => {
        const idEstudiante = estudiante.idEstudiante || estudiante.id
        if (!idEstudiante) {
            nuevoMensaje(tiposAlertas.cargadoError, 'No se pudo identificar el estudiante')
            return
        }
        this.setState({ cargandoDiploma: true })
        getDb(`/responseSisproind/validarDiploma/${idEstudiante}/${this.props.curso.id}`)
            .set('accept', 'json')
            .end(async (err, res) => {
                if (err) {
                    this.setState({ cargandoDiploma: false })
                    nuevoMensaje(tiposAlertas.cargadoError, 'No fue posible cargar el diploma')
                    return
                }

                const respuesta = JSON.parse(res.text || '[]')
                if (!respuesta.length) {
                    this.setState({ cargandoDiploma: false })
                    nuevoMensaje(tiposAlertas.cargadoWarn, 'No hay informacion para mostrar el diploma')
                    return
                }

                let cursoDiploma = respuesta[0]
                try {
                    cursoDiploma = await this.completarFondoDiploma(cursoDiploma, idEstudiante)
                } catch (e) {
                    // fallback silencioso
                }

                this.setState({
                    cargandoDiploma: false,
                    mostrandoDiploma: true,
                    cursoDiploma: { ...cursoDiploma, tipoPdf: 'diploma' }
                })
            })
    }

    cerrarDiploma = () => {
        this.setState({ mostrandoDiploma: false, cursoDiploma: null })
    }

    fetchJson = (url) => {
        return new Promise((resolve, reject) => {
            getDb(url)
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        try {
                            resolve(JSON.parse(res.text || '[]'))
                        } catch (parseErr) {
                            reject(parseErr)
                        }
                    }
                })
        })
    }

    completarFondoDiploma = async (cursoDiploma, idEstudiante) => {
        if (cursoDiploma && cursoDiploma.urlFondoDiploma) {
            return cursoDiploma
        }
        const lista = await this.fetchJson(`/responseSisproind/certificadosCursos/${idEstudiante}`)
        const encontrado = (Array.isArray(lista) ? lista : []).find(
            (item) => String(item.idCurso) === String(this.props.curso.id)
        )
        if (encontrado && encontrado.urlFondoDiploma) {
            return { ...cursoDiploma, urlFondoDiploma: encontrado.urlFondoDiploma }
        }
        return cursoDiploma
    }

    descargarDiplomasCurso = async () => {
        try {
            nuevoMensaje(tiposAlertas.cargando, 'Generando diplomas...')
            const estudiantes = await this.fetchJson(`/responseSisproind/estudianteXcurso/${this.props.curso.id}`)
            const graduados = (Array.isArray(estudiantes) ? estudiantes : []).filter((item) => item.graduado == 1)

            if (graduados.length === 0) {
                nuevoMensaje(tiposAlertas.cargadoWarn, 'No hay alumnos graduados para este curso')
                return
            }

            const zip = new JSZip()
            this.setState({ progresoZip: { total: graduados.length, actual: 0 } })

            for (let i = 0; i < graduados.length; i += 1) {
                const estudiante = graduados[i]
                const idEstudiante = estudiante.idEstudiante || estudiante.id
                if (!idEstudiante) {
                    this.setState({ progresoZip: { total: graduados.length, actual: i + 1 } })
                    continue
                }
                const data = await this.fetchJson(`/responseSisproind/validarDiploma/${idEstudiante}/${this.props.curso.id}`)
                if (!data.length) {
                    this.setState({ progresoZip: { total: graduados.length, actual: i + 1 } })
                    continue
                }
                let cursoDiploma = data[0]
                cursoDiploma = await this.completarFondoDiploma(cursoDiploma, idEstudiante)
                const blob = await pdf(<DiplomaDoc curso={cursoDiploma} />).toBlob()
                const nombreArchivo = `diploma_${idEstudiante}_${this.props.curso.id}.pdf`
                zip.file(nombreArchivo, blob)
                this.setState({ progresoZip: { total: graduados.length, actual: i + 1 } })
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' })
            saveAs(zipBlob, `diplomas_curso_${this.props.curso.id}.zip`)
            nuevoMensaje(tiposAlertas.cargadoSuccess, 'Diplomas generados')
            this.setState({ progresoZip: { total: 0, actual: 0 } })
        } catch (error) {
            console.error(error)
            nuevoMensaje(tiposAlertas.cargadoError, 'No fue posible generar los diplomas')
            this.setState({ progresoZip: { total: 0, actual: 0 } })
        }
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

                    {item.graduado == 1 ? (
                        <BootstrapTooltip title="Ver diploma del estudiante">
                            <SchoolIcon className="iconoDiploma" onClick={() => this.verDiplomaAlumno(item)} />
                        </BootstrapTooltip>
                    ) : null}

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
                    <span><strong>Empresa: </strong> {curso.empresa || "--"} </span>
                    <span><strong>NIT: </strong> {curso.nit || "--"} </span>
                    <span><strong>R.L: </strong> {curso.rl || "--"} </span>
                    <span><strong>ARL: </strong> {curso.arl || "--"} </span>

                </div>

                <div className="instructorDetalle">

                    {curso.urlImgIns == "" ?
                        <img src={require("../../../../image/general/estudiantes.png")} alt="" className="imagenPerfil" />
                        :
                        <img src={"/image/instructores/" + curso.urlImgIns} alt="" />
                    }
                    <div className="txtDetallesInst">
                        <h5>Instructor</h5>
                        <span>{curso.nombreIns + " " + curso.apellidosIns}</span>
                        <span>{curso.profesion}</span>
                    </div>

                </div>




                <br />

                <button className="btn-descargarDiplomas" onClick={this.descargarDiplomasCurso}>
                    Descargar diplomas (ZIP)
                </button>
                {this.state.progresoZip.total > 0 ? (
                    <div className="progresoZip">
                        Generando {this.state.progresoZip.actual} / {this.state.progresoZip.total}
                    </div>
                ) : null}
                {this.state.estudiantesEnCurso ? (
                    <div className="resumenAlumnos">
                        <div>Alumnos inscritos: {this.state.estudiantesEnCurso.length}</div>
                        <div>Alumnos graduados: {this.state.estudiantesEnCurso.filter((item) => item.graduado == 1).length}</div>
                    </div>
                ) : null}

                <AgregarAlumnoCurso curso={curso} fun={this} detalles={false} />

                <h3>Alumnos</h3>

                <div className="listadoAlumnos">
                    {this.state.estudiantesEnCurso == null ?
                        <Cargando />
                        :
                        this.renderListaAlumnos()
                    }
                </div>

                {this.state.mostrandoDiploma && this.state.cursoDiploma ? (
                    <div className="modalDiploma">
                        <div className="modalDiplomaCard">
                            <div className="modalDiplomaHeader">
                                <h3>Diploma del estudiante</h3>
                                <button className="btn-secundario" onClick={this.cerrarDiploma}>Cerrar</button>
                            </div>
                            <VistaPdf curso={this.state.cursoDiploma} />
                        </div>
                    </div>
                ) : null}

            </div>
        )
    }
}
