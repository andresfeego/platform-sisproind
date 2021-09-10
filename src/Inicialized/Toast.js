import { toast } from 'react-toastify';
import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import BounceLoader from "react-spinners/BounceLoader";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';





let cargando = null;
export const tiposAlertas = {info: 1, success: 2, warn: 3, error: 4, autoCloseCustom: 5, cargando: 6, cargadoSuccess: 7, cargadoWarn: 8, cargadoError: 9, cerrarTodas: 10};

export const nuevoMensaje = (icono,mensaje,auto) =>{

    const override = `
  display: flex;
  margin-right: 5px;
  border-color: red;
  flex-direction: row;
`;


    switch (icono) {
        case 1:
            toast.info(
                <div>
                <InfoOutlinedIcon style={{marginRight: '5px'}}/>
                {mensaje}
                </div>,{
                    autoClose: auto
                }
            );
            break;

        case 2:
            toast.success(
                <div>
                <CheckOutlinedIcon style={{marginRight: '5px'}}/>
                {mensaje}
                </div>,{
                    autoClose: auto
                }
            );
            break;
            
        case 3:
            toast.warn(
                <div>
                <ReportProblemOutlinedIcon style={{marginRight: '5px'}}/>
                {mensaje}
                </div>,{
                    autoClose: auto
                }
            );
            break;

        case 4:
            toast.error(
                <div>
                <HighlightOffOutlinedIcon style={{marginRight: '5px'}}/>
                {mensaje}
                </div>,{
                    autoClose: auto
                }
            );
            break;

        case 5:
            toast.success(
                <div>
                <CheckOutlinedIcon style={{marginRight: '5px'}}/>
                {mensaje}
                </div>,{
                    autoClose: auto
                }
            );
            break;

        case 6:
            cargando = toast.warn(
                <div style={{color: "#495057", display: "flex"}}>
                <BounceLoader 
                    css={override}
                    size={20}
                    />

                {mensaje}
                </div>,
                {
                    autoClose: false                }
            );
            break;

        case 7:
            toast.update(cargando, {
                render: 
                    <div>
                        <CheckOutlinedIcon style={{marginRight: '5px'}}/>
                        {mensaje}
                    </div>,
                type: toast.TYPE.SUCCESS,
                autoClose: auto
              });
            break;

        case 8:
            toast.update(cargando, {
                render: 
                    <div style={{color: "#495057", display: "flex"}}>
                        <ReportProblemOutlinedIcon style={{marginRight: '5px'}}/>
                        <span>{ mensaje }</span> 
                    </div>,
                type: toast.TYPE.WARNING,
                autoClose: auto,
              });
            break;

        case 9:
            toast.update(cargando, {
                render: 
                    <div>
                        <HighlightOffOutlinedIcon style={{marginRight: '5px'}}/>
                        {mensaje}
                    </div>,
                type: toast.TYPE.ERROR,
                autoClose: auto
              });
            break;

        case 10:
            toast.success(
                <div>
                <CloseOutlinedIcon style={{marginRight: '5px'}}/>
                {mensaje}
                </div>,{
                    onClose: props => toast.dismiss(),
                    autoClose: auto

                }
            );
            break;

        
    
        default:
            break;
    }
    
}
