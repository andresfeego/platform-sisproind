import React, { Component } from 'react'
import BotonMenuCurso from './BotonMenuCurso'
import "./Curso.scss"
import "./Curso_mobile.scss"
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import { zfill } from '../../../../Inicialized/FuncionesGlobales';


export default class Curso extends Component {


    render() {
        const curso = this.props.curso
        return (
            <div className="curso">

                <div className={"idCurso " + curso.nombreEstado}>
                    {curso.siglaTema + " - " + zfill(curso.id, 3)}
                </div>

                <div className="nombre">
                    {curso.nombreTema + " - " + curso.nombreLinea}
                </div>

                <div className="codMat">
                    {curso.estado == 2 ?
                        <div className="codigo" >
                            <CopyToClipboard text={curso.codTempMatricula} onCopy={() => nuevoMensaje(tiposAlertas.info, "Código copiado al portapapeles")}>
                                <FileCopyIcon className="icon" />
                            </CopyToClipboard>
                            <span>{curso.codTempMatricula}</span>

                        </div>
                        :
                        null
                    }
                    <span className="estado">{curso.nombreEstado}</span>
                </div>

                <BotonMenuCurso curso={curso} fun={this.props.fun} />

            </div>
        )
    }
}
