import {useState} from 'react'
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
    Object.keys(aux).forEach((key) => {
        //console.log(key, aux[key]);
        attributes.push(aux[key]);
    });

    /*
    * Object.keys(myObject).forEach((key, index) => {
    myObject[key] *= 2;
        })
    */

    const handleInputChange = (e, index) =>{
        const newVal = [...originalAttributes];
        newVal[index] = Number(e.target.value);
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
    }

    return(
        <div>

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
                            />
                        </td>
                        <td>{attrValues.at(attrIndex)}%</td>
                    </tr>
                ))}
                <tr>
                    <td>Média do jogador</td>
                    <td>{((originalAttributes.reduce((a, b) => {
                        return a + b
                    })) / 15).toFixed(2)}%</td>
                    <td>{((attrValues.reduce((a, b) => {
                        return a + b
                    })) / 15).toFixed(2)}%</td>
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
}