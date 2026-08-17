// =====================================================
// NOTAS.JS — ADMINISTRADOR
// SGE ANGOLA
// BLOCO 1/2
//
// Professor → Classe → Turma → Disciplina → Trimestre
// Controle de abertura/fecho pelo Administrador
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
// ESCOLA ATUAL
// =====================================================

const escolaId =
    sessionStorage.getItem("escolaId") ||
    localStorage.getItem("escolaId");

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

function mostrarMensagem(texto, tipo = "aviso") {

    if (!mensagem) return;

    mensagem.textContent = texto;

    mensagem.className =
        "mensagem visivel " + tipo;

}


// =====================================================
// ESCONDER MENSAGEM
// =====================================================

function esconderMensagem() {

    if (!mensagem) return;

    mensagem.textContent = "";

    mensagem.className = "mensagem";

}


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
            "👨‍🏫 Selecione um professor para começar.",
            "aviso"
        );

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO INICIAR NOTAS:",
            erro
        );

        mostrarMensagem(
            "❌ Erro ao carregar os dados.",
            "erro"
        );

    }

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


    console.log(
        "👨‍🏫 PROFESSORES:",
        professores
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


    console.log(
        "🏫 TURMAS:",
        turmas
    );

}


// =====================================================
// PREENCHER PROFESSORES
// =====================================================

function preencherProfessores() {

    if (!filtroProfessor) return;

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
                    ? professor.codigoProfessor +
                      " — " +
                      professor.nome
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

    if (!filtroClasse) return;

    filtroClasse.innerHTML = `

        <option value="">
            Selecionar classe
        </option>

    `;

    filtroClasse.disabled = true;


    professorSelecionado =
        professores.find(
            professor =>
                professor.id ===
                professorId
        ) || null;


    if (!professorSelecionado) {

        return;

    }


    const atribuicoes =
        Array.isArray(
            professorSelecionado.atribuicoes
        )
            ? professorSelecionado.atribuicoes
            : [];


    const classes = new Map();


    atribuicoes.forEach(
        atribuicao => {

            const classe =
                String(
                    atribuicao.classe || ""
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


    const professor =
        professorSelecionado;


    if (!professor || !classe) {

        return;

    }


    const atribuicoes =
        Array.isArray(
            professor.atribuicoes
        )
            ? professor.atribuicoes
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

    if (!filtroDisciplina) return;


    filtroDisciplina.innerHTML = `

        <option value="">
            Selecionar disciplina
        </option>

    `;

    filtroDisciplina.disabled = true;


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


    const disciplinas = new Set();


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
// EVENTO PROFESSOR
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

        filtroTurma.disabled = true;


        filtroDisciplina.innerHTML = `

            <option value="">
                Selecione primeiro a turma
            </option>

        `;

        filtroDisciplina.disabled = true;


        notasLista.innerHTML = `

            <tr>

                <td colspan="8"
                    class="carregando">

                    Selecione a classe,
                    turma e disciplina.

                </td>

            </tr>

        `;

    }
);


// =====================================================
// EVENTO CLASSE
// =====================================================

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

        filtroDisciplina.disabled = true;

    }
);


// =====================================================
// EVENTO TURMA
// =====================================================

filtroTurma?.addEventListener(
    "change",
    function () {

        carregarDisciplinasDaTurma(
            this.value
        );

    }
);


// =====================================================
// EVENTO DISCIPLINA
// =====================================================

filtroDisciplina?.addEventListener(
    "change",
    async function () {

        if (!this.value) return;

        await mostrarLancamentoSelecionado();

    }
);


// =====================================================
// EVENTO TRIMESTRE
// =====================================================

filtroTrimestre?.addEventListener(
    "change",
    async function () {

        await mostrarLancamentoSelecionado();

    }
);


// =====================================================
// INICIAR
// =====================================================

iniciarNotas();

// =====================================================
// NOTAS.JS — ADMINISTRADOR
// BLOCO 2/2
//
// Estados
// Abrir / Fechar
// Tabela
// Ver
// Imprimir
// =====================================================


// =====================================================
// CRIAR ID DO LANÇAMENTO
// =====================================================

function criarIdLancamento(
    turmaId,
    disciplina,
    trimestre
) {

    return (
        String(turmaId || "").trim() +
        "_" +
        String(disciplina || "")
            .trim()
            .replace(/\//g, "-")
            .replace(/\s+/g, "_") +
        "_" +
        String(trimestre || "")
            .replace("º", "")
            .replace("°", "")
            .replace("ª", "")
            .replace(" ", "")
            .replace("Trimestre", "")
            .trim()
    );

}


const idLancamento =
    criarIdLancamento(
        turmaId,
        disciplina,
        trimestre
    );


// =====================================================
// OBTER ESTADO
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


        if (!resultado.exists()) {

            return {

                existe: false,

                abertoGeral: false,

                dados: {}

            };

        }


        const dados =
            resultado.data();


        if (
            dados.escolaId &&
            dados.escolaId !== escolaId
        ) {

            return {

                existe: false,

                abertoGeral: false,

                dados: {}

            };

        }


        return {

            existe: true,

            abertoGeral:
                dados.abertoGeral === true,

            dados:
                dados

        };

    }

    catch (erro) {

        console.error(
            "Erro ao obter estado:",
            erro
        );


        return {

            existe: false,

            abertoGeral: false,

            dados: {}

        };

    }

}


// =====================================================
// MOSTRAR LANÇAMENTO SELECIONADO
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
                item.id === professorId
        );


    const turma =
        turmas.find(
            item =>
                item.id === turmaId
        );


    if (
        !professor ||
        !turma
    ) {

        return;

    }


    const trimestres =
        filtroTrimestre?.value
            ? [
                filtroTrimestre.value
              ]
            : [
                "1",
                "2",
                "3"
              ];


    notasLista.innerHTML = `

        <tr>

            <td colspan="8"
                class="carregando">

                ⏳ A verificar lançamentos...

            </td>

        </tr>

    `;


    const estados = {};


    for (
        const trimestre
        of trimestres
    ) {

        estados[trimestre] =
            await obterEstadoLancamento(
                turmaId,
                disciplina,
                trimestre
            );

    }


    // =============================================
    // SE FOI ESCOLHIDO UM TRIMESTRE
    // =============================================

    if (
        filtroTrimestre?.value
    ) {

        const trimestre =
            filtroTrimestre.value;


        const estado =
            estados[trimestre];


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
                turma.nome,

            disciplina:
                disciplina,

            trimestre:
                trimestre,

            estado:
                estado

        };

    }

    else {

        lancamentoSelecionado = null;

    }


    // =============================================
    // TABELA
    // =============================================

    const estado1 =
        estados["1"] ||
        await obterEstadoLancamento(
            turmaId,
            disciplina,
            "1"
        );


    const estado2 =
        estados["2"] ||
        await obterEstadoLancamento(
            turmaId,
            disciplina,
            "2"
        );


    const estado3 =
        estados["3"] ||
        await obterEstadoLancamento(
            turmaId,
            disciplina,
            "3"
        );


    notasLista.innerHTML = `

        <tr>

            <td class="nome">
                ${professor.nome || "—"}
            </td>

            <td>
                ${classe || "—"}
            </td>

            <td>
                ${turma.nome || "—"}
            </td>

            <td>
                ${disciplina || "—"}
            </td>

            <td>
                ${mostrarEstadoTabela(estado1)}
            </td>

            <td>
                ${mostrarEstadoTabela(estado2)}
            </td>

            <td>
                ${mostrarEstadoTabela(estado3)}
            </td>

            <td>

                ${botaoAcaoLancamento()}

            </td>

        </tr>

    `;


    atualizarBotaoSistema();

}


// =====================================================
// MOSTRAR ESTADO NA TABELA
// =====================================================

function mostrarEstadoTabela(
    estado
) {

    if (!estado.existe) {

        return `

            <span class="estado-nota fechado">

                🔒 Fechado

            </span>

        `;

    }


    if (
        estado.abertoGeral === true
    ) {

        return `

            <span class="estado-nota lancado">

                🟢 Aberto

            </span>

        `;

    }


    return `

        <span class="estado-nota fechado">

            🔒 Fechado

        </span>

    `;

}


// =====================================================
// BOTÃO DA TABELA
// =====================================================

function botaoAcaoLancamento() {

    if (
        !filtroTrimestre?.value
    ) {

        return `

            <span style="
                color:#64748b;
                font-size:13px;
            ">

                Selecione o trimestre

            </span>

        `;

    }


    const estado =
        lancamentoSelecionado?.estado;


    const aberto =
        estado?.abertoGeral === true;


    return `

        <div style="
            display:flex;
            gap:6px;
            justify-content:center;
            flex-wrap:wrap;
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
                    background:${aberto ? "#dc2626" : "#16a34a"};
                "
                onclick="alternarLancamento()"
            >
                ${aberto ? "🔒 Fechar" : "🔓 Abrir"}
            </button>

        </div>

    `;

}


// =====================================================
// ATUALIZAR BOTÃO DO SISTEMA
// =====================================================

async function atualizarBotaoSistema() {

    if (
        !botaoSistema ||
        !estadoSistema
    ) {

        return;

    }


    if (
        !lancamentoSelecionado
    ) {

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


    const aberto =
        lancamentoSelecionado
            .estado
            .abertoGeral === true;


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
// ABRIR / FECHAR PELO BOTÃO PRINCIPAL
// =====================================================

botaoSistema?.addEventListener(
    "click",
    async function () {

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
// ALTERNAR LANÇAMENTO
// =====================================================

window.alternarLancamento = async function () {

    alert("🔥 CLIQUE NO BOTÃO FOI DETECTADO!");

        if (
            !lancamentoSelecionado
        ) {

            alert(
                "⚠️ Selecione um lançamento primeiro."
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


        try {

            if (novoEstado) {

                const confirmar =
                    confirm(

                        "🔓 Abrir lançamento?\n\n" +

                        "Professor: " +
                        dados.professorNome +

                        "\nClasse: " +
                        dados.classe +

                        "\nTurma: " +
                        dados.turmaNome +

                        "\nDisciplina: " +
                        dados.disciplina +

                        "\nTrimestre: " +
                        dados.trimestre

                    );


                if (!confirmar) {

                    return;

                }

            }

            else {

                const confirmar =
                    confirm(

                        "🔒 Fechar este lançamento?\n\n" +

                        "O professor deixará " +
                        "de poder lançar notas."

                    );


                if (!confirmar) {

                    return;

                }

            }


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
                    merge: true
                }

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
                    ? "✅ Lançamento aberto com sucesso!"
                    : "🔒 Lançamento fechado com sucesso!"
            );

        }

        catch (erro) {

            console.error(
                "Erro ao alterar lançamento:",
                erro
            );


            alert(
                "❌ Não foi possível alterar o estado.\n\n" +
                erro.message
            );

        }

    };


// =====================================================
// VER LANÇAMENTO
// =====================================================

window.verLancamento =
    function () {

        if (
            !lancamentoSelecionado
        ) {

            alert(
                "⚠️ Selecione um lançamento."
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
                "⚠️ Selecione um lançamento."
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
                "⚠️ O navegador bloqueou a janela de impressão."
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

                    h1 {
                        color: #1e3a8a;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 25px;
                    }

                    th,
                    td {
                        border: 1px solid #999;
                        padding: 10px;
                    }

                    th {
                        background: #eee;
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
                            ${dados.trimestre}º Trimestre
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
// PRIMEIRA ATUALIZAÇÃO DO BOTÃO
// =====================================================

atualizarBotaoSistema();
