import {useEffect, useState} from 'react'
import TableStyles from './attributes.module.css'
import PropTypes from "prop-types";
function Attributes(props) {
    const info = ['', 'Atual', 'Simulado'];
    //const [attrValues, setAttrValues] = useState(Array(15).fill(100));
    const [whiteAttrs, setWhiteAttrs] = useState(Array(15).fill(1));
    const attrValues = props.attrValues;
    const setAttrValues = props.setAttrValues;
    const originalAttributes = props.original;
    const setOriginal = props.setOriginal;
    const attributes = [];
    const aux = props.attrs;
    const packs = props.packs;
    const setPacks = props.setPacks;
    const setSequencia = props.setSequencia;
    const playerPositions = props.playerPositions;
    const setPlayerPositions = props.setPlayerPositions;
    const setCounter = props.setCounter;
    Object.keys(aux).forEach((key) => {
        //console.log(key, aux[key]);
        attributes.push(aux[key]);
    });

    /*
    * Object.keys(myObject).forEach((key, index) => {
    myObject[key] *= 2;
        })
    */
    const positions = ["GK", "DL", "DR", "DC", "DMC", "ML", "MR", "MC", "AML", "AMR", "AMC", "ST"];
    const GK = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1];
    const DL = [2, 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1];
    const DR = [2, 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1];
    const DC = [2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1];
    const DMC = [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 2];
    const ML = [1, 1, 2, 1, 1, 2, 2, 2, 1, 1, 2, 1, 1, 2, 2];
    const MR = [1, 1, 2, 1, 1, 2, 2, 2, 1, 1, 2, 1, 1, 2, 2];
    const MC = [2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 2, 2];
    const AML = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2];
    const AMR = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2];
    const AMC = [1, 1, 1, 2, 1, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2]
    const ST = [1, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 2];

    const [choosePositions, setChoosePositions] = useState();
    const [positionsList, setPositionsList] = useState([]);
    let numbers = Array(15).fill(1);

    const handleNumbers = () => {
        console.log(positionsList);
    }
    useEffect(() => {
        console.log(positionsList)
        let player = [...playerPositions];

        for (let i = 0; i < positionsList.length; i++) {
            let position = eval(positionsList[i]);
            player.map((item, index) => {
                position[index] === 2 ? player[index] = 2 : player[index] = 1;
                //numbers[index] *= position[index];
                console.log(position[index], index, i);
            })
        }
        if(JSON.stringify(player) !== JSON.stringify(playerPositions)) {
            setPlayerPositions(player);
        }
    }, [positionsList, playerPositions, setPlayerPositions]);

    const handlePositionsChange = (e, index) => {
        const chose = e.target.value;
        const currentPositions = [...positionsList];
        chose !== '' ? currentPositions[index] = chose : currentPositions.pop();
        setPositionsList(currentPositions);

        setChoosePositions(chose);
    }

    const handleInputChange = (e, index) =>{
        const newVal = [...originalAttributes];
        let value = e.target.value;
        value = value.replace('%', '');
        console.log("changing")
        newVal[index] = Number(value);
        setAttrValues(newVal);
        setOriginal(newVal);
    };

    const handleKeyDown = (event, index) =>{
        if (event.key === 'Enter') {
            console.log(`key typed: ${event.key}`);
            event.preventDefault();
            const nextRowIndex = index + 1;
            if (nextRowIndex < originalAttributes.length) {
                const nextInput = document.querySelector(`#input-${nextRowIndex}`);

                if (nextInput) {
                    nextInput.focus();
                }
            }
        }
    }
    const resetAttributes = () => {
        const attrs = [...originalAttributes];
        setPacks(0);
        setAttrValues(attrs);
        setSequencia([]);
        setPlayerPositions(Array(15).fill(1));
        setCounter(0);
    }

    return(
        <div>
            <select value={positionsList[0]} onChange={(e) => handlePositionsChange(e,0)}>
                <option value="">Posição 1</option>
                {positions.map((position, index) => (
                    <option key={index} value={position}>{position}</option>
                ))}
            </select>
            <select value={positionsList[1]} onChange={(e) => handlePositionsChange(e,1)}>
                <option value={""}>Posição 2</option>
                {positions.map((position, index) => (
                    <option key={index} value={position}>{position}</option>
                ))}
            </select>
            <select value={positionsList[2]} onChange={(e) => handlePositionsChange(e,2)}>
                <option value={""}>Posição 3</option>
                {positions.map((position, index) => (
                    <option key={index} value={position}>{position}</option>
                ))}
            </select>
            <p>Posicao: {choosePositions}</p>
            <table className={TableStyles.table}>
                <thead>
                <tr>
                    {info.map((attribute, index) => (
                        <th key={index}>{attribute}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {attributes.map((attribute, attrIndex) => (
                    <tr key={attrIndex}>
                        <td>{attribute.charAt(0).toUpperCase() + attribute.slice(1)}</td>
                        <td>
                            <input
                                className={TableStyles.inputTable}
                                id={`input-${attrIndex}`}
                                type="text"
                                value={`${originalAttributes[attrIndex]}%`}
                                onChange={(event) => handleInputChange(event, attrIndex)}
                                onKeyDown={(event) => handleKeyDown(event, attrIndex)}
                                onClick={event => {
                                    event.target.value = ''
                                }}
                            />
                        </td>
                        <td>{attrValues.at(attrIndex)}%</td>
                    </tr>
                ))}
                <tr>
                    <td>Média do jogador</td>
                    <td>{((originalAttributes.reduce((a, b) => {
                        return a + b
                    })) / 15).toFixed(2)}%
                    </td>
                    <td>{((attrValues.reduce((a, b) => {
                        return a + b
                    })) / 15).toFixed(2)}%
                    </td>
                </tr>
                <tr>
                    <td>Maletas</td>
                    <td>{Math.abs(parseFloat(packs.toFixed(2)))}</td>
                </tr>
                </tbody>
            </table>
            <button className={TableStyles.buttonReset} onClick={resetAttributes}>Resetar simulação</button>
        </div>
    );
}

export default Attributes;

Attributes.propTypes = {
    attrs: PropTypes.object,
    attrValues: PropTypes.array.isRequired,
    setAttrValues: PropTypes.func.isRequired,
    original: PropTypes.array.isRequired,
    setOriginal: PropTypes.func.isRequired,
    packs: PropTypes.number.isRequired,
    setPacks: PropTypes.func.isRequired,
    setSequencia: PropTypes.func.isRequired,
    playerPositions: PropTypes.array.isRequired,
    setPlayerPositions: PropTypes.func.isRequired,
    setCounter: PropTypes.func.isRequired,
}