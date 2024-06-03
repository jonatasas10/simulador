import {useEffect, useRef, useState} from "react";
import TableStyles from "./trainings.module.css"
import PropTypes from "prop-types";

function Trainings({attrValues, setAttrValues, attrs, exercises,setPacks, counter, setCounter, sequence,
                    setSequence, playerPositions, currentAvg, setCurrentAvg, add, setAdd, positionsList,
                    seqCount, setSeqCount, currentIndex, setCurrentIndex, prev, setPrev,
                    setCurrentPacks, originalPacks, speedChosen}) {

    const [removeIndex, setRemoveIndex] = useState(0);
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
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handleAttributesOnUpdate = (attr) => {
        let sum = 0;
        let sumTotal = [];

        setAttrValues((newValues) => {
            const updateAttr = exercises[attr];
            const aux = [...newValues];
            const fim = trainingCondition(attr);

            const updatedValues = aux.map((item, index) => {
                if (updateAttr.includes(index) && avg[attr] < 179) {
                    if (fim) {
                        item = item < 340 ? item + 1 : item;
                        sum += 1;
                    } else {
                        item = item < 340 ? item + position[index] : item;
                        sum += position[index];
                    }
                    sumTotal.push(item);
                }
                return item;
            });

            const media = (sumTotal.reduce((acc, val) => acc + val, 0) / sumTotal.length);
            if (media > 179) {
                setAdd(c => c - sum);
                stopInterval();
            }
            setCurrentAvg(media);
            setAdd(sum);
            const train = `${trainsOptions[attr]} = ${attrs[exercises[attr][0]]} = ${sumTotal[0]}`;
            const seqAux = [...sequence];
            if(sumTotal.length > 0){
                if (seqAux.length > 0 && seqAux[seqAux.length-1].includes(trainsOptions[attr])) {
                    seqAux[seqAux.length-1] = train;
                    setSequence(seqAux);
                }
                else {
                    setSequence([...sequence, train]);
                }
            }
            return updatedValues;
        });
    };

    const handleAttributesOnDecrease = (attr) => {
        let sub = 0;
        let subTotal = [];
        const seqAuxSub = [...sequence];

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
                        sub = item < 340 ? sub - 1 : sub;
                    } else {
                        item = item < 340 ? item - position[index] : item;
                        sub = sub - position[index];
                    }
                    subTotal.push(item);
                }
                return item;
            });
            const media = (subTotal.reduce((acc, val) => acc + val, 0) / subTotal.length);
            setCurrentAvg(media - sub/exercises[attr].length);
            setAdd(sub);

            const train = `${trainsOptions[attr]} = ${attrs[exercises[attr][0]]} = ${subTotal[0]}`;

            if (subTotal.length > 0) {
                if (seqAuxSub.length > 0 && seqAuxSub[seqAuxSub.length-1].includes(trainsOptions[attr])) {
                    seqAuxSub[seqAuxSub.length-1] = train;
                    setSequence(seqAuxSub);
                } else {
                    setSequence([...sequence, train]);
                }
            } else {
                if (seqAuxSub.length > 0 && seqAuxSub[seqAuxSub.length-1].includes(trainsOptions[attr])) {
                    setSequence(seqAuxSub);
                }
            }


            return updatedValues;
        });
    }

    const handleMouseDown = (attrIndex, move) => {

        if (move === 'up' && avg[attrIndex] < 180){
            const aux = [...seqCount];
            if(attrIndex !== currentIndex[0]){
                setPrev([...prev, attrIndex])
                setCounter(0);
                setRemoveIndex(aux.length);
                aux.push(0);
            }
            setSeqCount(aux);

            setCurrentIndex([attrIndex, move]);
            setCounter(c => c + 1);

            handleAttributesOnUpdate(attrIndex);
            intervalRef.current = setInterval(() => {
                setCounter(c => c + 1);
                handleAttributesOnUpdate(attrIndex)
            }, speedChosen);
        }
        else{
            if (move === 'down' && sequence.length > 0 && sequence[sequence.length-1].includes(trainsOptions[attrIndex]) && seqCount[seqCount.length - 1] > 0 && attrIndex === currentIndex[0]){
                setCurrentIndex([attrIndex, move]);
                setCounter(c => c - 1);

                handleAttributesOnDecrease(attrIndex);
                intervalRef.current = setInterval(() => {
                    setCounter(c => c - 1);
                    handleAttributesOnDecrease(attrIndex)
                }, speedChosen);
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
        let cost = 0;
        if (currentAvg <= 80){
            cost = add / 5;
            setPacks(c => c + cost);
        }
        else if (80 < currentAvg && currentAvg <= 100){
            cost = add / 4;
            setPacks(c => c + cost);
        }
        else if (100 < currentAvg && currentAvg <= 120){
            cost = add / 3;
            setPacks(c => c + cost);
        }
        else if (120 < currentAvg && currentAvg <= 140){
            cost = add / 2;
            setPacks(c => c + cost);
        }
        else{
            cost = add
            setPacks(c => c + cost);
        }
    }, [add, currentAvg, setPacks, originalPacks, setCurrentPacks]);

    useEffect(() => {
        const handleAverageChange = (updatedValues) => {
            const newVal = [...avg];
            const aux = [...updatedValues];
            exercises.map((item, index) => {
                let sum = 0;
                if (positionsList[0] === 'GK' || index !== 12){
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
        const handleSeqCountChange = (removeIndex, counter) => {
            const aux = [...seqCount];
            if (aux.length > 0) {
                aux[removeIndex] = counter;
            }

            if (JSON.stringify(aux) !== JSON.stringify(seqCount)) {
                setSeqCount(aux);
            }
        };
        handleAverageChange(attrValues);

        if (counter === 0 ) {
            stopInterval();
        }

        handleSeqCountChange(removeIndex,counter);

        if (currentIndex[1] === 'down' && seqCount.length > 0 && seqCount[seqCount.length-1] === 0) {
            const sequenceAux = [...sequence];
            const seqAux = [...seqCount]
            const delCurrent = [...prev]
            sequenceAux.pop()
            delCurrent.pop()

            if (delCurrent.length > 0){
                setCurrentIndex([delCurrent[delCurrent.length-1], 'down'])
                setRemoveIndex(seqCount.length-2);
            }
            else{
                setCurrentIndex([])
            }

            setPrev(delCurrent);
            seqAux.pop();
            if (JSON.stringify(seqAux) !== JSON.stringify(seqCount)) {
                setSeqCount(seqAux);
            }
            setSequence(sequenceAux);

            if(seqAux[seqAux.length-1] !== null && seqAux.length > 0 ){
                setCounter(seqAux[seqAux.length-1])
            }
            else{
                setCounter(0)
            }
        }
        // // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attrValues, exercises, counter, prev, currentIndex, sequence, setSequence, removeIndex, avg, setCounter, seqCount, setSeqCount, positionsList, setCurrentIndex, setPrev]);

    return(
        <div className={TableStyles['train-container']}>
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
                {sequence.length > 0 && <h4>Sequência de treinos</h4>}
                {sequence.map((item, index) => (<li key={index}>{`${index + 1}) ${item}`}</li>))}
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
    packs: PropTypes.number.isRequired,
    originalAttributes: PropTypes.array.isRequired,
    sequence: PropTypes.array.isRequired,
    setSequence: PropTypes.func.isRequired,
    playerPositions: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    setCounter: PropTypes.func.isRequired,
    currentAvg: PropTypes.number.isRequired,
    setCurrentAvg: PropTypes.func.isRequired,
    add: PropTypes.number.isRequired,
    setAdd: PropTypes.func.isRequired,
    positionsList: PropTypes.array.isRequired,
    seqCount: PropTypes.array.isRequired,
    setSeqCount: PropTypes.func.isRequired,
    currentIndex: PropTypes.array.isRequired,
    setCurrentIndex: PropTypes.func.isRequired,
    prev: PropTypes.array.isRequired,
    setPrev: PropTypes.func.isRequired,
    setCurrentPacks: PropTypes.func.isRequired,
    currentPacks: PropTypes.number,
    originalPacks: PropTypes.number,
    setOriginalPacks: PropTypes.func.isRequired,
    speedChosen: PropTypes.number,
}
