import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { zfill } from '../../Inicialized/FuncionesGlobales'
import { buildDiplomaUrl, buildFirmaUrl, buildFondoDiplomaUrl } from '../../Inicialized/BackendConfig'

const testMode = false

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 12,
        position: 'relative'
    },
    fondo: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    headerInfoWrapper: {
        position: 'absolute',
        top: 24,
        right: 40,
        width: 240
    },
    headerInfo: {
        fontSize: 10,
        textAlign: 'center'
    },
    lineaWrapper: {
        position: 'absolute',
        left: 60,
        right: 60
    },
    lineaTexto: {
        textAlign: 'center'
    },
    tituloPrincipal: {
        textAlign: 'center',
        fontSize: 21,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 0.2
    },
    subtitulo: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'Helvetica-Oblique'
    },
    lineaCedula: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'Helvetica-Oblique'
    },
    lineaCurso: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'Helvetica-Oblique'
    },
    lineaNivel: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Helvetica-Bold'
    },
    lineaDuracion: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'Helvetica-Oblique'
    },
    bold: {
        fontFamily: 'Helvetica-Bold'
    },
    italic: {
        fontFamily: 'Helvetica-Oblique'
    },
    firmas: {
        position: 'absolute',
        left: 60,
        right: 60,
        bottom: 70,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 9
    },
    firmaCol: {
        width: '30%',
        textAlign: 'center',
        position: 'relative',
        minHeight: 120,
        justifyContent: 'flex-end',
        overflow: 'hidden'
    },
    firmaTexto: {
        position: 'relative',
        zIndex: 2
    },
    firmaBg: {
        position: 'absolute',
        bottom: 15,
        left: '10%',
        width: '80%',
        maxHeight: 70,
        objectFit: 'contain',
        zIndex: 1,
        opacity: 0.7
    },
    footer: {
        position: 'absolute',
        left: 60,
        right: 60,
        bottom: 30,
        textAlign: 'center',
        fontSize: 8
    },
    qrDiploma: {
        position: 'absolute',
        right: 16,
        bottom: 66,
        width: 58,
        height: 58
    },
    qrLabel: {
        position: 'absolute',
        right: 16,
        bottom: 128,
        fontSize: 7,
        color: '#111'
    },
    debugFechas: {
        position: 'absolute',
        left: 40,
        top: 20,
        fontSize: 8,
        textAlign: 'left'
    },
    textoDinamico: {
        color: testMode ? '#d32f2f' : '#000'
    },
    textoQuemado: {
        color: testMode ? '#2e7d32' : '#000'
    },
    marker: {
        position: 'absolute',
        top: -8,
        right: 0,
        fontSize: 7,
        color: '#111'
    }
})

const MESES = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
]

const parseFecha = (value) => {
    if (!value) return null
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return null
    return d
}

const formatoDiasCurso = (fechaInicio, fechaCierre) => {
    const inicio = parseFecha(fechaInicio)
    const cierre = parseFecha(fechaCierre)
    if (!inicio || !cierre) return 'SIN_DATO'

    const start = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate())
    const end = new Date(cierre.getFullYear(), cierre.getMonth(), cierre.getDate())
    const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()

    const diffMs = end.getTime() - start.getTime()
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000)) + 1

    const d1 = start.getDate()
    const d2 = end.getDate()
    const mes = MESES[start.getMonth()]
    const anio = start.getFullYear()

    if (!sameMonth) {
        const mes2 = MESES[end.getMonth()]
        const anio2 = end.getFullYear()
        return `los dias entre el ${d1} de ${mes} de ${anio} y el ${d2} de ${mes2} de ${anio2}`
    }

    if (diffDays <= 1) {
        return `el dia ${d1} de ${mes} de ${anio}`
    }
    if (diffDays === 2) {
        return `los dias ${d1} y ${d2} de ${mes} de ${anio}`
    }
    if (diffDays <= 4) {
        const dias = []
        for (let i = 0; i < diffDays; i += 1) {
            dias.push(d1 + i)
        }
        return `los dias ${dias.slice(0, -1).join(', ')} y ${dias[dias.length - 1]} de ${mes} de ${anio}`
    }

    return `los dias habiles entre el ${d1} y ${d2} de ${mes} de ${anio}`
}

const formatoFechaLarga = (fecha) => {
    const d = parseFecha(fecha)
    if (!d) return 'SIN_DATO'
    const dia = d.getDate()
    const mes = MESES[d.getMonth()]
    const anio = d.getFullYear()
    return `${dia} dias de ${mes} de ${anio}`
}

const getVerifyUrl = (curso) => {
    if (typeof window === 'undefined') return ''
    if (!curso) return ''
    const url = `${window.location.origin}/verificar_certificados?idCurso=${curso.idCurso}&idEstudiante=${curso.idEstudiante}`
    // Debug visual en desktop
    console.log('URL verificacion diploma:', url)
    return url
}

const getQrUrl = (curso) => {
    const verifyUrl = getVerifyUrl(curso)
    if (!verifyUrl) return ''
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`
}

const DiplomaDoc = ({ curso }) => (
    <Document>
        <Page size="LETTER" orientation="landscape" style={styles.page}>
            <Image
                style={styles.fondo}
                src={curso && curso.urlFondoDiploma ? buildFondoDiplomaUrl(curso.urlFondoDiploma) : buildDiplomaUrl('default_image_diploma.jpeg')}
            />

            <View style={[styles.lineaWrapper, { top: 150 }]}>
                <Text style={[styles.tituloPrincipal, styles.textoQuemado]}>
                    CERTIFICADO DE CAPACITACION Y ENTRENAMIENTO{'\n'}
                    PARA <Text style={styles.textoDinamico}>{curso.nombreTema || 'SIN_DATO'}</Text>
                </Text>
                {testMode ? <Text style={styles.marker}>02</Text> : null}
            </View>
            <View style={[styles.lineaWrapper, { top: 210 }]}>
                <Text style={[styles.subtitulo, styles.textoQuemado]}>HACE CONSTAR QUE :</Text>
                {testMode ? <Text style={styles.marker}>03</Text> : null}
            </View>

            <View style={[styles.lineaWrapper, { top: 255 }]}>
                <Text style={[styles.lineaCedula, styles.textoQuemado]}>
                    Con Cedula de Ciudadania N.º 
                    <Text style={[styles.bold, styles.textoDinamico]}>{curso.idEstudiante || 'SIN_DATO'}</Text>
                </Text>
                {testMode ? <Text style={styles.marker}>04</Text> : null}
            </View>

            <View style={[styles.lineaWrapper, { top: 285 }]}>
                <Text style={[styles.lineaCurso, styles.textoQuemado]}>
                    CURSO Y APROBO LA CAPACITACION Y ENTRENAMIENTO DE <Text style={styles.textoDinamico}>{curso.nombreTema || 'SIN_DATO'}</Text>
                </Text>
                {testMode ? <Text style={styles.marker}>05</Text> : null}
            </View>

            <View style={[styles.lineaWrapper, { top: 315 }]}>
                <Text style={[styles.lineaNivel, styles.textoDinamico]}>
                    {curso.nombre || 'SIN_DATO'}
                </Text>
                {testMode ? <Text style={styles.marker}>06</Text> : null}
            </View>
            <View style={[styles.lineaWrapper, { top: 340 }]}>
                <Text style={[styles.lineaDuracion, styles.textoQuemado]}>
                    Con una duracion de (<Text style={styles.textoDinamico}>{curso.horas || curso.numeroHoras || 'SIN_DATO'}</Text>) horas.
                </Text>
                {testMode ? <Text style={styles.marker}>07</Text> : null}
            </View>

            <View style={[styles.lineaWrapper, { top: 375 }]}>
                <Text style={[styles.lineaTexto, styles.textoQuemado, { fontSize: 10 }]}>
                    Realizado en la ciudad de <Text style={styles.textoQuemado}>Sogamoso Boyaca</Text> <Text style={styles.textoDinamico}>{formatoDiasCurso(curso.fechaInicio, curso.fechaCierre)}</Text>.
                </Text>
                {testMode ? <Text style={styles.marker}>08</Text> : null}
            </View>
            <View style={[styles.lineaWrapper, { top: 395 }]}>
                <Text style={[styles.lineaTexto, styles.textoQuemado, { fontSize: 10 }]}>
                    Dando cumplimiento a los requisitos exigidos por la Resolucion <Text style={styles.textoDinamico}>{curso.resolucion || 'SIN_DATO'}</Text>.
                </Text>
                {testMode ? <Text style={styles.marker}>09</Text> : null}
            </View>
            <View style={[styles.lineaWrapper, { top: 415 }]}>
                <Text style={[styles.lineaTexto, styles.textoQuemado, { fontSize: 10 }]}>
                    En testimonio de lo anterior se expide en <Text style={styles.textoQuemado}>Sogamoso Boyaca</Text> a los <Text style={styles.textoDinamico}>{formatoFechaLarga(curso.fechaCierre)}</Text>.
                </Text>
                {testMode ? <Text style={styles.marker}>10</Text> : null}
            </View>

            <View style={styles.firmas}>
                <View style={styles.firmaCol}>
                    {curso.urlFirmaInstructor ? (
                        <Image
                            style={styles.firmaBg}
                            src={buildFirmaUrl(curso.urlFirmaInstructor)}
                        />
                    ) : null}
                    <View style={styles.firmaTexto}>
                        <Text style={styles.textoDinamico}>{curso.nombreInstructor || 'SIN_DATO'}</Text>
                        <Text style={styles.textoDinamico}>C.C: {curso.idInstructor || 'SIN_DATO'}</Text>
                        <Text style={styles.textoDinamico}>{curso.cargoInstructor || 'SIN_DATO'}</Text>
                        <Text style={styles.textoDinamico}>{curso.licenciaInstructor || 'SIN_DATO'}</Text>
                    </View>
                </View>
                <View style={styles.firmaCol}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                        <View style={{ flexGrow: 1 }}>
                            <Text><Text style={styles.textoQuemado}>EMPRESA: </Text><Text style={styles.textoDinamico}>{curso.empresa || '--'}</Text></Text>
                            <Text><Text style={styles.textoQuemado}>NIT: </Text><Text style={styles.textoDinamico}>{curso.nit || '--'}</Text></Text>
                            <Text><Text style={styles.textoQuemado}>R.L: </Text><Text style={styles.textoDinamico}>{curso.rl || '--'}</Text></Text>
                            <Text><Text style={styles.textoQuemado}>ARL: </Text><Text style={styles.textoDinamico}>{curso.arl || '--'}</Text></Text>
                        </View>
                    </View>
                    {testMode ? <Text style={styles.marker}>13</Text> : null}
                </View>
            </View>
            {getQrUrl(curso) ? (
                <>
                    <Text style={styles.qrLabel}>Verificar autenticidad</Text>
                    <Image
                        style={styles.qrDiploma}
                        src={getQrUrl(curso)}
                    />
                </>
            ) : null}

            {testMode ? (
                <Text style={styles.debugFechas}>
                    fechaInicio: {curso.fechaInicio || 'SIN_DATO'}{'\n'}
                    fechaCierre: {curso.fechaCierre || 'SIN_DATO'}
                </Text>
            ) : null}
        </Page>
    </Document>
)

export default DiplomaDoc
