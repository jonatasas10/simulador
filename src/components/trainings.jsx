import {useEffect, useRef, useState} from "react";
import TableStyles from "./trainings.module.css"
import PropTypes from "prop-types";


function Trainings({attrValues, setAttrValues, attrs, exercises, setPacks, originalAttributes, sequencia, setSequencia}) {
    /*const attrValues = props.attrValues;
    const setAttrValues = props.setAttrValues;*/
    const intervalRef = useRef(null);
    const trainsOptions = [
        'passe, vá, dispare',
        'marcar homem a homem',
        'jogada ensaiada',
        'técnica de chute',
        'drible de slalom',
        'jogo na ponta',
        'contra ataque rápido',
        'análise de vídeo',
        'cabeçada',
        'uma linha de defesa',
        'parar o atacante',
        'cruzamento da defesa',
        'treino de goleiro',
        'pressione o play',
        'controle de bola',
        'jogo de bobinho',
        'matada de bola',
        'virada de jogo',
        'posicionamento',
        'passes para o chute',
        'entradas',
        'aquecimento',
        'alongamento',
        'carioca com escadas',
        'corrida longa',
        'corrida de ir e vir',
        'corrida de obstáculo',
        'academia',
        'arrancada'

    ];

    const info = ['Exercício', 'Brancos', 'Cinzas', 'Média', 'Treinar'];

    const DMC = [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 2];

    const brancos = exercises.map((item) => {
        return(item.filter(attr => DMC[attr] === 2).map(attr => attrs[attr]).join(', '));
    });
    const cinzas = exercises.map((item) => {
        return(item.filter(attr => DMC[attr] === 1).map(attr => attrs[attr]).join(', '));
    });
    const [avg, setAvg] = useState(Array(29).fill(0));

    const [gains, setGains] = useState(0);
    //const [packs, setPacks] = useState(0);

    const trainingCondition = (exercise) => {
        const updateAttr = exercises[exercise];
        let status = true;

        for(let i = 0; i < updateAttr.length; i++) {
            let item = updateAttr[i];
            if (DMC[item] === 1) {
                status = false;
                break;
            }
        }
        return status;
    };

    const checkStopCondition = () => {
        // Replace this with your actual logic to determine if the interval should stop
        return Math.random() > 0.8; // Example condition, 20% chance to stop
    };
    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
    const handleAttributesOnUpdate = (attr) => {

        let soma = 0;
        let somaTotal = [];

        /*const currentAvg = () => {
            const ex = exercises[attr];
            const x = attrValues.filter((_, index) => {
                return ex.includes(index);
            }).reduce((acc, curr) => {acc += curr; return acc;}, 0);
            //console.log(ex, "resultado = " , x);
            return x / ex.length;
        }*/

        //else{console.log("continue = ", avg[attr]) ; currentAvg()}
        setAttrValues((newValues) => {
            const updateAttr = exercises[attr];
            const aux = [...newValues];
            const fim = trainingCondition(attr);
           // console.log("Fim = ", fim);
            if(fim){
                return aux.map((item, index) => {
                    console.log("Subida ", avg[attr])
                    if (updateAttr.includes(index) && avg[attr] < 179){
                        item = item < 340 ? item + 1 : item;
                        soma = soma + 1;
                        somaTotal.push(item);
                        return item;
                    }
                    return item;
                });
            }
            else{
                return aux.map((item, index) => {
                    console.log("Subida ", avg[attr])
                    if (updateAttr.includes(index) && avg[attr] < 179){
                        item = item < 340 ? item + DMC[index] : item;
                        soma = soma + DMC[index];
                        somaTotal.push(item);
                        return item;
                    }
                    return item;
                });
            }
        });
        const newExAvg = somaTotal.reduce((acc, val) => {acc += val; return acc; },0) / somaTotal.length;
        const media = somaTotal.reduce((acc, val) => {acc += val; return acc; },0) / somaTotal.length;
        if (media >= 179) {
            console.log("signal sent")
            stopInterval();
        }
        if (newExAvg <= 80){
            setPacks(c => c + soma / 5);
        }
        else if (80 < newExAvg && newExAvg <= 100){
            setPacks(c => c + soma / 4);
        }
        else if (100 < newExAvg && newExAvg <= 120){
            setPacks(c => c + soma / 3);
        }
        else if (120 < newExAvg && newExAvg <= 140){
            setPacks(c => c + soma / 2);
        }
        else{
            setPacks(c => c + soma);
        }

        console.log("EXERCICIO SELECIONADO = ",trainsOptions[attr])
        const train = `${trainsOptions[attr]} = ${attrs[exercises[attr][0]]} = ${somaTotal[0]}`;
        const seqAux = [...sequencia];
        if (seqAux.length > 0 && seqAux[seqAux.length-1].includes(trainsOptions[attr])) {
            seqAux[seqAux.length-1] = train;
            setSequencia(seqAux);
        }
        else{
            setSequencia([...sequencia, train]);
        }

        //console.log(sequencia, "tam", sequencia.length);
        //console.log("Executou increase, media = ", avg[attr], somaTotal, newExAvg);
        //console.log(trainingCondition(attr));
        console.log("Terminou increase", soma);
    };

    const handleAttributesOnDecrease = (attr) => {
        let subtracao = 0;
        let subtracaoTotal = [];
        const seqAuxSub = [...sequencia];
        if (seqAuxSub.length > 0 && !seqAuxSub[seqAuxSub.length-1].includes(trainsOptions[attr])){
            return;
        }
        setAttrValues((newValues) => {
            const updateAttr = exercises[attr];
            const aux = [...newValues];
            console.log("Executou");
            const fim = trainingCondition(attr);
            if(fim){
                return aux.map((item, index) => {
                    console.log("ATUAL = ", item, "ORIGINAL = ", originalAttributes[index])
                    if (updateAttr.includes(index) && item > originalAttributes[index]){
                        item = item < 340 ? item - 1 : item;
                        subtracao = item < 340 ? subtracao - 1 : subtracao;
                        subtracaoTotal.push(item);
                        return item;
                    }
                    return item;
                });
            }
            else{
                return aux.map((item, index) => {
                    if (updateAttr.includes(index)  && item > originalAttributes[index]){
                        item =  item - DMC[index];
                        subtracao =  subtracao - DMC[index];
                        subtracaoTotal.push(item);
                        return item;
                    }
                    return item;
                });
            }

           /* if(trainingCondition(attr)){
                return aux.map((item, index) => {
                    const updatedValues = updateAttr.includes(index) ? item - 1 : item
                    subtracao = updateAttr.includes(index) ? subtracao - 1 : subtracao;
                    //updateAttr[index] ? console.log(item, index, soma) : null;
                    return updatedValues;
                });
            }
            else{
                return aux.map((item, index) => {
                    const updatedValues = updateAttr.includes(index) ? item - DMC[index] : item
                    subtracao = updateAttr.includes(index) ? subtracao - DMC[index] : subtracao;
                    //updateAttr[index] ? console.log(item, index, soma) : null;
                    return updatedValues;
                });
            }*/
        });
        const train = `${trainsOptions[attr]} = ${attrs[exercises[attr][0]]} = ${subtracaoTotal[0]}`;

        if (subtracaoTotal.length > 0) {
            if (seqAuxSub.length > 0 && seqAuxSub[seqAuxSub.length-1].includes(trainsOptions[attr])) {
                seqAuxSub[seqAuxSub.length-1] = train;
                setSequencia(seqAuxSub);
            }
            else{
                setSequencia([...sequencia, train]);
            }
        }
        else{
            if (seqAuxSub.length > 0 && seqAuxSub[seqAuxSub.length-1].includes(trainsOptions[attr])) {
                seqAuxSub.pop();
                setSequencia(seqAuxSub);
            }
            //setSequencia(seqAuxSub);
        }

        const newExAvg = subtracaoTotal.reduce((acc, val) => {acc += val; return acc; },0) / subtracaoTotal.length;

        if (newExAvg < 80){
            setPacks(c => c + subtracao / 5);
        }
        else if (80 <= newExAvg && newExAvg < 100){
            setPacks(c => c + subtracao / 4);
        }
        else if (100 <= newExAvg && newExAvg < 120){
            setPacks(c => c + subtracao / 3);
        }
        else if (120 <= newExAvg && newExAvg < 140){
            setPacks(c => c + subtracao / 2);
        }
        else{
            setPacks(c => c + subtracao);
        }
        console.log("Executou increase, media = ", avg[attr], subtracao, newExAvg);
    }
    const handleMouseDown = (attrIndex, move) => {

        if (move === 'up' && avg[attrIndex] < 180){
            handleAttributesOnUpdate(attrIndex); // Call once immediately
            intervalRef.current = setInterval(() => handleAttributesOnUpdate(attrIndex), 120);
        }
        else{
            if (move === 'down'){
                handleAttributesOnDecrease(attrIndex); // Call once immediately
                intervalRef.current = setInterval(() => handleAttributesOnDecrease(attrIndex), 120);
            }

        }
    };

    const handleMouseUp = () => {
        clearInterval(intervalRef.current);
    };

    const handleMouseLeave = () => {
        clearInterval(intervalRef.current);
    };

    useEffect(() => {
        const handleAverageChange = (updatedValues) => {
        const newVal = [...avg];
        const aux = [...updatedValues];
        exercises.map((item, index) => {let sum = 0;
            if (index !== 12){
                for (let key in item){
                    //console.log(`Valor = ${aux[item[key]]} INDEX = ${index}`)
                    sum += aux[item[key]];
                }
            }
                //console.log(sum, "indice" ,index, "tam", item.length, " = ", sum / item.length, updatedValues[index], aux[index])
            const avgExercise = sum / item.length;
            //console.log(avgExercise);
            newVal[index] = parseFloat(avgExercise.toFixed(2));
        })
            setAvg(newVal);
        };
        handleAverageChange(attrValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attrValues, exercises]);

    return(<div className={TableStyles['train-container']}>
        <table className={TableStyles.table}>
            <thead>
            <tr>
                {info.map((attribute, index) => (
                    <th key={index}>{attribute}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {trainsOptions.map((attribute, attrIndex) => (
                <tr key={attrIndex}>
                    {brancos[attrIndex].length > 0 || cinzas[attrIndex].length > 0?
                        <>
                            <td>{attribute.charAt(0).toUpperCase() + attribute.slice(1)}</td>
                            <td>{brancos[attrIndex]}</td>
                            <td>{cinzas[attrIndex]}</td>
                            <td>{avg[attrIndex]}%</td>
                            <td>
                                <div className={TableStyles.upDownBtn}>
                                    <button onMouseDown={() => handleMouseDown(attrIndex, 'up')}

                                            onMouseUp={handleMouseUp}
                                            onMouseLeave={handleMouseLeave}
                                    >
                                        {<i className="fa-solid fa-arrow-up"></i>}
                                    </button>

                                    <button onMouseDown={() => handleMouseDown(attrIndex, 'down')}
                                            onMouseUp={handleMouseUp}
                                            onMouseLeave={handleMouseLeave}
                                    >{<i
                                        className="fa-solid fa-arrow-down"></i>}</button>
                                </div>

                            </td>
                        </>
                        : null
                    }

                </tr>
            ))}

            </tbody>
        </table>

        <ul className={TableStyles.exercises}>
            {sequencia.length > 0 && <h4>Sequência de treinos</h4>}
            {sequencia.map((item, index) => (<li key={index}>{`${index + 1}) ${item}`}</li>))}
        </ul>

    </div>);
}

export default Trainings;

Trainings.propTypes = {
    exercises: PropTypes.array.isRequired,
    attrs: PropTypes.object.isRequired,
    attrValues: PropTypes.array.isRequired,
    setAttrValues: PropTypes.func.isRequired,
    setPacks: PropTypes.func.isRequired,
    originalAttributes: PropTypes.array.isRequired,
    sequencia: PropTypes.array.isRequired,
    setSequencia: PropTypes.func.isRequired,
}