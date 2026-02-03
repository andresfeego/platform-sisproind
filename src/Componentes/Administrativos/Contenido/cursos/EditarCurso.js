import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core'
import React, { Component } from 'react'
import PersonAddSharpIcon from '@material-ui/icons/PersonAddSharp';
import { getDb, setDb } from '../../../../Inicialized/ApiDb';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora'
import { zfill } from '../../../../Inicialized/FuncionesGlobales'

export default class EditarCurso extends Component {

    constructor(props) {
        super(props)
        const curso = this.props.curso
        this.state = {
            open: false,
            id: curso.id,
            tema: curso.idTema, //TODO Back
            linea: curso.linea,
            instructor: curso.idInstructor,
            estado: curso.estado,
            fechaCreacion: new Date(curso.fechaCreacion),
            fechaInicio: new Date(curso.fechaInicio),
            fechaCierre: new Date(curso.fechaCierre),
            horasTeoria: curso.horasTeoria,
            horasPractica: curso.horasPractica,
            empresa: curso.empresa || "",
            nit: curso.nit || "",
            rl: curso.rl || "",
            arl: curso.arl || "",

            numeroHoras: curso.horas,
            tiposTemas: [],
            tiposLineas: [],
            listaInstructores: [],
            tiposEstado: []

        };
    };

    componentDidMount() {
        this.getTipoTemas()
        this.getInstructores()
        this.getTipoLineas(this.props.curso.idTema)
        this.getTipoEstados()
    }

    getTipoEstados() {
        getDb('/responseSisproind/tipoEstadosCurso')
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

    getTipoTemas() {
        getDb('/responseSisproind/tipoTemas')
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
        getDb('/responseSisproind/instructores')
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
        getDb('/responseSisproind/tipoLineas/' + tema)
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
        const curso = this.props.curso
        this.setState({
            open: true,
            id: curso.id,
            tema: curso.idTema, //TODO Back
            linea: curso.linea,
            instructor: curso.idInstructor,
            estado: curso.estado,
            fechaCreacion: new Date(curso.fechaCreacion),
            fechaInicio: new Date(curso.fechaInicio),
            fechaCierre: new Date(curso.fechaCierre),
            horasTeoria: curso.horasTeoria,
            horasPractica: curso.horasPractica,
            empresa: curso.empresa || "",
            nit: curso.nit || "",
            rl: curso.rl || "",
            arl: curso.arl || "",

            numeroHoras: curso.horas,
        })
        if (this.props.fun && this.props.fun.handleClickClose) {
            this.props.fun.handleClickClose()
        }
        this.getTipoLineas(this.props.curso.idTema)

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
            empresa: "",
            nit: "",
            rl: "",
            arl: "",
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

    formatDate = (date) => {
        if (!date) return ""
        const d = new Date(date)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        return `${y}-${m}-${day}`
    }

    formatDateTime = (date) => {
        if (!date) return ""
        const d = new Date(date)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        const hh = String(d.getHours()).padStart(2, "0")
        const mm = String(d.getMinutes()).padStart(2, "0")
        const ss = String(d.getSeconds()).padStart(2, "0")
        return `${y}-${m}-${day} ${hh}:${mm}:${ss}`
    }

    guardar() {

        return new Promise((resolve, reject) => {
            setDb('/responseSisproind/editarCurso')
                .send({ id: this.state.id, linea: this.state.linea, instructor: this.state.instructor, estado: this.state.estado, fechaCreacion: this.formatDateTime(this.state.fechaCreacion), fechaInicio: this.formatDate(this.state.fechaInicio), fechaCierre: this.formatDate(this.state.fechaCierre), horasTeoria: this.state.horasTeoria, horasPractica: this.state.horasPractica, empresa: this.state.empresa, nit: this.state.nit, rl: this.state.rl, arl: this.state.arl })
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {

                        reject("Error al guardar información")

                    } else {
                        const respuestaLogin = JSON.parse(res.text);
                        agregarEventoBitacora(6, "id curso: " + zfill(this.state.id, 3))
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
                if (this.state.fechaInicio.getTime() > this.state.fechaCierre.getTime()) {
                    reject("La fecha de inicio no puede ser despues de la fecha de cierre")
                } else {
                    if ((parseInt(this.state.horasPractica) + parseInt(this.state.horasTeoria)) != parseInt(this.state.numeroHoras)) {
                        reject("El número de horas de practica y teoria esta fuera del rango de las horas de este curso")
                    } else {
                        if (this.state.estado == 0) {
                            reject("Selecciona un estado para este curso")
                        } else {
                            resolve()
                        }
                    }
                }
            }
        })

    }

    onSubmit = async () => {
        nuevoMensaje(tiposAlertas.cargando, "Editando Curso")
        this.validarInfo().then(() => {
            this.guardar().then((response) => {
                nuevoMensaje(tiposAlertas.cargadoSuccess, "Registro exitoso " + this.state.id)
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
                {this.props.detalles == true ?
                    <Box className="btnAgregarAlumnoCurso" onClick={() => this.handleClickOpen()}>
                        <PersonAddSharpIcon className="icon" />
                        Editar curso
                    </Box>
                    :
                    <MenuItem onClick={() => this.handleClickOpen()}>Editar curso</MenuItem>
                }




                <Dialog
                    fullWidth={true}
                    maxWidth="xs"
                    open={this.state.open}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Nuevo Curso</div></DialogTitle>
                    <DialogContent>
                        <div className="formularioUniStep cursoModal">
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

                                <FormControl >
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">
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

                                            <Input className="inputform" type="text" placeholder="Número de horas teoria" value={this.state.horasTeoria} name="horasTeoria" onChange={this.onChange} />
                                            <Input className="inputform" type="text" placeholder="Número de horas practica" value={this.state.horasPractica} name="horasPractica" onChange={this.onChange} />

                                            <Input className="inputform" type="text" placeholder="Empresa" value={this.state.empresa} name="empresa" onChange={this.onChange} />
                                            <Input className="inputform" type="text" placeholder="NIT" value={this.state.nit} name="nit" onChange={this.onChange} />
                                            <Input className="inputform" type="text" placeholder="R.L" value={this.state.rl} name="rl" onChange={this.onChange} />
                                            <Input className="inputform" type="text" placeholder="ARL" value={this.state.arl} name="arl" onChange={this.onChange} />

                                        </Grid>
                                    </MuiPickersUtilsProvider>

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
