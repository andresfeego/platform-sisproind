import { Box, Menu, MenuItem } from '@material-ui/core'
import React, { Component } from 'react'
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import CambiarEstadoCurso from './CambiarEstadoCurso';
import EditarCurso from './EditarCurso';
import AgregarAlumnoCurso from './AgregarAlumnoCurso';


export default class BotonMenuCurso extends Component {

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

    verDetalles(curso) {
        this.props.fun.cambiarContenido(2)
        this.props.fun.setCurso(curso)

    }

    render() {
        return (
            <div className="btnaccion">
                <Box key={1} className={"botonContenidoUno "} onClick={this.handleClickOpen}>
                    <MoreVertOutlinedIcon />
                </Box>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.setAnchorEl}
                    keepMounted
                    open={this.state.open}
                    onClose={this.handleClickOpen}
                >

                    <MenuItem onClick={() => this.verDetalles(this.props.curso)} >Detalles</MenuItem>
                    <CambiarEstadoCurso curso={this.props.curso} fun={this} fun2={this.props.fun} />
                    <EditarCurso curso={this.props.curso} fun={this} fun2={this.props.fun} detalles={false} />
                    <AgregarAlumnoCurso curso={this.props.curso} fun={this} detalles={true} />
                </Menu>
            </div>
        )
    }
}
