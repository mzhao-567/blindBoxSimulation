import { Slider, PrimaryButton, Text, Dialog, DialogType, DialogFooter} from '@fluentui/react';
import { useState } from 'react';
import { VegaLite } from 'react-vega'
import { Container, Pane, ChartContainer, FlexBox, InputContainer } from './Components'

function eqSet(as, bs) {
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
}

const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

const getNumBoxes = (numOptions, numTargets) =>{
    if(numTargets > numOptions){
        return []
    }
    let n = 0
    const results = new Set()
    const targets = new Set()
    for (let i = 1; i <= numTargets; i++){
        targets.add(i)
    }
    let intersection = new Set()
    while (!eqSet(intersection, targets)){
        let newBox = Math.floor(Math.random() * numOptions) + 1
        results.add(newBox)
        n++
        intersection = new Set([...results].filter(x => targets.has(x)));
    }
    return n
}

const getSimulationResult = (inputValues, setSimulationResult, toggleHideDialog) =>{
    const {numOptions, numTargets, numSimulations} = inputValues
    if(numTargets > numOptions){
        toggleHideDialog()
        return null
    }
    const results = []
    for (let i = 0; i < numSimulations; i++){
        results.push(getNumBoxes(numOptions, numTargets))
    }
    setSimulationResult(results)
}

const Histogram = (props) =>{
    const {simulationResult} = props

    const spec = {
        mark: 'bar',
        encoding: {
            x: { field: 'numBoxes', "bin": true, },
            y: { aggregate: 'count'},
        },
        data: { name: 'table' },
        }
    
        const barData = {
        table: simulationResult.map(result => ({numBoxes: result})),
        }

    if(simulationResult.length < 1){
        return null
    }
    else{
        return (
        <FlexBox>
            <ChartContainer>
                <div>
                    <VegaLite spec={spec} data={barData} />
                    <Text variant='large' block>Average Number of Boxes: {Math.ceil(average(simulationResult))}</Text>
                </div>
            </ChartContainer>
        </FlexBox>)
    }

}

const InputControls = (props) =>{
    const {inputValues, setInputValues} = props

    const onSliderChange = (value, item) =>{
        setInputValues({... inputValues, [item]: value})
    }

    return (
        <InputContainer>
            <Slider label='Number of Possible Options' min={1} max={25} value={inputValues['numOptions']} 
            onChange={value =>{onSliderChange(value, 'numOptions')}}/>
            <Slider label='Number of Figures Needed' min={1} max={25} value={inputValues['numTargets']}
            onChange={value =>{onSliderChange(value, 'numTargets')}}/>
            <Slider label='Number of Simulation Rounds' min={100} max={2500} step={100} value={inputValues['numSimulations']}
            onChange={value =>{onSliderChange(value, 'numSimulations')}}/>
        </InputContainer>
    )
}

export const Simulation = () =>{
    const [inputValues, setInputValues] = useState({numOptions: 10, numTargets: 10, numSimulations: 1000})
    const [simulationResult, setSimulationResult] = useState([])
    const [hideDialog, setHideDialog] = useState(true)

    const toggleHideDialog = () =>{
        setHideDialog(!hideDialog)
    }

    const dialogContentProps = {
        type: DialogType.normal,
        title: 'Error',
        subText: "Can't have more figures than possible options",
        };

    return (
    <Container>
        <Dialog         
            hidden={hideDialog}
            onDismiss={toggleHideDialog}
            dialogContentProps={dialogContentProps}
        >
            <DialogFooter>
                <PrimaryButton onClick={toggleHideDialog} text="Close" />
            </DialogFooter>
        </Dialog>
        <Pane>
            <Text variant='xLargePlus' block>Monte Carlo Simulation — Blind Box</Text>
            <InputControls inputValues={inputValues} setInputValues={setInputValues}/>
            <PrimaryButton text="Run Simulation" onClick={()=>{getSimulationResult(inputValues, setSimulationResult, toggleHideDialog)}}/>
            <Histogram simulationResult={simulationResult} />
        </Pane>
    </Container>)
}