// =====================================================
// MINI-PAUTA.JS
// SGE
// Sistema de lançamento de notas
// Controle geral + controle individual
// Separação por escola
// =====================================================

alert("MINI-PAUTA.JS 1 CARREGADO ✅");

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
// DADOS DA ESCOLA
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
// DADOS DA MINI-PAUTA
// =====================================================

const turmaId =
    localStorage.getItem("turmaId");

const turmaNome =
    localStorage.getItem("turmaNome");

const disciplina =
    localStorage.getItem("disciplina");

const trimestre =
    localStorage.getItem("trimestre");


if (
    !turmaId ||
    !disciplina ||
    !trimestre
) {

    alert(
        "❌ Dados da Mini-Pauta incompletos."
    );

    throw new Error(
        "turmaId, disciplina ou trimestre não encontrado."
    );

}


// =====================================================
// ELEMENTOS
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
// ESTADO
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


// =====================================================
// INFORMAÇÕES
// =====================================================

if (info) {

    info.innerHTML = `

        Turma: ${turmaNome || "—"}<br>

        Disciplina: ${disciplina || "—"}<br>

        Trimestre: ${trimestre}º

    `;

}


// =====================================================
// ID ÚNICO DA MINI-PAUTA
// =====================================================
//
// Agora a escola também faz parte do ID.
//
// Assim:
//
// Escola A + Turma 7A + Matemática + 1
//
// nunca será confundida com:
//
// Escola B + Turma 7A + Matemática + 1
//
// =====================================================

const idLancamento =
    `${escolaId}_${turmaId}_${disciplina}_${trimestre}`;


// =====================================================
// REFERÊNCIA DA MINI-PAUTA
// =====================================================

const notaRef =
    doc(
        db,
        "notas",
        idLancamento
    );


// =====================================================
// REFERÊNCIA DO CONTROLE
// =====================================================
//
// Este documento controla:
//
// sistemaAberto
//
// e a abertura individual dos alunos.
//
// =====================================================

const controleRef =
    doc(
        db,
        "controlesMiniPautas",
        idLancamento
    );


// =====================================================
// PROFESSOR LOGADO
// =====================================================

function obterProfessorLogado() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "professorLogado"
            )
        ) || null;

    }
    catch (erro) {

        console.error(
            "Erro ao ler professor:",
            erro
        );

        return null;

    }

}


// =====================================================
// ENSINO
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


    if (
        turmaSnap.exists()
    ) {

        const dados =
            turmaSnap.data();


        ensino =
            dados.ensino ||
            "ensinoPrimario";

    }

}


// =====================================================
// CARREGAR CONTROLE DA MINI-PAUTA
// =====================================================

async function carregarControle() {

    try {

        const controleSnap =
            await getDoc(
                controleRef
            );


        // ---------------------------------------------
        // SE NÃO EXISTIR
        // ---------------------------------------------

        if (
            !controleSnap.exists()
        ) {

            sistemaAberto =
                false;

            controleAlunos =
                {};

            atualizarEstadoVisual();

            return;

        }


        const dados =
            controleSnap.data();


        sistemaAberto =
            dados.sistemaAberto === true;


        controleAlunos =
            dados.alunos || {};


        console.log(
            "🔐 CONTROLE DA MINI-PAUTA:",
            dados
        );


        atualizarEstadoVisual();

    }
    catch (erro) {

        console.error(
            "Erro ao carregar controle:",
            erro
        );

        sistemaAberto =
            false;

        controleAlunos =
            {};

        atualizarEstadoVisual();

    }

}


// =====================================================
// VERIFICAR SE ALUNO PODE SER EDITADO
// =====================================================
//
// Regra:
//
// Geral aberto
//      → todos podem editar
//
// Geral fechado
//      → somente aluno individualmente aberto
//
// =====================================================

function alunoPodeEditar(
    alunoId,
    numeroAluno
) {

    // ---------------------------------------------
    // SISTEMA GERAL ABERTO
    // ---------------------------------------------

    if (
        sistemaAberto === true
    ) {

        return true;

    }


    // ---------------------------------------------
    // SISTEMA GERAL FECHADO
    // ---------------------------------------------

    const controle =
        controleAlunos?.[
            alunoId
        ];


    if (
        controle?.edicaoAberta === true
    ) {

        return true;

    }


    // ---------------------------------------------
    // COMPATIBILIDADE PELO NÚMERO
    // ---------------------------------------------

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
// ESTADO VISUAL DA PAUTA
// =====================================================

function atualizarEstadoVisual() {

    if (!estadoPauta)
        return;


    if (
        sistemaAberto
    ) {

        estadoPauta.innerHTML =
            "🟢 Sistema aberto — professor pode lançar e editar";

        estadoPauta.style.color =
            "green";

        return;

    }


    // ---------------------------------------------
    // VERIFICAR SE EXISTEM ALUNOS ABERTOS
    // ---------------------------------------------

    const existemIndividuais =
        Object.values(
            controleAlunos || {}
        ).some(
            controle =>
                controle?.edicaoAberta === true
        );


    if (
        existemIndividuais
    ) {

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


// =====================================================
// CARREGAR NOTAS EXISTENTES
// =====================================================

async function carregarNotas() {

    try {

        const notaSnap =
            await getDoc(
                notaRef
            );


        if (
            notaSnap.exists()
        ) {

            pautaExiste =
                true;


            const dados =
                notaSnap.data();


            // -----------------------------------------
            // GARANTIR QUE É DA ESCOLA
            // -----------------------------------------

            if (
                dados.escolaId &&
                dados.escolaId !== escolaId
            ) {

                throw new Error(
                    "Esta Mini-Pauta pertence a outra escola."
                );

            }


            // -----------------------------------------
            // CARREGAR ALUNOS
            // -----------------------------------------

            if (
                Array.isArray(
                    dados.alunos
                )
            ) {

                dados.alunos.forEach(
                    aluno => {

                        notasGuardadas[
                            aluno.numero
                        ] = aluno;

                    }
                );

            }


        }


    }
    catch (erro) {

        console.error(
            "Erro ao carregar notas:",
            erro
        );

        throw erro;

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


    // ---------------------------------------------
    // PRIMEIRO CICLO
    // ---------------------------------------------

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


    const macInput =
        linha.querySelector(".mac");

    const nptInput =
        linha.querySelector(".npt");

    const mf =
        linha.querySelector(".mf");

    const classificacao =
        linha.querySelector(
            ".classificacao"
        );


    if (
        !macInput ||
        !nptInput ||
        !mf ||
        !classificacao
    ) {

        return;

    }


    if (
        macInput.value === "" ||
        nptInput.value === ""
    ) {

        mf.value = "";

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


    mf.value =
        media;


    const resultado =
        classificarNota(
            media
        );


    classificacao.innerHTML =
        resultado;


    mf.style.color =
        "";

    classificacao.style.color =
        "";


    const limite =
        ensino ===
        "ensinoPrimario"
            ? 5
            : 10;


    if (
        Number(media) < limite
    ) {

        mf.style.color =
            "red";

        classificacao.style.color =
            "red";

    }


    if (
        mac < limite
    ) {

        macInput.style.color =
            "red";

    }
    else {

        macInput.style.color =
            "";

    }


    if (
        npt < limite
    ) {

        nptInput.style.color =
            "red";

    }
    else {

        nptInput.style.color =
            "";

    }

};


// =====================================================
// BLOQUEAR / LIBERTAR LINHA
// =====================================================

function aplicarEstadoEdicao(
    linha,
    podeEditar
) {

    const inputs =
        linha.querySelectorAll(
            ".mac, .npt"
        );


    inputs.forEach(
        input => {

            input.readOnly =
                !podeEditar;

        }
    );


    const botao =
        linha.querySelector(
            ".estado-edicao"
        );


    if (botao) {

        if (podeEditar) {

            botao.innerHTML =
                "🔓 Aberto";

            botao.style.color =
                "green";

        }
        else {

            botao.innerHTML =
                "🔒 Fechado";

            botao.style.color =
                "red";

        }

    }

}


// =====================================================
// CARREGAR ALUNOS
// =====================================================

async function carregarAlunos() {

    await carregarEnsino();

    await carregarNotas();

    await carregarControle();


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


    const alunos = [];


    resultado.forEach(
        documento => {

            alunos.push({

                id:
                    documento.id,

                ...documento.data()

            });

        }
    );


    alunos.sort(
        (a, b) =>
            Number(a.numero) -
            Number(b.numero)
    );


    lista.innerHTML =
        "";


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


            lista.innerHTML += `

<tr data-aluno-id="${aluno.id}">

    <td>
        ${aluno.numero || ""}
    </td>


    <td style="text-align:left">
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
            max="${
                ensino ===
                "ensinoPrimario"
                    ? 10
                    : 20
            }"
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
            max="${
                ensino ===
                "ensinoPrimario"
                    ? 10
                    : 20
            }"
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


    <td class="classificacao">
        ${nota.classificacao || ""}
    </td>


    <td>

        <span
            class="estado-edicao"
            style="
                font-weight:bold;
                ${
                    podeEditar
                        ? "color:green;"
                        : "color:red;"
                }
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

        }
    );


    // ---------------------------------------------
    // ESTADO DO BOTÃO GUARDAR
    // ---------------------------------------------

    if (guardarNotas) {

        const algumaLinhaEditavel =
            alunos.some(
                aluno =>
                    alunoPodeEditar(
                        aluno.id,
                        aluno.numero
                    )
            );


        guardarNotas.disabled =
            !algumaLinhaEditavel;


        if (
            algumaLinhaEditavel
        ) {

            guardarNotas.title =
                "Guardar lançamentos";

        }
        else {

            guardarNotas.title =
                "Sistema fechado";

        }

    }

}


// =====================================================
// GUARDAR / ATUALIZAR
// =====================================================

if (guardarNotas) {

    guardarNotas.addEventListener(
        "click",
        async () => {

            try {

                // -------------------------------------
                // PROFESSOR
                // -------------------------------------

                const professor =
                    obterProfessorLogado();


                if (!professor) {

                    alert(
                        "❌ Professor não identificado."
                    );

                    return;

                }


                // -------------------------------------
                // RECARREGAR CONTROLE
                // -------------------------------------

                await carregarControle();


                // -------------------------------------
                // BUSCAR ALUNOS
                // -------------------------------------

                const alunosSnapshot =
                    await getDocs(
                        collection(
                            db,
                            "turmas",
                            turmaId,
                            "alunos"
                        )
                    );


                const alunosFirebase =
                    {};


                alunosSnapshot.forEach(
                    documento => {

                        alunosFirebase[
                            documento.id
                        ] = documento.data();

                    }
                );


                const alunos =
                    [];


                // -------------------------------------
                // LER A TABELA
                // -------------------------------------

                document
                    .querySelectorAll(
                        "#listaAlunos tr"
                    )
                    .forEach(
                        linha => {

                            const alunoId =
                                linha.dataset.alunoId;


                            const alunoFirebase =
                                alunosFirebase[
                                    alunoId
                                ];


                            if (!alunoFirebase)
                                return;


                            const podeEditar =
                                alunoPodeEditar(
                                    alunoId,
                                    alunoFirebase.numero
                                );


                            // --------------------------------
                            // SE ESTIVER FECHADO, IGNORAR
                            // --------------------------------

                        
                            if (!podeEditar) {

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


                            const mac =
                                macInput.value === ""
                                    ? null
                                    : Number(
                                        macInput.value
                                    );


                            const npt =
                                nptInput.value === ""
                                    ? null
                                    : Number(
                                        nptInput.value
                                    );


                            const mf =
                                mfInput.value === ""
                                    ? null
                                    : Number(
                                        mfInput.value
                                    );


                            alunos.push({

                                id:
                                    alunoId,

                                nome:
                                    alunoFirebase.nome ||
                                    "",

                                numero:
                                    alunoFirebase.numero ||
                                    "",

                                sexo:
                                    alunoFirebase.sexo ||
                                    "",

                                MAC:
                                    mac,

                                NPT:
                                    npt,

                                MF:
                                    mf,

                                classificacao:
                                    classificacao?.innerText ||
                                    ""

                            });

                        }
                    );


                // -------------------------------------
                // VERIFICAR SE EXISTE ALGO PARA GUARDAR
                // -------------------------------------

                if (
                    !alunos.length
                ) {

                    alert(
                        "🔒 Nenhum aluno está autorizado para edição."
                    );

                    return;

                }


                // -------------------------------------
                // PRESERVAR NOTAS DOS ALUNOS FECHADOS
                // -------------------------------------

                const notasFinais =
                    [];


                alunosFirebase &&
                Object.entries(
                    alunosFirebase
                );


                const alunosTabela =
                    document.querySelectorAll(
                        "#listaAlunos tr"
                    );


                alunosTabela.forEach(
                    linha => {

                        const alunoId =
                            linha.dataset.alunoId;


                        const alunoFirebase =
                            alunosFirebase[
                                alunoId
                            ];


                        if (!alunoFirebase)
                            return;


                        const podeEditar =
                            alunoPodeEditar(
                                alunoId,
                                alunoFirebase.numero
                            );


                        if (
                            podeEditar
                        ) {

                            const existente =
                                alunos.find(
                                    item =>
                                        item.id ===
                                        alunoId
                                );


                            if (existente) {

                                notasFinais.push(
                                    existente
                                );

                            }

                        }
                        else {

                            const notaAntiga =
                                notasGuardadas[
                                    alunoFirebase.numero
                                ];


                            notasFinais.push({

                                id:
                                    alunoId,

                                nome:
                                    alunoFirebase.nome ||
                                    "",

                                numero:
                                    alunoFirebase.numero ||
                                    "",

                                sexo:
                                    alunoFirebase.sexo ||
                                    "",

                                MAC:
                                    notaAntiga?.MAC ??
                                    null,

                                NPT:
                                    notaAntiga?.NPT ??
                                    null,

                                MF:
                                    notaAntiga?.MF ??
                                    null,

                                classificacao:
                                    notaAntiga?.classificacao ||
                                    ""

                            });

                        }

                    }
                );


                // -------------------------------------
                // VERIFICAR NOVAMENTE O CONTROLE
                // -------------------------------------

                const controleAtual =
                    await getDoc(
                        controleRef
                    );


                const controle =
                    controleAtual.exists()
                        ? controleAtual.data()
                        : {};


                const sistemaContinuaAberto =
                    controle.sistemaAberto === true;


                const controlesAtuais =
                    controle.alunos || {};


                // -------------------------------------
                // VALIDAR AUTORIZAÇÃO
                // -------------------------------------

                let existeAutorizacao =
                    sistemaContinuaAberto;


                if (!existeAutorizacao) {

                    existeAutorizacao =
                        Object.values(
                            controlesAtuais
                        ).some(
                            item =>
                                item?.edicaoAberta === true
                        );

                }


                if (!existeAutorizacao) {

                    alert(
                        "🔒 O sistema foi fechado. " +
                        "As alterações não foram guardadas."
                    );

                    await carregarAlunos();

                    return;

                }


                // -------------------------------------
                // GUARDAR
                // -------------------------------------

                await setDoc(

                    notaRef,

                    {

                        escolaId,

                        turmaId,

                        turmaNome,

                        disciplina,

                        trimestre,

                        professorId:
                            professor?.id || "",

                        professorNome:
                            professor?.nome || "",

                        alunos:
                            notasFinais,

                        atualizadoEm:
                            serverTimestamp(),

                        ...(pautaExiste
                            ? {}
                            : {
                                criadoEm:
                                    serverTimestamp()
                            })

                    },

                    {
                        merge:
                            true
                    }

                );


                pautaExiste =
                    true;


                // -------------------------------------
                // ATUALIZAR CACHE
                // -------------------------------------

                notasGuardadas =
                    {};


                notasFinais.forEach(
                    aluno => {

                        notasGuardadas[
                            aluno.numero
                        ] = aluno;

                    }
                );


                atualizarEstadoVisual();


                alert(
                    "Notas guardadas com sucesso ✅"
                );


                // -------------------------------------
                // RECARREGAR
                // -------------------------------------

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
// INICIAR
// =====================================================

carregarAlunos()
    .catch(
        erro => {

            console.error(
                "Erro ao iniciar Mini-Pauta:",
                erro
            );

            if (estadoPauta) {

                estadoPauta.innerHTML =
                    "❌ Erro ao carregar Mini-Pauta";

                estadoPauta.style.color =
                    "red";

            }

        }
    );
