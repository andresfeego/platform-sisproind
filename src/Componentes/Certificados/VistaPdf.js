import React, { Component } from 'react'
import { PDFViewer } from '@react-pdf/renderer';
import "./VistaPdf.scss"
import { PDFDoc } from './Certificado'


export default class VistaPdf extends Component {
    render() {
        const curso = this.props.curso
        return (
            <div className="vistaPDF">
                <PDFViewer>
                    <PDFDoc curso={ curso }/>
                </PDFViewer>
            </div>
        )
    }
}
