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

alert("🔥 NOTAS.JS 11 CARREGADO!");

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
// OBTER DADOS COMPLETOS DA MINI-PAUTA
// =====================================================

async function obterDadosMiniPauta() {

    if (!lancamentoSelecionado) {

        throw new Error(
            "Nenhum lançamento selecionado."
        );

    }


    const dados =
        lancamentoSelecionado;


    const id =
        criarIdLancamento(
            dados.turmaId,
            dados.disciplina,
            dados.trimestre
        );


    const referencia =
        doc(
            db,
            "notas",
            id
        );


    const snapshot =
        await getDoc(
            referencia
        );


    if (!snapshot.exists()) {

        throw new Error(
            "A Mini-Pauta ainda não possui lançamento de notas."
        );

    }


    const notas =
        snapshot.data();


    // ---------------------------------------------
    // SEGURANÇA DA ESCOLA
    // ---------------------------------------------

    if (
        notas.escolaId &&
        String(notas.escolaId).trim() !==
        String(escolaId).trim()
    ) {

        throw new Error(
            "Esta Mini-Pauta pertence a outra escola."
        );

    }


    // ---------------------------------------------
    // NOME DA ESCOLA
    // ---------------------------------------------

    let nomeEscola =
        localStorage.getItem(
            "nomeEscola"
        ) ||
        sessionStorage.getItem(
            "nomeEscola"
        ) ||
        "";


    // Se não estiver guardado,
    // tentar buscar no Firestore

    if (!nomeEscola) {

        try {

            const escolaRef =
                doc(
                    db,
                    "escolas",
                    escolaId
                );


            const escolaSnap =
                await getDoc(
                    escolaRef
                );


            if (
                escolaSnap.exists()
            ) {

                const escola =
                    escolaSnap.data();


                nomeEscola =
                    escola.nome ||
                    escola.nomeEscola ||
                    escola.designacao ||
                    "";

            }

        }
        catch (erro) {

            console.warn(
                "Não foi possível obter nome da escola:",
                erro
            );

        }

    }


    if (!nomeEscola) {

        nomeEscola =
            notas.nomeEscola ||
            "ESCOLA";

    }


// =====================================================
    // OBTER ENSINO ATRAVÉS DO ID DA TURMA
    // =====================================================

    let ensino = "";

    try {

        if (dados.turmaId) {

            const turmaRef =
                doc(
                    db,
                    "turmas",
                    dados.turmaId
                );

            const turmaSnap =
                await getDoc(
                    turmaRef
                );


            if (turmaSnap.exists()) {

                const dadosTurma =
                    turmaSnap.data();


                ensino =
                    String(
                        dadosTurma.ensino ||
                        dadosTurma.nivelEnsino ||
                        dadosTurma.nivel ||
                        ""
                    ).trim();


                console.log(
                    "🎓 ENSINO DA TURMA:",
                    ensino
                );

            }

        }

    }
    catch (erro) {

        console.warn(
            "⚠️ Não foi possível obter o ensino da turma:",
            erro
        );

    }


    // =====================================================
    // RETORNAR DADOS COMPLETOS
    // =====================================================

    return {

        escolaId:
            escolaId,

        nomeEscola:
            nomeEscola,

        professorNome:
            notas.professorNome ||
            dados.professorNome ||
            "—",

        classe:
            notas.classe ||
            dados.classe ||
            "—",

        turmaId:
            dados.turmaId,

        turmaNome:
            notas.turmaNome ||
            dados.turmaNome ||
            "—",

        disciplina:
            notas.disciplina ||
            dados.disciplina ||
            "—",

        trimestre:
            notas.trimestre ||
            dados.trimestre ||
            "—",

        // IMPORTANTE:
        // Ensino vem diretamente da turma

        ensino:
            ensino,

        alunos:
            Array.isArray(
                notas.alunos
            )
                ? notas.alunos
                : []

    };
}

// =====================================================
// CONSTRUIR MINI-PAUTA COMPLETA
// =====================================================

function construirMiniPautaHTML(
    dados
) {

    alert("🔥 ENTROU NA CONSTRUIR MINI-PAUTA");

const alunos =
    dados.alunos || [];

alert(
    "ALUNOS ENCONTRADOS: " +
    alunos.length
);
    
// =====================================================
// ESTATÍSTICAS DA MINI-PAUTA
// =====================================================

const ensino =
    String(
        dados.ensino || ""
    )
    .toLowerCase()
    .trim();


// =====================================================
// IDENTIFICAR O ENSINO
// =====================================================

const primeiroCiclo =
    ensino.includes("primeiro") &&
    ensino.includes("ciclo");


console.log(
    "🎓 ENSINO:",
    dados.ensino
);

console.log(
    "🎓 PRIMEIRO CICLO:",
    primeiroCiclo
);


// =====================================================
// CLASSIFICAÇÕES
// =====================================================

const classificacoes =
    primeiroCiclo

        ? [

            {
                nome: "Mau",
                minimo: 0,
                maximo: 4
            },

            {
                nome: "Medíocre",
                minimo: 5,
                maximo: 9
            },

            {
                nome: "Suficiente",
                minimo: 10,
                maximo: 13
            },

            {
                nome: "Bom",
                minimo: 14,
                maximo: 16
            },

            {
                nome: "Muito Bom",
                minimo: 17,
                maximo: 20
            }

        ]

        : [

            {
                nome: "Mau",
                minimo: 0,
                maximo: 2
            },

            {
                nome: "Medíocre",
                minimo: 3,
                maximo: 4
            },

            {
                nome: "Suficiente",
                minimo: 5,
                maximo: 6
            },

            {
                nome: "Bom",
                minimo: 7,
                maximo: 8
            },

            {
                nome: "Muito Bom",
                minimo: 9,
                maximo: 10
            }

        ];


// =====================================================
// CONTADORES
// =====================================================

const estatistica =
    classificacoes.map(
        item => ({

            nome:
                item.nome,

            minimo:
                item.minimo,

            maximo:
                item.maximo,

            M: 0,

            F: 0,

            total: 0

        })
    );


let desistidos = 0;

let transferidos = 0;

let alunosValidos = 0;

let bomAproveitamento = 0;

let semBomAproveitamento = 0;


// =====================================================
// ANALISAR TODOS OS ALUNOS
// =====================================================

alunos.forEach(
    aluno => {

        console.log(
            "📊 ALUNO PARA ESTATÍSTICA:",
            aluno
        );


        // ---------------------------------------------
        // ESTADO
        // ---------------------------------------------

        const estado =
            String(
                aluno.estado || ""
            )
            .toLowerCase()
            .trim();


        if (
            estado.includes("desist")
        ) {

            desistidos++;

            return;

        }


        if (
            estado.includes("transfer")
        ) {

            transferidos++;

            return;

        }


        // ---------------------------------------------
        // OBTER MF
        // ---------------------------------------------

        let valorMF =
            aluno.MF;


        // aceitar também mf caso exista

        if (
            valorMF === undefined ||
            valorMF === null ||
            valorMF === ""
        ) {

            valorMF =
                aluno.mf;

        }


        // ---------------------------------------------
        // CONVERTER MF
        // ---------------------------------------------

        const mf =
            Number(
                String(
                    valorMF ?? ""
                )
                .replace(",", ".")
                .trim()
            );


        console.log(
            "📌 MF:",
            valorMF,
            "→",
            mf
        );


        // ---------------------------------------------
        // MF INVÁLIDA
        // ---------------------------------------------

        if (
            !Number.isFinite(mf)
        ) {

            console.warn(
                "⚠️ MF inválida:",
                aluno
            );

            return;

        }


        alunosValidos++;


        // ---------------------------------------------
        // SEXO
        // ---------------------------------------------

        const sexo =
            String(
                aluno.sexo || ""
            )
            .toUpperCase()
            .trim();


        // ---------------------------------------------
        // LOCALIZAR CLASSIFICAÇÃO
        // ---------------------------------------------

        const linha =
            estatistica.find(
                item =>

                    mf >= item.minimo &&
                    mf <= item.maximo
            );


        if (!linha) {

            console.warn(
                "⚠️ MF fora da escala:",
                mf,
                aluno
            );

            return;

        }


        // ---------------------------------------------
        // MASCULINO
        // ---------------------------------------------

        if (
            sexo === "M" ||
            sexo === "MASCULINO"
        ) {

            linha.M++;

        }


        // ---------------------------------------------
        // FEMININO
        // ---------------------------------------------

        else if (
            sexo === "F" ||
            sexo === "FEMININO"
        ) {

            linha.F++;

        }


        // ---------------------------------------------
        // TOTAL
        // ---------------------------------------------

        linha.total++;


        // ---------------------------------------------
        // BOM APROVEITAMENTO
        // ---------------------------------------------

        const minimoBom =
            primeiroCiclo
                ? 14
                : 7;


        if (
            mf >= minimoBom
        ) {

            bomAproveitamento++;

        }
        else {

            semBomAproveitamento++;

        }

    }
);


// =====================================================
// TOTAIS
// =====================================================

const totalM =
    estatistica.reduce(
        (soma, item) =>
            soma + item.M,
        0
    );


const totalF =
    estatistica.reduce(
        (soma, item) =>
            soma + item.F,
        0
    );


const totalClassificados =
    estatistica.reduce(
        (soma, item) =>
            soma + item.total,
        0
    );


// =====================================================
// PERCENTAGENS
// =====================================================

const percentBom =
    alunosValidos > 0
        ? (
            bomAproveitamento /
            alunosValidos
        ) * 100
        : 0;


const percentSemBom =
    alunosValidos > 0
        ? (
            semBomAproveitamento /
            alunosValidos
        ) * 100
        : 0;


console.log(
    "📊 ESTATÍSTICA FINAL:",
    estatistica
);

console.log(
    "👨 M:",
    totalM
);

console.log(
    "👩 F:",
    totalF
);

console.log(
    "👥 TOTAL:",
    totalClassificados
);

console.log(
    "🎓 VÁLIDOS:",
    alunosValidos
);

console.log(
    "🚫 DESISTIDOS:",
    desistidos
);

console.log(
    "🔄 TRANSFERIDOS:",
    transferidos
);
    
    let linhas =
        "";

    alunos.forEach(
        (aluno, indice) => {

            const numero =
                aluno.numero ??
                (indice + 1);


            const nome =
                aluno.nome ||
                "—";


            const sexo =
                aluno.sexo ||
                "—";


            const mac =
                aluno.MAC !== null &&
                aluno.MAC !== undefined &&
                aluno.MAC !== ""
                    ? aluno.MAC
                    : "";


            const npt =
                aluno.NPT !== null &&
                aluno.NPT !== undefined &&
                aluno.NPT !== ""
                    ? aluno.NPT
                    : "";


            const mf =
                aluno.MF !== null &&
                aluno.MF !== undefined &&
                aluno.MF !== ""
                    ? aluno.MF
                    : "";


            const classificacao =
                aluno.classificacao ||
                "";


            linhas += `

                <tr>

                    <td>
                        ${numero}
                    </td>

                    <td class="nome">
                        ${nome}
                    </td>

                    <td>
                        ${sexo}
                    </td>

                    <td>
                        ${mac}
                    </td>

                    <td>
                        ${npt}
                    </td>

                    <td>
                        ${mf}
                    </td>

                    <td class="classificacao">
                        ${classificacao}
                    </td>

                </tr>

            `;

        }
    );


    if (!linhas) {

        linhas = `

            <tr>

                <td
                    colspan="7"
                    style="padding:20px"
                >
                    Nenhum aluno encontrado.
                </td>

            </tr>

        `;

    }

    // =====================================================
// CONSTRUIR TABELA DE ESTATÍSTICA
// =====================================================

let linhasEstatistica = "";


estatistica.forEach(
    item => {

        linhasEstatistica += `

            <tr>

                <td>
                    ${item.nome}
                    (${item.minimo}-${item.maximo})
                </td>

                <td>
                    ${item.M}
                </td>

                <td>
                    ${item.F}
                </td>

                <td>
                    ${item.total}
                </td>

            </tr>

        `;

    }
);


linhasEstatistica += `

    <tr class="linha-total">

        <td>
            <strong>Total</strong>
        </td>

        <td>
            <strong>${totalM}</strong>
        </td>

        <td>
            <strong>${totalF}</strong>
        </td>

        <td>
            <strong>${totalClassificados}</strong>
        </td>

    </tr>

`;

    return `

<!DOCTYPE html>

<html lang="pt">

<head>

<meta charset="UTF-8">

<title>
    Mini-Pauta — ${dados.turmaNome}
</title>


<style>

*{
    box-sizing:border-box;
}


body{

    margin:0;

    padding:25px;

    font-family:Arial,
        Helvetica,
        sans-serif;

    color:#111;

    background:white;

}


.pauta{

    width:100%;

    max-width:1100px;

    margin:auto;

}


.cabecalho{

    text-align:center;

    border-bottom:3px solid #1e3a8a;

    padding-bottom:12px;

    margin-bottom:15px;

}


.cabecalho h1{

    margin:0;

    font-size:22px;

    text-transform:uppercase;

}


.cabecalho h2{

    margin:6px 0;

    font-size:18px;

}


.cabecalho p{

    margin:4px 0;

    font-size:14px;

}


.informacoes{

    display:grid;

    grid-template-columns:
        1fr 1fr;

    gap:6px 25px;

    margin-bottom:15px;

    font-size:14px;

}


.informacoes div{

    border-bottom:1px solid #ccc;

    padding:5px;

}


table{

    width:100%;

    border-collapse:collapse;

    font-size:12px;

}


th,
td{

    border:1px solid #222;

    padding:6px;

    text-align:center;

}


th{

    background:#e5e7eb;

    font-weight:bold;

}


td.nome{

    text-align:left;

}


td.classificacao{

    text-align:center;

}


.assinatura{

    margin-top:60px;

    text-align:center;

}


.linha-assinatura{

    width:280px;

    border-top:1px solid #111;

    margin:45px auto 5px;

}


.rodape{

    margin-top:45px;

    padding-top:10px;

    border-top:1px solid #aaa;

    text-align:center;

    font-size:11px;

    color:#555;

}


@media print{

    body{

        padding:10px;

    }


    .pauta{

        max-width:none;

    }


    @page{

        size:A4 portrait;

        margin:10mm;

    }

}

<style>

.estatisticas {
    margin-top: 12px;
    page-break-inside: avoid;
}

.estatisticas h3 {
    margin: 0 0 5px;
    font-size: 11px;
    text-align: left;
    text-transform: uppercase;
}

.estatisticas table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9px;
}

.estatisticas th,
.estatisticas td {
    border: 1px solid #222;
    padding: 3px 5px;
    text-align: center;
}

.estatisticas th {
    background: #e5e7eb;
}

.estatisticas .linha-total {
    background: #f1f5f9;
}

.resumo-aproveitamento {
    margin-top: 6px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
    font-size: 9px;
}

.resumo-aproveitamento div {
    border: 1px solid #aaa;
    padding: 4px;
}

@media print {

    @page {
        size: A4 portrait;
        margin: 7mm;
    }

    body {
        padding: 0;
    }

    .pauta {
        max-width: none;
    }

}
</style>

</head>


<body>


<div class="pauta">


    <!-- =========================================
         CABEÇALHO
    ========================================== -->

    <div class="cabecalho">

        <h1>
            ${dados.nomeEscola}
        </h1>

        <h2>
            MINI-PAUTA DE AVALIAÇÃO
        </h2>

        <p>
            Sistema de Gestão Escolar — SGE
        </p>

    </div>


    <!-- =========================================
         INFORMAÇÕES
    ========================================== -->

    <div class="informacoes">

        <div>
            <strong>Classe:</strong>
            ${dados.classe}
        </div>


        <div>
            <strong>Turma:</strong>
            ${dados.turmaNome}
        </div>


        <div>
            <strong>Disciplina:</strong>
            ${dados.disciplina}
        </div>


        <div>
    <strong>Trimestre:</strong>
    ${dados.trimestre}.º Trimestre
</div>


        <div>
            <strong>Professor:</strong>
            ${dados.professorNome}
        </div>


        <div>
            <strong>Total de alunos:</strong>
            ${alunos.length}
        </div>

    </div>


    <!-- =========================================
         TABELA
    ========================================== -->

    <table>

        <thead>

            <tr>

                <th>
                    Nº
                </th>

                <th>
                    Nome do Aluno
                </th>

                <th>
                    Sexo
                </th>

                <th>
                    MAC
                </th>

                <th>
                    NPT
                </th>

                <th>
                    MF
                </th>

                <th>
                    Classificação
                </th>

            </tr>

        </thead>


        <tbody>

            ${linhas}

        </tbody>

   </table>


<!-- =========================================
     ESTATÍSTICA DA MINI-PAUTA
========================================== -->

<div class="estatisticas">

    <h3>
        Estatística do Aproveitamento
    </h3>


    <table>

        <thead>

            <tr>

                <th>
                    Classificação
                </th>

                <th>
                    M
                </th>

                <th>
                    F
                </th>

                <th>
                    Total
                </th>

            </tr>

        </thead>


        <tbody>

            ${linhasEstatistica}

        </tbody>

    </table>


    <div class="resumo-aproveitamento">

        <div>

            <strong>
                Bom aproveitamento
            </strong>

            <br>

            ${bomAproveitamento}
            —
            ${percentBom.toFixed(1)}%

        </div>


        <div>

            <strong>
                Sem bom aproveitamento
            </strong>

            <br>

            ${semBomAproveitamento}
            —
            ${percentSemBom.toFixed(1)}%

        </div>


        <div>

            <strong>
                Desistidos
            </strong>

            <br>

            ${desistidos}

        </div>


        <div>

            <strong>
                Transferidos
            </strong>

            <br>

            ${transferidos}

        </div>

    </div>

</div>

<!-- =========================================
     ASSINATURA
========================================= -->

    <div class="assinatura">

        <p>
            O Professor
        </p>


        <div class="linha-assinatura"></div>


        <strong>
            ${dados.professorNome}
        </strong>

    </div>


    <!-- =========================================
         RODAPÉ
    ========================================== -->

    <div class="rodape">

        SGE — Sistema de Gestão Escolar

        <br>

        Mini-Pauta gerada pelo Sistema de Gestão Escolar

    </div>


</div>


</body>

</html>

`;

}


// =====================================================
// VER MINI-PAUTA
// =====================================================

window.verLancamento =
async function () {

    alert("TESTE A — ENTROU NO VER LANÇAMENTO");


    if (!lancamentoSelecionado) {

        alert(
            "TESTE B — NÃO HÁ LANÇAMENTO"
        );

        return;

    }


    try {

        alert(
            "TESTE C — ANTES DE obterDadosMiniPauta"
        );


        const dados =
            await obterDadosMiniPauta();


        alert(
            "TESTE D — obterDadosMiniPauta TERMINOU"
        );


        console.log(
            "DADOS RECEBIDOS:",
            dados
        );


        const janela =
            window.open(
                "",
                "_blank"
            );


        alert(
            "TESTE E — janela aberta"
        );


        if (!janela) {

            alert(
                "TESTE F — navegador bloqueou"
            );

            return;

        }


        alert(
            "TESTE G — ANTES DE construirMiniPautaHTML"
        );


        janela.document.write(
            construirMiniPautaHTML(
                dados
            )
        );


        alert(
            "TESTE H — construirMiniPautaHTML TERMINOU"
        );


        janela.document.close();


    }

    catch (erro) {

        alert(
            "ERRO:\n\n" +
            erro.message
        );


        console.error(
            "ERRO COMPLETO:",
            erro
        );

    }

};


// =====================================================
// IMPRIMIR MINI-PAUTA
// =====================================================

window.imprimirLancamento =
async function () {

    if (!lancamentoSelecionado) {

        alert(
            "⚠️ Nenhum lançamento selecionado."
        );

        return;

    }


    try {

        const dados =
            await obterDadosMiniPauta();


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


        janela.document.write(
            construirMiniPautaHTML(
                dados
            )
        );


        janela.document.close();


        janela.onload =
            function () {

                janela.focus();

                janela.print();

            };


        console.log(
            "🖨️ MINI-PAUTA ENVIADA PARA IMPRESSÃO."
        );

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO IMPRIMIR MINI-PAUTA:",
            erro
        );


        alert(
            "❌ Não foi possível imprimir a Mini-Pauta.\n\n" +
            erro.message
        );

    }

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
