import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
import React, { Component } from 'react'

export default class DetalleUsuario extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false,
        };
    };

    handleClickOpen = () => {
        const estudiante = this.props.estudiante

        this.setState({
            open: true,
        })
    };


    handleClickClose = () => {
        this.setState({
            open: false,
        })
    };

    abrirEdicion() {
        this.handleClickOpen()
        this.props.fun.handleClickClose()
    }
    render() {
        const { usuario } = this.props;
        return (
            <React.Fragment>

                <MenuItem onClick={() => this.abrirEdicion()}>Detalles</MenuItem>

                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Detalle Usuario</div></DialogTitle>

                    <DialogContent>
                        <div className="detalleUsuario">
                            {usuario.urlImage == "" ?
                                <img src={require("../../../../image/general/perfil-de-usuario.png")} alt="" className="imagenPerfil" />
                                :
                                <img src={"http://www.sisproind.com/plataforma/image/estudiantes/" + usuario.urlImage} alt="" />
                            }
                            <span><strong>Id: </strong> {usuario.id}</span>
                            <span><strong>Nombres: </strong> {usuario.nombre}</span>
                            <span><strong>Apellidos: </strong> {usuario.apellido}</span>
                            <span><strong>Email: </strong> {usuario.email}</span>


                        </div>


                    </DialogContent>

                    <DialogActions>


                        <Button color="primary" onClick={this.handleClickClose}>
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}
