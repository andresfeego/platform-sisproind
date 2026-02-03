import { MenuItem } from '@material-ui/core';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getDb } from '../../../../Inicialized/ApiDb';
import { clearUsuario } from '../../../../Inicialized/Actions';

class CerrarSesion extends Component {


    cerrarSesion() {
        this.props.clearUsuario()
        getDb('/responseSisproind/cerrarSesion')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                }
            });
    }

    render() {
        return (
            <MenuItem onClick={() => this.cerrarSesion()}>Cerrar sesión</MenuItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        usuario: state.usuario
    }
}

const mapDispatchToProps = {
    clearUsuario

}

export default connect(mapStateToProps, mapDispatchToProps)(CerrarSesion)