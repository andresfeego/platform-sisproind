import React from 'react';
import './App.scss';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Header from './COMPONENTES/Header'
import VentanaAdministrativos from './COMPONENTES/Administrativos/VentanaAdministrativos';
import VentanaCertificados from './COMPONENTES/Certificados/VentanaCertificados';
import VentanaMatriculas from './COMPONENTES/Administrativos/Contenido/estudiantes/VentanaMatriculas';
import BarraUsuario from './COMPONENTES/Administrativos/Contenido/Usuario/BarraUsuario';

function irAweb(){
  window.open("https://sisproind.com/web", "_self")
}

function App() {


  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          {irAweb}
        </Route>
      </Switch>
        <Route  path="/:idSeccion" component={Header}/>
        <Route  path="/administrativos" component={BarraUsuario}/>
        <Route  path="/administrativos" component={VentanaAdministrativos}/>
        <Route  path="/certificados" component={VentanaCertificados}/>
        <Route  path="/matriculas" component={VentanaMatriculas}/>

    </BrowserRouter>
  );
}

export default App;
