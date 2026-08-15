// =====================================================
// NOTAS.JS — ADMINISTRADOR
// SGE
// BLOCO 1/2
//
// Professor → Classe → Turma → Disciplina → Trimestre
// Controle de abertura/fecho pelo Administrador
// Isolamento por escola
// =====================================================

alert("🔥 NOTAS.JS ADMINISTRADOR CARREGADO!");


import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


// =====================================================
// ESCOLA LOGADA
// =====================================================

const escolaId =
    sessionStorage.getItem("escolaId");


if (!escolaId) {

    alert(
        "❌ Escola não identificada.\n\n" +
        "Faça login novamente."
    );

    throw new Error(
        "escolaId não encontrado."
    );

}


// =====================================================
// ELEMENTOS
// =====================================================

const filtroProfessor =
    document.getElementById("filtroProfessor");

const filtroClasse =
    document.getElementById("filtroClasse");

const filtroTurma =
    document.getElementById("filtroTurma");

const filtroDisciplina =
    document.getElementById("filtroDisciplina");

const filtroTrimestre =
    document.getElementById("filtroTrimestre");

const notasLista =
    document.getElementById("notasLista");


// =====================================================
// DADOS
// =====================================================

let professores = [];

let turmas = [];

let professorSelecionado = null;

let atribuicoesSelecionadas = [];


// =====================================================
// ESTADO DOS LANÇAMENTOS
// =====================================================

let estadosLancamentos = {};


// =====================================================
// INICIAR
// =====================================================

async function iniciarNotas() {

    try {

        mostrarMensagem(
            "⏳ A carregar dados da escola..."
        );


        await carregarProfessores();

        await carregarTurmas();


        preencherProfessores();

        prepararFiltros();


        mostrarMensagem(
            "👨‍🏫 Selecione um professor para começar."
        );


        console.log(
            "================================="
        );

        console.log(
            "✅ NOTAS.JS INICIADO"
        );

        console.log(
            "🏫 Escola:",
            escolaId
        );

        console.log(
            "👨‍🏫 Professores:",
            professores.length
        );

        console.log(
            "🏫 Turmas:",
            turmas.length
        );

        console.log(
            "================================="
        );

    }
    catch (erro) {

        console.error(
            "❌ ERRO AO INICIAR NOTAS:",
            erro
        );


        mostrarMensagem(
            "❌ Erro ao carregar os dados."
        );

    }

}


// =====================================================
// CARREGAR PROFESSORES
// =====================================================

async function carregarProfessores() {

    professores = [];


    /*
    IMPORTANTE:

    Cada escola só pode visualizar
    os seus próprios professores.
    */

    const resultado =
        await getDocs(
            query(
                collection(
                    db,
                    "professores"
                ),
                where(
                    "escolaId",
                    "==",
                    escolaId
                )
            )
        );


    resultado.forEach(
        documento => {

            professores.push({

                id:
                    documento.id,

                ...documento.data()

            });

        }
    );


    professores.sort(
        (a, b) =>
            String(
                a.nome || ""
            ).localeCompare(
                String(
                    b.nome || ""
                ),
                "pt"
            )
    );


    console.log(
        "👨‍🏫 PROFESSORES DA ESCOLA:",
        professores
    );

}


// =====================================================
// CARREGAR TURMAS
// =====================================================

async function carregarTurmas() {

    turmas = [];


    /*
    Cada escola vê somente
    as suas turmas.
    */

    const resultado =
        await getDocs(
            query(
                collection(
                    db,
                    "turmas"
                ),
                where(
                    "escolaId",
                    "==",
                    escolaId
                )
            )
        );


    resultado.forEach(
        documento => {

            turmas.push({

                id:
                    documento.id,

                ...documento.data()

            });

        }
    );


    console.log(
        "🏫 TURMAS DA ESCOLA:",
        turmas
    );

}


// =====================================================
// PREENCHER PROFESSORES
// =====================================================

function preencherProfessores() {

    if (!filtroProfessor) {

        console.error(
            "❌ filtroProfessor não encontrado."
        );

        return;

    }


    filtroProfessor.innerHTML = `

        <option value="">
            Selecionar professor
        </option>

    `;


    professores.forEach(
        professor => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                professor.id;


            option.textContent =
                professor.codigo
                    ? `${professor.codigo} — ${professor.nome || "Sem nome"}`
                    : professor.nome ||
                      "Professor sem nome";


            filtroProfessor.appendChild(
                option
            );

        }
    );

}


// =====================================================
// PREPARAR FILTROS
// =====================================================

function prepararFiltros() {

    if (filtroClasse) {

        filtroClasse.innerHTML = `

            <option value="">
                Selecione primeiro o professor
            </option>

        `;

        filtroClasse.disabled = true;

    }


    if (filtroTurma) {

        filtroTurma.innerHTML = `

            <option value="">
                Selecione primeiro a classe
            </option>

        `;

        filtroTurma.disabled = true;

    }


    if (filtroDisciplina) {

        filtroDisciplina.innerHTML = `

            <option value="">
                Selecione primeiro a turma
            </option>

        `;

        filtroDisciplina.disabled = true;

    }


    if (filtroTrimestre) {

        filtroTrimestre.innerHTML = `

            <option value="">
                Selecionar trimestre
            </option>

            <option value="1">
                1.º Trimestre
            </option>

            <option value="2">
                2.º Trimestre
            </option>

            <option value="3">
                3.º Trimestre
            </option>

        `;

    }

}


// =====================================================
// PROFESSOR → CLASSES
// =====================================================

function carregarClassesDoProfessor(
    professorId
) {

    if (!filtroClasse) return;


    filtroClasse.innerHTML = `

        <option value="">
            Selecionar classe
        </option>

    `;


    filtroClasse.disabled = true;


    const professor =
        professores.find(
            item =>
                item.id === professorId
        );


    professorSelecionado =
        professor || null;


    if (!professor) {

        return;

    }


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


    if (!atribuicoes.length) {

        filtroClasse.innerHTML = `

            <option value="">
                Nenhuma classe associada
            </option>

        `;

        return;

    }


    const classes =
        new Map();


    atribuicoes.forEach(
        item => {

            const classe =
                String(
                    item.classe ?? ""
                ).trim();


            if (!classe) return;


            const chave =
                classe.toLowerCase();


            if (!classes.has(chave)) {

                classes.set(
                    chave,
                    classe
                );

            }

        }
    );


    classes.forEach(
        classe => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                classe;


            option.textContent =
                classe;


            filtroClasse.appendChild(
                option
            );

        }
    );


    filtroClasse.disabled =
        classes.size === 0;


    console.log(
        "📚 CLASSES:",
        [...classes.values()]
    );

}


// =====================================================
// CLASSE → TURMAS
// =====================================================

function carregarTurmasDaClasse(
    classe
) {

    if (!filtroTurma) return;


    filtroTurma.innerHTML = `

        <option value="">
            Selecionar turma
        </option>

    `;


    filtroTurma.disabled = true;


    const professorId =
        filtroProfessor?.value;


    if (
        !professorId ||
        !classe
    ) {

        return;

    }


    const professor =
        professores.find(
            item =>
                item.id === professorId
        );


    if (!professor) {

        return;

    }


    const atribuicoes =
        Array.isArray(
            professor.atribuicoes
        )
            ? professor.atribuicoes
            : [];


    const atribuicoesClasse =
        atribuicoes.filter(
            item => {

                return (
                    String(
                        item.classe || ""
                    ).trim() ===
                    String(
                        classe || ""
                    ).trim()
                );

            }
        );


    if (!atribuicoesClasse.length) {

        filtroTurma.innerHTML = `

            <option value="">
                Nenhuma turma encontrada
            </option>

        `;

        return;

    }


    const idsTurmas = [
        ...new Set(
            atribuicoesClasse
                .map(
                    item =>
                        item.turmaId
                )
                .filter(Boolean)
        )
    ];


    const turmasEncontradas =
        idsTurmas
            .map(
                turmaId => {

                    return turmas.find(
                        turma =>
                            turma.id ===
                            turmaId
                    );

                }
            )
            .filter(Boolean);


    turmasEncontradas.forEach(
        turma => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                turma.id;


            option.textContent =
                turma.nome ||
                turma.turma ||
                turma.designacao ||
                turma.codigo ||
                `Turma ${turma.id}`;


            filtroTurma.appendChild(
                option
            );

        }
    );


    filtroTurma.disabled =
        turmasEncontradas.length === 0;


    console.log(
        "🏫 TURMAS:",
        turmasEncontradas
    );

}


// =====================================================
// TURMA → DISCIPLINAS
// =====================================================

function carregarDisciplinasDaTurma(
    turmaId
) {

    if (!filtroDisciplina) return;


    filtroDisciplina.innerHTML = `

        <option value="">
            Selecionar disciplina
        </option>

    `;


    filtroDisciplina.disabled = true;


    const professorId =
        filtroProfessor?.value;


    if (
        !professorId ||
        !turmaId
    ) {

        return;

    }


    const professor =
        professores.find(
            item =>
                item.id === professorId
        );


    if (!professor) return;


    const atribuicoes =
        Array.isArray(
            professor.atribuicoes
        )
            ? professor.atribuicoes
            : [];


    const disciplinas =
        new Set();


    atribuicoes.forEach(
        item => {

            const itemTurmaId =
                String(
                    item.turmaId ?? ""
                ).trim();


            if (
                itemTurmaId !==
                String(
                    turmaId
                ).trim()
            ) {

                return;

            }


            const disciplina =
                String(
                    item.disciplina ?? ""
                ).trim();


            if (!disciplina) return;


            disciplinas.add(
                disciplina
            );

        }
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


            filtroDisciplina.appendChild(
                option
            );

        }
    );


    filtroDisciplina.disabled =
        disciplinas.size === 0;


    console.log(
        "📖 DISCIPLINAS:",
        [...disciplinas]
    );


    if (!disciplinas.size) {

        filtroDisciplina.innerHTML = `

            <option value="">
                Nenhuma disciplina atribuída
            </option>

        `;

    }

}


// =====================================================
// EVENTO — PROFESSOR
// =====================================================

filtroProfessor?.addEventListener(
    "change",
    function () {

        const professorId =
            this.value;


        if (filtroTurma) {

            filtroTurma.innerHTML = `

                <option value="">
                    Selecione primeiro a classe
                </option>

            `;

            filtroTurma.disabled = true;

        }


        if (filtroDisciplina) {

            filtroDisciplina.innerHTML = `

                <option value="">
                    Selecione primeiro a turma
                </option>

            `;

            filtroDisciplina.disabled = true;

        }


        carregarClassesDoProfessor(
            professorId
        );


        if (professorId) {

            mostrarMensagem(
                "📚 Agora selecione a classe."
            );

        }
        else {

            mostrarMensagem(
                "👨‍🏫 Selecione um professor para começar."
            );

        }

    }
);


// =====================================================
// EVENTO — CLASSE
// =====================================================

filtroClasse?.addEventListener(
    "change",
    function () {

        const classe =
            this.value;


        if (filtroDisciplina) {

            filtroDisciplina.innerHTML = `

                <option value="">
                    Selecione primeiro a turma
                </option>

            `;

            filtroDisciplina.disabled = true;

        }


        carregarTurmasDaClasse(
            classe
        );


        if (classe) {

            mostrarMensagem(
                "🏫 Agora selecione a turma."
            );

        }

    }
);


// =====================================================
// EVENTO — TURMA
// =====================================================

filtroTurma?.addEventListener(
    "change",
    function () {

        const turmaId =
            this.value;


        carregarDisciplinasDaTurma(
            turmaId
        );


        if (turmaId) {

            mostrarMensagem(
                "📖 Agora selecione a disciplina."
            );

        }

    }
);


// =====================================================
// EVENTO — DISCIPLINA
// =====================================================

filtroDisciplina?.addEventListener(
    "change",
    function () {

        const disciplina =
            this.value;


        if (disciplina) {

            mostrarMensagem(
                "📅 Agora selecione o trimestre."
            );

        }

    }
);


// =====================================================
// EVENTO — TRIMESTRE
// =====================================================

filtroTrimestre?.addEventListener(
    "change",
    async function () {

        await mostrarLancamentoSelecionado();

    }
);


// =====================================================
// MENSAGEM
// =====================================================

function mostrarMensagem(
    mensagem
) {

    if (!notasLista) return;


    notasLista.innerHTML = `

        <tr>

            <td
                colspan="8"
                style="
                    text-align:center;
                    padding:25px;
                    color:#64748b;
                    white-space:pre-line;
                "
            >

                ${mensagem}

            </td>

        </tr>

    `;

}


// =====================================================
// INICIAR
// =====================================================

iniciarNotas();

// =====================================================
// NOTAS.JS — ADMINISTRADOR
// BLOCO 2/2
//
// Estado
// Abrir / Fechar
// Ver Mini-Pauta
// Imprimir
// =====================================================


// =====================================================
// ID DO LANÇAMENTO
// =====================================================

function criarIdLancamento(
    turmaId,
    disciplina,
    trimestre
) {

    return (
        turmaId +
        "_" +
        disciplina +
        "_" +
        trimestre
    );

}


// =====================================================
// OBTER ESTADO DO LANÇAMENTO
// =====================================================

async function obterEstadoLancamento(
    turmaId,
    disciplina,
    trimestre
) {

    const idLancamento =
        criarIdLancamento(
            turmaId,
            disciplina,
            trimestre
        );


    try {

        const referencia =
            doc(
                db,
                "notas",
                idLancamento
            );


        const resultado =
            await getDoc(
                referencia
            );


        if (!resultado.exists()) {

            return {

                existe: false,

                abertoGeral: false,

                alunosAbertos: {},

                alunos: []

            };

        }


        const dados =
            resultado.data();


        /*
        Verificação extra de segurança:
        */

        if (
            dados.escolaId &&
            dados.escolaId !== escolaId
        ) {

            console.warn(
                "⚠️ Lançamento pertence a outra escola."
            );


            return {

                existe: false,

                abertoGeral: false,

                alunosAbertos: {},

                alunos: []

            };

        }


        return {

            existe: true,

            abertoGeral:
                dados.abertoGeral === true,

            alunosAbertos:
                dados.alunosAbertos || {},

            alunos:
                Array.isArray(
                    dados.alunos
                )
                    ? dados.alunos
                    : [],

            dados

        };

    }
    catch (erro) {

        console.error(
            "Erro ao obter lançamento:",
            erro
        );


        return {

            existe: false,

            abertoGeral: false,

            alunosAbertos: {},

            alunos: []

        };

    }

}


// =====================================================
// ESTADO DAS NOTAS
// =====================================================

function verificarEstadoNotas(
    alunos
) {

    if (
        !Array.isArray(alunos) ||
        alunos.length === 0
    ) {

        return "Sem lançamento";

    }


    let completos = 0;


    alunos.forEach(
        aluno => {

            const mac =
                aluno.MAC;


            const npt =
                aluno.NPT;


            const mf =
                aluno.MF;


            if (
                mac !== undefined &&
                mac !== null &&
                mac !== "" &&

                npt !== undefined &&
                npt !== null &&
                npt !== "" &&

                mf !== undefined &&
                mf !== null &&
                mf !== ""
            ) {

                completos++;

            }

        }
    );


    if (
        completos === 0
    ) {

        return "Sem lançamento";

    }


    if (
        completos === alunos.length
    ) {

        return "Lançamento completo";

    }


    return "Lançamento incompleto";

}


// =====================================================
// COR DO ESTADO
// =====================================================

function obterClasseEstado(
    estado
) {

    if (
        estado ===
        "Lançamento completo"
    ) {

        return "estado-completo";

    }


    if (
        estado ===
        "Lançamento incompleto"
    ) {

        return "estado-incompleto";

    }


    return "estado-sem-lancamento";

}


// =====================================================
// MOSTRAR LANÇAMENTO SELECIONADO
// =====================================================

async function mostrarLancamentoSelecionado() {

    const professorId =
        filtroProfessor?.value || "";


    const classe =
        filtroClasse?.value || "";


    const turmaId =
        filtroTurma?.value || "";


    const disciplina =
        filtroDisciplina?.value || "";


    const trimestre =
        filtroTrimestre?.value || "";


    if (
        !professorId ||
        !classe ||
        !turmaId ||
        !disciplina ||
        !trimestre
    ) {

        mostrarMensagem(
            "Selecione professor, classe, turma, disciplina e trimestre."
        );

        return;

    }


    const professor =
        professores.find(
            item =>
                item.id === professorId
        );


    if (!professor) {

        mostrarMensagem(
            "❌ Professor não encontrado."
        );

        return;

    }


    const estado =
        await obterEstadoLancamento(
            turmaId,
            disciplina,
            trimestre
        );


    const estadoNotas =
        verificarEstadoNotas(
            estado.alunos
        );


    const estadoGeral =
        estado.abertoGeral
            ? "ABERTO"
            : "FECHADO";


    const turma =
        turmas.find(
            item =>
                item.id === turmaId
        );


    const turmaNome =
        turma?.nome ||
        turma?.turma ||
        turma?.designacao ||
        turmaId;


    notasLista.innerHTML = `

        <tr>

            <td>

                ${
                    professor.codigo ||
                    "—"
                }

            </td>


            <td>

                ${
                    professor.nome ||
                    "Sem nome"
                }

            </td>


            <td>

                ${
                    professor.ensino ||
                    professor.nivelEnsino ||
                    "—"
                }

            </td>


            <td>

                ${disciplina}

            </td>


            <td>

                ${classe}

            </td>


            <td>

                ${turmaNome}

            </td>


            <td>

                ${trimestre}º Trimestre

            </td>


            <td>

                <span
                    class="${obterClasseEstado(
                        estadoNotas
                    )}"
                >

                    ${estadoNotas}

                </span>

                <br>

                <small>

                    Sistema:
                    ${
                        estadoGeral
                    }

                </small>

            </td>


            <td>

                <button
                    type="button"
                    class="botao-ver"
                    onclick="
                        verMiniPauta(
                            '${professorId}',
                            '${turmaId}',
                            '${disciplina.replace(/'/g, "\\'")}',
                            '${trimestre}'
                        )
                    "
                >

                    👁️ Ver

                </button>


                <button
                    type="button"
                    class="botao-imprimir"
                    onclick="
                        imprimirMiniPauta(
                            '${professorId}',
                            '${turmaId}',
                            '${disciplina.replace(/'/g, "\\'")}',
                            '${trimestre}'
                        )
                    "
                >

                    🖨️ Imprimir

                </button>


                <button
                    type="button"
                    class="
                        botao-controle
                        ${
                            estado.abertoGeral
                                ? "aberto"
                                : "fechado"
                        }
                    "
                    onclick="
                        alterarEstadoGeral(
                            '${turmaId}',
                            '${disciplina.replace(/'/g, "\\'")}',
                            '${trimestre}'
                        )
                    "
                >

                    ${
                        estado.abertoGeral
                            ? "🔒 Fechar"
                            : "🔓 Abrir"
                    }

                </button>

            </td>

        </tr>

    `;


    console.log(
        "📋 LANÇAMENTO:",
        {
            professor,
            turmaId,
            disciplina,
            trimestre,
            estado
        }
    );

}


// =====================================================
// ABRIR / FECHAR GERAL
// =====================================================

window.alterarEstadoGeral =
async function (
    turmaId,
    disciplina,
    trimestre
) {

    try {

        const idLancamento =
            criarIdLancamento(
                turmaId,
                disciplina,
                trimestre
            );


        const referencia =
            doc(
                db,
                "notas",
                idLancamento
            );


        const resultado =
            await getDoc(
                referencia
            );


        let dados =
            resultado.exists()
                ? resultado.data()
                : {};


        /*
        Segurança:
        */

        if (
            dados.escolaId &&
            dados.escolaId !== escolaId
        ) {

            alert(
                "❌ Este lançamento pertence a outra escola."
            );

            return;

        }


        const estadoAtual =
            dados.abertoGeral === true;


        const novoEstado =
            !estadoAtual;


        /*
        Criar estrutura caso ainda
        não exista.
        */

        if (
            !dados.alunosAbertos
        ) {

            dados.alunosAbertos = {};

        }


        await setDoc(

            referencia,

            {

                escolaId,

                turmaId,

                disciplina,

                trimestre,

                abertoGeral:
                    novoEstado,

                alunosAbertos:
                    dados.alunosAbertos,

                atualizadoEm:
                    serverTimestamp()

            },

            {
                merge: true
            }

        );


        alert(

            novoEstado

                ? "🔓 Sistema de lançamento ABERTO.\n\n" +
                  "O professor poderá lançar ou editar as notas."

                : "🔒 Sistema de lançamento FECHADO.\n\n" +
                  "O professor não poderá alterar as notas."

        );


        await mostrarLancamentoSelecionado();

    }
    catch (erro) {

        console.error(
            "Erro ao alterar estado:",
            erro
        );


        alert(
            "❌ Erro ao alterar o estado:\n\n" +
            erro.message
        );

    }

};


// =====================================================
// VER MINI-PAUTA
// =====================================================

window.verMiniPauta =
function (
    professorId,
    turmaId,
    disciplina,
    trimestre
) {

    const professor =
        professores.find(
            item =>
                item.id === professorId
        );


    if (!professor) {

        alert(
            "Professor não encontrado."
        );

        return;

    }


    /*
    Guardar contexto para a Mini-Pauta.
    */

    localStorage.setItem(
        "turmaId",
        turmaId
    );


    const turma =
        turmas.find(
            item =>
                item.id === turmaId
        );


    localStorage.setItem(
        "turmaNome",
        turma?.nome ||
        turma?.turma ||
        turma?.designacao ||
        ""
    );


    localStorage.setItem(
        "disciplina",
        disciplina
    );


    localStorage.setItem(
        "trimestre",
        trimestre
    );


    localStorage.setItem(
        "professorSelecionadoAdmin",
        professorId
    );


    localStorage.setItem(
        "modoVisualizacao",
        "admin"
    );


    /*
    Abrir a Mini-Pauta.
    */

    window.open(
        "mini-pauta.html",
        "_blank"
    );

};


// =====================================================
// IMPRIMIR MINI-PAUTA
// =====================================================

window.imprimirMiniPauta =
function (
    professorId,
    turmaId,
    disciplina,
    trimestre
) {

    /*
    Guardar o mesmo contexto
    utilizado pelo botão Ver.
    */

    const turma =
        turmas.find(
            item =>
                item.id === turmaId
        );


    localStorage.setItem(
        "turmaId",
        turmaId
    );


    localStorage.setItem(
        "turmaNome",
        turma?.nome ||
        turma?.turma ||
        turma?.designacao ||
        ""
    );


    localStorage.setItem(
        "disciplina",
        disciplina
    );


    localStorage.setItem(
        "trimestre",
        trimestre
    );


    localStorage.setItem(
        "professorSelecionadoAdmin",
        professorId
    );


    localStorage.setItem(
        "modoVisualizacao",
        "admin"
    );


    /*
    Abrir Mini-Pauta para impressão.
    */

    const janela =
        window.open(
            "mini-pauta.html",
            "_blank"
        );


    if (!janela) {

        alert(
            "⚠️ O navegador bloqueou a nova janela."
        );

    }

};


// =====================================================
// FUNÇÃO PARA MOSTRAR A TABELA GERAL
// =====================================================

async function carregarTabelaProfessores() {

    if (!notasLista) return;


    notasLista.innerHTML = `

        <tr>

            <td
                colspan="9"
                style="
                    text-align:center;
                    padding:25px;
                "
            >

                ⏳ A carregar professores...

            </td>

        </tr>

    `;


    try {

        if (!professores.length) {

            mostrarMensagem(
                "Nenhum professor encontrado nesta escola."
            );

            return;

        }


        notasLista.innerHTML = "";


        for (
            const professor
            of professores
        ) {

            const atribuicoes =
                Array.isArray(
                    professor.atribuicoes
                )
                    ? professor.atribuicoes
                    : [];


            if (
                !atribuicoes.length
            ) {

                const linha =
                    document.createElement(
                        "tr"
                    );


                linha.innerHTML = `

                    <td>
                        ${
                            professor.codigo ||
                            "—"
                        }
                    </td>

                    <td>
                        ${
                            professor.nome ||
                            "Sem nome"
                        }
                    </td>

                    <td>
                        ${
                            professor.ensino ||
                            professor.nivelEnsino ||
                            "—"
                        }
                    </td>

                    <td>
                        —
                    </td>

                    <td>
                        —
                    </td>

                    <td>
                        —
                    </td>

                    <td>
                        —
                    </td>

                    <td>
                        ⚪ Sem lançamento
                    </td>

                    <td>

                        <button
                            type="button"
                            disabled
                        >
                            👁️ Ver
                        </button>

                    </td>

                `;


                notasLista.appendChild(
                    linha
                );


                continue;

            }


            /*
            Mostrar uma linha por atribuição,
            pois cada disciplina/turma pode
            ter um lançamento diferente.
            */

            for (
                const atribuicao
                of atribuicoes
            ) {

                const turmaId =
                    atribuicao.turmaId;


                const disciplina =
                    String(
                        atribuicao.disciplina ||
                        ""
                    ).trim();


                const trimestre =
                    filtroTrimestre?.value ||
                    "1";


                if (
                    !turmaId ||
                    !disciplina
                ) {

                    continue;

                }


                const turma =
                    turmas.find(
                        item =>
                            item.id ===
                            turmaId
                    );


                const estado =
                    await obterEstadoLancamento(
                        turmaId,
                        disciplina,
                        trimestre
                    );


                const estadoNotas =
                    verificarEstadoNotas(
                        estado.alunos
                    );


                const linha =
                    document.createElement(
                        "tr"
                    );


                linha.innerHTML = `

                    <td>

                        ${
                            professor.codigo ||
                            "—"
                        }

                    </td>


                    <td>

                        ${
                            professor.nome ||
                            "Sem nome"
                        }

                    </td>


                    <td>

                        ${
                            professor.ensino ||
                            professor.nivelEnsino ||
                            atribuicao.ensino ||
                            "—"
                        }

                    </td>


                    <td>

                        ${disciplina}

                    </td>


                    <td>

                        ${
                            atribuicao.classe ||
                            turma?.classe ||
                            "—"
                        }

                    </td>


                    <td>

                        ${
                            turma?.nome ||
                            turma?.turma ||
                            turma?.designacao ||
                            "—"
                        }

                    </td>


                    <td>

                        ${trimestre}º

                    </td>


                    <td>

                        <span
                            class="${obterClasseEstado(
                                estadoNotas
                            )}"
                        >

                            ${estadoNotas}

                        </span>


                        <br>


                        <small>

                            ${
                                estado.abertoGeral
                                    ? "🔓 Aberto"
                                    : "🔒 Fechado"
                            }

                        </small>

                    </td>


            <td>

                        <button
                            type="button"
                            class="botao-ver"
                            onclick="
                                verMiniPauta(
                                    '${professor.id}',
                                    '${turmaId}',
                                    '${disciplina.replace(/'/g, "\\'")}',
                                    '${trimestre}'
                                )
                            "
                        >

                            👁️ Ver

                        </button>


                        <button
                            type="button"
                            class="botao-imprimir"
                            onclick="
                                imprimirMiniPauta(
                                    '${professor.id}',
                                    '${turmaId}',
                                    '${disciplina.replace(/'/g, "\\'")}',
                                    '${trimestre}'
                                )
                            "
                        >

                            🖨️ Imprimir

                        </button>


                        <button
                            type="button"
                            class="botao-controle"
                            onclick="
                                alterarEstadoGeral(
                                    '${turmaId}',
                                    '${disciplina.replace(/'/g, "\\'")}',
                                    '${trimestre}'
                                )
                            "
                        >

                            ${
                                estado.abertoGeral
                                    ? "🔒 Fechar"
                                    : "🔓 Abrir"
                            }

                        </button>

                    </td>

                `;


                notasLista.appendChild(
                    linha
                );

            }

        }


    }
    catch (erro) {

        console.error(
            "Erro ao montar tabela:",
            erro
        );


        mostrarMensagem(
            "❌ Erro ao carregar a tabela."
        );

    }

}


// =====================================================
// BOTÃO GERAL EXISTENTE NO HTML
// =====================================================

const botaoGeral =
    document.getElementById(
        "abrirFecharSistema"
    );


if (botaoGeral) {

    botaoGeral.addEventListener(
        "click",
        async function () {

            const turmaId =
                filtroTurma?.value;


            const disciplina =
                filtroDisciplina?.value;


            const trimestre =
                filtroTrimestre?.value;


            if (
                !turmaId ||
                !disciplina ||
                !trimestre
            ) {

                alert(
                    "Selecione professor, classe, turma, disciplina e trimestre."
                );

                return;

            }


            await alterarEstadoGeral(
                turmaId,
                disciplina,
                trimestre
            );

        }
    );

}


// =====================================================
// AO ALTERAR O TRIMESTRE,
// ATUALIZAR A TABELA
// =====================================================

filtroTrimestre?.addEventListener(
    "change",
    async function () {

        await carregarTabelaProfessores();

    }
);


// =====================================================
// PRIMEIRA CARGA
// =====================================================

setTimeout(
    async function () {

        await carregarTabelaProfessores();

    },
    500
);


// =====================================================
// EXPOR FUNÇÕES
// =====================================================

window.carregarTabelaProfessores =
    carregarTabelaProfessores;


window.obterEstadoLancamento =
    obterEstadoLancamento;


window.verificarEstadoNotas =
    verificarEstadoNotas;
