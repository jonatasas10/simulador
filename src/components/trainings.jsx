import {useEffect, useRef, useState} from "react";
import TableStyles from "./trainings.module.css"
import PropTypes, {array} from "prop-types";
/*
import {i} from "vite/dist/node/types.d-aGj9QkWt.js";
*/


function Trainings({attrValues, setAttrValues, attrs, exercises, setPacks, counter, setCounter, sequencia, setSequencia, playerPositions}) {


    const [test, setTest] = useState(0);
    const [currentAvg, setCurrentAvg] = useState(0);
    const [add, setAdd] = useState(0);
    const [prev, setPrev] = useState([]);
    const intervalRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState([]);
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
    const [seqCount, setSeqCount] = useState([]);

    const info = ['Exercício', 'Brancos', 'Cinzas', 'Média', 'Treinar'];

    const position = [...playerPositions];


    const brancos = exercises.map((item) => {
        return(item.filter(attr => position[attr] === 2).map(attr => attrs[attr]).join(', '));
    });
    const cinzas = exercises.map((item) => {
        return(item.filter(attr => position[attr] === 1).map(attr => attrs[attr]).join(', '));
    });
    const [avg, setAvg] = useState(Array(29).fill(0));

    const trainingCondition = (exercise) => {
        const updateAttr = exercises[exercise];
        let status = true;

        for(let i = 0; i < updateAttr.length; i++) {
            let item = updateAttr[i];
            if (position[item] === 1) {
                status = false;
                break;
            }
        }
        return status;
    };

    const stopInterval = () => {
        if (intervalRef.current) {
            console.log("parado")
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
    const handleAttributesOnUpdate = (attr) => {

        let soma = 0;
        let somaTotal = [];

        setAttrValues((newValues) => {
            const updateAttr = exercises[attr];
            const aux = [...newValues];
            const fim = trainingCondition(attr);
            console.log(aux);
            console.log("COND", attr, updateAttr);

            const updatedValues = aux.map((item, index) => {
                if (updateAttr.includes(index) && avg[attr] < 179) {
                    console.log("SET: ", updateAttr, index);
                    if (fim) {
                        item = item < 340 ? item + 1 : item;
                        soma += 1;
                    } else {
                        item = item < 340 ? item + position[index] : item;
                        soma += position[index];
                    }
                    somaTotal.push(item);
                }
                return item;
            });

            // Calculate newExAvg and media within this callback
            const newExAvg = somaTotal.reduce((acc, val) => acc + val, 0) / somaTotal.length;
            const media = somaTotal.reduce((acc, val) => acc + val, 0) / somaTotal.length;

            console.log("Updated somaTotal:", somaTotal);
            console.log("New Exercise Average:", newExAvg);
            console.log("Media:", media);
            setCurrentAvg(newExAvg);
            setAdd(soma);

            if (media >= 179) {
                stopInterval();
            }

            console.log("Resultado",somaTotal, "atr", attr)
            const train = `${trainsOptions[attr]} = ${attrs[exercises[attr][0]]} = ${somaTotal[0]}`;
            const seqAux = [...sequencia];
            if (seqAux.length > 0 && seqAux[seqAux.length-1].includes(trainsOptions[attr])) {
                seqAux[seqAux.length-1] = train;
                setSequencia(seqAux);
            }
            else{
                setSequencia([...sequencia, train]);
            }

            return updatedValues;
        });


    };

    const handleAttributesOnDecrease = (attr) => {
        let subtracao = 0;
        let subtracaoTotal = [];
        const seqAuxSub = [...sequencia];

        if (seqAuxSub.length > 0 && !seqAuxSub[seqAuxSub.length-1].includes(trainsOptions[attr]) ){
            return;
        }

        setAttrValues((newValues) => {
            const updateAttr = exercises[attr];
            const aux = [...newValues];
            const fim = trainingCondition(attr);

            const updatedValues = aux.map((item, index) => {
                if (updateAttr.includes(index)) {
                    if (fim) {
                        item = item < 340 ? item - 1 : item;
                        subtracao = item < 340 ? subtracao - 1 : subtracao;
                    } else {
                        item = item < 340 ? item - position[index] : item;
                        subtracao = subtracao - position[index];
                    }
                    subtracaoTotal.push(item);
                }
                return item;
            });

            const train = `${trainsOptions[attr]} = ${attrs[exercises[attr][0]]} = ${subtracaoTotal[0]}`;

            if (subtracaoTotal.length > 0) {
                if (seqAuxSub.length > 0 && seqAuxSub[seqAuxSub.length-1].includes(trainsOptions[attr])) {
                    seqAuxSub[seqAuxSub.length-1] = train;
                    setSequencia(seqAuxSub);
                } else {
                    setSequencia([...sequencia, train]);
                }
            } else {
                if (seqAuxSub.length > 0 && seqAuxSub[seqAuxSub.length-1].includes(trainsOptions[attr])) {
                    setSequencia(seqAuxSub);
                }
            }

            const newExAvg = subtracaoTotal.reduce((acc, val) => acc + val, 0) / subtracaoTotal.length;
            console.log("New Exercise Average:", newExAvg);
            setCurrentAvg(newExAvg+0.1);
            setAdd(subtracao);

            return updatedValues;
        });
    }

    const handleMouseDown = (attrIndex, move) => {

        console.log("CUrrent index", attrIndex, currentIndex, counter)

        if (move === 'up' && avg[attrIndex] < 180){
            const aux = [...seqCount];

            if(attrIndex !== currentIndex[0]){
                setPrev([...prev, attrIndex])
                setCounter(0);
                setTest(aux.length);
                aux.push(0);
            }
            setSeqCount(aux);

            setCurrentIndex([attrIndex, move]);
            setCounter(c => c + 1);

            handleAttributesOnUpdate(attrIndex); // Call once immediately
            intervalRef.current = setInterval(() => {
                setCounter(c => c + 1);
                handleAttributesOnUpdate(attrIndex)
            }, 120);
        }
        else{
           // console.log(sequencia.length > 0, sequencia[sequencia.length-1].includes(trainsOptions[attrIndex]), seqCount[seqCount.length - 1] > 0, attrIndex === currentIndex[0], attrIndex,currentIndex[0] )
            if (move === 'down' && sequencia.length > 0 && sequencia[sequencia.length-1].includes(trainsOptions[attrIndex]) && seqCount[seqCount.length - 1] > 0 && attrIndex === currentIndex[0]){

                setCurrentIndex([attrIndex, move]);
                //setCounter(counterList[attrIndex]);
                setCounter(c => c - 1);

                handleAttributesOnDecrease(attrIndex); // Call once immediately
                intervalRef.current = setInterval(() => {
                    setCounter(c => c - 1);
                    handleAttributesOnDecrease(attrIndex)
                }, 120);
            }
            else{
               console.log("Desbloquear ", seqCount)
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
        console.log("MEDIA ATUAL ", currentAvg, "GANHO ", add)
        if (currentAvg <= 80){

            setPacks(c => c + add / 5);
        }
        else if (80 < currentAvg && currentAvg <= 100){
            setPacks(c => c + add / 4);
        }
        else if (100 < currentAvg && currentAvg <= 120){
            setPacks(c => c + add / 3);
        }
        else if (120 < currentAvg && currentAvg <= 140){
            setPacks(c => c + add / 2);
        }
        else{
            setPacks(c => c + add);
        }
    }, [add, currentAvg, setPacks]);


    useEffect(() => {

        const handleAverageChange = (updatedValues) => {
            const newVal = [...avg];
            const aux = [...updatedValues];
            exercises.map((item, index) => {
                let sum = 0;
                if (index !== 12){
                    for (let key in item){
                        sum += aux[item[key]];
                    }
                }
                const avgExercise = sum / item.length;
                newVal[index] = parseFloat(avgExercise.toFixed(0));
            })
            if (JSON.stringify(newVal) !== JSON.stringify(avg)) {
                setAvg(newVal);
            }
        };
        const handleSeqCountChange = (test, counter) => {
            const aux = [...seqCount];
            if (aux.length > 0) {
                aux[test] = counter;
            }

            /*if (JSON.stringify(aux) !== JSON.stringify(seqCount))*/ {
                setSeqCount(aux);
            }
        };
        handleAverageChange(attrValues);

        if (counter === 0 ) {
            stopInterval();
            console.log("Interrompido")
        }

        handleSeqCountChange(test,counter);

        if (currentIndex[1] === 'down' && seqCount.length > 0 && seqCount[seqCount.length-1] === 0) {
            console.log("Rodou apos")
            const sequenciaAux = [...sequencia];
            const seqAux = [...seqCount]
            const delCurrent = [...prev]
            sequenciaAux.pop()
            delCurrent.pop()

            if (delCurrent.length > 0){
                setCurrentIndex([delCurrent[delCurrent.length-1], 'down'])
                setTest(delCurrent[delCurrent.length-1]);
            }
            else{
                setCurrentIndex([])
            }
            setPrev(delCurrent);
            seqAux.pop();
            if (JSON.stringify(seqAux) !== JSON.stringify(seqCount)) {
                setSeqCount(seqAux);
            }
            setSequencia(sequenciaAux);
            setCounter(seqAux[seqAux.length-1]);
        }

        // // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attrValues, exercises, counter, prev, currentIndex, sequencia, setSequencia, test, avg]);

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
                                    >
                                        {<i className="fa-solid fa-arrow-down"></i>}
                                    </button>
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
    playerPositions: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    setCounter: PropTypes.func.isRequired,
}