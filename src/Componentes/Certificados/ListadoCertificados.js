import React, { Component } from 'react'
import { getDb } from '../../Inicialized/ApiDb';
import Cargando from '../../Inicialized/Cargando'
import { nuevoMensaje, tiposAlertas } from '../../Inicialized/Toast'
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import BookIcon from '@material-ui/icons/Book';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import SchoolIcon from '@material-ui/icons/School';
import "./ListadoCertificados.scss"
import "./ListadoCertificados_mobile.scss"
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Moment from 'react-moment';
import { PDFDoc }  from './Certificado'
import { zfill } from '../../Inicialized/FuncionesGlobales';
import { agregarEventoBitacora } from '../../Inicialized/Bitacora';
import { PDFDownloadLink } from "@react-pdf/renderer";



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



export default class ListadoCertificados extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             estudiante: this.props.estudiante,
             listado: []
        }

    }

    componentDidMount(){
        this.getListado()
    }

    
    getListado(){
        getDb('/responseSisproind/certificadosCursos/'+this.state.estudiante.id)
        .set('accept', 'json')
        .end((err, res) => {
                if (err) {
                    nuevoMensaje(tiposAlertas.error, "Ocurrio un error al consultar, intenta de nuevo mas tarde. Detalles: " + err)
    
    
                } else {
                    
                    const respuestaLogin =   JSON.parse(res.text);
                    this.setState({
                        listado: respuestaLogin,

                    })
                }
        });
    }

    verCertificado(curso){
        agregarEventoBitacora(26, "id estudiante: " + curso.idEstudiante + " - id curso: " + zfill(curso.idCurso, 3), 0)
        this.props.fun.setCurso({ ...curso, tipoPdf: 'certificado' })
        this.props.fun.cambiarEstado(3)
    }

    verDiploma(curso){
        agregarEventoBitacora(26, "id estudiante: " + curso.idEstudiante + " - id curso: " + zfill(curso.idCurso, 3) + " - diploma", 0)
        this.props.fun.setCurso({ ...curso, tipoPdf: 'diploma' })
        this.props.fun.cambiarEstado(3)
    }

    renderIconoDescarga(cursoA){
            if (cursoA.estado != 4) {
                return (
                    <BootstrapTooltip title="El curso debe estar finalizado para descargar la constancia">
                        <span className="descargarCertificado deshabilitado">
                            <img src={require("../../image/general/constancia.png")} alt=""/>
                        </span>
                    </BootstrapTooltip>
                )
            }

            return(
                [
                    <span className="descargarCertificado" onClick={() => this.verCertificado(cursoA)}>
                        <img src={require("../../image/general/constancia.png")} alt=""/>
                    </span>,

                    <PDFDownloadLink className="certificadoMobile"
                        document={<PDFDoc curso={ cursoA }/>}
                        fileName="certificado.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            textDecoration: "none",
                            padding: "10px",
                            color: "#4a4a4a",
                            backgroundColor: "#f2f2f2",
                            border: "1px solid #4a4a4a"
                        }}
                    >
                        {({ blob, url, loading, error }) =>
                        loading ? "Cargando documento" : "Descargar certificado"
                        }
                    </PDFDownloadLink>
                ]
            )
        }

    renderIconoDiploma(cursoA){
        if (cursoA.graduado != 1) {
            return null
        }
        if (cursoA.estado != 4) {
            return (
                <BootstrapTooltip title="El curso debe estar finalizado para descargar el diploma">
                    <span className="descargarDiploma deshabilitado">
                        <span className="diplomaIcon">
                            <SchoolIcon />
                            <span>Diploma</span>
                        </span>
                    </span>
                </BootstrapTooltip>
            )
        }

        return (
            [
                <span className="descargarDiploma" onClick={() => this.verDiploma(cursoA)}>
                    <span className="diplomaIcon">
                        <SchoolIcon />
                        <span>Diploma</span>
                    </span>
                </span>
            ]
        )
    }
    
    renderEstadoCurso(item){
        let IconoEstado = AddCircleOutlineIcon
        let textoEstado = item.nombreEstado || ''

        if (item.estado == 2) {
            IconoEstado = GroupAddIcon
        } else if (item.estado == 3) {
            IconoEstado = PlayCircleOutlineIcon
        } else if (item.estado == 4) {
            IconoEstado = CheckCircleOutlineIcon
        }

        return (
            <span className="estadoCur">
                <BootstrapTooltip title={textoEstado}>
                    <span className="estadoIcon">
                        <IconoEstado />
                    </span>
                </BootstrapTooltip>
                <span className="estadoLabel">{textoEstado}</span>
            </span>
        )
    }

    renderListado(){
        if (this.state.listado == null) {
            return <Cargando/>
        } else {

            if (this.state.listado.length == 0) {
                return <span>No hay certificados para mostrar</span>
            } else {
                return this.state.listado.map((item) => 
                    <div className="certificado">
                        <span className="idCurso">{item.sigla + " - " + zfill( item.idCurso , 3)}</span>
                        <span className="nombreCurso">{ item.nombreTema + " - " + item.nombre}</span>
                        <span className="fechaCierre">
                            <Moment format="YYYY-MM-DD">{ item.fechaCierre }</Moment>
                        </span>
                        
                        {item.graduado == 0 ?
                            <span className="graduado">
                                <BootstrapTooltip title="No graduado">
                                    <span className="estadoIcon">
                                        <AssignmentLateIcon className="iconoNoGraduado"/>
                                    </span>
                                </BootstrapTooltip>
                                <span className="estadoLabel">No graduado</span>
                            </span>
                            :
                            <span className="graduado">
                                <BootstrapTooltip title="Graduado">
                                    <span className="estadoIcon">
                                        <BookIcon className="iconoGraduado" />
                                    </span>
                                </BootstrapTooltip>
                                <span className="estadoLabel">Graduado</span>
                            </span>
                        }
                        {this.renderEstadoCurso(item)}
                        {item.estado == 4 && item.graduado == 1? 
                            
                            this.renderIconoDescarga(item)
                            :
                            <BootstrapTooltip title="El curso debe cerrar para descargar la constacia de estudio"   className="noDescargarCertificado">
                                <span>El curso debe ser finalizado para descargar la constacia de estudio</span>
                            </BootstrapTooltip>
                            }

                        {this.renderIconoDiploma(item)}

                            {item.idTema == 8 & item.graduado == 1 && item.estado == 4 ? 
                                <a href="https://app2.mintrabajo.gov.co/CentrosEntrenamiento/consulta_ext.aspx" target="_blank"> Verificar oficialmente</a>
                                :
                                null
                            }
                    </div>
                )
            }
            
        }
    }


    render() {
        const estudiante = this.state.estudiante
        return (
            <div className="listadoCertificados">
                <div className="tituloCertificados">
                    <div className="tituloTexto">
                        <span className="tituloLabel">Listado de certificados</span>
                        <span className="tituloNombre">{estudiante.nombres + " " + estudiante.apellidos}</span>
                    </div>
                    <button
                        className="btnCambiarPersona"
                        onClick={() => {
                            this.props.fun.setEstudiante("")
                            this.props.fun.cambiarEstado(1)
                        }}
                    >
                        Cambiar persona
                    </button>
                </div>
                <div className="listado">
                    {this.renderListado()}
                </div>


            </div>
        )
    }
}
