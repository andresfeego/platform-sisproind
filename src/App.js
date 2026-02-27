import React from 'react';
import './App.scss';

import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Header from './Componentes/Header'
import VentanaAdministrativos from './Componentes/Administrativos/VentanaAdministrativos';
import VentanaCertificados from './Componentes/Certificados/VentanaCertificados';
import VerificarDiploma from './Componentes/Certificados/VerificarDiploma';
import VentanaMatriculas from './Componentes/Administrativos/Contenido/estudiantes/VentanaMatriculas';
import BarraUsuario from './Componentes/Administrativos/Contenido/Usuario/BarraUsuario';

function App() {


  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/administrativos" />} />
      </Switch>

      <Route  path="/:idSeccion" component={Header}/>
      <Route exact path="/verificar_certificados" component={VerificarDiploma}/>
      <Route  path="/administrativos" component={BarraUsuario}/>
      <Route  path="/administrativos" component={VentanaAdministrativos}/>
      <Route  path="/certificados" component={VentanaCertificados}/>
      <Route  path="/matriculas" component={VentanaMatriculas}/>

    </BrowserRouter>
  );
}

export default App;
