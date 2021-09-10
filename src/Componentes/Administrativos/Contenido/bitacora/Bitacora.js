import DateFnsUtils from '@date-io/date-fns'
import { Grid, Input, MenuItem, Select } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import React, { Component } from 'react'
import request from 'superagent'
import Cargando from '../../../../Inicialized/Cargando'
import "./Bitacora.scss"
import "./Bitacora_mobile.scss"
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
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


export default class Bitacora extends Component {

    constructor(props) {
        super(props)

        this.state = {
            bitacora: "init",
            tiposBitacora: [],
            bitacoraOriginal: [],
            listadoUsuarios: [],

            tipo: 0,
            descripcion: "",
            usuario: -1,
            desde: null,
            hasta: null

        }
    }

    componentDidMount() {
        this.getBitacora()
        this.getTiposEventosBitacora()
        this.getUsuarioSistema()
    }

    getBitacora() {
        request
            .get('/responseSisproind/bitacora')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        this.setState({
                            bitacora: [],
                        })
                    } else {
                        this.setState({
                            bitacora: respuestaLogin,
                            bitacoraOriginal: respuestaLogin,
                        })
                    }
                }
            });
    }

    getTiposEventosBitacora() {
        request
            .get('/responseSisproind/tiposEventosBitacora')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        this.setState({
                            tiposBitacora: [],
                        })
                    } else {
                        this.setState({
                            tiposBitacora: respuestaLogin,
                        })
                    }
                }
            });
    }

    getUsuarioSistema() {
        request
            .get('/responseSisproind/usuariosSistema')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    if (respuestaLogin.length == 0) {
                        this.setState({
                            listadoUsuarios: [],
                        })
                    } else {
                        this.setState({
                            listadoUsuarios: respuestaLogin,
                        })
                    }
                }
            });
    }

    renderListado() {
        if (this.state.bitacora.length == 0) {
            return <span>No hay eventos para esta lista</span>
        } else {
            return (
                <div className="listaBitacora">
                    {this.state.bitacora.map((item) =>

                        <div className="eventoBitacora">
                            <BootstrapTooltip title={item.descripcionEvento}>
                                <span className="txtTipoEvento">
                                    {item.tipo}
                                </span>
                            </BootstrapTooltip>
                            <span className="txtDescripcion">{item.descripcion}</span>
                            <span className="txtIDUsuario">{item.nombreUsuario}</span>
                            <span className="txtFechaHora">{moment(item.fechaYhora).format('LLLL')}</span>
                        </div>

                    )}
                </div>
            )
        }
    }

    buscar() {

        let listadoAUXI = this.state.bitacoraOriginal

        if (this.state.tipo != 0) {

            let tipoAuxi = listadoAUXI.filter((item) => {
                if (this.state.tipo == item.id) {
                    return true
                } else {
                    return false
                }
            });
            listadoAUXI = tipoAuxi
        }

        if (this.state.descripcion != "") {

            var prepBus = new RegExp(this.state.descripcion, 'i'); // preparando termino de busqueda
            let descAuxi = listadoAUXI.filter((item) => {
                if (prepBus.test(item.descripcion)) {
                    return true
                } else {
                    return false
                }
            });
            listadoAUXI = descAuxi
        }

        if (this.state.usuario != -1) {

            let usuAuxi = listadoAUXI.filter((item) => {
                if (this.state.usuario == item.idUsuarioSistema) {
                    return true
                } else {
                    return false
                }
            });
            listadoAUXI = usuAuxi
        }


        if (this.state.desde != null) {

            let desdeAuxi = listadoAUXI.filter((item) => {
                if (this.state.desde.getTime() <= new Date(item.fechaYhora).getTime()) {
                    return true
                } else {
                    return false
                }
            });
            listadoAUXI = desdeAuxi
        }

        if (this.state.hasta != null) {

            let hastaAuxi = listadoAUXI.filter((item) => {
                if (this.state.hasta.getTime() >= new Date(item.fechaYhora).getTime()) {
                    return true
                } else {
                    return false
                }
            });
            listadoAUXI = hastaAuxi
        }

        this.setState({
            bitacora: listadoAUXI
        })



    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
            bitacora: "init"
        }, () => this.buscar())
    }

    onChangeDesde = (date) => {
        this.setState({
            desde: date,
            bitacora: "init"
        }, () => this.buscar())

    };

    onChangeHasta = (date) => {
        this.setState({
            hasta: date,
            bitacora: "init"
        }, () => this.buscar())

    };


    render() {
        return (
            <div className="bitacora">
                <span onClick={() => this.props.fun.cambiarEstado(1)} className="volverAtras">{"◀️ Volver al menú"}</span>

                <div className="filtrosBitacora">

                    <Select className="inputform filtroIdUsuBit" autoFocus value={0} onChange={this.onChange} value={this.state.tipo} inputProps={{ name: 'tipo', id: 'tipo' }} >
                        <MenuItem key={0} value={0}>Seleccione tipo</MenuItem>
                        {this.state.tiposBitacora.map((tipo) => <MenuItem key={tipo.id} value={tipo.id}>{tipo.tipo}</MenuItem>)}
                    </Select>

                    <Input className="inputform" type="text" placeholder="Descripción" value={this.state.descripcion} name="descripcion" onChange={this.onChange} />

                    <Select className="inputform filtroIdUsuBit" autoFocus value={0} onChange={this.onChange} value={this.state.usuario} inputProps={{ name: 'usuario', id: 'usuario' }} >
                        <MenuItem key={-1} value={-1}>Seleccione usuario</MenuItem>
                        {this.state.listadoUsuarios.map((usuario) => <MenuItem key={usuario.id} value={usuario.id}>{usuario.nombreUsuario}</MenuItem>)}
                    </Select>
                    <div className="containerFechas">

                        <MuiPickersUtilsProvider utils={DateFnsUtils} >
                            <Grid container  >
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="yyyy/MM/dd"
                                    margin="normal"
                                    name="fechaCreacion"
                                    id="date-picker-inline"
                                    label="Desde AAAA/MM/DD"
                                    placeholder="Desde"
                                    value={this.state.desde}
                                    onChange={this.onChangeDesde}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />

                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="yyyy/MM/dd"
                                    margin="normal"
                                    name="fechaCreacion"
                                    id="date-picker-inline"
                                    label="Hasta AAA/MM/DD"
                                    placeholder="Hasta"
                                    value={this.state.hasta}
                                    onChange={this.onChangeHasta}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />

                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>



                </div>

                {this.state.bitacora == "init" ?
                    <Cargando />
                    :
                    this.renderListado()
                }

            </div>
        )
    }
}
