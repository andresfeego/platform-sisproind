import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import React, { Component } from 'react'
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora'
import { zfill } from '../../../../Inicialized/FuncionesGlobales';

export default class CambiarEstadoCurso extends Component {

    constructor(props) {
        super(props)
        const curso = this.props.curso

        this.state = {
            open: false,
            estado: curso.estado,

            tiposEstado: []

        };
    };

    componentDidMount() {
        this.getTipoEstados()
    }

    getTipoEstados() {
        request
            .get('/responseSisproind/tipoEstadosCurso')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        tiposEstado: respuestaLogin,
                    })
                }
            });
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
        })
        this.props.fun.handleClickClose()

    };

    handleClickClose = () => {
        this.setState({
            open: false,
        })
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }

    guardar() {

        return new Promise((resolve, reject) => {
            request
                .post('/responseSisproind/editarEstadoCurso')
                .send({ id: this.props.curso.id, estado: this.state.estado })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {

                        reject("Error al guardar información")

                    } else {

                        agregarEventoBitacora(3, "id curso: " + zfill(this.props.curso.id) + " - estado: " + this.state.tiposEstado.find(item => item.id === this.state.estado).estado)
                        resolve()

                    }
                });
        })
    }


    validarInfo() {

        return new Promise((resolve, reject) => {
            if (this.state.estado == 0) {
                reject("Debes escoger un estado valido")

            } else {
                resolve()
            }
        })

    }

    onSubmit() {
        nuevoMensaje(tiposAlertas.cargando, "Editando estado del curso")
        this.validarInfo().then(() => {
            this.guardar().then(() => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso")
                this.handleClickClose()
                this.props.fun2.cambiarContenido(1)
                this.props.fun2.getCursos()

            }).catch((error) => {
                nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
            })

        }).catch((error) => {
            nuevoMensaje(tiposAlertas.cargadoError, error, 3000)
        })
    }

    render() {
        return (
            <React.Fragment>
                <MenuItem onClick={() => this.handleClickOpen()}>Cambiar Estado</MenuItem>

                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Cambiar Estado</div></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>

                                <FormControl >
                                    <InputLabel htmlFor="max-width">Tipo de estado</InputLabel>
                                    <Select className="inputform" autoFocus value={0} onChange={this.onChange} value={this.state.estado} inputProps={{ name: 'estado', id: 'estado' }} >
                                        <MenuItem key={0} value={0}>Seleccione tipo de Estado</MenuItem>
                                        {this.state.tiposEstado.map((tipo) => <MenuItem key={tipo.id} value={tipo.id}>{tipo.estado}</MenuItem>)}
                                    </Select>
                                </FormControl>


                            </form>
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.onSubmit()}>
                            Guardar
                        </Button>

                        <Button color="primary" onClick={this.handleClickClose}>
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}
