import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core'
import React, { Component } from 'react'
import PersonAddSharpIcon from '@material-ui/icons/PersonAddSharp';
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora'
import { zfill } from '../../../../Inicialized/FuncionesGlobales'

export default class AgregarCurso extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false,
            id: '',
            tema: 0,
            linea: 0,
            instructor: 0,
            fechaCreacion: new Date(),
            fechaInicio: new Date(),
            fechaCierre: new Date(),
            horasTeoria: 0,
            horasPractica: 0,

            numeroHoras: 0,
            tiposTemas: [],
            tiposLineas: [],
            listaInstructores: []

        };
    };

    componentDidMount() {
        this.getTipoTemas()
        this.getInstructores()
    }

    getTipoTemas() {
        request
            .get('/responseSisproind/tipoTemas')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        tiposTemas: respuestaLogin,
                    })
                }
            });
    }

    getInstructores() {
        request
            .get('/responseSisproind/instructores')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        listaInstructores: respuestaLogin,
                    })
                }
            });
    }

    getTipoLineas(tema) {
        request
            .get('/responseSisproind/tipoLineas/' + tema)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);

                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        tiposLineas: respuestaLogin,
                    })
                }
            });
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
        })
    };

    handleClickClose = () => {
        this.setState({
            open: false,
            id: '',
            tema: 0,
            linea: 0,
            instructor: 0,
            fechaCreacion: new Date(),
            fechaInicio: new Date(),
            fechaCierre: new Date(),
            horasTeoria: 0,
            horasPractica: 0,
            numeroHoras: 0,


            tiposLineas: []
        })
    };


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }



    onChangeTema = e => {
        this.setState({
            [e.target.name]: e.target.value,
            linea: 0,
            numeroHoras: 0
        })

        this.getTipoLineas(e.target.value)

    }

    onChangeLinea = e => {
        const resultado = this.state.tiposLineas.find(linea => linea.id === e.target.value);

        this.setState({
            [e.target.name]: e.target.value,
            numeroHoras: resultado.horas
        })



    }

    onChangeFechaCreacion = (date) => {
        this.setState({
            fechaCreacion: date
        })
    };

    onChangeFechaInicio = (date) => {
        this.setState({
            fechaInicio: date
        })
    };

    onChangeFechaCierre = (date) => {
        this.setState({
            fechaCierre: date
        })
    };

    guardar() {

        return new Promise((resolve, reject) => {
            request
                .post('/responseSisproind/crearCurso')
                .send({ linea: this.state.linea, instructor: this.state.instructor, fechaCreacion: this.state.fechaCreacion, fechaInicio: this.state.fechaInicio, fechaCierre: this.state.fechaCierre, horasTeoria: this.state.horasTeoria, horasPractica: this.state.horasPractica, })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {

                        reject("Error al guardar información")

                    } else {
                        const respuestaLogin = JSON.parse(res.text);
                        agregarEventoBitacora(2, this.state.tiposTemas.find(item => item.id === this.state.tema).sigla + " - " + zfill(respuestaLogin.insertId, 3))
                        resolve(respuestaLogin)

                    }
                });
        })
    }

    validarInfo() {

        return new Promise((resolve, reject) => {
            if (this.state.linea == 0) {
                reject("No has seleccionado una linea para este curso")
            } else {
                if (this.state.instructor == 0) {
                    reject("No has seleccionado un instructor para el curso")
                } else {
                    if (this.state.fechaInicio.getTime() > this.state.fechaCierre.getTime()) {
                        reject("La fecha de inicio no puede ser despues de la fecha de cierre")
                    } else {
                        if ((parseInt(this.state.horasPractica) + parseInt(this.state.horasTeoria)) != parseInt(this.state.numeroHoras)) {
                            reject("El número de horas de practica y teoria esta fuera del rango de las horas de este curso")
                        } else {
                            resolve()
                        }
                    }
                }
            }
        })

    }

    onSubmit = async () => {
        nuevoMensaje(tiposAlertas.cargando, "Creando Curso")
        this.validarInfo().then(() => {
            this.guardar().then((response) => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso " + response.insertId)
                this.handleClickClose()
                this.props.fun.cambiarContenido(1)
                this.props.fun.getCursos()

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
                <Box className="btnAgregar buElement" onClick={() => this.handleClickOpen()}>
                    <PersonAddSharpIcon className="icon" />
                    Nuevo Curso
                </Box>


                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Nuevo Curso</div></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep">
                            <form noValidate>

                                <FormControl >
                                    <InputLabel htmlFor="max-width">Tematica del curso</InputLabel>
                                    <Select className="inputform" autoFocus value={0} onChange={this.onChangeTema} value={this.state.tema} inputProps={{ name: 'tema', id: 'tema' }} >
                                        <MenuItem key={0} value={0}>Seleccione tematica</MenuItem>
                                        {this.state.tiposTemas.map((tipo) => <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <FormControl >
                                    <InputLabel htmlFor="max-width">Linea del curso</InputLabel>
                                    <Select className="inputform" autoFocus value={0} onChange={this.onChangeLinea} value={this.state.linea} inputProps={{ name: 'linea', id: 'linea' }} >
                                        <MenuItem key={0} value={0}>Seleccione linea para este curso</MenuItem>
                                        {this.state.tiposLineas.map((tipo) => <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <FormControl >
                                    <InputLabel htmlFor="max-width">Instructor del Curso</InputLabel>
                                    <Select className="inputform" autoFocus value={0} onChange={this.onChange} value={this.state.instructor} inputProps={{ name: 'instructor', id: 'instructor' }} >
                                        <MenuItem key={0} value={0}>Seleccione instructor para este curso</MenuItem>
                                        {this.state.listaInstructores.map((instructor) => <MenuItem key={instructor.id} value={instructor.id}>{instructor.nombres + " " + instructor.apellidos}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                {this.state.numeroHoras !== 0 ?
                                    <span>numero de horas para esta linea: {this.state.numeroHoras}</span>
                                    :
                                    null
                                }

                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="space-around">
                                        <FormControl >
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                format="yyyy/MM/dd"
                                                margin="normal"
                                                name="fechaCreacion"
                                                id="date-picker-inline"
                                                label="Fecha creación del curso"
                                                value={this.state.fechaCreacion}
                                                onChange={this.onChangeFechaCreacion}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </FormControl>

                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="yyyy/MM/dd"
                                            margin="normal"
                                            name="fechaCreacion"
                                            id="date-picker-inline"
                                            label="Fecha inicio del curso"
                                            value={this.state.fechaInicio}
                                            onChange={this.onChangeFechaInicio}
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
                                            label="Fecha cierre del curso"
                                            value={this.state.fechaCierre}
                                            onChange={this.onChangeFechaCierre}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />


                                    </Grid>
                                </MuiPickersUtilsProvider>


                                <FormControl >
                                    <InputLabel htmlFor="max-width">Horas teóricas</InputLabel>
                                    <Input className="inputform" type="text" placeholder="Número de horas teoria" value={this.state.horasTeoria} name="horasTeoria" onChange={this.onChange} />
                                </FormControl>

                                <FormControl >
                                    <InputLabel htmlFor="max-width">Horas practicas</InputLabel>
                                    <Input className="inputform" type="text" placeholder="Número de horas practica" value={this.state.horasPractica} name="horasPractica" onChange={this.onChange} />
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
