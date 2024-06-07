import {useEffect} from 'react'
import TableStyles from './attributes.module.css'
import PropTypes, {number} from "prop-types";
function Attributes(props) {
    const info = ['Atributo', 'Atual', 'Simulado'];
    const attrValues = props.attrValues;
    const setAttrValues = props.setAttrValues;
    const originalAttributes = props.original;
    const setOriginal = props.setOriginal;
    const attributes = [];
    const aux = props.attrs;
    const packs = props.packs;
    const setPacks = props.setPacks;
    const setSequence = props.setSequence;
    const playerPositions = props.playerPositions;
    const setPlayerPositions = props.setPlayerPositions;
    const setCounter = props.setCounter;
    const setSeqCounter = props.setSeqCount;
    const setCurrentIndex = props.setCurrentIndex;
    const setPrev = props.setPrev;
    const setAdd = props.setAdd;
    const positions = ["GK", "DL", "DR", "DC", "DMC", "ML", "MR", "MC", "AML", "AMR", "AMC", "ST"];
    const positionsList = props.positionsList;
    const setPositionsList = props.setPositionsList;
    const currentPacks = props.currentPacks;
    const setCurrentPacks = props.setCurrentPacks;
    const originalPacks = props.originalPacks;
    const setOriginalPacks = props.setOriginalPacks;
    let speedChosen = props.speedChosen;
    const speedChoice = props.speedChoice;
    const setSpeedChoice = props.setSpeedChoice;
    Object.keys(aux).forEach((key) => {
        attributes.push(aux[key]);
    });

    useEffect(() => {
        const positionsNumbers= {
            'GK': [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1],
            'DL': [2, 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1],
            'DR': [2, 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1],
            'DC': [2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
            'DMC': [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 2],
            'ML': [1, 1, 2, 1, 1, 2, 2, 2, 1, 1, 2, 1, 1, 2, 2],
            'MR': [1, 1, 2, 1, 1, 2, 2, 2, 1, 1, 2, 1, 1, 2, 2],
            'MC': [2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 2, 2],
            'AML': [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2],
            'AMR': [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2],
            'AMC': [1, 1, 1, 2, 1, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2],
            'ST': [1, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 2]
        }
        let player = Array(15).fill(1);
        for (let i = 0; i < positionsList.length; i++) {
            let position = positionsNumbers[positionsList[i]];
            player.map((item, index) => {
                if (player[index] ===  1 && position[index] === 2){
                    player[index] = 2;
                }
            })
        }
        if(JSON.stringify(player) !== JSON.stringify(playerPositions)) {
            setPlayerPositions(player);
        }
    }, [positionsList, playerPositions, setPlayerPositions]);

    const handlePositionsChange = (e, index) => {
        const chose = e.target.value;
        let currentPositions =  [...positionsList];
        if(index === 0 && positionsList.length > 1){
            currentPositions = [];

        }
        else if(index === 1 && positionsList.length > 2 && chose !== positionsList[index]){
            currentPositions.pop();
        }
        chose !== '' ? currentPositions[index] = chose : currentPositions.pop();
        setPositionsList(currentPositions);
    }

    const handleInputChange = (e, index) => {
        const newVal = [...originalAttributes];
        let value = e.target.value;
        value = value.replace('%', '').trim();
        const validPartialNumber = /^-?\d*\.?\d*$/;

        if(value === '-'){
            newVal[index] = '-';
        }
        else if (validPartialNumber.test(value)) {
            newVal[index] = parseInt(value);
        } else {
            newVal[index] = '';
        }

        setAttrValues(newVal);
        setOriginal(newVal);
    };

    const handleKeyDown = (event, index) =>{
        if (event.key === 'Enter') {
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
    const playerAvg = (arr) => {
        const sum = (arr.reduce((a, b) => {
            /*a = parseInt(a);
            b = parseInt(b);*/
            return a + b;
        }));
        if(isNaN(sum)){
            return "";
        }
        return (sum / 15).toFixed(0);
    }

    const resetAttributes = () => {
        const attrs = [...originalAttributes];
        setPacks(0);
        setAttrValues(attrs);
        setSequence([]);
        setPlayerPositions(Array(15).fill(1));
        setCounter(0);
        setSeqCounter([]);
        setCurrentIndex([]);
        setPrev([]);
        setAdd(0);
        setCurrentPacks(originalPacks);
    }

    const handleSpeedChange = (e) => {
        const value = Number(e.target.value);
        setSpeedChoice(value);
        switch (value) {
            case 1:
                speedChosen.current = 180;
                break;
            case 2:
                speedChosen.current = 120;
                break;
            case 3:
                speedChosen.current = 50;
                break;
            default: speedChosen.current = 120
        }
    }

    const handleInputPacksChange = (e) => {
        const value = e.target.value;
        const intValue = value === '0' ? '' : Number(parseInt(value, 10));
        setOriginalPacks(intValue);
        setCurrentPacks(intValue);
        setAdd(0);
    }

    const filterPositions = (index) => {
        const pos0 = positionsList[0];
        const pos1 = positionsList[1];
        const includesAny = (position, substrings) =>
            substrings.some((substring) => position === substring);
        switch (index) {

            case 1:
                if(pos0 === 'GK' || positionsList.length === 0) {
                    return [];
                }
                else if(pos0 === 'DL'){
                    return positions.filter((position) => includesAny(position, ['DC', 'ML']));
                }
                else if(pos0 === 'DR'){
                    return positions.filter((position) => includesAny(position, ['DC', 'MR']));
                }
                else if(pos0 === 'DC'){
                    return positions.filter((position) => includesAny(position, ['DL', 'DR', 'DMC']));
                }
                else if(pos0 === 'DMC'){
                    return positions.filter((position) => includesAny(position, ['DC', 'MC']));
                }
                else if(pos0 === 'ML'){
                    return positions.filter((position) => includesAny(position, ['DL', 'MC', 'AML']));
                }
                else if(pos0 === 'MR'){
                    return positions.filter((position) => includesAny(position, ['DR', 'MC', 'AMR']));
                }
                else if(pos0 === 'MC'){
                    return positions.filter((position) => includesAny(position, ['DMC', 'ML', 'MR', 'AMC']));
                }
                else if(pos0 === 'AML'){
                    return positions.filter((position) => includesAny(position, ['ML', 'AMC', 'ST']));
                }
                else if(pos0 === 'AMR'){
                    return positions.filter((position) => includesAny(position, ['MR', 'AMC', 'ST']));
                }
                else if(pos0 === 'AMC'){
                    return positions.filter((position) => includesAny(position, ['MC','AML', 'AMR', 'ST']));
                }
                else{
                    return positions.filter((position) => includesAny(position, ['AML', 'AMC', 'AMR']));
                }
            case 2:
                if(pos0 === 'GK'|| positionsList.length < 2){
                    return [];
                }
                else if(pos0 === 'DL' && pos1 === 'DC' || pos0 === 'DC' && pos1 === 'DL'){
                    return positions.filter((position) => includesAny(position, ['DR', 'ML', 'DMC']));
                }
                else if(pos0 === 'DR' && pos1 === 'DC' || pos0 === 'DC' && pos1 === 'DR'){
                    return positions.filter((position) => includesAny(position, ['DL', 'MR', 'DMC']));
                }
                else if(pos0 === 'DL' && pos1 === 'ML' || pos0 === 'ML' && pos1 === 'DL'){
                    return positions.filter((position) => includesAny(position, ['DC', 'AML', 'MC']));
                }
                else if(pos0 === 'DR' && pos1 === 'MR' || pos0 === 'MR' && pos1 === 'DR'){
                    return positions.filter((position) => includesAny(position, ['DC', 'AMR', 'MC']));
                }
                else if(pos0 === 'DC' && pos1 === 'DMC' || pos0 === 'DMC' && pos1 === 'DC'){
                    return positions.filter((position) => includesAny(position, ['DL', 'DR', 'MC']));
                }
                else if(pos0 === 'DMC' && pos1 === 'MC' || pos0 === 'MC' && pos1 === 'DMC'){
                    return positions.filter((position) => includesAny(position, ['DC', 'AMC', 'ML', 'MR']));
                }
                else if(pos0 === 'MC' && pos1 === 'ML' || pos0 === 'ML' && pos1 === 'MC'){
                    return positions.filter((position) => includesAny(position, ['DMC', 'AML', 'MR', 'AMC']));
                }
                else if(pos0 === 'MC' && pos1 === 'MR' || pos0 === 'MR' && pos1 === 'MC'){
                    return positions.filter((position) => includesAny(position, ['DMC', 'AMR', 'ML', 'AMC']));
                }
                else if(pos0 === 'MC' && pos1 === 'AMC' || pos0 === 'AMC' && pos1 === 'MC'){
                    return positions.filter((position) => includesAny(position, ['DMC','ML', 'MR', 'AML', 'AMR', 'ST']));
                }
                else if(pos0 === 'ML' && pos1 === 'AML' || pos0 === 'AML' && pos1 === 'ML'){
                    return positions.filter((position) => includesAny(position, ['DL', 'MC', 'AMC', 'ST']));
                }
                else if(pos0 === 'MR' && pos1 === 'AMR' || pos0 === 'AMR' && pos1 === 'MR'){
                    return positions.filter((position) => includesAny(position, ['DR', 'MC', 'AMC', 'ST']));
                }
                else if(pos0 === 'AMC' && pos1 === 'AML' || pos0 === 'AML' && pos1 === 'AMC'){
                    return positions.filter((position) => includesAny(position, ['ML', 'MC', 'AMR', 'ST']));
                }
                else if(pos0 === 'AMC' && pos1 === 'AMR' || pos0 === 'AMR' && pos1 === 'AMC'){
                    return positions.filter((position) => includesAny(position, ['MR', 'MC', 'AML', 'ST']));
                }
                else if(pos0 === 'AML' && pos1 === 'ST' || pos0 === 'ST' && pos1 === 'AML'){
                    return positions.filter((position) => includesAny(position, ['AMC', 'ML', 'AMR']));
                }
                else if(pos0 === 'AMR' && pos1 === 'ST' || pos0 === 'ST' && pos1 === 'AMR'){
                    return positions.filter((position) => includesAny(position, ['AMC', 'MR', 'AML']));
                }
                else{
                    return positions.filter((position) => includesAny(position, ['MC', 'AML', 'AMR']));
                }
            default:
                return positions;
        }
    };

    return(
        <div>
            <div className={TableStyles.buttons}>
                <select value={positionsList[0]} onChange={(e) => handlePositionsChange(e, 0)}>
                    <option value="">Posição 1</option>
                    { positions.map((position, index) => (
                        <option key={index} value={position}>{position}</option>
                    ))}
                </select>
                <select value={positionsList.length > 1 ? positionsList[1] : ""} onChange={(e) => handlePositionsChange(e, 1)}>
                    <option value={""}>Posição 2</option>
                    {filterPositions(1).map((position, index) => (
                            <option key={index} value={position}>{position}</option>
                        )
                    )}
                </select>
                <select value={positionsList.length > 2 ? positionsList[2] : ""} onChange={(e) => handlePositionsChange(e, 2)}>
                    <option value="">Posição 3</option>
                    {filterPositions(2).map((position, index) => (
                            <option key={index} value={position}>{position}</option>
                        )
                    )}
                </select>
            </div>

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
                    <tr className={playerPositions[attrIndex] === 1 ? TableStyles.attrColorGray : TableStyles.attrWhite}
                        key={attrIndex}>
                        <td>{attribute.charAt(0).toUpperCase() + attribute.slice(1)}</td>
                        <td>
                            <input
                                className={TableStyles.inputTable}
                                id={`input-${attrIndex}`}
                                type="text"
                                value={originalAttributes[attrIndex] !== null ? `${originalAttributes[attrIndex]}%` : ''}
                                onChange={(event) => handleInputChange(event, attrIndex)}
                                onKeyDown={(event) => handleKeyDown(event, attrIndex)}
                                onClick={event => {
                                    event.target.value = ''
                                }}
                            />
                        </td>
                        <td>{attrValues.at(attrIndex) !== null ? `${attrValues.at(attrIndex)}%` : ''}</td>
                    </tr>
                ))}
                <tr>
                    <td>Média do jogador</td>
                    <td>{((originalAttributes.reduce((a, b) => {
                        a = (/^-?\d+(\.\d*)?$/).test(a) ? a : 0;
                        b = (/^-?\d+(\.\d*)?$/).test(b) ? b : 0;
                        return a + b
                    })) / 15).toFixed(0)}%
                    </td>
                    <td>{((attrValues.reduce((a, b) => {
                        a = (/^-?\d+(\.\d*)?$/).test(a) ? a : 0;
                        b = (/^-?\d+(\.\d*)?$/).test(b) ? b : 0;
                        return a + b
                    })) / 15).toFixed(0)}%
                    </td>
                </tr>
                <tr>
                    <td>Maletas gastas</td>
                    <td>
                        <input className={TableStyles.inputTable}
                               type="text"
                               onChange={(e) => handleInputPacksChange(e)}
                               onClick={event => {
                                   event.target.value = ''
                               }}
                               value={originalPacks !== null ? originalPacks : ''}
                        />
                    </td>
                    <td>{currentPacks !== null && originalPacks > 0 ? currentPacks.toFixed(0) : null}</td>
                </tr>
                <tr className={TableStyles.attrWhite}>
                    <td>Maletas usadas</td>
                    <td>{Math.abs(parseFloat(packs.toFixed(0)))}</td>
                </tr>
                </tbody>
            </table>
            <button className={TableStyles.buttonReset} onClick={resetAttributes}>Resetar simulação</button>
            <select value={speedChoice} onChange={(e) => handleSpeedChange(e)}
                    className={TableStyles.inputSpeed}
            >
                <option value="">Velocidade</option>
                <option value="1">Lento</option>
                <option value="2">Normal</option>
                <option value="3">Rápido</option>
            </select>
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
    setSequence: PropTypes.func.isRequired,
    playerPositions: PropTypes.array.isRequired,
    setPlayerPositions: PropTypes.func.isRequired,
    setCounter: PropTypes.func.isRequired,
    positionsList: PropTypes.array.isRequired,
    setPositionsList: PropTypes.func.isRequired,
    setSeqCount: PropTypes.func.isRequired,
    setCurrentIndex: PropTypes.func.isRequired,
    setPrev: PropTypes.func.isRequired,
    setAdd: PropTypes.func.isRequired,
    setCurrentPacks: PropTypes.func.isRequired,
    currentPacks: PropTypes.number,
    originalPacks: PropTypes.number,
    setOriginalPacks: PropTypes.func.isRequired,
    speedChosen: PropTypes.object,
    speedChoice: PropTypes.number.isRequired,
    setSpeedChoice: PropTypes.func.isRequired,
}