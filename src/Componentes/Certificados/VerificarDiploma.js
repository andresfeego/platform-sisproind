import React, { Component } from 'react'
import { getDb } from '../../Inicialized/ApiDb'
import './VerificarDiploma.scss'
import './VerificarDiploma_mobile.scss'

export default class VerificarDiploma extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            error: '',
            curso: null,
            idCurso: '',
            idEstudiante: ''
        }
    }

    componentDidMount() {
        this.cargarDatos()
    }

    cargarDatos() {
        const params = new URLSearchParams(this.props.location.search)
        const idCurso = params.get('idCurso') || ''
        const idEstudiante = params.get('idEstudiante') || ''

        if (!idCurso || !idEstudiante) {
            this.setState({
                loading: false,
                error: 'Faltan parametros para validar el diploma.',
                idCurso,
                idEstudiante
            })
            return
        }

        getDb(`/responseSisproind/validarDiploma/${idEstudiante}/${idCurso}`)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    this.setState({
                        loading: false,
                        error: 'No fue posible validar el diploma. Intenta mas tarde.',
                        idCurso,
                        idEstudiante
                    })
                    return
                }

                const data = JSON.parse(res.text || '[]')
                if (!data.length) {
                    this.setState({
                        loading: false,
                        error: 'No se encontro informacion para este diploma.',
                        idCurso,
                        idEstudiante
                    })
                    return
                }

                this.setState({
                    loading: false,
                    curso: data[0],
                    idCurso,
                    idEstudiante
                })
            })
    }

    formatFecha(value) {
        if (!value) return '--'
        const d = new Date(value)
        if (Number.isNaN(d.getTime())) return value
        return d.toLocaleDateString('es-CO')
    }

    renderRow(label, value) {
        return (
            <div className="row">
                <span className="label">{label}</span>
                <span className="value">{value || '--'}</span>
            </div>
        )
    }

    render() {
        const { loading, error, curso, idCurso, idEstudiante } = this.state

        return (
            <div className="VerificarDiploma">
                <div className="panel">
                    <div className="titulo">
                        Verificación de diploma Sisproind
                        <span className={`estado ${!loading && !error && curso ? 'ok' : 'bad'}`}>
                            {!loading && !error && curso ? 'VALIDADO' : 'NO VALIDADO'}
                        </span>
                    </div>
                    <div className="subtitulo">
                        Compare visualmente los datos del diploma escaneado con la información mostrada en esta página.
                        Si no coinciden, es posible que el diploma haya sido alterado.
                    </div>

                    {loading ? (
                        <div className="mensaje">Consultando informacion...</div>
                    ) : error ? (
                        <div className="mensaje error">{error}</div>
                    ) : (
                        <div className="tabla">
                            {this.renderRow('ID curso', idCurso)}
                            {this.renderRow('Documento', idEstudiante)}
                            {this.renderRow('Estudiante', `${curso.nombres || ''} ${curso.apellidos || ''}`.trim())}
                            {this.renderRow('Tema', curso.nombreTema)}
                            {this.renderRow('Linea del curso', curso.nombre)}
                            {this.renderRow('Horas', curso.horas || curso.numeroHoras)}
                            {this.renderRow('Fecha inicio', this.formatFecha(curso.fechaInicio))}
                            {this.renderRow('Fecha cierre', this.formatFecha(curso.fechaCierre))}
                            {this.renderRow('Instructor', curso.nombreInstructor)}
                            {this.renderRow('Cargo instructor', curso.cargoInstructor)}
                            {this.renderRow('Licencia instructor', curso.licenciaInstructor)}
                            {this.renderRow('Empresa', curso.empresa)}
                            {this.renderRow('NIT', curso.nit)}
                            {this.renderRow('R.L', curso.rl)}
                            {this.renderRow('ARL', curso.arl)}
                            {this.renderRow('Resolucion', curso.resolucion)}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
