import React, { Component } from 'react'
import ListadoCertificados from './ListadoCertificados';
import ValidacionDocumento from './ValidacionDocumento';
import VistaPdf from './VistaPdf';

export default class VentanaCertificados extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             estado: 1,
             estudiante: "",
             curso: ""

        }
    }

    cambiarEstado(nuevoEstado){
        this.setState({
            estado: nuevoEstado
        })
    }

    setEstudiante(est){
        this.setState({
            estudiante: est
        })
    }

    
    setCurso(cur){
        this.setState({
            curso: cur
        })
    }

    volverAlistado(estado){
        this.setState({
            estado: estado,
            curso: ""
        })
    }


    renderVentana(){
        switch (this.state.estado) {
            case 1:
                    return  <ValidacionDocumento fun={ this }/>
                break;

            case 2:
                return  <ListadoCertificados estudiante={ this.state.estudiante } fun={ this }/>
            break;

            case 3:
                return  <div className="containerPDF">
                            <span onClick={()=> this.volverAlistado(2)} className="volverAtras">{ "◀️ Volver al listado"}</span>
                            <VistaPdf curso={ this.state.curso } fun={ this }/>
                        </div>
            break;
        
            default:
                break;
        }
    }

    render() {
        return (
            this.renderVentana()    
        )
    }
}
