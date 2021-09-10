import React, { Component } from 'react'
import { css } from "@emotion/core";
import MoonLoader from "react-spinners/BeatLoader";
import "./Cargando.scss"


const override = css`
  display: block;
  margin: 0 auto;
  border-color: gray;
`;

export default class CargandoDos extends Component {


    render() {
        return (
            <div className="CargandoContainer">
                
                <MoonLoader
                    css={override}
                    size={15}
                    color={"gray"}
                    loading={true}
                />
          </div>
        )
    }
}
