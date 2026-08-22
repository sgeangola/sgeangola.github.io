// =====================================================
// MINI-PAUTA.JS
// SGE ANGOLA
// Sistema de lançamento de notas
// =====================================================

alert("MINI-PAUTA.JS 1CARREGADO ✅");

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


// =====================================================
// ESCOLA ATUAL
// =====================================================

let escolaId =
    sessionStorage.getItem("escolaId") ||
    localStorage.getItem("escolaId") ||
    "";

escolaId = String(escolaId).trim();

console.log("🏫 ESCOLA ATUAL:", escolaId);

if (!escolaId) {

    alert("❌ Escola não identificada.");

    throw new Error(
        "escolaId não encontrado."
    );

}


// =====================================================
// DADOS DA MINI-PAUTA
// =====================================================

const turmaId =
    localStorage.getItem("turmaId") || "";

const turmaNome =
    localStorage.getItem("turmaNome") || "";

const disciplina =
    localStorage.getItem("disciplina") || "";

const trimestre =
    localStorage.getItem("trimestre") || "";


if (
    !turmaId ||
    !disciplina ||
    !trimestre
) {

    alert(
        "❌ Dados da Mini-Pauta incompletos."
    );

    throw new Error(
        "turmaId, disciplina ou trimestre não encontrados."
    );

}


// =====================================================
// ELEMENTOS HTML
// =====================================================

const info =
    document.getElementById("info");

const lista =
    document.getElementById("listaAlunos");

const estadoPauta =
    document.getElementById("estadoPauta");

const guardarNotas =
    document.getElementById("guardarNotas");


// =====================================================
// ESTADO DO SISTEMA
// =====================================================

let ensino =
    "ensinoPrimario";

let notasGuardadas =
    {};

let controleAlunos =
    {};

let sistemaAberto =
    false;

let pautaExiste =
    false;

let alunos =
    [];


// =====================================================
// NORMALIZAR TRIMESTRE
// =====================================================

const trimestreNormalizado =
    String(trimestre || "")
        .replace(/[º°ª]/g, "")
        .replace(/\s+/g, "")
        .replace(/Trimestre/gi, "")
        .trim();


console.log(
    "📅 TRIMESTRE:",
    trimestreNormalizado
);


// =====================================================
// NORMALIZAR DISCIPLINA
// =====================================================

const disciplinaNormalizada =
    String(disciplina || "")
        .trim()
        .replace(/[\/\\]/g, "-")
        .replace(/\s+/g, "_");


console.log(
    "📚 DISCIPLINA NORMALIZADA:",
    disciplinaNormalizada
);


// =====================================================
// ID ÚNICO DA PAUTA
// =====================================================

const idLancamento =
    `${turmaId}_${disciplinaNormalizada}_${trimestreNormalizado}`;


console.log(
    "======================================"
);

console.log(
    "📋 MINI-PAUTA"
);

console.log(
    "Turma:",
    turmaNome
);

console.log(
    "Turma ID:",
    turmaId
);

console.log(
    "Disciplina:",
    disciplina
);

console.log(
    "Disciplina normalizada:",
    disciplinaNormalizada
);

console.log(
    "Trimestre:",
    trimestreNormalizado
);

console.log(
    "ID lançamento:",
    idLancamento
);

console.log(
    "======================================"
);


// =====================================================
// REFERÊNCIA DAS NOTAS
// =====================================================

const notaRef =
    doc(
        db,
        "notas",
        idLancamento
    );


// =====================================================
// PROFESSOR LOGADO
// =====================================================

function obterProfessorLogado() {

    try {

        const dados =
            localStorage.getItem(
                "professorLogado"
            );

        if (!dados) {

            return null;

        }

        return JSON.parse(dados);

    }

    catch (erro) {

        console.error(
            "❌ Erro ao ler professor:",
            erro
        );

        return null;

    }

}


// =====================================================
// INFORMAÇÕES DA MINI-PAUTA
// =====================================================

if (info) {

    info.innerHTML = `

        Turma: ${turmaNome || "—"}<br>

        Disciplina: ${disciplina || "—"}<br>

        Trimestre: ${trimestreNormalizado}º

    `;

}


// =====================================================
// CARREGAR ENSINO DA TURMA
// =====================================================

async function carregarEnsino() {

    const turmaRef =
        doc(
            db,
            "turmas",
            turmaId
        );


    const turmaSnap =
        await getDoc(
            turmaRef
        );


    if (!turmaSnap.exists()) {

        throw new Error(
            "A turma não foi encontrada."
        );

    }


    const dados =
        turmaSnap.data();


    ensino =
        dados.ensino ||
        "ensinoPrimario";


    console.log(
        "📚 ENSINO:",
        ensino
    );

}


// =====================================================
// VERIFICAR SE A TURMA PERTENCE À ESCOLA
// =====================================================

async function verificarTurmaEscola() {

    const turmaRef =
        doc(
            db,
            "turmas",
            turmaId
        );


    const turmaSnap =
        await getDoc(
            turmaRef
        );


    if (!turmaSnap.exists()) {

        throw new Error(
            "A turma não existe no sistema."
        );

    }


    const dados =
        turmaSnap.data();


    const escolaDaTurma =
        String(
            dados.escolaId || ""
        ).trim();


    console.log(
        "🏫 ESCOLA DA TURMA:",
        escolaDaTurma
    );


    console.log(
        "🏫 ESCOLA ATUAL:",
        escolaId
    );


    if (
        !escolaDaTurma
    ) {

        throw new Error(
            "A turma não possui escolaId."
        );

    }


    if (
        escolaDaTurma !==
        escolaId
    ) {

        throw new Error(
            "Esta turma pertence a outra escola."
        );

    }


    console.log(
        "✅ TURMA PERTENCE À ESCOLA CORRETA."
    );

}


// =====================================================
// CARREGAR NOTAS EXISTENTES
// =====================================================

async function carregarNotas() {

    notasGuardadas = {};

    pautaExiste = false;


    const snapshot =
        await getDoc(
            notaRef
        );


    console.log(
        "📒 DOCUMENTO DAS NOTAS:",
        {
            id: idLancamento,
            existe: snapshot.exists()
        }
    );


    if (!snapshot.exists()) {

        console.log(
            "ℹ️ Ainda não existem notas."
        );

        return;

    }


    const dados =
        snapshot.data();


    // =================================================
    // SEGURANÇA
    // =================================================

    if (
        dados.escolaId &&
        String(
            dados.escolaId
        ).trim() !==
        String(
            escolaId
        ).trim()
    ) {

        console.warn(
            "⚠️ A pauta encontrada possui outro escolaId."
        );

        console.warn(
            "A pauta antiga NÃO será utilizada."
        );

        // NÃO interromper o carregamento dos alunos.
        // Apenas ignorar as notas antigas.

        notasGuardadas = {};

        pautaExiste = false;

        return;

    }


    pautaExiste = true;


    // =================================================
    // NOTAS DOS ALUNOS
    // =================================================

    if (
        Array.isArray(
            dados.alunos
        )
    ) {

        dados.alunos.forEach(
            aluno => {

                if (
                    aluno.numero !== undefined &&
                    aluno.numero !== null
                ) {

                    notasGuardadas[
                        aluno.numero
                    ] = aluno;

                }

            }
        );

    }


    console.log(
        "📝 NOTAS CARREGADAS:",
        Object.keys(
            notasGuardadas
        ).length
    );

}


// =====================================================
// CARREGAR CONTROLE DA PAUTA
// =====================================================

async function carregarControle() {

    sistemaAberto = false;

    controleAlunos = {};


    try {

        const snapshot =
            await getDoc(
                notaRef
            );


        if (
            !snapshot.exists()
        ) {

            atualizarEstadoVisual();

            return;

        }


        const dados =
            snapshot.data();


        // =================================================
        // SEGURANÇA
        // =================================================

        if (
            dados.escolaId &&
            String(
                dados.escolaId
            ).trim() !==
            String(
                escolaId
            ).trim()
        ) {

            console.warn(
                "⚠️ Controle pertence a outra escola."
            );

            atualizarEstadoVisual();

            return;

        }


        // =================================================
        // ABERTURA GERAL
        // =================================================

        sistemaAberto =
            dados.abertoGeral === true;


        // =================================================
        // ABERTURA INDIVIDUAL
        // =================================================

        controleAlunos =
            dados.alunosAbertos ||
            {};


        console.log(
            "🔐 CONTROLE:",
            {
                abertoGeral:
                    dados.abertoGeral,

                alunosAbertos:
                    controleAlunos
            }
        );


        atualizarEstadoVisual();

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO CARREGAR CONTROLE:",
            erro
        );

        sistemaAberto = false;

        controleAlunos = {};

        atualizarEstadoVisual();

    }

}


// =====================================================
// VERIFICAR SE ALUNO PODE EDITAR
// =====================================================

function alunoPodeEditar(
    alunoId,
    numeroAluno
) {

    // =================================================
    // SISTEMA GERAL ABERTO
    // =================================================

    if (
        sistemaAberto === true
    ) {

        return true;

    }


    // =================================================
    // PELO ID
    // =================================================

    const controleId =
        controleAlunos?.[
            alunoId
        ];


    if (
        controleId?.edicaoAberta === true
    ) {

        return true;

    }


    // =================================================
    // PELO NÚMERO
    // =================================================

    const controleNumero =
        controleAlunos?.[
            String(numeroAluno)
        ];


    if (
        controleNumero?.edicaoAberta === true
    ) {

        return true;

    }


    return false;

}


// =====================================================
// ATUALIZAR ESTADO VISUAL
// =====================================================

function atualizarEstadoVisual() {

    if (!estadoPauta) {

        return;

    }


    if (
        sistemaAberto === true
    ) {

        estadoPauta.innerHTML =
            "🟢 Sistema aberto — professor pode lançar e editar";

        estadoPauta.style.color =
            "green";

    }

    else {

        const individuais =
            Object.values(
                controleAlunos || {}
            ).some(
                item =>
                    item?.edicaoAberta === true
            );


        if (individuais) {

            estadoPauta.innerHTML =
                "🟡 Sistema fechado — existem alunos autorizados individualmente";

            estadoPauta.style.color =
                "#d97706";

        }

        else {

            estadoPauta.innerHTML =
                "🔴 Sistema fechado — lançamento bloqueado";

            estadoPauta.style.color =
                "red";

        }

    }


    atualizarBotaoGuardar();

}


// =====================================================
// BOTÃO GUARDAR
// =====================================================

function atualizarBotaoGuardar() {

    if (!guardarNotas) {

        return;

    }


    const podeGuardar =
        alunos.some(
            aluno =>
                alunoPodeEditar(
                    aluno.id,
                    aluno.numero
                )
        );


    guardarNotas.disabled =
        !podeGuardar;


    if (podeGuardar) {

        guardarNotas.title =
            "Guardar lançamentos";

    }

    else {

        guardarNotas.title =
            "Sistema fechado";

    }

}


// =====================================================
// CLASSIFICAÇÃO
// =====================================================

function classificarNota(
    nota
) {

    nota =
        Number(nota);


    // =================================================
    // ENSINO PRIMÁRIO
    // =================================================

    if (
        ensino ===
        "ensinoPrimario"
    ) {

        if (nota <= 2)
            return "Mau";

        if (nota <= 4)
            return "Medíocre";

        if (nota <= 6)
            return "Suficiente";

        if (nota <= 8)
            return "Bom";

        return "Muito Bom";

    }


    // =================================================
    // PRIMEIRO CICLO
    // =================================================

    if (nota <= 4)
        return "Mau";

    if (nota <= 9)
        return "Medíocre";

    if (nota <= 13)
        return "Suficiente";

    if (nota <= 16)
        return "Bom";

    return "Muito Bom";

}


// =====================================================
// CALCULAR MF
// =====================================================

window.calcularMF =
function(input) {

    const linha =
        input.closest("tr");


    if (!linha) {

        return;

    }


    const macInput =
        linha.querySelector(
            ".mac"
        );

    const nptInput =
        linha.querySelector(
            ".npt"
        );

    const mfInput =
        linha.querySelector(
            ".mf"
        );

    const classificacao =
        linha.querySelector(
            ".classificacao"
        );


    if (
        !macInput ||
        !nptInput ||
        !mfInput ||
        !classificacao
    ) {

        return;

    }


    if (
        macInput.value === "" ||
        nptInput.value === ""
    ) {

        mfInput.value = "";

        classificacao.innerHTML = "";

        return;

    }


    const mac =
        Number(
            macInput.value
        );

    const npt =
        Number(
            nptInput.value
        );


    const media =
        (
            (mac + npt) / 2
        ).toFixed(1);


    mfInput.value =
        media;


    classificacao.innerHTML =
        classificarNota(
            media
        );


    const limite =
        ensino ===
        "ensinoPrimario"
            ? 5
            : 10;


    macInput.style.color =
        mac < limite
            ? "red"
            : "";

    nptInput.style.color =
        npt < limite
            ? "red"
            : "";

    mfInput.style.color =
        Number(media) < limite
            ? "red"
            : "";

    classificacao.style.color =
        Number(media) < limite
            ? "red"
            : "";

};


// =====================================================
// CARREGAR ALUNOS
// =====================================================

async function carregarAlunos() {

    try {

        console.log(
            "🚀 INICIANDO CARREGAMENTO..."
        );


        // =================================================
        // 1 — VERIFICAR TURMA
        // =================================================

        await verificarTurmaEscola();


        // =================================================
        // 2 — ENSINO
        // =================================================

        await carregarEnsino();


        // =================================================
        // 3 — BUSCAR ALUNOS
        // =================================================

        console.log(
            "👨‍🎓 PROCURANDO ALUNOS:",
            turmaId
        );


        const alunosRef =
            collection(
                db,
                "turmas",
                turmaId,
                "alunos"
            );


        const resultado =
            await getDocs(
                alunosRef
            );


        alunos = [];


        resultado.forEach(
            documento => {

                alunos.push({

                    id:
                        documento.id,

                    ...documento.data()

                });

            }
        );


        console.log(
            "📊 ALUNOS ENCONTRADOS:",
            alunos.length
        );


        // =================================================
        // 4 — ORDENAR
        // =================================================

        alunos.sort(
            (a, b) =>
                Number(
                    a.numero || 0
                ) -
                Number(
                    b.numero || 0
                )
        );


        // =================================================
        // 5 — CARREGAR NOTAS
        // =================================================

        await carregarNotas();


        // =================================================
        // 6 — CARREGAR CONTROLE
        // =================================================

        await carregarControle();


        // =================================================
        // 7 — LIMPAR TABELA
        // =================================================

        if (lista) {

            lista.innerHTML = "";

        }


        // =================================================
        // 8 — NENHUM ALUNO
        // =================================================

        if (
            alunos.length === 0
        ) {

            if (lista) {

                lista.innerHTML = `

                    <tr>

                        <td colspan="8">

                            ⚠️ Nenhum aluno encontrado
                            nesta turma.

                        </td>

                    </tr>

                `;

            }


            atualizarBotaoGuardar();

            return;

        }


        // =================================================
        // 9 — CRIAR LINHAS
        // =================================================

      alunos.forEach(
            aluno => {

                const nota =
                    notasGuardadas[
                        aluno.numero
                    ] || {};


                const podeEditar =
                    alunoPodeEditar(
                        aluno.id,
                        aluno.numero
                    );


                const maxNota =
                    ensino ===
                    "ensinoPrimario"
                        ? 10
                        : 20;


                if (!lista) {

                    return;

                }


                lista.innerHTML += `

                    <tr
                        data-aluno-id="${aluno.id}"
                    >

                        <td>

                            ${aluno.numero || ""}

                        </td>


                        <td
                            style="text-align:left"
                        >

                            ${aluno.nome || ""}

                        </td>


                        <td>

                            ${aluno.sexo || ""}

                        </td>


                        <td>

                            <input
                                class="mac"
                                type="number"
                                min="0"
                                max="${maxNota}"
                                step="0.1"
                                value="${nota.MAC ?? ""}"
                                oninput="calcularMF(this)"
                                ${podeEditar ? "" : "readonly"}
                            >

                        </td>


                        <td>

                            <input
                                class="npt"
                                type="number"
                                min="0"
                                max="${maxNota}"
                                step="0.1"
                                value="${nota.NPT ?? ""}"
                                oninput="calcularMF(this)"
                                ${podeEditar ? "" : "readonly"}
                            >

                        </td>


                        <td>

                            <input
                                class="mf"
                                readonly
                                value="${nota.MF ?? ""}"
                            >

                        </td>


                        <td
                            class="classificacao"
                        >

                            ${nota.classificacao || ""}

                        </td>


                        <td>

                            <span
                                class="estado-edicao"
                                style="
                                    font-weight:bold;
                                    color:${
                                        podeEditar
                                            ? "green"
                                            : "red"
                                    };
                                "
                            >

                                ${
                                    podeEditar
                                        ? "🔓 Aberto"
                                        : "🔒 Fechado"
                                }

                            </span>

                        </td>

                    </tr>

                `;


                // =================================================
                // CALCULAR MF EXISTENTE
                // =================================================

                const linha =
                    lista.lastElementChild;


                if (
                    nota.MAC !== undefined &&
                    nota.MAC !== null &&
                    nota.NPT !== undefined &&
                    nota.NPT !== null
                ) {

                    const mac =
                        linha.querySelector(
                            ".mac"
                        );


                    if (mac) {

                        window.calcularMF(
                            mac
                        );

                    }

                }

            }
        );


        atualizarBotaoGuardar();


        console.log(
            "======================================"
        );

        console.log(
            "✅ MINI-PAUTA CARREGADA"
        );

        console.log(
            "👨‍🎓 TOTAL:",
            alunos.length
        );

        console.log(
            "======================================"
        );


    }

    catch (erro) {

        console.error(
            "❌ ERRO AO CARREGAR MINI-PAUTA:",
            erro
        );


        if (lista) {

            lista.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        style="color:red"
                    >

                        ❌ Erro ao carregar
                        Mini-Pauta.

                        <br><br>

                        ${erro.message}

                    </td>

                </tr>

            `;

        }


        if (estadoPauta) {

            estadoPauta.innerHTML =
                "❌ Erro ao carregar Mini-Pauta";

            estadoPauta.style.color =
                "red";

        }

    }

}


// =====================================================
// GUARDAR NOTAS
// =====================================================

if (guardarNotas) {

    guardarNotas.addEventListener(
        "click",
        async function () {

            try {

                // =================================================
                // PROFESSOR
                // =================================================

                const professor =
                    obterProfessorLogado();


                if (!professor) {

                    alert(
                        "❌ Professor não identificado."
                    );

                    return;

                }


                // =================================================
                // VERIFICAR DOCUMENTO ATUAL
                // =================================================

                const controleSnapshot =
                    await getDoc(
                        notaRef
                    );


                let controle = {};


                if (
                    controleSnapshot.exists()
                ) {

                    controle =
                        controleSnapshot.data();

                }


                // =================================================
                // SEGURANÇA DA ESCOLA
                // =================================================

                if (
                    controle.escolaId &&
                    String(
                        controle.escolaId
                    ).trim() !==
                    String(
                        escolaId
                    ).trim()
                ) {

                    alert(
                        "❌ Esta pauta pertence a outra escola."
                    );

                    return;

                }


                // =================================================
                // VERIFICAR ABERTURA
                // =================================================

                const sistemaAtualAberto =
                    controle.abertoGeral === true;


                const alunosAbertos =
                    controle.alunosAbertos ||
                    {};


                let autorizado =
                    sistemaAtualAberto;


                if (!autorizado) {

                    autorizado =
                        Object.values(
                            alunosAbertos
                        ).some(
                            item =>
                                item?.edicaoAberta === true
                        );

                }


                if (!autorizado) {

                    alert(
                        "🔒 O lançamento ainda está fechado pelo administrador."
                    );

                    await carregarAlunos();

                    return;

                }


                // =================================================
                // CONSTRUIR NOTAS
                // =================================================

                const notasFinais = [];


                alunos.forEach(
                    aluno => {

                        const linha =
                            lista?.querySelector(
                                `tr[data-aluno-id="${aluno.id}"]`
                            );


                        if (!linha) {

                            return;

                        }


                        const macInput =
                            linha.querySelector(
                                ".mac"
                            );

                        const nptInput =
                            linha.querySelector(
                                ".npt"
                            );

                        const mfInput =
                            linha.querySelector(
                                ".mf"
                            );

                        const classificacao =
                            linha.querySelector(
                                ".classificacao"
                            );


                        const notaAntiga =
                            notasGuardadas[
                                aluno.numero
                            ] || {};


                        notasFinais.push({

                            id:
                                aluno.id,

                            numero:
                                aluno.numero,

                            nome:
                                aluno.nome || "",

                            sexo:
                                aluno.sexo || "",

                            MAC:
                                macInput?.value !== ""
                                    ? Number(
                                        macInput.value
                                    )
                                    : null,

                            NPT:
                                nptInput?.value !== ""
                                    ? Number(
                                        nptInput.value
                                    )
                                    : null,

                            MF:
                                mfInput?.value !== ""
                                    ? Number(
                                        mfInput.value
                                    )
                                    : (
                                        notaAntiga.MF ??
                                        null
                                    ),

                            classificacao:
                                classificacao?.textContent?.trim() ||
                                notaAntiga.classificacao ||
                                ""

                        });

                    }
                );


                // =================================================
                // GUARDAR
                // =================================================

                await setDoc(

                    notaRef,

                    {

                        escolaId:
                            escolaId,

                        turmaId:
                            turmaId,

                        turmaNome:
                            turmaNome,

                        disciplina:
                            disciplina,

                        trimestre:
                            trimestreNormalizado,

                        professorId:
                            professor.id || "",

                        professorNome:
                            professor.nome || "",

                        alunos:
                            notasFinais,

                        atualizadoEm:
                            serverTimestamp(),

                        criadoEm:
                            serverTimestamp()

                    },

                    {
                        merge:
                            true
                    }

                );


                // =================================================
                // ATUALIZAR CACHE
                // =================================================

                notasGuardadas = {};


                notasFinais.forEach(
                    aluno => {

                        notasGuardadas[
                            aluno.numero
                        ] = aluno;

                    }
                );


                pautaExiste = true;


                alert(
                    "✅ Notas guardadas com sucesso!"
                );


                await carregarAlunos();

            }

            catch (erro) {

                console.error(
                    "❌ ERRO AO GUARDAR:",
                    erro
                );


                alert(
                    "❌ Erro ao guardar notas:\n\n" +
                    erro.message
                );

            }

        }
    );

}


// =====================================================
// INICIAR MINI-PAUTA
// =====================================================

console.log(
    "🚀 A iniciar Mini-Pauta..."
);


carregarAlunos();
