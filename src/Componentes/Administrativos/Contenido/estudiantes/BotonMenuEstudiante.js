import { Box, Menu, MenuItem } from '@material-ui/core';
import React, { Component } from 'react'
import "./BotonMenuEstudiante.scss"
import "./BotonMenuEstudiante_mobile.scss"
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import EditarEstudiante from './EditarEstudiante';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora';

export default class BotonMenuEstudiante extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            setAnchorEl: null
        }
    }



    handleClickOpen = (event) => {
        this.setState({
            open: !this.state.open,
            setAnchorEl: event.currentTarget
        })
    };

    handleClickClose = () => {
        this.setState({
            open: !this.state.open,
            setAnchorEl: null

        })
    };


    irDetalles(idEstudiante) {
        this.props.fun.setEstudiante(idEstudiante)
        this.props.fun.cambiarContenido(2)

    }

    activarDesactivarEstudiante(estudiante) {
        let accion = 1
        if (estudiante.activo == 1) {
            accion = 0
        }

        let labelActivar = "Activar "

        if (accion == 0) {
            labelActivar = "Desactivar "
        }

        request
            .post('/responseSisproind/actDesEstu')
            .set('accept', 'json')
            .send({ accion: accion, id: estudiante.id })
            .end((err, res) => {
                if (err) {
                    nuevoMensaje(tiposAlertas.error, "Error al " + labelActivar + " estudiante" + err, 3000)
                } else {
                    nuevoMensaje(tiposAlertas.success, "Estudiante actualizado", 1000)
                    let accionLetra = "Activado"
                    if (accion == 0) {
                        accionLetra = "Desactivado"
                    }
                    agregarEventoBitacora(8, "id estudiante: " + estudiante.id + " - accion: " + accionLetra)
                    this.props.fun.getEstudiantes()
                    this.handleClickClose()
                }
            });

    }


    render() {

        const estudiante = this.props.estudiante
        var activo = "inactivo"
        let LabelActivar = "Activar"

        if (estudiante.activo == 1) {
            activo = ""
            LabelActivar = "Desactivar"
        }

        return (

            <div>

                <Box key={1} className={"botonContenidoUno " + activo} onClick={this.handleClickOpen}>
                    <MoreVertOutlinedIcon />
                </Box>

                <Menu
                    id="simple-menu"
                    anchorEl={this.state.setAnchorEl}
                    keepMounted
                    open={this.state.open}
                    onClose={this.handleClickOpen}
                >

                    <MenuItem onClick={() => this.irDetalles(estudiante.id)}>Detalles</MenuItem>
                    <EditarEstudiante estudiante={estudiante} fun={this} fun2={this.props.fun} />
                    <MenuItem onClick={() => this.activarDesactivarEstudiante(estudiante)}>{LabelActivar}</MenuItem>
                </Menu>

            </div>
        )
    }
}
