import React from 'react'
import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    justify-content: center;
    background: #f8f8f8;
    height: 100vh;
    width: 100vw;
`

export const Pane = styled.div`
    background: white;
    padding: 12px;
    margin: 12px;
    height: 95%;
    width: 100%;
    @media only screen and (min-width: 600px) {
        width: 75%;
        }
`

export const ChartContainer = styled.div`
    margin: 12px 0px;
    width: 350px; 
    height: 350px;
`

export const FlexBox = styled.div`
    display: flex;
    justify-content: center;
`

export const InputContainer = styled.div`
    margin: 16px 0px;
`