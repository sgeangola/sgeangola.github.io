// =====================================================
// NOTAS.JS — ADMINISTRADOR
// SGE ANGOLA
// Versão limpa
//
// Fluxo:
// Professor → Classe → Turma → Disciplina → Trimestre
//
// Controle:
// 🔓 Abrir lançamento
// 🔒 Fechar lançamento
//
// ID:
// turmaId + disciplina + trimestre
// =====================================================

alert("🔥 NOTAS.JS1 CARREGADO!");

// =====================================================
// FIREBASE
// =====================================================

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
// ESCOLA
// =====================================================

const escolaId =
    sessionStorage.getItem("escolaId") ||
    localStorage.getItem("escolaId");

if (!escolaId) {

    alert(
        "❌ ESCOLA NÃO IDENTIFICADA.\n\n" +
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

const mensagem =
    document.getElementById("mensagem");

const estadoSistema =
    document.getElementById("estadoSistema");

const botaoSistema =
    document.getElementById("botaoSistema");


// =====================================================
// DADOS
// =====================================================

let professores = [];

let turmas = [];

let professorSelecionado = null;

let lancamentoSelecionado = null;


// =====================================================
// MENSAGEM
// =====================================================

function mostrarMensagem(
    texto,
    tipo = "aviso"
) {

    if (!mensagem)
        return;

    mensagem.textContent =
        texto;

    mensagem.className =
        "mensagem visivel " + tipo;

}


function esconderMensagem() {

    if (!mensagem)
        return;

    mensagem.textContent =
        "";

    mensagem.className =
        "mensagem";

}


// =====================================================
// CRIAR ID DO LANÇAMENTO
// =====================================================
//
// Esta função é usada SEMPRE.
//
// Exemplo:
//
// turma ABC
// E.M.P
// trimestre 1
//
// ABC_E.M.P_1
//
// =====================================================

function criarIdLancamento(
    turmaId,
    disciplina,
    trimestre
) {

    const turma =
        String(
            turmaId || ""
        )
        .trim();

    const materia =
        String(
            disciplina || ""
        )
        .trim()
        .replace(/\//g, "-")
        .replace(/\s+/g, "_");

    const tri =
        String(
            trimestre || ""
        )
        .replace("º", "")
        .replace("°", "")
        .replace("ª", "")
        .replace("Trimestre", "")
        .replace(/\s+/g, "")
        .trim();

    return (
        turma +
        "_" +
        materia +
        "_" +
        tri
    );

}


// =====================================================
// CARREGAR PROFESSORES
// =====================================================

async function carregarProfessores() {

    professores = [];

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

}


// =====================================================
// CARREGAR TURMAS
// =====================================================

async function carregarTurmas() {

    turmas = [];

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

}


// =====================================================
// PREENCHER PROFESSORES
// =====================================================

function preencherProfessores() {

    if (!filtroProfessor)
        return;


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
                professor.codigoProfessor
                    ? `${professor.codigoProfessor} — ${professor.nome}`
                    : (
                        professor.nome ||
                        "Professor sem nome"
                    );


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

        filtroClasse.disabled =
            true;

    }


    if (filtroTurma) {

        filtroTurma.innerHTML = `

            <option value="">
                Selecione primeiro a classe
            </option>

        `;

        filtroTurma.disabled =
            true;

    }


    if (filtroDisciplina) {

        filtroDisciplina.innerHTML = `

            <option value="">
                Selecione primeiro a turma
            </option>

        `;

        filtroDisciplina.disabled =
            true;

    }


    if (filtroTrimestre) {

        filtroTrimestre.innerHTML = `

            <option value="">
                Todos os trimestres
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

    if (!filtroClasse)
        return;


    filtroClasse.innerHTML = `

        <option value="">
            Selecionar classe
        </option>

    `;

    filtroClasse.disabled =
        true;


    professorSelecionado =
        professores.find(
            professor =>
                professor.id ===
                professorId
        ) || null;


    if (!professorSelecionado)
        return;


    const atribuicoes =
        Array.isArray(
            professorSelecionado.atribuicoes
        )
            ? professorSelecionado.atribuicoes
            : [];


    const classes =
        new Map();


    atribuicoes.forEach(
        atribuicao => {

            const classe =
                String(
                    atribuicao.classe || ""
                ).trim();


            if (!classe)
                return;


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

}


// =====================================================
// CLASSE → TURMAS
// =====================================================

function carregarTurmasDaClasse(
    classe
) {

    if (!filtroTurma)
        return;


    filtroTurma.innerHTML = `

        <option value="">
            Selecionar turma
        </option>

    `;

    filtroTurma.disabled =
        true;


    if (
        !professorSelecionado ||
        !classe
    ) {

        return;

    }


    const atribuicoes =
        Array.isArray(
            professorSelecionado.atribuicoes
        )
            ? professorSelecionado.atribuicoes
            : [];


    const idsTurmas = [

        ...new Set(

            atribuicoes
                .filter(
                    atribuicao =>

                        String(
                            atribuicao.classe || ""
                        ).trim() ===
                        String(
                            classe
                        ).trim()
                )
                .map(
                    atribuicao =>
                        atribuicao.turmaId
                )
                .filter(Boolean)

        )

    ];


    const turmasEncontradas =
        idsTurmas
            .map(
                id =>
                    turmas.find(
                        turma =>
                            turma.id === id
                    )
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
                "Turma";


            filtroTurma.appendChild(
                option
            );

        }
    );


    filtroTurma.disabled =
        turmasEncontradas.length === 0;

}


// =====================================================
// TURMA → DISCIPLINAS
// =====================================================

function carregarDisciplinasDaTurma(
    turmaId
) {

    if (!filtroDisciplina)
        return;


    filtroDisciplina.innerHTML = `

        <option value="">
            Selecionar disciplina
        </option>

    `;

    filtroDisciplina.disabled =
        true;


    if (
        !professorSelecionado ||
        !turmaId
    ) {

        return;

    }


    const atribuicoes =
        Array.isArray(
            professorSelecionado.atribuicoes
        )
            ? professorSelecionado.atribuicoes
            : [];


    const disciplinas =
        new Set();


    atribuicoes.forEach(
        atribuicao => {

            if (
                String(
                    atribuicao.turmaId || ""
                ).trim() !==
                String(
                    turmaId
                ).trim()
            ) {

                return;

            }


            const disciplina =
                String(
                    atribuicao.disciplina || ""
                ).trim();


            if (disciplina) {

                disciplinas.add(
                    disciplina
                );

            }

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

}


// =====================================================
// OBTER ESTADO DO LANÇAMENTO
// =====================================================

async function obterEstadoLancamento(
    turmaId,
    disciplina,
    trimestre
) {

    const id =
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
                id
            );


        const resultado =
            await getDoc(
                referencia
            );


        if (
            !resultado.exists()
        ) {

            return {

                existe:
                    false,

                abertoGeral:
                    false,

                dados:
                    {}

            };

        }


        const dados =
            resultado.data();


        if (
            dados.escolaId &&
            String(
                dados.escolaId
            ).trim() !==
            String(
                escolaId
            ).trim()
        ) {

            return {

                existe:
                    false,

                abertoGeral:
                    false,

                dados:
                    {}

            };

        }


        return {

            existe:
                true,

            abertoGeral:
                dados.abertoGeral === true,

            dados:
                dados

        };

    }

    catch (erro) {

        console.error(
            erro
        );


        return {

            existe:
                false,

            abertoGeral:
                false,

            dados:
                {}

        };

    }

}


// =====================================================
// MOSTRAR LANÇAMENTO
// =====================================================

async function mostrarLancamentoSelecionado() {

    const professorId =
        filtroProfessor?.value;

    const classe =
        filtroClasse?.value;

    const turmaId =
        filtroTurma?.value;

    const disciplina =
        filtroDisciplina?.value;


    if (
        !professorId ||
        !classe ||
        !turmaId ||
        !disciplina
    ) {

        return;

    }


    const professor =
        professores.find(
            item =>
                item.id ===
                professorId
        );


    const turma =
        turmas.find(
            item =>
                item.id ===
                turmaId
        );


    if (
        !professor ||
        !turma
    ) {

        return;

    }


    const trimestre =
        filtroTrimestre?.value;


    if (!trimestre) {

        lancamentoSelecionado =
            null;

        notasLista.innerHTML = `

            <tr>

                <td colspan="8">

                    Selecione um trimestre.

                </td>

            </tr>

        `;

        atualizarBotaoSistema();

        return;

    }


    notasLista.innerHTML = `

        <tr>

            <td colspan="8">

                ⏳ A verificar lançamento...

            </td>

        </tr>

    `;


    const estado =
        await obterEstadoLancamento(
            turmaId,
            disciplina,
            trimestre
        );


    lancamentoSelecionado = {

        professorId:
            professor.id,

        professorNome:
            professor.nome,

        classe:
            classe,

        turmaId:
            turma.id,

        turmaNome:
            turma.nome ||
            turma.turma,

        disciplina:
            disciplina,

        trimestre:
            trimestre,

        estado:
            estado

    };


    notasLista.innerHTML = `

        <tr>

            <td>
                ${professor.nome || "—"}
            </td>

            <td>
                ${classe || "—"}
            </td>

            <td>
                ${
                    turma.nome ||
                    turma.turma ||
                    "—"
                }
            </td>

            <td>
                ${disciplina || "—"}
            </td>

            <td>
                ${
                    mostrarEstadoTabela(
                        estado
                    )
                }
            </td>

            <td>
                —
            </td>

            <td>
                —
            </td>

            <td>

                ${botaoAcaoLancamento()}

            </td>

        </tr>

    `;


    atualizarBotaoSistema();

}


// =====================================================
// ESTADO DA TABELA
// =====================================================

function mostrarEstadoTabela(
    estado
) {

    if (
        !estado.existe
    ) {

        return `
            🔒 Fechado
        `;

    }


    if (
        estado.abertoGeral === true
    ) {

        return `
            🟢 Aberto
        `;

    }


    return `
        🔒 Fechado
    `;

}


// =====================================================
// BOTÕES
// =====================================================

function botaoAcaoLancamento() {

    if (
        !lancamentoSelecionado
    ) {

        return "";

    }


    const aberto =
        lancamentoSelecionado
            .estado
            .abertoGeral === true;


    return `

        <div style="
            display:flex;
            gap:6px;
            flex-wrap:wrap;
            justify-content:center;
        ">

            <button
                type="button"
                class="botao-controlar"
                onclick="verLancamento()"
            >
                👁️ Ver
            </button>


            <button
                type="button"
                class="botao-controlar"
                onclick="imprimirLancamento()"
            >
                🖨️ Imprimir
            </button>


            <button
                type="button"
                class="botao-controlar"
                style="
                    background:${
                        aberto
                            ? "#dc2626"
                            : "#16a34a"
                    };
                    color:white;
                "
                onclick="alternarLancamento()"
            >
                ${
                    aberto
                        ? "🔒 Fechar"
                        : "🔓 Abrir"
                }
            </button>

        </div>

    `;

}

// =====================================================
// ATUALIZAR BOTÃO PRINCIPAL DO SISTEMA
// =====================================================

function atualizarBotaoSistema() {

    if (!botaoSistema || !estadoSistema) {
        return;
    }


    // ---------------------------------------------
    // NENHUM LANÇAMENTO SELECIONADO
    // ---------------------------------------------

    if (!lancamentoSelecionado) {

        estadoSistema.textContent =
            "🔴 Fechado";

        estadoSistema.className =
            "sistema-fechado";

        botaoSistema.textContent =
            "🔓 Abrir sistema";

        botaoSistema.className =
            "botao-sistema botao-abrir";

        return;
    }


    // ---------------------------------------------
    // VERIFICAR ESTADO
    // ---------------------------------------------

    const aberto =
        lancamentoSelecionado.estado?.abertoGeral === true;


    // ---------------------------------------------
    // ABERTO
    // ---------------------------------------------

    if (aberto) {

        estadoSistema.textContent =
            "🟢 Aberto";

        estadoSistema.className =
            "sistema-aberto";

        botaoSistema.textContent =
            "🔒 Fechar sistema";

        botaoSistema.className =
            "botao-sistema botao-fechar";

    }

    // ---------------------------------------------
    // FECHADO
    // ---------------------------------------------

    else {

        estadoSistema.textContent =
            "🔴 Fechado";

        estadoSistema.className =
            "sistema-fechado";

        botaoSistema.textContent =
            "🔓 Abrir sistema";

        botaoSistema.className =
            "botao-sistema botao-abrir";

    }

}

// =====================================================
// BOTÃO PRINCIPAL
// =====================================================

botaoSistema?.addEventListener(
    "click",
    async function () {

        alert(
            "🔘 BOTÃO DO SISTEMA CLICADO"
        );


        if (
            !lancamentoSelecionado
        ) {

            alert(
                "⚠️ Primeiro selecione:\n\n" +
                "Professor → Classe → Turma → " +
                "Disciplina → Trimestre."
            );

            return;

        }


        await alternarLancamento();

    }
);


// =====================================================
// ABRIR / FECHAR
// =====================================================

window.alternarLancamento =
    async function () {

        alert(
            "🔥 ALTERNAR LANÇAMENTO EXECUTADO"
        );


        if (
            !lancamentoSelecionado
        ) {

            alert(
                "⚠️ Nenhum lançamento selecionado."
            );

            return;

        }


        const dados =
            lancamentoSelecionado;


        const abertoAtual =
            dados.estado
                .abertoGeral === true;


        const novoEstado =
            !abertoAtual;


        const id =
            criarIdLancamento(
                dados.turmaId,
                dados.disciplina,
                dados.trimestre
            );


        alert(
            "DEBUG DA ABERTURA\n\n" +

            "ID:\n" +
            id +

            "\n\nTurma ID:\n" +
            dados.turmaId +

            "\n\nDisciplina:\n" +
            dados.disciplina +

            "\n\nTrimestre:\n" +
            dados.trimestre +

            "\n\nNovo estado:\n" +
            novoEstado
        );


        try {

            const confirmar =
                confirm(

                    novoEstado

                        ? "🔓 Abrir este lançamento?"

                        : "🔒 Fechar este lançamento?"

                );


            if (!confirmar)
                return;


            await setDoc(

                doc(
                    db,
                    "notas",
                    id
                ),

                {

                    escolaId:
                        escolaId,

                    professorId:
                        dados.professorId,

                    professorNome:
                        dados.professorNome,

                    classe:
                        dados.classe,

                    turmaId:
                        dados.turmaId,

                    turmaNome:
                        dados.turmaNome,

                    disciplina:
                        dados.disciplina,

                    trimestre:
                        dados.trimestre,

                    abertoGeral:
                        novoEstado,

                    alunosAbertos:
                        {},

                    atualizadoEm:
                        serverTimestamp()

                },

                {
                    merge:
                        true
                }

            );


            alert(
                "✅ DOCUMENTO GUARDADO NO FIRESTORE\n\n" +
                "ID:\n" +
                id
            );


            dados.estado =
                await obterEstadoLancamento(
                    dados.turmaId,
                    dados.disciplina,
                    dados.trimestre
                );


            await mostrarLancamentoSelecionado();


            alert(

                novoEstado

                    ? "🟢 LANÇAMENTO ABERTO COM SUCESSO!"

                    : "🔒 LANÇAMENTO FECHADO COM SUCESSO!"

            );

        }

        catch (erro) {

            console.error(
                "❌ ERRO:",
                erro
            );


            alert(
                "❌ ERRO AO ABRIR/FECHAR\n\n" +
                erro.message
            );

        }

    };


// =====================================================
// VER
// =====================================================

window.verLancamento =
    function () {

        if (
            !lancamentoSelecionado
        ) {

            alert(
                "⚠️ Nenhum lançamento selecionado."
            );

            return;

        }


        const dados =
            lancamentoSelecionado;


        alert(

            "📋 LANÇAMENTO\n\n" +

            "Professor: " +
            dados.professorNome +

            "\nClasse: " +
            dados.classe +

            "\nTurma: " +
            dados.turmaNome +

            "\nDisciplina: " +
            dados.disciplina +

            "\nTrimestre: " +
            dados.trimestre +

            "\n\nEstado: " +

            (
                dados.estado.abertoGeral
                    ? "🟢 ABERTO"
                    : "🔒 FECHADO"
            )

        );

    };


// =====================================================
// IMPRIMIR
// =====================================================

window.imprimirLancamento =
    function () {

        if (
            !lancamentoSelecionado
        ) {

            alert(
                "⚠️ Nenhum lançamento selecionado."
            );

            return;

        }


        const dados =
            lancamentoSelecionado;


        const estado =
            dados.estado.abertoGeral
                ? "ABERTO"
                : "FECHADO";


        const janela =
            window.open(
                "",
                "_blank"
            );


        if (!janela) {

            alert(
                "⚠️ O navegador bloqueou a impressão."
            );

            return;

        }


        janela.document.write(`

            <!DOCTYPE html>

            <html lang="pt">

            <head>

                <meta charset="UTF-8">

                <title>
                    Lançamento de Notas
                </title>

                <style>

                    body {
                        font-family: Arial;
                        padding: 30px;
                    }

                    table {
                        width:100%;
                        border-collapse:collapse;
                    }

                    td,
                    th {
                        border:1px solid #999;
                        padding:10px;
                    }

                    th {
                        background:#eee;
                    }

                </style>

            </head>

            <body>

                <h1>
                    Lançamento de Notas
                </h1>

                <table>

                    <tr>
                        <th>Professor</th>
                        <td>
                            ${dados.professorNome}
                        </td>
                    </tr>

                    <tr>
                        <th>Classe</th>
                        <td>
                            ${dados.classe}
                        </td>
                    </tr>

                    <tr>
                        <th>Turma</th>
                        <td>
                            ${dados.turmaNome}
                        </td>
                    </tr>

                    <tr>
                        <th>Disciplina</th>
                        <td>
                            ${dados.disciplina}
                        </td>
                    </tr>

                    <tr>
                        <th>Trimestre</th>
                        <td>
                            ${dados.trimestre}
                        </td>
                    </tr>

                    <tr>
                        <th>Estado</th>
                        <td>
                            ${estado}
                        </td>
                    </tr>

                </table>

            </body>

            </html>

        `);


        janela.document.close();

        janela.focus();

        janela.print();

    };


// =====================================================
// EVENTOS DOS FILTROS
// =====================================================

filtroProfessor?.addEventListener(
    "change",
    function () {

        carregarClassesDoProfessor(
            this.value
        );


        filtroTurma.innerHTML = `

            <option value="">
                Selecione primeiro a classe
            </option>

        `;

        filtroTurma.disabled =
            true;


        filtroDisciplina.innerHTML = `

            <option value="">
                Selecione primeiro a turma
            </option>

        `;

        filtroDisciplina.disabled =
            true;


        lancamentoSelecionado =
            null;

        atualizarBotaoSistema();

    }
);


filtroClasse?.addEventListener(
    "change",
    function () {

        carregarTurmasDaClasse(
            this.value
        );


        filtroDisciplina.innerHTML = `

            <option value="">
                Selecione primeiro a turma
            </option>

        `;

        filtroDisciplina.disabled =
            true;


        lancamentoSelecionado =
            null;

        atualizarBotaoSistema();

    }
);


filtroTurma?.addEventListener(
    "change",
    function () {

        carregarDisciplinasDaTurma(
            this.value
        );


        lancamentoSelecionado =
            null;

        atualizarBotaoSistema();

    }
);


filtroDisciplina?.addEventListener(
    "change",
    async function () {

        if (!this.value)
            return;


        await mostrarLancamentoSelecionado();

    }
);


filtroTrimestre?.addEventListener(
    "change",
    async function () {

        await mostrarLancamentoSelecionado();

    }
);


// =====================================================
// INICIAR
// =====================================================

async function iniciarNotas() {

    try {

        alert(
            "⏳ A CARREGAR NOTAS..."
        );


        await carregarProfessores();

        await carregarTurmas();

        preencherProfessores();

        prepararFiltros();


        mostrarMensagem(
            "👨‍🏫 Selecione um professor.",
            "aviso"
        );


        alert(
            "✅ NOTAS.JS PRONTO!"
        );

    }

    catch (erro) {

        console.error(
            erro
        );


        alert(
            "❌ ERRO AO INICIAR\n\n" +
            erro.message
        );


        mostrarMensagem(
            "❌ Erro ao carregar dados.",
            "erro"
        );

    }

}


// =====================================================
// INICIAR SISTEMA
// =====================================================

iniciarNotas();
