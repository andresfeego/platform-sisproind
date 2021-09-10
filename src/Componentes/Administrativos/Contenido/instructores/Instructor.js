import React, { Component } from 'react'
import BotonMenuInstructor from './BotonMenuInstructor'

export default class Instructor extends Component {


    render() {
        const instructor = this.props.instructor
        var activo = "inactivo"
        if (instructor.activo == 1) {
            activo = ""
        }

        return (
            <div className="estudiante">

                <div className={"identificacion " + activo}>
                    {instructor.id}
                </div>

                <div className="nombres">
                    {instructor.nombres + " " + instructor.apellidos}
                </div>

                <BotonMenuInstructor instructor={instructor} fun={this.props.fun} />

            </div>
        )
    }
}