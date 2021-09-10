import { Box, Menu } from '@material-ui/core'
import React, { Component } from 'react'
import DetalleUsuario from './DetalleUsuario';
import CerrarSesion from './CerrarSesion'
import CambiarPass from './CambiarPass';
import EditarUsuario from './EditarUsuario';

export default class BotonMenuUsuario extends Component {

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

    render() {
        const usuario = this.props.usuario
        return (
            <div>

                <Box key={1} className={"iconoUser "} onClick={this.handleClickOpen}>
                    {usuario.urlImage == "" ?
                        <img src={require("../../../../image/general/perfil-de-usuario.png")} alt="" className="imagenPerfil" />
                        :
                        <img src={"http://www.sisproind.com/plataforma/image/estudiantes/" + usuario.urlImage} alt="" />
                    }
                </Box>

                <Menu
                    id="simple-menu"
                    anchorEl={this.state.setAnchorEl}
                    keepMounted
                    open={this.state.open}
                    onClose={this.handleClickOpen}
                >
                    <DetalleUsuario usuario={usuario} fun={this} />
                    <CambiarPass usuario={usuario} fun={this} />
                    <EditarUsuario usuario={usuario} fun={this} fun2={this.props.fun} />
                    <CerrarSesion />
                </Menu>

            </div>
        )
    }
}
