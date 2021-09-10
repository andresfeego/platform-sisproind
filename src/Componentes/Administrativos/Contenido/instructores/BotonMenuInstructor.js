import { Box, Menu, MenuItem } from '@material-ui/core';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import React, { Component } from 'react'
import request from 'superagent';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import EditarInstructor from './EditarInstructor';

export default class BotonMenuInstructor extends Component {

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

    irDetalles(idInstructor) {
        this.props.fun.setInstructor(idInstructor)
        this.props.fun.cambiarContenido(2)
    }

    activarDesactivarInstructor(instructor) {
        let accion = 1
        if (instructor.activo == 1) {
            accion = 0
        }

        let labelActivar = "Activar "

        if (accion == 0) {
            labelActivar = "Desactivar "
        }

        request
            .post('/responseSisproind/actDesInst')
            .set('accept', 'json')
            .send({ accion: accion, id: instructor.id })
            .end((err, res) => {
                if (err) {
                    nuevoMensaje(tiposAlertas.error, "Error al " + labelActivar + " instructor" + err, 3000)
                } else {
                    nuevoMensaje(tiposAlertas.success, "instructor actualizado", 1000)
                    let accionLet = "Activado"
                    if (accion == 0) {
                        accionLet = "Desactivado"
                    }
                    agregarEventoBitacora(15, "id instructor: " + instructor.id)
                    this.props.fun.getInstructores()
                    this.handleClickClose()
                }
            });
    }

    render() {

        const instructor = this.props.instructor
        var activo = "inactivo"
        let LabelActivar = "Activar"
        if (instructor.activo == 1) {
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

                    <MenuItem onClick={() => this.irDetalles(instructor.id)}>Detalles</MenuItem>
                    <EditarInstructor fun={this} fun2={this.props.fun} instructor={instructor} />
                    <MenuItem onClick={() => this.activarDesactivarInstructor(instructor)}>{LabelActivar}</MenuItem>
                </Menu>

            </div>
        )
    }
}
