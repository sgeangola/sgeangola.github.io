// =====================================================
// NOTAS.JS — ADMINISTRADOR
// SGE ANGOLA
// =====================================================

alert("🔥 NOTAS.JS DG CARREGADO!");

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

    throw new Error("escolaId não encontrado.");
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
// MENSAGENS
// =====================================================

function mostrarMensagem(texto, tipo = "aviso") {

    if (!mensagem) return;

    mensagem.textContent = texto;

    mensagem.className =
        "mensagem visivel " + tipo;
}


function esconderMensagem() {

    if (!mensagem) return;

    mensagem.textContent = "";

    mensagem.className = "mensagem";
}


// =====================================================
// CRIAR ID DO LANÇAMENTO
// =====================================================

function criarIdLancamento(
    turmaId,
    disciplina,
    trimestre
) {

    const turma =
        String(turmaId || "")
            .trim();

    const materia =
        String(disciplina || "")
            .trim()
            .replace(/\//g, "-")
            .replace(/\s+/g, "_");

    const tri =
        String(trimestre || "")
            .replace("º", "")
            .replace("°", "")
            .replace("ª", "")
            .replace("Trimestre", "")
            .replace(/\s+/g, "")
            .trim();

    return `${turma}_${materia}_${tri}`;
}


// =====================================================
// CARREGAR PROFESSORES
// =====================================================

async function carregarProfessores() {

    professores = [];

    const resultado =
        await getDocs(
            query(
                collection(db, "professores"),
                where("escolaId", "==", escolaId)
            )
        );

    resultado.forEach(documento => {

        professores.push({
            id: documento.id,
            ...documento.data()
        });

    });

    professores.sort((a, b) =>
        String(a.nome || "")
            .localeCompare(
                String(b.nome || ""),
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
                collection(db, "turmas"),
                where("escolaId", "==", escolaId)
            )
        );

    resultado.forEach(documento => {

        turmas.push({
            id: documento.id,
            ...documento.data()
        });

    });

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

    professores.forEach(professor => {

        const option =
            document.createElement("option");

        option.value =
            professor.id;

        option.textContent =
            professor.codigoProfessor
                ? `${professor.codigoProfessor} — ${professor.nome}`
                : (
                    professor.nome ||
                    "Professor sem nome"
                );

        filtroProfessor.appendChild(option);

    });
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

function carregarClassesDoProfessor(professorId) {

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
                professor.id === professorId
        ) || null;

    if (!professorSelecionado) return;

    const atribuicoes =
        Array.isArray(
            professorSelecionado.atribuicoes
        )
            ? professorSelecionado.atribuicoes
            : [];

    const classes = new Map();

    atribuicoes.forEach(atribuicao => {

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

    });

    classes.forEach(classe => {

        const option =
            document.createElement("option");

        option.value = classe;
        option.textContent = classe;

        filtroClasse.appendChild(option);

    });

    filtroClasse.disabled =
        classes.size === 0;
}


// =====================================================
// CLASSE → TURMAS
// =====================================================

function carregarTurmasDaClasse(classe) {

    if (!filtroTurma) return;

    filtroTurma.innerHTML = `
        <option value="">
            Selecionar turma
        </option>
    `;

    filtroTurma.disabled = true;

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
                .filter(atribuicao =>
                    String(
                        atribuicao.classe || ""
                    ).trim() ===
                    String(classe).trim()
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
            .map(id =>
                turmas.find(
                    turma =>
                        turma.id === id
                )
            )
            .filter(Boolean);

    turmasEncontradas.forEach(turma => {

        const option =
            document.createElement("option");

        option.value = turma.id;

        option.textContent =
            turma.nome ||
            turma.turma ||
            turma.designacao ||
            "Turma";

        filtroTurma.appendChild(option);

    });

    filtroTurma.disabled =
        turmasEncontradas.length === 0;

    console.log(
        "🏫 TURMAS DA CLASSE:",
        turmasEncontradas
    );
}


// =====================================================
// TURMA → DISCIPLINAS
// =====================================================

function carregarDisciplinasDaTurma(turmaId) {

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

    atribuicoes.forEach(atribuicao => {

        if (
            String(
                atribuicao.turmaId || ""
            ).trim() !==
            String(turmaId).trim()
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

    });

    disciplinas.forEach(disciplina => {

        const option =
            document.createElement("option");

        option.value = disciplina;
        option.textContent = disciplina;

        filtroDisciplina.appendChild(option);

    });

    filtroDisciplina.disabled =
        disciplinas.size === 0;

    console.log(
        "📚 DISCIPLINAS:",
        [...disciplinas]
    );
}


// =====================================================
// ESTADO DO LANÇAMENTO
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
            await getDoc(referencia);

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
            String(dados.escolaId).trim() !==
            String(escolaId).trim()
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
            dados: dados
        };

    }
    catch (erro) {

        console.error(
            "❌ ERRO AO OBTER ESTADO:",
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

    const trimestre =
        filtroTrimestre?.value;


    if (
        !professorId ||
        !classe ||
        !turmaId ||
        !disciplina
    ) {

        return;
    }


    if (!trimestre) {

        lancamentoSelecionado = null;

        if (notasLista) {

            notasLista.innerHTML = `
                <tr>
                    <td colspan="8">
                        Selecione um trimestre.
                    </td>
                </tr>
            `;
        }

        atualizarBotaoSistema();

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


    if (notasLista) {

        notasLista.innerHTML = `
            <tr>
                <td colspan="8">
                    ⏳ A verificar lançamento...
                </td>
            </tr>
        `;
    }


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
            professor.nome || "—",

        classe:
            classe,

        turmaId:
            turma.id,

        turmaNome:
            turma.nome ||
            turma.turma ||
            turma.designacao ||
            "—",

        disciplina:
            disciplina,

        trimestre:
            trimestre,

        estado:
            estado

    };


    if (notasLista) {

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
                        turma.designacao ||
                        "—"
                    }
                </td>

                <td>
                    ${disciplina || "—"}
                </td>

                <td>
                    ${mostrarEstadoTabela(estado)}
                </td>

                <td>—</td>

                <td>—</td>

                <td>
                    ${botaoAcaoLancamento()}
                </td>

            </tr>

        `;
    }


    atualizarBotaoSistema();
}


// =====================================================
// ESTADO DA TABELA
// =====================================================

function mostrarEstadoTabela(estado) {

    if (!estado.existe) {

        return "🔒 Fechado";
    }

    if (estado.abertoGeral === true) {

        return "🟢 Aberto";
    }

    return "🔒 Fechado";
}


// =====================================================
// BOTÕES DO LANÇAMENTO
// =====================================================

function botaoAcaoLancamento() {

    if (!lancamentoSelecionado) {
        return "";
    }

    const aberto =
        lancamentoSelecionado
            .estado
            ?.abertoGeral === true;


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
                    background:${aberto
                        ? "#dc2626"
                        : "#16a34a"};
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
// ATUALIZAR BOTÃO PRINCIPAL
// =====================================================

function atualizarBotaoSistema() {

    if (
        !botaoSistema ||
        !estadoSistema
    ) {
        return;
    }


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


    const aberto =
        lancamentoSelecionado
            .estado
            ?.abertoGeral === true;


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
// BOTÃO PRINCIPAL DO SISTEMA
// =====================================================

botaoSistema?.addEventListener(
    "click",
    async function () {

        if (!lancamentoSelecionado) {

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
// ABRIR / FECHAR LANÇAMENTO
// =====================================================

window.alternarLancamento =
async function () {

    if (!lancamentoSelecionado) {

        alert(
            "⚠️ Nenhum lançamento selecionado."
        );

        return;
    }


    const dados =
        lancamentoSelecionado;


    const abertoAtual =
        dados.estado?.abertoGeral === true;


    const novoEstado =
        !abertoAtual;


    const id =
        criarIdLancamento(
            dados.turmaId,
            dados.disciplina,
            dados.trimestre
        );


    const confirmar =
        confirm(
            novoEstado
                ? "🔓 Abrir este lançamento?"
                : "🔒 Fechar este lançamento?"
        );


    if (!confirmar) {
        return;
    }


    try {

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
                ? "🟢 LANÇAMENTO ABERTO COM SUCESSO!"
                : "🔒 LANÇAMENTO FECHADO COM SUCESSO!"
        );

    }
    catch (erro) {

        console.error(
            "❌ ERRO AO ABRIR/FECHAR:",
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


    // =================================================
    // BUSCAR DOCUMENTO DAS NOTAS
    // =================================================

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


    const notas =
        snapshot.exists()
            ? snapshot.data()
            : {};


    // =================================================
    // SEGURANÇA DA ESCOLA
    // =================================================

    if (
        notas.escolaId &&
        String(notas.escolaId).trim() !==
        String(escolaId).trim()
    ) {

        throw new Error(
            "Esta Mini-Pauta pertence a outra escola."
        );
    }


    // =================================================
    // NOME DA ESCOLA
    // =================================================

    let nomeEscola =
        localStorage.getItem("nomeEscola") ||
        sessionStorage.getItem("nomeEscola") ||
        "";


    if (!nomeEscola) {

        try {

            const escolaSnap =
                await getDoc(
                    doc(
                        db,
                        "escolas",
                        escolaId
                    )
                );


            if (escolaSnap.exists()) {

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
                "⚠️ Não foi possível obter nome da escola:",
                erro
            );
        }
    }


    if (!nomeEscola) {

        nomeEscola =
            notas.nomeEscola ||
            "ESCOLA";
    }


    // =================================================
    // BUSCAR A TURMA
    // =================================================

    let ensino = "";
    let alunosDaTurma = [];


    if (!dados.turmaId) {

        throw new Error(
            "turmaId não encontrado."
        );
    }


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


    if (!turmaSnap.exists()) {

        throw new Error(
            "Turma não encontrada."
        );
    }


    const dadosTurma =
        turmaSnap.data();


    // =================================================
    // IDENTIFICAR ENSINO
    // =================================================

    ensino =
        String(
            dadosTurma.ensino ||
            dadosTurma.nivelEnsino ||
            dadosTurma.nivel ||
            ""
        )
        .trim();


    console.log(
        "🎓 TURMA:",
        dados.turmaId
    );

    console.log(
        "🎓 ENSINO:",
        ensino
    );


    // =================================================
    // BUSCAR ALUNOS DA TURMA
    // =================================================

    const alunosRef =
        collection(
            db,
            "turmas",
            dados.turmaId,
            "alunos"
        );


    const alunosSnap =
        await getDocs(
            alunosRef
        );


    alunosSnap.forEach(documento => {

        alunosDaTurma.push({

            id:
                documento.id,

            ...documento.data()

        });

    });


    console.log(
        "👨‍🎓 ALUNOS DA TURMA:",
        alunosDaTurma
    );


    console.log(
        "👨‍🎓 QUANTIDADE:",
        alunosDaTurma.length
    );


    // =================================================
    // NOTAS LANÇADAS
    // =================================================

    const notasLancadas =
        Array.isArray(notas.alunos)
            ? notas.alunos
            : [];


  // =================================================
// ASSOCIAR NOTAS AOS ALUNOS
// =================================================

const alunosComNotas =
    alunosDaTurma.map(
        (aluno, indice) => {

            const matriculaAluno =
                String(
                    aluno.matricula ??
                    aluno.codigoAluno ??
                    aluno.numeroMatricula ??
                    ""
                )
                .trim();


            // =================================================
            // PROCURAR NOTA DO ALUNO
            // =================================================

            const notaEncontrada =
                notasLancadas.find(
                    nota => {

                        const matriculaNota =
                            String(
                                nota.matricula ??
                                nota.codigoAluno ??
                                nota.numeroMatricula ??
                                ""
                            )
                            .trim();


                        return (
                            matriculaAluno !== "" &&
                            matriculaNota !== "" &&
                            matriculaAluno ===
                            matriculaNota
                        );

                    }
                );


            // =================================================
            // RECUPERAR MAC
            // =================================================

            const MAC =
                notaEncontrada?.MAC ??
                notaEncontrada?.mac ??
                notaEncontrada?.Mac ??
                aluno.MAC ??
                aluno.mac ??
                "";


            // =================================================
            // RECUPERAR NPT
            // =================================================

            const NPT =
                notaEncontrada?.NPT ??
                notaEncontrada?.npt ??
                notaEncontrada?.Npt ??
                aluno.NPT ??
                aluno.npt ??
                "";


            // =================================================
            // RECUPERAR MF
            // =================================================

            const MF =
                notaEncontrada?.MF ??
                notaEncontrada?.mf ??
                notaEncontrada?.Mf ??
                aluno.MF ??
                aluno.mf ??
                "";


            // =================================================
            // RECUPERAR CLASSIFICAÇÃO
            // =================================================

            const classificacao =
                notaEncontrada?.classificacao ??
                notaEncontrada?.Classificacao ??
                aluno.classificacao ??
                "";


            console.log(
                "📝 ALUNO + NOTAS:",
                {
                    nome:
                        aluno.nome ||
                        aluno.nomeAluno,

                    matricula:
                        matriculaAluno,

                    notaEncontrada:
                        notaEncontrada,

                    MAC:
                        MAC,

                    NPT:
                        NPT,

                    MF:
                        MF,

                    classificacao:
                        classificacao
                }
            );


            // =================================================
            // DEVOLVER ALUNO COM AS NOTAS
            // =================================================

            return {

                ...aluno,

                numero:
                    aluno.numero ??
                    aluno.n ??
                    (indice + 1),

                MAC:
                    MAC,

                NPT:
                    NPT,

                MF:
                    MF,

                classificacao:
                    classificacao

            };

        }
    );


// =================================================
// RETORNAR DADOS COMPLETOS
// =================================================

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
        dadosTurma.nome ||
        dadosTurma.turma ||
        "—",

    disciplina:

        notas.disciplina ||
        dados.disciplina ||
        "—",

    trimestre:

        notas.trimestre ||
        dados.trimestre ||
        "—",

    ensino:

        ensino,

    alunos:

        alunosComNotas,

    notasLancadas:

        notasLancadas

};

// =====================================================
// CONSTRUIR MINI-PAUTA HTML
// =====================================================

async function construirMiniPautaHTML(dados) {

    const alunos =
        Array.isArray(dados.alunos)
            ? dados.alunos
            : [];


    // =================================================
    // IDENTIFICAR ENSINO
    // =================================================

    const ensinoNormalizado =
        String(dados.ensino || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();


    const primeiroCiclo =
        ensinoNormalizado.includes(
            "primeiro ciclo"
        ) ||
        ensinoNormalizado.includes(
            "1 ciclo"
        ) ||
        ensinoNormalizado === "1c" ||
        ensinoNormalizado.includes(
            "primeiro"
        );


    // =================================================
    // ESCALA
    // =================================================

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


    // =================================================
    // ESTATÍSTICAS
    // =================================================

    const estatistica =
        classificacoes.map(item => ({

            nome:
                item.nome,

            minimo:
                item.minimo,

            maximo:
                item.maximo,

            M: 0,

            F: 0,

            total: 0

        }));


    let desistidos = 0;
    let transferidos = 0;
    let alunosValidos = 0;
    let bomAproveitamento = 0;
    let semBomAproveitamento = 0;


    alunos.forEach(aluno => {

        const estado =
            String(
                aluno.estado || ""
            )
            .toLowerCase()
            .trim();


        if (estado.includes("desist")) {

            desistidos++;

            return;
        }


        if (estado.includes("transfer")) {

            transferidos++;

            return;
        }


        const valorMF =
            aluno.MF ??
            aluno.mf ??
            aluno.Mf ??
            aluno.mediaFinal ??
            aluno.mediaFinalGeral;


        const mf =
            Number(
                String(valorMF ?? "")
                    .replace(",", ".")
                    .trim()
            );


        if (!Number.isFinite(mf)) {
            return;
        }


        alunosValidos++;


        const sexo =
            String(
                aluno.sexo ??
                aluno.Sexo ??
                aluno.genero ??
                ""
            )
            .toUpperCase()
            .trim();


        const linha =
            estatistica.find(
                item =>
                    mf >= item.minimo &&
                    mf <= item.maximo
            );


        if (!linha) {
            return;
        }


        if (
            sexo === "M" ||
            sexo === "MASCULINO"
        ) {

            linha.M++;

        }
        else if (
            sexo === "F" ||
            sexo === "FEMININO"
        ) {

            linha.F++;

        }


        linha.total++;


        const minimoSuficiente =
            primeiroCiclo
                ? 10
                : 5;


        if (mf >= minimoSuficiente) {

            bomAproveitamento++;

        }
        else {

            semBomAproveitamento++;

        }

    });


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


    // =================================================
    // TABELA DOS ALUNOS
    // =================================================

    let linhas = "";


    alunos.forEach((aluno, indice) => {

        const numero =
            aluno.numero ??
            (indice + 1);


        const nome =
            aluno.nome ||
            aluno.nomeAluno ||
            "—";


        const sexo =
            aluno.sexo ||
            aluno.Sexo ||
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
    });


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


    // =================================================
    // TABELA ESTATÍSTICA
    // =================================================

    let linhasEstatistica = "";


    estatistica.forEach(item => {

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
    });


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


    // =================================================
    // HTML FINAL
    // =================================================

    return `

<!DOCTYPE html>

<html lang="pt">

<head>

<meta charset="UTF-8">

<title>
    Mini-Pauta — ${dados.turmaNome}
</title>

<style>

* {
    box-sizing: border-box;
}

body {

    margin: 0;

    padding: 25px;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    color: #111;

    background: white;
}

.pauta {

    width: 100%;

    max-width: 1100px;

    margin: auto;
}

.cabecalho {

    text-align: center;

    border-bottom:
        3px solid #1e3a8a;

    padding-bottom: 12px;

    margin-bottom: 15px;
}

.cabecalho h1 {

    margin: 0;

    font-size: 22px;

    text-transform: uppercase;
}

.cabecalho h2 {

    margin: 6px 0;

    font-size: 18px;
}

.cabecalho p {

    margin: 4px 0;

    font-size: 14px;
}

.informacoes {

    display: grid;

    grid-template-columns:
        1fr 1fr;

    gap: 6px 25px;

    margin-bottom: 15px;

    font-size: 14px;
}

.informacoes div {

    border-bottom:
        1px solid #ccc;

    padding: 5px;
}

table {

    width: 100%;

    border-collapse:
        collapse;

    font-size: 12px;
}

th,
td {

    border:
        1px solid #222;

    padding: 6px;

    text-align: center;
}

th {

    background:
        #e5e7eb;

    font-weight: bold;
}

td.nome {

    text-align: left;
}

td.classificacao {

    text-align: center;
}

.estatisticas {

    margin-top: 12px;

    page-break-inside:
        avoid;
}

.estatisticas h3 {

    margin:
        0 0 5px;

    font-size: 11px;

    text-align: left;

    text-transform:
        uppercase;
}

.estatisticas table {

    width: 100%;

    border-collapse:
        collapse;

    font-size: 9px;
}

.estatisticas th,
.estatisticas td {

    border:
        1px solid #222;

    padding:
        3px 5px;

    text-align:
        center;
}

.estatisticas th {

    background:
        #e5e7eb;
}

.linha-total {

    background:
        #f1f5f9;
}

.resumo-aproveitamento {

    margin-top: 6px;

    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap: 5px;

    font-size: 9px;
}

.resumo-aproveitamento div {

    border:
        1px solid #aaa;

    padding: 4px;
}

.assinatura {

    margin-top: 60px;

    text-align: center;
}

.linha-assinatura {

    width: 280px;

    border-top:
        1px solid #111;

    margin:
        45px auto 5px;
}

.rodape {

    margin-top: 45px;

    padding-top: 10px;

    border-top:
        1px solid #aaa;

    text-align: center;

    font-size: 11px;

    color: #555;
}

@media print {

    body {
        padding: 0;
    }

    .pauta {
        max-width: none;
    }

    @page {
        size: A4 portrait;
        margin: 7mm;
    }
}

</style>

</head>

<body>

<div class="pauta">

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


    <table>

        <thead>

            <tr>

                <th>Nº</th>

                <th>Nome do Aluno</th>

                <th>Sexo</th>

                <th>MAC</th>

                <th>NPT</th>

                <th>MF</th>

                <th>Classificação</th>

            </tr>

        </thead>

        <tbody>

            ${linhas}

        </tbody>

    </table>


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


    <div class="assinatura">

        <p>
            O Professor
        </p>

        <div class="linha-assinatura"></div>

        <strong>
            ${dados.professorNome}
        </strong>

    </div>


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

    if (!lancamentoSelecionado) {

        alert(
            "⚠️ Nenhum lançamento selecionado."
        );

        return;
    }


    // Abre imediatamente para evitar bloqueio
    const janela =
        window.open(
            "",
            "_blank"
        );


    if (!janela) {

        alert(
            "❌ O navegador bloqueou a nova janela.\n\n" +
            "Permita pop-ups para este site."
        );

        return;
    }


    janela.document.write(`

        <!DOCTYPE html>

        <html lang="pt">

        <head>

            <meta charset="UTF-8">

            <title>
                Mini-Pauta
            </title>

            <style>

                body {

                    font-family:
                        Arial,
                        sans-serif;

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    min-height:
                        100vh;

                    margin: 0;

                    background:
                        #f8fafc;

                    color:
                        #1e3a8a;
                }

                .carregando {

                    text-align:
                        center;

                    padding:
                        30px;
                }

            </style>

        </head>

        <body>

            <div class="carregando">

                <h2>
                    ⏳ A carregar Mini-Pauta...
                </h2>

                <p>
                    Aguarde um momento.
                </p>

            </div>

        </body>

        </html>

    `);

    janela.document.close();


    try {

        const dados =
            await obterDadosMiniPauta();


        console.log(
            "✅ DADOS DA MINI-PAUTA:",
            dados
        );


        const html =
            await construirMiniPautaHTML(
                dados
            );


        janela.document.open();

        janela.document.write(html);

        janela.document.close();

    }
    catch (erro) {

        console.error(
            "❌ ERRO AO ABRIR MINI-PAUTA:",
            erro
        );


        janela.document.open();

        janela.document.write(`

            <!DOCTYPE html>

            <html lang="pt">

            <head>

                <meta charset="UTF-8">

                <title>
                    Erro
                </title>

            </head>

            <body>

                <div style="
                    font-family:Arial;
                    padding:30px;
                    color:#b91c1c;
                ">

                    <h2>
                        ❌ Não foi possível abrir a Mini-Pauta
                    </h2>

                    <p>
                        ${erro.message}
                    </p>

                </div>

            </body>

            </html>

        `);

        janela.document.close();

        alert(
            "❌ ERRO:\n\n" +
            erro.message
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


        const html =
            await construirMiniPautaHTML(
                dados
            );


        const janela =
            window.open(
                "",
                "_blank"
            );


        if (!janela) {

            alert(
                "⚠️ O navegador bloqueou a janela."
            );

            return;
        }


        janela.document.open();

        janela.document.write(html);

        janela.document.close();


        janela.onload =
            function () {

                janela.focus();

                janela.print();

            };

    }
    catch (erro) {

        console.error(
            "❌ ERRO AO IMPRIMIR:",
            erro
        );

        alert(
            "❌ Não foi possível imprimir.\n\n" +
            erro.message
        );
    }
};


// =====================================================
// EVENTO — PROFESSOR
// =====================================================

filtroProfessor?.addEventListener(
    "change",
    function () {

        carregarClassesDoProfessor(
            this.value
        );


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


        lancamentoSelecionado = null;

        atualizarBotaoSistema();
    }
);


// =====================================================
// EVENTO — CLASSE
// =====================================================

filtroClasse?.addEventListener(
    "change",
    function () {

        carregarTurmasDaClasse(
            this.value
        );


        if (filtroDisciplina) {

            filtroDisciplina.innerHTML = `
                <option value="">
                    Selecione primeiro a turma
                </option>
            `;

            filtroDisciplina.disabled = true;
        }


        lancamentoSelecionado = null;

        atualizarBotaoSistema();
    }
);


// =====================================================
// EVENTO — TURMA
// =====================================================

filtroTurma?.addEventListener(
    "change",
    function () {

        carregarDisciplinasDaTurma(
            this.value
        );


        lancamentoSelecionado = null;

        atualizarBotaoSistema();
    }
);


// =====================================================
// EVENTO — DISCIPLINA
// =====================================================

filtroDisciplina?.addEventListener(
    "change",
    async function () {

        if (!this.value) return;

        await mostrarLancamentoSelecionado();
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
// INICIAR
// =====================================================

async function iniciarNotas() {

    try {

        mostrarMensagem(
            "⏳ A carregar dados...",
            "aviso"
        );


        await carregarProfessores();

        await carregarTurmas();

        preencherProfessores();

        prepararFiltros();


        mostrarMensagem(
            "👨‍🏫 Selecione um professor.",
            "aviso"
        );


        console.log(
            "✅ NOTAS.JS PRONTO!"
        );

    }
    catch (erro) {

        console.error(
            "❌ ERRO AO INICIAR:",
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
