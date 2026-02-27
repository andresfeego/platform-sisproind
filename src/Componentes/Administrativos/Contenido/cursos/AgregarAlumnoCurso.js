import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core'
import React, { Component } from 'react'
import PersonAddSharpIcon from '@material-ui/icons/PersonAddSharp';
import { getDb, setDb } from '../../../../Inicialized/ApiDb';
import { nuevoMensaje, tiposAlertas } from '../../../../Inicialized/Toast';
import "./AgregarAlumnoCurso.scss"
import Cargando from '../../../../Inicialized/Cargando';
import { agregarEventoBitacora } from '../../../../Inicialized/Bitacora';

var buscar 

export default class AgregarAlumnoCurso extends Component {

    constructor(props) {
        super(props)
        this._isMounted = false
        
        this.state = {
            open: false,
            estudiantesOriginales: [],
            estudiantesEnCurso: [],
            estudiantesDisponibles: [],
            estudiantesParaBusqueda: null,
            busqueda: "",
            buscando: false
            
        };
      };

      componentDidMount(){
        this._isMounted = true

        Promise.all([ this.getEstudiantes() , this.getEstudiantesEnCurso() ]).then(() => {

            this.crearlistaDisponibles()

        }).catch(( error ) => {
            if (this._isMounted) {
                nuevoMensaje(tiposAlertas.cargadoWarn, "No fue posible cargar los estudiantes")
            }
        })
   }

   componentWillUnmount() {
        this._isMounted = false
   }

   isAbortError = (error) => {
       if (!error) return false
       if (error.abort) return true
       if (error.code === 'ECONNABORTED') return true
       if ((error.message || '').toLowerCase().includes('terminated')) return true
       return false
   }

   crearlistaDisponibles(){

       if (this.state.estudiantesEnCurso.length == 0) {
           this.setState({
            estudiantesDisponibles: this.state.estudiantesOriginales,
            estudiantesParaBusqueda: this.state.estudiantesOriginales
        })
       } else {
        
        const estudiantesAuxi = this.state.estudiantesOriginales

        this.state.estudiantesEnCurso.map((estudianteEnCurso) => {
            estudiantesAuxi.map((estuAuxi, index) => {
                if (estuAuxi.id == estudianteEnCurso.id) {
                    estudiantesAuxi.splice(index, 1)
                }
            })
        })

        this.setState({
            estudiantesDisponibles: estudiantesAuxi,
            estudiantesParaBusqueda: estudiantesAuxi
        })

       }
   }
   
   getEstudiantes(){

    return new Promise ((resolve, reject) => {
        getDb('/responseSisproind/estudiantesParaBusqueda')
        .set('accept', 'json')
        .end((err, res) => {
                if (err) {
                    if (!this._isMounted || this.isAbortError(err)) {
                        resolve([])
                        return
                    }
                    reject(err)

                } else {
                    
                const respuestaLogin =   JSON.parse(res.text);
                this.setState({
                    estudiantesOriginales: respuestaLogin,

                })
                resolve()
                }
        });

    })
}

    getEstudiantesEnCurso(){

    return new Promise ((resolve, reject) => {
            
            getDb('/responseSisproind/estudianteXcurso/'+this.props.curso.id)
            .set('accept', 'json')
            .end((err, res) => {
                    if (err) {
                        if (!this._isMounted || this.isAbortError(err)) {
                            resolve([])
                            return
                        }
                        reject(err)

                    } else {
                        
                    const respuestaLogin =   JSON.parse(res.text);
                    this.setState({
                        estudiantesEnCurso: respuestaLogin,

                    })
                    resolve()

                    }
            });

        })
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
            busqueda: ""
        })
        if (this.props.fun && this.props.fun.handleClickClose) {
            this.props.fun.handleClickClose()
        }

        Promise.all([ this.getEstudiantes() , this.getEstudiantesEnCurso() ]).then(() => {

            this.crearlistaDisponibles()

        }).catch(( error ) => {
            if (this._isMounted) {
                nuevoMensaje(tiposAlertas.cargadoWarn, "No fue posible cargar los estudiantes")
            }
        })

    };

    handleClickClose = () => {
        this.setState({
            open: false,

        })
    };

    
    onChange = e =>{
        
        clearTimeout(buscar)
        var value = e.target.value
        this.setState({
            [e.target.name]: value
        })

        buscar = setTimeout(() => this.buscar(value), 500);
     
    }
    

    buscar(busqueda){
        this.setState({
            estudiantesParaBusqueda: null
        })
        var prepBus = new RegExp(busqueda , 'i'); // preparando termino de busqueda

        let estudiantesAuxi = this.state.estudiantesDisponibles.filter(( item ) => {
            if (prepBus.test( item.id ) || prepBus.test( item.nombres ) || prepBus.test( item.apellidos )) {
                return true
            } else {
                return false
            }
        });
        
        this.setState({
            estudiantesParaBusqueda: estudiantesAuxi,
            buscando: false
        })

    }

    agregarAlumnoAcurso(idEstudiante){
        
        nuevoMensaje(tiposAlertas.cargando, "Agregando alumno")
        
        setDb('/responseSisproind/AgregarAlumnoAcurso')
        .send({idCurso: this.props.curso.id, idEstudiante: idEstudiante})
        .set('accept', 'json')
        .end((err, res) => {
                if (err) {
                    
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al guardar información")

                } else {

                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Agregado de forma correcta")
                    agregarEventoBitacora(1, this.props.curso.nombreTema + " - " + this.props.curso.nombreLinea + " cedula: " + idEstudiante )
                    this.handleClickOpen()
                    this.props.fun.getEstudiantesEnCurso()
                    
                }
        });

    }

    renderListaBusqueda(){
        if (this.state.estudiantesParaBusqueda.length == 0) {
            return <span>No hay estudiantes para agregar</span>
        } else {
            return this.state.estudiantesParaBusqueda.map((item) => 
                <div className="estudianteAgregar">
                    <div className="texto">
                        {item.nombres + " " + item.apellidos + " - " + item.id}
                    </div>
                    <div className="btnAgregar" onClick={() => this.agregarAlumnoAcurso(item.id)}> Agregar </div>
                </div>
            )
        }
    }



    render() {
        return (
            <React.Fragment>
                {this.props.detalles ?
                    <MenuItem onClick={() => this.handleClickOpen()} >Agregar alumno al curso</MenuItem>
                    :
                    <Box className="btnAgregarAlumnoCurso" onClick={() => this.handleClickOpen()}>
                            <PersonAddSharpIcon className="icon"/>
                            Agregar alumno al curso
                    </Box>
                }


                <Dialog fullWidth={true} maxWidth="xs" open={this.state.open} aria-labelledby="max-width-dialog-title">

                    <DialogTitle id="max-width-dialog-title"><div className="tituloAgregarActividad">Agregar alumno a este curso</div></DialogTitle>

                    <DialogContent>
                        
                        <div className="formularioUniStep">
                            <form  noValidate>
                                    <Input className="inputform" type="text" placeholder="Buscar por nombre o documento" value={this.state.busqueda} name="busqueda" onChange={this.onChange}/>
                            </form>
                        </div>

                        <div className="listaEstudiantesAgregar">
                            {this.state.estudiantesParaBusqueda == null ?
                                <Cargando/>
                                :
                                this.renderListaBusqueda()
                            }
                        </div>

                    </DialogContent>    
                    
                    <DialogActions>

                        <Button  color="primary" onClick={this.handleClickClose}>
                            Cerrar
                        </Button>

                    </DialogActions>

                </Dialog>
            </React.Fragment>
        )
    }
}
