import React, { Component } from 'react'
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
import "./Cargando.scss"


const override = css`
  display: block;
  margin: 0 auto;
  border-color: gray;
`;

export default class Cargando extends Component {


    render() {
        return (
            <div className="CargandoContainer">
                
                <BeatLoader
                    css={override}
                    size={15}
                    color={"gray"}
                    loading={true}
                />

                <span className="cargando">Cargando...</span>

          </div>
        )
    }
}
