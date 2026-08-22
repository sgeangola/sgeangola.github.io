// =====================================================
// PAINEL-PROFESSOR.JS
// SGE ANGOLA
// Seleção de Turma → Disciplina → Trimestre
// =====================================================

alert("PAINEL PROFESSOR CARREGADO ✅");

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


// =====================================================
// PROFESSOR LOGADO
// =====================================================

const dadosProfessor =
    localStorage.getItem("professorLogado");

if (!dadosProfessor) {

    alert(
        "Sessão do professor não encontrada."
    );

    window.location.href =
        "login-professor.html";

    throw new Error(
        "Professor não autenticado."
    );
}


let professor;

try {

    professor =
        JSON.parse(dadosProfessor);

}
catch (erro) {

    console.error(
        "Erro ao ler professorLogado:",
        erro
    );

    localStorage.removeItem(
        "professorLogado"
    );

    alert(
        "A sessão do professor está inválida. Faça login novamente."
    );

    window.location.href =
        "login-professor.html";

    throw erro;
}


console.log(
    "👨‍🏫 PROFESSOR LOGADO:",
    professor
);


// =====================================================
// ELEMENTOS
// =====================================================

const nomeProfessor =
    document.getElementById(
        "nomeProfessor"
    );

const selectTurma =
    document.getElementById(
        "selectTurma"
    );

const selectDisciplina =
    document.getElementById(
        "selectDisciplina"
    );

const selectTrimestre =
    document.getElementById(
        "selectTrimestre"
    );

const abrirMiniPauta =
    document.getElementById(
        "abrirMiniPauta"
    );


// =====================================================
// VERIFICAR ELEMENTOS
// =====================================================

if (!selectTurma) {

    alert(
        "Erro: selectTurma não encontrado no HTML."
    );

    throw new Error(
        "selectTurma inexistente."
    );
}


if (!selectDisciplina) {

    alert(
        "Erro: selectDisciplina não encontrado no HTML."
    );

    throw new Error(
        "selectDisciplina inexistente."
    );
}


if (!selectTrimestre) {

    alert(
        "Erro: selectTrimestre não encontrado no HTML."
    );

    throw new Error(
        "selectTrimestre inexistente."
    );
}


// =====================================================
// NOME DO PROFESSOR
// =====================================================

if (nomeProfessor) {

    nomeProfessor.textContent =
        "👨‍🏫 " +
        (
            professor.nome ||
            "Professor"
        );

}


// =====================================================
// ESCOLA DO PROFESSOR
// =====================================================

let escolaId =
    sessionStorage.getItem(
        "escolaId"
    ) ||
    localStorage.getItem(
        "escolaId"
    ) ||
    professor.escolaId ||
    "";

escolaId =
    String(escolaId).trim();


console.log(
    "🏫 ESCOLA DO PROFESSOR:",
    escolaId
);


if (!escolaId) {

    alert(
        "A escola do professor não foi identificada.\n\nFaça login novamente."
    );

    throw new Error(
        "escolaId inexistente."
    );
}


// Garantir sessão

sessionStorage.setItem(
    "escolaId",
    escolaId
);

localStorage.setItem(
    "escolaId",
    escolaId
);


// =====================================================
// ATRIBUIÇÕES DO PROFESSOR
// =====================================================

const atribuicoes =
    Array.isArray(
        professor.atribuicoes
    )
        ? professor.atribuicoes
        : [];


console.log(
    "📚 ATRIBUIÇÕES DO PROFESSOR:",
    atribuicoes
);


if (
    atribuicoes.length === 0
) {

    alert(
        "Este professor não possui turmas ou disciplinas atribuídas."
    );

}


// =====================================================
// MAPA DAS TURMAS
// =====================================================

const mapaTurmas =
    new Map();


// =====================================================
// CARREGAR TURMAS REAIS DO FIRESTORE
// =====================================================

async function carregarTurmasFirestore() {

    console.log(
        "🔎 A procurar turmas reais no Firestore..."
    );


    const turmasRef =
        collection(
            db,
            "turmas"
        );


    const snapshot =
        await getDocs(
            turmasRef
        );


    console.log(
        "📊 Total de turmas encontradas:",
        snapshot.size
    );


    snapshot.forEach(
        documento => {

            const dados =
                documento.data();


            const turmaId =
                documento.id;


            const turmaEscolaId =
                String(
                    dados.escolaId || ""
                ).trim();


            // ---------------------------------------------
            // IGNORAR TURMAS DE OUTRAS ESCOLAS
            // ---------------------------------------------

            if (
                turmaEscolaId !== escolaId
            ) {

                return;

            }


            const turmaNome =
                String(
                    dados.nome || ""
                ).trim();


            const classe =
                String(
                    dados.classe || ""
                ).trim();


            const ensino =
                String(
                    dados.ensino || ""
                ).trim();


            mapaTurmas.set(
                turmaId,
                {

                    id: turmaId,

                    nome:
                        turmaNome ||
                        classe ||
                        turmaId,

                    classe,

                    ensino,

                    escolaId:
                        turmaEscolaId,

                    disciplinas:
                        Array.isArray(
                            dados.disciplinas
                        )
                            ? dados.disciplinas
                            : []

                }
            );

        }
    );


    console.log(
        "🏫 TURMAS REAIS DA ESCOLA:",
        Array.from(
            mapaTurmas.values()
        )
    );

}


// =====================================================
// ENCONTRAR TURMA REAL
// =====================================================

function encontrarTurmaReal(
    atribuicao
) {

    const turmaId =
        String(
            atribuicao.turmaId || ""
        ).trim();


    const turmaNome =
        String(
            atribuicao.turmaNome || ""
        ).trim();


    const classe =
        String(
            atribuicao.classe || ""
        ).trim();


    // =================================================
    // 1. TENTAR PELO ID
    // =================================================

    if (
        turmaId &&
        mapaTurmas.has(turmaId)
    ) {

        return mapaTurmas.get(
            turmaId
        );

    }


    // =================================================
    // 2. TENTAR PELO NOME DA TURMA
    // =================================================

    if (turmaNome) {

        for (
            const turma
            of mapaTurmas.values()
        ) {

            if (
                turma.nome === turmaNome
            ) {

                return turma;

            }

        }

    }


    // =================================================
    // 3. TENTAR PELO NOME + CLASSE
    // =================================================

    if (
        turmaNome &&
        classe
    ) {

        for (
            const turma
            of mapaTurmas.values()
        ) {

            if (
                turma.nome === turmaNome &&
                turma.classe === classe
            ) {

                return turma;

            }

        }

    }


    // =================================================
    // NÃO ENCONTRADA
    // =================================================

    return null;

}


// =====================================================
// CONSTRUIR LISTA DE TURMAS DO PROFESSOR
// =====================================================

function construirTurmasProfessor() {

    selectTurma.innerHTML = `

        <option value="">
            Selecione a turma
        </option>

    `;


    const turmasProfessor =
        new Map();


    atribuicoes.forEach(
        atribuicao => {

            const turmaReal =
                encontrarTurmaReal(
                    atribuicao
                );


            if (!turmaReal) {

                console.warn(
                    "⚠️ Turma da atribuição não encontrada:",
                    atribuicao
                );

                return;

            }


            // Guardar a turma REAL

            if (
                !turmasProfessor.has(
                    turmaReal.id
                )
            ) {

                turmasProfessor.set(
                    turmaReal.id,
                    turmaReal
                );

            }

        }
    );


    // =================================================
    // MOSTRAR TURMAS
    // =================================================

    turmasProfessor.forEach(
        turma => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                turma.id;


            option.textContent =
                turma.classe
                    ? `${turma.nome} - ${turma.classe}`
                    : turma.nome;


            selectTurma.appendChild(
                option
            );

        }
    );


    console.log(
        "👨‍🏫 TURMAS DISPONÍVEIS:",
        Array.from(
            turmasProfessor.values()
        )
    );


    if (
        turmasProfessor.size === 0
    ) {

        selectTurma.innerHTML = `

            <option value="">
                Nenhuma turma atribuída
            </option>

        `;

    }

}


// =====================================================
// OBTER ATRIBUIÇÕES DA TURMA
// =====================================================

function obterAtribuicoesDaTurma(
    turmaId
) {

    return atribuicoes.filter(
        atribuicao => {

            const turmaReal =
                encontrarTurmaReal(
                    atribuicao
                );


            if (!turmaReal) {

                return false;

            }


            return (
                turmaReal.id ===
                turmaId
            );

        }
    );

}


// =====================================================
// CARREGAR DISCIPLINAS
// =====================================================

function carregarDisciplinas(
    turmaId
) {

    selectDisciplina.innerHTML = `

        <option value="">
            Selecione a disciplina
        </option>

    `;


    if (!turmaId) {

        return;

    }


    const turmaReal =
        mapaTurmas.get(
            turmaId
        );


    if (!turmaReal) {

        console.error(
            "❌ Turma real não encontrada:",
            turmaId
        );

        return;

    }


    const disciplinas =
        [];


    // =================================================
    // DISCIPLINAS DAS ATRIBUIÇÕES
    // =================================================

    const atribuicoesTurma =
        obterAtribuicoesDaTurma(
            turmaId
        );


    atribuicoesTurma.forEach(
        atribuicao => {

            const disciplina =
                String(
                    atribuicao.disciplina || ""
                ).trim();


            if (
                disciplina &&
                !disciplinas.includes(
                    disciplina
                )
            ) {

                disciplinas.push(
                    disciplina
                );

            }

        }
    );


    // =================================================
    // SE NÃO HOUVER ATRIBUIÇÃO,
    // NÃO LIBERAR TODAS AS DISCIPLINAS
    // =================================================

    console.log(
        "📚 DISCIPLINAS ATRIBUÍDAS:",
        disciplinas
    );


    disciplinas.forEach(
        disciplina => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                disciplina;


            option.textContent =
                disciplina;


            selectDisciplina.appendChild(
                option
            );

        }
    );


    if (
        disciplinas.length === 0
    ) {

        selectDisciplina.innerHTML = `

            <option value="">
                Nenhuma disciplina atribuída
            </option>

        `;

    }

}


// =====================================================
// TURMA SELECIONADA
// =====================================================

selectTurma.addEventListener(
    "change",
    () => {

        const turmaId =
            selectTurma.value;


        console.log(
            "🏫 TURMA SELECIONADA:",
            turmaId
        );


        carregarDisciplinas(
            turmaId
        );

    }
);


// =====================================================
// ABRIR MINI-PAUTA
// =====================================================

if (abrirMiniPauta) {

    abrirMiniPauta.addEventListener(
        "click",
        async () => {

            const turmaId =
                selectTurma.value;


            const disciplina =
                selectDisciplina.value;


            const trimestre =
                selectTrimestre.value;


            console.log(
                "📋 DADOS PARA MINI-PAUTA:",
                {

                    turmaId,

                    disciplina,

                    trimestre

                }
            );


            // =================================================
            // VALIDAR TURMA
            // =================================================

            if (!turmaId) {

                alert(
                    "Selecione uma turma."
                );

                return;

            }


            // =================================================
            // VALIDAR DISCIPLINA
            // =================================================

            if (!disciplina) {

                alert(
                    "Selecione uma disciplina."
                );

                return;

            }


            // =================================================
            // VALIDAR TRIMESTRE
            // =================================================

            if (!trimestre) {

                alert(
                    "Selecione o trimestre."
                );

                return;

            }


            // =================================================
            // TURMA REAL
            // =================================================

            const turmaReal =
                mapaTurmas.get(
                    turmaId
                );


            if (!turmaReal) {

                alert(
                    "A turma não foi encontrada no Firestore."
                );

                console.error(
                    "❌ turmaId inválido:",
                    turmaId
                );

                return;

            }


            console.log(
                "✅ TURMA REAL:",
                turmaReal
            );


            // =================================================
            // VERIFICAR ATRIBUIÇÃO
            // =================================================

            const atribuicao =
                obterAtribuicoesDaTurma(
                    turmaId
                ).find(
                    item => {

                        const disc =
                            String(
                                item.disciplina || ""
                            ).trim();


                        return (
                            disc ===
                            disciplina
                        );

                    }
                );


            if (!atribuicao) {

                alert(
                    "Esta disciplina não está atribuída a este professor nesta turma."
                );

                console.error(
                    "❌ Atribuição não encontrada:",
                    {

                        turmaId,

                        disciplina,

                        atribuicoes

                    }
                );

                return;

            }


            // =================================================
            // ESCOLA
            // =================================================

            sessionStorage.setItem(
                "escolaId",
                escolaId
            );

            localStorage.setItem(
                "escolaId",
                escolaId
            );


            // =================================================
            // GUARDAR TURMA REAL
            // =================================================

            localStorage.setItem(
                "turmaId",
                turmaReal.id
            );


            localStorage.setItem(
                "turmaNome",
                turmaReal.nome
            );


            // =================================================
            // DISCIPLINA
            // =================================================

            localStorage.setItem(
                "disciplina",
                disciplina
            );


            // =================================================
            // TRIMESTRE
            // =================================================

            localStorage.setItem(
                "trimestre",
                trimestre
            );


            // =================================================
            // ENSINO
            // =================================================

            localStorage.setItem(
                "ensino",
                turmaReal.ensino ||
                professor.ensino ||
                ""
            );


            // =================================================
            // CLASSE
            // =================================================

            localStorage.setItem(
                "classe",
                turmaReal.classe ||
                atribuicao.classe ||
                ""
            );


            // =================================================
            // NORMALIZAR DISCIPLINA
            // =================================================

            const disciplinaNormalizada =
                String(
                    disciplina
                )
                    .replace(
                        /\//g,
                        "-"
                    )
                    .replace(
                        /\s+/g,
                        "_"
                    )
                    .trim();


            // =================================================
            // NORMALIZAR TRIMESTRE
            // =================================================

            const trimestreNormalizado =
                String(
                    trimestre
                )
                    .replace(
                        "º",
                        ""
                    )
                    .replace(
                        "°",
                        ""
                    )
                    .replace(
                        "ª",
                        ""
                    )
                    .replace(
                        " ",
                        ""
                    )
                    .replace(
                        "Trimestre",
                        ""
                    )
                    .trim();


            // =================================================
            // ID DO LANÇAMENTO
            // =================================================

            const idLancamento =
                turmaReal.id +
                "_" +
                disciplinaNormalizada +
                "_" +
                trimestreNormalizado;


            localStorage.setItem(
                "idLancamento",
                idLancamento
            );


            // =================================================
            // DEBUG FINAL
            // =================================================

            console.log(
                "===================================="
            );

            console.log(
                "✅ PREPARANDO MINI-PAUTA"
            );

            console.log(
                "🏫 Escola:",
                escolaId
            );

            console.log(
                "🏫 Turma ID REAL:",
                turmaReal.id
            );

            console.log(
                "🏫 Turma:",
                turmaReal.nome
            );

            console.log(
                "📚 Disciplina:",
                disciplina
            );

            console.log(
                "📅 Trimestre:",
                trimestre
            );

            console.log(
                "🔑 ID lançamento:",
                idLancamento
            );

            console.log(
                "===================================="
            );


            // =================================================
            // ABRIR MINI-PAUTA
            // =================================================

            window.location.href =
                "mini-pauta.html";

        }
    );

}


// =====================================================
// INICIALIZAR
// =====================================================

async function iniciarPainelProfessor() {

    try {

        console.log(
            "🚀 A iniciar Painel do Professor..."
        );


        await carregarTurmasFirestore();


        construirTurmasProfessor();


        console.log(
            "✅ PAINEL PROFESSOR PRONTO."
        );

    }
    catch (erro) {

        console.error(
            "❌ ERRO AO CARREGAR TURMAS:",
            erro
        );


        selectTurma.innerHTML = `

            <option value="">
                Erro ao carregar turmas
            </option>

        `;


        alert(
            "Erro ao carregar as turmas.\n\n" +
            erro.message
        );

    }

}


// =====================================================
// EXECUTAR
// =====================================================

iniciarPainelProfessor();
