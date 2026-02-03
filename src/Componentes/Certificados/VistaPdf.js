import React, { Component } from 'react'
import { PDFViewer } from '@react-pdf/renderer';
import "./VistaPdf.scss"
import { PDFDoc } from './Certificado'
import DiplomaDoc from './Diploma'


export default class VistaPdf extends Component {
    render() {
        const curso = this.props.curso
        const isDiploma = curso && curso.tipoPdf === 'diploma'
        return (
            <div className="vistaPDF">
                <PDFViewer>
                    {isDiploma ? <DiplomaDoc curso={ curso }/> : <PDFDoc curso={ curso }/>}
                </PDFViewer>
            </div>
        )
    }
}
