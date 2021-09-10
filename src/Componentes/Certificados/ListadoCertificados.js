import React, { Component } from 'react'
import request from 'superagent'
import Cargando from '../../Inicialized/Cargando'
import { nuevoMensaje, tiposAlertas } from '../../Inicialized/Toast'
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import BookIcon from '@material-ui/icons/Book';
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
        request
        .get('/responseSisproind/certificadosCursos/'+this.state.estudiante.id)
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
        this.props.fun.setCurso(curso)
        this.props.fun.cambiarEstado(3)
    }

    renderIconoDescarga(cursoA){
            return(
                [

                    <span className="descargarCertificado" onClick={() => this.verCertificado(cursoA)}>
                        <img src={require("../../image/general/constancia.png")} alt=""/>
                    </span>,

                    <PDFDownloadLink className="certificadoMobile"
                        document={<PDFDoc curso={ cursoA }/>}
                        fileName="certificado.pdf"
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
                                <AssignmentLateIcon className="iconoNoGraduado"/>
                                <span>No graduado</span>
                            </span>
                            :
                            <span className="graduado">
                                <BookIcon className="iconoGraduado" />
                                <span>Graduado</span>
                            </span>
                        }
                        <span className="estadoCur">{ item.nombreEstado } </span>
                        {item.estado == 4 && item.graduado == 1? 
                            
                            this.renderIconoDescarga(item)
                            :
                            <BootstrapTooltip title="El curso debe cerrar para descargar la constacia de estudio"   className="noDescargarCertificado">
                                <span>El curso debe ser finalizado para descargar la constacia de estudio</span>
                            </BootstrapTooltip>
                            }

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
                <h2>{"Listado de certificados para "} <br/> { estudiante.nombres + " " + estudiante.apellidos }</h2>
                <div className="listado">
                    {this.renderListado()}
                </div>


            </div>
        )
    }
}
