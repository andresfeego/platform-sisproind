import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import localStore from './Inicialized/localStore'
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import MetaTags from 'react-meta-tags';
import Favicon from 'react-favicon';


ReactDOM.render(
  <Provider store={localStore}>
    <App />
    <ToastContainer
      position="bottom-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      transition={Slide}
      rtl={false}
      pauseOnVisibilityChange
      draggable
      pauseOnHover />

    <Favicon url={require("./image/general/icono.png")} />

    <div className="wrapper">
      <MetaTags>
        <title>SISPROIND - Seguridad Industrial y Servicios Profesionales</title>
        <meta name="description" content="Somos una empresa que brinda soluciones integrales en formación, suministro, acompañamiento y todo lo relacionado a la seguridad en tareas de alto riesgo, ajustadas a las necesidades del cliente, que le garanticen el cumplimiento de la normas  legales y técnicamente establecidas." />
        <meta property="og:title" content="SISPROIND - Seguridad Industrial y Servicios Profesionales" />
        <meta property="og:image" content={require("./image/general/LOGO SISPROIND 200.png")} />
      </MetaTags>
    </div>

  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
