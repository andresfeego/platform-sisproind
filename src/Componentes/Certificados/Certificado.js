import React from 'react';
import { Page, Text, Image, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import moment from 'moment';
import 'moment/locale/es';
import RobotoR from "../../fonts/Roboto-Regular.ttf"
import RobotoB from "../../fonts/Roboto-Bold.ttf"


moment.locale('es');

Font.register({ family: 'RobotoR', src: RobotoR });
Font.register({ family: 'RobotoB', src: RobotoB });
    


const styles = StyleSheet.create({
  page: { color: '#000', fontSize: '2vw', fontFamily: 'RobotoR' },
  sectionFecha: { textAlign: 'left', margin: "4cm 2cm 1cm 2cm" },
  logo: { position: 'absolute', top: "1cm",left: "2cm", width: '6cm' },
  mPrevencion: { position: 'absolute', top: "1cm",right: "1cm", width: '3.5cm',transform: { rotate: '-30deg'} },
  mAgua: { position: 'absolute', top: "8cm",right: "20%", width: '13cm' },
  titulo: { textAlign: 'center', marginTop: '60', fontFamily: 'RobotoB'},
  txtParrafo: { textAlign: 'justify', margin: '10 40', fontFamily: 'RobotoR'},
  txtBold: {fontFamily: 'RobotoB'},
  txtRegular: {fontFamily: 'RobotoR'},
  separado: {marginBottom: '20'}
});

export function PDFDoc(props){
    const curso = props.curso
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View>
                <Image source={require("../../image/general/LOGO SISPROIND 200.png")} style={styles.logo} />
                <Image source={require("../../image/general/mas prevencion.png")} style={styles.mPrevencion} />
                <Image source={require("../../image/general/icono grande 80porc.png")} style={styles.mAgua} />
                </View>
            <View style={styles.sectionFecha}>
                <Text >{"Sogamoso, " + moment().format('LLLL')}</Text>
                <Text style={styles.titulo} >CONSTANCIA DE CAPACITACIÓN</Text> 
            </View>

            <Text style={styles.txtParrafo}>
                EL <Text style={styles.txtBold}>INSTITUTO DE EDUCACION PARA EL DESARROLLO HUMANO, SISPROIND SAS</Text> hace constar que <Text style={styles.txtBold}>{curso.nombres + " " + curso.apellidos}</Text>, identificado(a) con <Text> {curso.documento} </Text> número <Text style={styles.txtBold}>{curso.idEstudiante}</Text>, registra la siguiente información de capacitación:
            </Text>

            <View style={[styles.txtParrafo,{marginTop: 20}]}>
                <Text style={[styles.txtBold, styles.separado]}>NOMBRE DEL PROGRAMA: <Text style={styles.txtRegular}>{curso.nombreTema + " - " + curso.nombre}</Text></Text>
                <Text style={[styles.txtBold, styles.separado]}>ENTRENADOR FORMADOR: <Text style={styles.txtRegular}>{curso.nombreInstructor}</Text></Text>
                <Text style={[styles.txtBold, styles.separado]}>SEDE DE FORMACIÓN: <Text style={styles.txtRegular}>CARRERA 24 Nº 2-38  SOGAMOSO</Text></Text>
                <Text style={[styles.txtBold, styles.separado]}>FECHAS DE FORMACIÓN: <Text style={styles.txtRegular}>{moment(curso.fechaInicio).format('YYYY-MM-DD') + " - " + moment(curso.fechaCierre).format('YYYY-MM-DD')}</Text></Text>
                <Text style={[styles.txtBold, styles.separado]}>INTENSIDAD HORARIA: <Text style={styles.txtRegular}>{curso.horas + " horas"}</Text></Text>
            </View>

            <Text style={styles.txtParrafo}>
                La constancia de capacitación es generada Según Resolución 1735-19 Artículo Primero: Otorga Licencia de Servicios de Salud Ocupacional “Seguridad y Salud en el Trabajo”,
                a SISPROIND En los campos de acción de : EDUCACIÓN Y CAPACITACIÓN. Y Autorización de la SECRETRARIA DE EDUCACION Nº 001/2020 Como IETDH  debidamente habilitado para impartir formación para el trabajo.
            </Text>

            <Text style={styles.txtParrafo}>
                Se expide la presente constancia el día <Text style={styles.txtBold}>{moment().format('LLL')}</Text>
            </Text>


            </Page>
        </Document>

    );
}


