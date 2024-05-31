import Attributes from "./components/attributes.jsx";
import Trainings from "./components/trainings.jsx";
import './App.css'
import {useState} from "react";

function App() {
    const [attrValues, setAttrValues] = useState(Array(15).fill(100));
    const [originalAttributes, setOriginAttributes] = useState(Array(15).fill(100));
    const [reset, setReset] = useState(true);
    const [counter, setCounter] = useState(0);

    const attributes = {
        0: 'corte',
        1: 'marcaçao',
        2: 'posicionamento',
        3: 'cabecada',
        4: 'coragem',
        5: 'passe',
        6: 'drible',
        7: 'cruzamento',
        8: 'chute',
        9: 'finalizacao',
        10: 'condicionamento',
        11: 'forca',
        12: 'agressividade',
        13: 'velocidade',
        14: 'criatividade'
    };
    const attributesGK = [{
        0: 'reflexos',
        1: 'agilidade',
        2: 'antecipação',
        3: 'sair na bola',
        4: 'comunicação',
        5: 'arremesso',
        6: 'chutar',
        7: 'espalmar',
        8: 'jogo aéreo',
        9: 'concentração',
        10: 'condicionamento',
        11: 'força',
        12: 'agressividade',
        13: 'velocidade',
        14: 'criatividade'
    }]
    const trainsOptions = [{
        1: 'passe, vá, dispare',
        2: 'marcar homem a homem',
        3: 'jogada ensaiada',
        4: 'técnica de chute',
        5: 'drible de slalom',
        6: 'jogo na ponta',
        7: 'contra ataque rápido',
        8: 'análise de vídeo',
        9: 'cabeçada',
        10: 'uma linha de defesa',
        11: 'parar o atacante',
        12: 'cruzamento da defesa',
        13: 'treino de goleiro',
        14: 'pressione o play',
        15: 'controle de bola',
        16: 'jogo de bobinho',
        17: 'matada de bola',
        18: 'virada de jogo',
        19: 'posicionamento',
        20: 'passes para o chute',
        21: 'entradas',
        22: 'aquecimento',
        23: 'alongamento',
        24: 'carioca com escadas',
        25: 'corrida longa',
        26: 'corrida de ir e vir',
        27: 'corrida de obstáculo',
        28: 'academia',
        29: 'arrancada'
    }];
    const trainsAttrs = {
        // Posição 1 = Jogador de linha; Posição 2 = GK
        1: [[5, 8, 13], [2, 13]],
        2: [[0, 6, 9], [2, 3]],
        3: [[1, 3, 7, 8], [3]],
        4: [[8, 9, 11], [0, 1, 11]],
        5: [[5, 6, 10, 13], [10, 13]],
        6: [[3, 7, 8, 9], [7]],
        7: [[5, 7, 9, 14], [4, 14]],
        8: [[2, 4, 14], [4, 14]],
        9: [[2, 3, 5, 14], [14]],
        10: [[1, 2], [4, 9]],
        11: [[0, 1, 4, 6, 11], [11]],
        12: [[1, 3, 4, 7], [8]],
        13: [[], [0, 1, 5, 6, 8]],
        14: [[0, 1, 2, 4, 12], [12]],
        15: [[3, 6, 14], [9, 14]],
        16: [[0, 2, 5, 10, 12], [10, 12]],
        17: [[5, 6, 10], [5, 10]],
        18: [[2, 5, 7, 13, 14], [4, 13, 14]],
        19: [[2, 10, 13], [8, 10, 13]],
        20: [[2, 5, 9, 14], [2, 14]],
        21: [[1, 4, 6, 11, 12], [11, 12]],
        22: [[3, 10, 12], [0, 10, 12]],
        23: [[10, 11, 13], [1, 10, 11, 13]],
        24: [[12, 13], [1, 9, 12, 13]],
        25: [[10, 13], [9, 10, 13]],
        26: [[4, 11, 13], [1, 11, 13]],
        27: [[4, 12, 13], [6, 12, 13]],
        28: [[10, 11], [5, 6, 10, 11]],
        29: [[6, 10, 13], [3, 10, 13]]
    };

    //console.log(trainsAttrs[1][0])
    const exercises = []
    for (let i = 1; i <= 29; i++) {
        exercises.push(trainsAttrs[i][0]);
    }
    const [packs, setPacks] = useState(0);
    const [sequencia, setSequencia] = useState([]);
    const [playerPositions, setPlayerPositions] = useState(Array(15).fill(1));

    return (
        <>
            <h1 style={{textAlign: "center"}}>Simulador</h1>
            <div className="table-container">
                <Attributes original={originalAttributes}
                            setOriginal={setOriginAttributes}
                            attrs={attributes}
                            attrValues={attrValues}
                            setAttrValues={setAttrValues}
                            reset={reset}
                            setReset={setReset}
                            packs={packs}
                            setPacks={setPacks}
                            setSequencia={setSequencia}
                            playerPositions={playerPositions}
                            setPlayerPositions={setPlayerPositions}
                            counter={counter}
                            setCounter={setCounter}
                />
                <Trainings exercises={exercises}
                           attrs={attributes}
                           attrValues={attrValues}
                           setAttrValues={setAttrValues}
                           setPacks={setPacks}
                           originalAttributes={originalAttributes}
                           sequencia={sequencia}
                           setSequencia={setSequencia}
                           packs={packs}
                           playerPositions={playerPositions}
                           counter={counter}
                           setCounter={setCounter}
                />
            </div>

        </>
    )
}

export default App
