import React, { Component } from 'react'
import { getDb, setDb } from '../../../../Inicialized/ApiDb';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import Cargando from '../../../../Inicialized/Cargando';
import { buildFondoDiplomaUrl } from '../../../../Inicialized/BackendConfig';
import './TematicasLineas.scss'

const endpoints = {
    getTemas: '/responseSisproind/tipoTemas',
    getLineas: '/responseSisproind/tipoLineas',
    crearTema: '/responseSisproind/crearTema',
    editarTema: '/responseSisproind/editarTema',
    eliminarTema: '/responseSisproind/eliminarTema',
    crearLinea: '/responseSisproind/crearLinea',
    editarLinea: '/responseSisproind/editarLinea',
    eliminarLinea: '/responseSisproind/eliminarLinea'
}

const getTemaNombre = (tema) => tema.tema || tema.nombre || tema.descripcion || ''
const getLineaNombre = (linea) => linea.linea || linea.nombre || linea.descripcion || ''

export default class TematicasLineas extends Component {

    constructor(props) {
        super(props)

        this.state = {
            temas: 'init',
            lineas: 'init',
            temaSeleccionado: 0,
            showTemaModal: false,
            showLineaModal: false,
            showTemaDetalle: false,
            showLineaDetalle: false,
            detalleTema: null,
            detalleLinea: null,
            fondoFile: null,
            fondoPreview: '',
            formTema: {
                id: 0,
                nombre: '',
                sigla: '',
                descripcion: '',
                resolucion: '',
                urlFondoDiploma: ''
            },
            formLinea: {
                id: 0,
                nombre: '',
                descripcion: '',
                horas: ''
            },
            modoTema: 'crear',
            modoLinea: 'crear'
        }
    }

    componentDidMount() {
        this.getTemas()
    }

    getTemas() {
        getDb(endpoints.getTemas)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err)
                    nuevoMensaje(tiposAlertas.error, 'No fue posible cargar las tematicas')
                } else {
                    const respuesta = JSON.parse(res.text)
                    this.setState({
                        temas: respuesta.length === 0 ? [] : respuesta
                    })
                }
            })
    }

    getLineas(idTema) {
        if (!idTema) {
            this.setState({ lineas: [] })
            return
        }

        getDb(`${endpoints.getLineas}/${idTema}`)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err)
                    nuevoMensaje(tiposAlertas.error, 'No fue posible cargar las lineas')
                } else {
                    const respuesta = JSON.parse(res.text)
                    const lista = Array.isArray(respuesta) ? respuesta : []
                    this.setState({
                        lineas: lista.length === 0 ? [] : lista
                    })
                }
            })
    }

    seleccionarTema = (tema) => {
        this.setState({
            temaSeleccionado: tema.id,
            formLinea: { id: 0, nombre: '', descripcion: '', horas: '' },
            modoLinea: 'crear',
            showLineaModal: false
        })

        this.getLineas(tema.id)
    }

    limpiarTema = () => {
        if (this.state.fondoPreview) {
            URL.revokeObjectURL(this.state.fondoPreview)
        }
        this.setState({
            formTema: { id: 0, nombre: '', sigla: '', descripcion: '', resolucion: '', urlFondoDiploma: '' },
            modoTema: 'crear',
            fondoFile: null,
            fondoPreview: ''
        })
    }

    limpiarLinea = () => {
        this.setState({
            formLinea: { id: 0, nombre: '', descripcion: '', horas: '' },
            modoLinea: 'crear'
        })
    }

    abrirModalTema = () => {
        this.limpiarTema()
        this.setState({ showTemaModal: true })
    }

    cerrarModalTema = () => {
        this.setState({ showTemaModal: false })
    }

    abrirDetalleTema = (tema) => {
        this.setState({ detalleTema: tema, showTemaDetalle: true })
    }

    cerrarDetalleTema = () => {
        this.setState({ detalleTema: null, showTemaDetalle: false })
    }

    abrirModalLinea = () => {
        if (!this.state.temaSeleccionado) {
            nuevoMensaje(tiposAlertas.warn, 'Seleccione una tematica')
            return
        }
        this.limpiarLinea()
        this.setState({ showLineaModal: true })
    }

    cerrarModalLinea = () => {
        this.setState({ showLineaModal: false })
    }

    abrirDetalleLinea = (linea) => {
        this.setState({ detalleLinea: linea, showLineaDetalle: true })
    }

    cerrarDetalleLinea = () => {
        this.setState({ detalleLinea: null, showLineaDetalle: false })
    }

    onChangeTema = (e) => {
        if (e.target.name === 'sigla') {
            const value = (e.target.value || '').toUpperCase().slice(0, 4)
            this.setState({
                formTema: {
                    ...this.state.formTema,
                    sigla: value
                }
            })
            return
        }
        if (e.target.name === 'resolucion') {
            const value = (e.target.value || '').toUpperCase().slice(0, 12)
            this.setState({
                formTema: {
                    ...this.state.formTema,
                    resolucion: value
                }
            })
            return
        }
        this.setState({
            formTema: {
                ...this.state.formTema,
                [e.target.name]: e.target.value
            }
        })
    }

    onChangeLinea = (e) => {
        this.setState({
            formLinea: {
                ...this.state.formLinea,
                [e.target.name]: e.target.value
            }
        })
    }

    onChangeFondo = (e) => {
        const file = e.target.files && e.target.files[0]
        if (!file) return

        if (!file.type || !file.type.startsWith('image/')) {
            nuevoMensaje(tiposAlertas.error, 'El fondo debe ser una imagen valida')
            return
        }

        if (this.state.fondoPreview) {
            URL.revokeObjectURL(this.state.fondoPreview)
        }

        this.setState({
            fondoFile: file,
            fondoPreview: URL.createObjectURL(file)
        })
    }

    subirFondoTema = (idTema) => {
        return new Promise((resolve, reject) => {
            if (!this.state.fondoFile) {
                resolve()
                return
            }

            setDb('/responseSisproind/temaFondoDiploma')
                .field('idTema', idTema)
                .attach('fondo', this.state.fondoFile, this.state.fondoFile.name)
                .set('accept', 'json')
                .end((err) => {
                    if (err) {
                        reject('Error al subir el fondo del diploma')
                    } else {
                        resolve()
                    }
                })
        })
    }

    guardarTema = () => {
        const nombre = (this.state.formTema.nombre || '').trim()
        const sigla = (this.state.formTema.sigla || '').trim().toUpperCase().slice(0, 4)
        const descripcion = (this.state.formTema.descripcion || '').trim()
        const resolucion = (this.state.formTema.resolucion || '').trim().toUpperCase().slice(0, 12)

        if (!nombre) {
            nuevoMensaje(tiposAlertas.error, 'Ingrese el nombre de la tematica')
            return
        }

        const payload = {
            id: this.state.formTema.id,
            nombre: nombre,
            sigla: sigla,
            descripcion: descripcion,
            resolucion: resolucion,
            urlFondoDiploma: this.state.formTema.urlFondoDiploma || ''
        }

        const endpoint = this.state.modoTema === 'editar' ? endpoints.editarTema : endpoints.crearTema

        setDb(endpoint)
            .send(payload)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err)
                    nuevoMensaje(tiposAlertas.error, 'No fue posible guardar la tematica')
                } else {
                    const respuesta = res && res.text ? JSON.parse(res.text) : {}
                    const idTema = this.state.modoTema === 'editar'
                        ? this.state.formTema.id
                        : (respuesta.insertId || respuesta.id || this.state.formTema.id)

                    this.subirFondoTema(idTema)
                        .then(() => {
                            nuevoMensaje(tiposAlertas.success, 'Tematica guardada')
                            this.getTemas()
                            this.limpiarTema()
                            this.cerrarModalTema()
                        })
                        .catch((errorMsg) => {
                            nuevoMensaje(tiposAlertas.warn, errorMsg || 'Tematica guardada, pero no se pudo subir el fondo')
                            this.getTemas()
                            this.limpiarTema()
                            this.cerrarModalTema()
                        })
                }
            })
    }

    editarTema = (tema) => {
        if (this.state.fondoPreview) {
            URL.revokeObjectURL(this.state.fondoPreview)
        }
        this.setState({
            formTema: {
                id: tema.id,
                nombre: getTemaNombre(tema),
                sigla: tema.sigla || '',
                descripcion: tema.descripcion || '',
                resolucion: tema.resolucion || '',
                urlFondoDiploma: tema.urlFondoDiploma || ''
            },
            fondoFile: null,
            fondoPreview: '',
            modoTema: 'editar',
            showTemaModal: true
        })
    }

    eliminarTema = (tema) => {
        if (!window.confirm('Seguro deseas eliminar esta tematica?')) return

        setDb(endpoints.eliminarTema)
            .send({ id: tema.id })
            .set('accept', 'json')
            .end((err) => {
                if (err) {
                    console.log(err)
                    nuevoMensaje(tiposAlertas.error, 'No fue posible eliminar la tematica')
                } else {
                    nuevoMensaje(tiposAlertas.success, 'Tematica eliminada')
                    const resetLinea = this.state.temaSeleccionado === tema.id
                    this.getTemas()
                    if (resetLinea) {
                        this.setState({
                            temaSeleccionado: 0,
                            lineas: [],
                            formLinea: { id: 0, nombre: '', descripcion: '', horas: '' },
                            modoLinea: 'crear'
                        })
                    }
                }
            })
    }

    guardarLinea = () => {
        const nombre = (this.state.formLinea.nombre || '').trim()
        const descripcion = (this.state.formLinea.descripcion || '').trim()
        const horas = this.state.formLinea.horas === '' ? '' : Number(this.state.formLinea.horas)

        if (!this.state.temaSeleccionado) {
            nuevoMensaje(tiposAlertas.warn, 'Seleccione una tematica')
            return
        }

        if (!nombre) {
            nuevoMensaje(tiposAlertas.error, 'Ingrese el nombre de la linea')
            return
        }

        const payload = {
            id: this.state.formLinea.id,
            idTema: this.state.temaSeleccionado,
            nombre: nombre,
            descripcion: descripcion,
            horas: horas
        }

        const endpoint = this.state.modoLinea === 'editar' ? endpoints.editarLinea : endpoints.crearLinea

        setDb(endpoint)
            .send(payload)
            .set('accept', 'json')
            .end((err) => {
                if (err) {
                    console.log(err)
                    nuevoMensaje(tiposAlertas.error, 'No fue posible guardar la linea')
                } else {
                    nuevoMensaje(tiposAlertas.success, 'Linea guardada')
                    this.getLineas(this.state.temaSeleccionado)
                    this.limpiarLinea()
                    this.cerrarModalLinea()
                }
            })
    }

    editarLinea = (linea) => {
        this.setState({
            formLinea: {
                id: linea.id,
                nombre: getLineaNombre(linea),
                descripcion: linea.descripcion || '',
                horas: linea.horas || ''
            },
            modoLinea: 'editar',
            showLineaModal: true
        })
    }

    eliminarLinea = (linea) => {
        if (!window.confirm('Seguro deseas eliminar esta linea?')) return

        setDb(endpoints.eliminarLinea)
            .send({ id: linea.id })
            .set('accept', 'json')
            .end((err) => {
                if (err) {
                    console.log(err)
                    nuevoMensaje(tiposAlertas.error, 'No fue posible eliminar la linea')
                } else {
                    nuevoMensaje(tiposAlertas.success, 'Linea eliminada')
                    this.getLineas(this.state.temaSeleccionado)
                }
            })
    }

    renderTemas() {
        if (this.state.temas === 'init') {
            return <Cargando />
        }

        if (this.state.temas.length === 0) {
            return <span>No hay tematicas registradas</span>
        }

        return (
            <div className="lista-temas">
                {this.state.temas.map((tema) => (
                    <div
                        key={tema.id}
                        className={this.state.temaSeleccionado === tema.id ? 'tema-row activa' : 'tema-row'}
                        onClick={() => this.seleccionarTema(tema)}
                    >
                        <div className="tema-info">
                            <span className="tema-nombre">{getTemaNombre(tema) || `Tematica ${tema.id}`}</span>
                            <span className="tema-sigla">{tema.sigla || ''}</span>
                        </div>
                        <div className="tema-actions">
                            <button onClick={(e) => { e.stopPropagation(); this.editarTema(tema); }} className="btn-secundario">Editar</button>
                            <button onClick={(e) => { e.stopPropagation(); this.abrirDetalleTema(tema); }} className="btn-secundario">Detalles</button>
                            <button onClick={(e) => { e.stopPropagation(); this.eliminarTema(tema); }} className="btn-peligro">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    renderLineas() {
        if (!this.state.temaSeleccionado) {
            return <span>Seleccione una tematica para ver sus lineas</span>
        }

        if (this.state.lineas === 'init') {
            return <Cargando />
        }

        if (this.state.lineas.length === 0) {
            return <span>No hay lineas registradas para esta tematica</span>
        }

        return (
            <div className="lista-lineas">
                {this.state.lineas.map((linea) => (
                    <div key={linea.id} className="linea-row">
                        <div className="linea-info">
                            <span className="linea-nombre">{getLineaNombre(linea) || `Linea ${linea.id}`}</span>
                            <span className="linea-horas">{linea.horas ? `${linea.horas} horas` : ''}</span>
                        </div>
                        <div className="linea-actions">
                            <button onClick={() => this.editarLinea(linea)} className="btn-secundario">Editar</button>
                            <button onClick={() => this.abrirDetalleLinea(linea)} className="btn-secundario">Detalles</button>
                            <button onClick={() => this.eliminarLinea(linea)} className="btn-peligro">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    render() {
        const fondoActual = this.state.formTema.urlFondoDiploma
            ? buildFondoDiplomaUrl(this.state.formTema.urlFondoDiploma)
            : ''
        return (
            <div className="tematicasAdmin">
                <div className="barraUp">
                    <span onClick={() => this.props.fun.cambiarEstado(1)} className="volverAtras">{'◀️ Volver al menú'}</span>
                </div>

                <div className="tematicas-layout">
                    <div className="panel-temas">
                        <div className="panel-header">
                            <h1>Tematicas</h1>
                            <button onClick={this.abrirModalTema} className="btn-secundario">Nueva tematica</button>
                        </div>
                        {this.renderTemas()}
                    </div>

                    <div className="panel-lineas">
                        <div className="panel-header">
                            <h1>Lineas de curso</h1>
                            <button onClick={this.abrirModalLinea} className="btn-secundario">Nueva linea</button>
                        </div>
                        {this.renderLineas()}
                    </div>
                </div>

                {this.state.showTemaModal ? (
                    <div className="modalOverlay">
                        <div className="modalCard">
                            <div className="modalHeader">
                                <h2>{this.state.modoTema === 'editar' ? 'Editar tematica' : 'Nueva tematica'}</h2>
                                <button onClick={this.cerrarModalTema} className="btn-secundario">Cerrar</button>
                            </div>
                            <div className="form-tema">
                                <input
                                    className="inputform"
                                    name="nombre"
                                    placeholder="Nombre tematica"
                                    value={this.state.formTema.nombre}
                                    onChange={this.onChangeTema}
                                />
                                <input
                                    className="inputform"
                                    name="sigla"
                                    placeholder="Sigla"
                                    value={this.state.formTema.sigla}
                                    onChange={this.onChangeTema}
                                />
                                <input
                                    className="inputform"
                                    name="resolucion"
                                    placeholder="Resolucion"
                                    value={this.state.formTema.resolucion}
                                    onChange={this.onChangeTema}
                                />
                                <div className="fondo-diploma">
                                    <label className="label">Fondo diploma</label>
                                    <input
                                        className="inputform"
                                        type="file"
                                        accept="image/*"
                                        onChange={this.onChangeFondo}
                                    />
                                    {this.state.fondoPreview ? (
                                        <div className="preview">
                                            <img src={this.state.fondoPreview} alt="Fondo diploma preview" />
                                        </div>
                                    ) : fondoActual ? (
                                        <div className="preview">
                                            <img src={fondoActual} alt="Fondo diploma actual" />
                                        </div>
                                    ) : (
                                        <div className="preview vacio">Sin fondo cargado</div>
                                    )}
                                </div>
                                <textarea
                                    className="inputform descripcionTema"
                                    name="descripcion"
                                    placeholder="Descripcion"
                                    value={this.state.formTema.descripcion}
                                    onChange={this.onChangeTema}
                                    rows={4}
                                />
                                <div className="acciones">
                                    <button onClick={this.guardarTema} className="btn-primario">
                                        {this.state.modoTema === 'editar' ? 'Actualizar' : 'Guardar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {this.state.showLineaModal ? (
                    <div className="modalOverlay">
                        <div className="modalCard">
                            <div className="modalHeader">
                                <h2>{this.state.modoLinea === 'editar' ? 'Editar linea' : 'Nueva linea'}</h2>
                                <button onClick={this.cerrarModalLinea} className="btn-secundario">Cerrar</button>
                            </div>
                            <div className="form-linea">
                                <input
                                    className="inputform"
                                    name="nombre"
                                    placeholder="Nombre linea"
                                    value={this.state.formLinea.nombre}
                                    onChange={this.onChangeLinea}
                                />
                                <textarea
                                    className="inputform"
                                    name="descripcion"
                                    placeholder="Descripcion"
                                    value={this.state.formLinea.descripcion}
                                    onChange={this.onChangeLinea}
                                    rows={4}
                                />
                                <input
                                    className="inputform"
                                    name="horas"
                                    type="number"
                                    placeholder="Horas"
                                    value={this.state.formLinea.horas}
                                    onChange={this.onChangeLinea}
                                />
                                <div className="acciones">
                                    <button onClick={this.guardarLinea} className="btn-primario">
                                        {this.state.modoLinea === 'editar' ? 'Actualizar' : 'Guardar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {this.state.showTemaDetalle && this.state.detalleTema ? (
                    <div className="modalOverlay">
                        <div className="modalCard">
                            <div className="modalHeader">
                                <h2>Detalle tematica</h2>
                                <button onClick={this.cerrarDetalleTema} className="btn-secundario">Cerrar</button>
                            </div>
                            <div className="detalleBody">
                                <div><strong>Nombre:</strong> {getTemaNombre(this.state.detalleTema)}</div>
                                <div><strong>Sigla:</strong> {this.state.detalleTema.sigla || ''}</div>
                                <div><strong>Resolucion:</strong> {this.state.detalleTema.resolucion || ''}</div>
                                <div><strong>Fondo diploma:</strong> {this.state.detalleTema.urlFondoDiploma || 'Sin fondo'}</div>
                                {this.state.detalleTema.urlFondoDiploma ? (
                                    <div className="preview">
                                        <img src={buildFondoDiplomaUrl(this.state.detalleTema.urlFondoDiploma)} alt="Fondo diploma" />
                                    </div>
                                ) : null}
                                <div><strong>Descripcion:</strong></div>
                                <div className="detalleTexto">{this.state.detalleTema.descripcion || ''}</div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {this.state.showLineaDetalle && this.state.detalleLinea ? (
                    <div className="modalOverlay">
                        <div className="modalCard">
                            <div className="modalHeader">
                                <h2>Detalle linea</h2>
                                <button onClick={this.cerrarDetalleLinea} className="btn-secundario">Cerrar</button>
                            </div>
                            <div className="detalleBody">
                                <div><strong>Nombre:</strong> {getLineaNombre(this.state.detalleLinea)}</div>
                                <div><strong>Horas:</strong> {this.state.detalleLinea.horas || ''}</div>
                                <div><strong>Descripcion:</strong></div>
                                <div className="detalleTexto">{this.state.detalleLinea.descripcion || ''}</div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        )
    }
}
