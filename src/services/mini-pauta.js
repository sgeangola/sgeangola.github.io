// =====================================================
// MINI-PAUTA.JS
// SGE ANGOLA
// VERSÃO ÚNICA — NOTAS + CONTROLO ABERTO/FECHADO
// =====================================================

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
// 1. IDENTIFICAÇÃO
// =====================================================

const escolaId =
    String(
        sessionStorage.getItem("escolaId") ||
        localStorage.getItem("escolaId") ||
        ""
    ).trim();

const turmaId =
    String(
        localStorage.getItem("turmaId") ||
        ""
    ).trim();

const turmaNome =
    localStorage.getItem("turmaNome") ||
    "";

const disciplina =
    localStorage.getItem("disciplina") ||
    "";

const trimestre =
    localStorage.getItem("trimestre") ||
    "";


if (!escolaId) {

    alert(
        "❌ Escola não identificada."
    );

    throw new Error(
        "escolaId não encontrado."
    );

}


if (!turmaId) {

    alert(
        "❌ Turma não identificada."
    );

    throw new Error(
        "turmaId não encontrado."
    );

}


if (!disciplina) {

    alert(
        "❌ Disciplina não identificada."
    );

    throw new Error(
        "disciplina não encontrada."
    );

}


if (!trimestre) {

    alert(
        "❌ Trimestre não identificado."
    );

    throw new Error(
        "trimestre não encontrado."
    );

}


console.log(
    "🏫 ESCOLA:",
    escolaId
);

console.log(
    "🏫 TURMA:",
    turmaId
);

console.log(
    "🏫 TURMA NOME:",
    turmaNome
);

console.log(
    "📚 DISCIPLINA:",
    disciplina
);

console.log(
    "📅 TRIMESTRE:",
    trimestre
);


// =====================================================
// 2. ID ÚNICO DO LANÇAMENTO
// =====================================================

const disciplinaNormalizada =
    String(disciplina)
        .replace(/\//g, "-")
        .replace(/\s+/g, "_")
        .trim();

const trimestreNormalizado =
    String(trimestre)
        .replace("º", "")
        .replace("°", "")
        .replace("ª", "")
        .replace(/\s+/g, "")
        .replace("Trimestre", "")
        .trim();


const idLancamento =
    `${turmaId}_${disciplinaNormalizada}_${trimestreNormalizado}`;


console.log(
    "🔑 ID LANÇAMENTO:",
    idLancamento
);


// =====================================================
// 3. ESTADO
// =====================================================

let turmaDados = null;

let ensino =
    "ensinoPrimario";

let alunos = [];

let sistemaAberto =
    false;

let alunosAbertos =
    {};


// =====================================================
// 4. ELEMENTOS
// =====================================================

const lista =
    document.getElementById(
        "listaAlunos"
    );

const botaoGuardar =
    document.getElementById(
        "guardarNotas"
    );

const estadoPauta =
    document.getElementById(
        "estadoPauta"
    );

const info =
    document.getElementById(
        "info"
    );


// =====================================================
// 5. INFORMAÇÕES DA MINI-PAUTA
// =====================================================

if (info) {

    info.innerHTML = `

        Turma: ${turmaNome}<br>

        Disciplina: ${disciplina}<br>

        Trimestre: ${trimestreNormalizado}º

    `;

}


// =====================================================
// 6. CARREGAR TURMA
// =====================================================

async function carregarTurma() {

    console.log(
        "🔎 A procurar turma:",
        turmaId
    );


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
            "A turma não existe no Firestore.\n\n" +
            "ID procurado:\n" +
            turmaId
        );

    }


    turmaDados =
        turmaSnap.data();


    console.log(
        "📦 DADOS DA TURMA:",
        turmaDados
    );


    // =================================================
    // ESCOLA
    // =================================================

    const escolaDaTurma =
        String(
            turmaDados.escolaId || ""
        ).trim();


    if (
        escolaDaTurma &&
        escolaDaTurma !== escolaId
    ) {

        throw new Error(
            "A turma pertence a outra escola."
        );

    }


    // =================================================
    // ENSINO
    // =================================================

    ensino =
        turmaDados.ensino ||
        "ensinoPrimario";


    console.log(
        "📚 ENSINO:",
        ensino
    );

}


// =====================================================
// 7. CARREGAR ALUNOS
// =====================================================

async function carregarAlunos() {

    console.log(
        "👨‍🎓 A carregar alunos..."
    );


    const alunosRef =
        collection(
            db,
            "turmas",
            turmaId,
            "alunos"
        );


    const snapshot =
        await getDocs(
            alunosRef
        );


    alunos = [];


    snapshot.forEach(
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
            Number(a.numero || 0) -
            Number(b.numero || 0)
    );


    console.log(
        "✅ ALUNOS:",
        alunos.length
    );


    if (
        alunos.length === 0
    ) {

        throw new Error(
            "Nenhum aluno encontrado nesta turma."
        );

    }

}


// =====================================================
// 8. VERIFICAR SE ALUNO PODE EDITAR
// =====================================================

function alunoPodeEditar(
    aluno
) {

    // ================================================
    // SISTEMA GERAL ABERTO
    // ================================================

    if (
        sistemaAberto === true
    ) {

        return true;

    }


    // ================================================
    // SISTEMA FECHADO
    // VERIFICAR ABERTURA INDIVIDUAL
    // ================================================

    const controle =
        alunosAbertos?.[
            aluno.id
        ];


    if (
        controle &&
        controle.edicaoAberta === true
    ) {

        return true;

    }


    // ================================================
    // TAMBÉM ACEITAR PELO NÚMERO
    // ================================================

    const controleNumero =
        alunosAbertos?.[
            String(aluno.numero)
        ];


    if (
        controleNumero &&
        controleNumero.edicaoAberta === true
    ) {

        return true;

    }


    return false;

}


// =====================================================
// 9. ATUALIZAR ESTADO VISUAL
// =====================================================

function atualizarEstadoVisual() {

    if (!estadoPauta)
        return;


    if (
        sistemaAberto === true
    ) {

        estadoPauta.textContent =
            "🟢 Sistema aberto — todos os alunos podem receber notas.";

        estadoPauta.style.color =
            "green";

    }

    else {

        const existeIndividual =
            alunos.some(
                aluno =>
                    alunoPodeEditar(aluno)
            );


        if (
            existeIndividual
        ) {

            estadoPauta.textContent =
                "🟡 Sistema fechado — apenas alunos autorizados podem ser editados.";

            estadoPauta.style.color =
                "#d97706";

        }

        else {

            estadoPauta.textContent =
                "🔴 Sistema fechado — lançamento bloqueado.";

            estadoPauta.style.color =
                "red";

        }

    }


    atualizarBloqueios();

}


// =====================================================
// 10. ATUALIZAR CAMPOS BLOQUEADOS
// =====================================================

function atualizarBloqueios() {

    alunos.forEach(
        aluno => {

            const podeEditar =
                alunoPodeEditar(
                    aluno
                );


            const mac =
                document.querySelector(
                    `.mac[data-id="${aluno.id}"]`
                );


            const npt =
                document.querySelector(
                    `.npt[data-id="${aluno.id}"]`
                );


            if (mac) {

                mac.disabled =
                    !podeEditar;

            }


            if (npt) {

                npt.disabled =
                    !podeEditar;

            }

        }
    );


    atualizarBotaoGuardar();

}


// =====================================================
// 11. BOTÃO GUARDAR
// =====================================================

function atualizarBotaoGuardar() {

    if (!botaoGuardar)
        return;


    const podeGuardar =
        alunos.some(
            aluno =>
                alunoPodeEditar(aluno)
        );


    botaoGuardar.disabled =
        !podeGuardar;


    if (
        podeGuardar
    ) {

        botaoGuardar.title =
            "Guardar notas";

    }

    else {

        botaoGuardar.title =
            "Sistema fechado";

    }

}


// =====================================================
// 12. CLASSIFICAÇÃO
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
// 13. CALCULAR MF
// =====================================================

function calcularMF(
    input
) {

    const linha =
        input.closest("tr");


    if (!linha)
        return;


    const mac =
        linha.querySelector(
            ".mac"
        );

    const npt =
        linha.querySelector(
            ".npt"
        );

    const mf =
        linha.querySelector(
            ".mf"
        );

    const classificacao =
        linha.querySelector(
            ".classificacao"
        );


    if (
        !mac ||
        !npt ||
        !mf ||
        !classificacao
    ) {

        return;

    }


    if (
        mac.value === "" ||
        npt.value === ""
    ) {

        mf.value = "";

        classificacao.textContent =
            "";

        return;

    }


    const valorMAC =
        Number(mac.value);

    const valorNPT =
        Number(npt.value);


    if (
        valorMAC < 0 ||
        valorMAC > 20 ||
        valorNPT < 0 ||
        valorNPT > 20
    ) {

        mf.value = "";

        classificacao.textContent =
            "Nota inválida";

        classificacao.style.color =
            "red";

        return;

    }


    const media =
        (
            (valorMAC + valorNPT) /
            2
        ).toFixed(1);


    mf.value =
        media;


    classificacao.textContent =
        classificarNota(media);


    const limite =
        ensino ===
        "ensinoPrimario"
            ? 5
            : 10;


    const reprovado =
        Number(media) < limite;


    mf.style.color =
        reprovado
            ? "red"
            : "green";


    classificacao.style.color =
        reprovado
            ? "red"
            : "green";

}


window.calcularMF =
    calcularMF;


// =====================================================
// 14. INPUT
// =====================================================

document.addEventListener(
    "input",
    event => {

        if (
            event.target.classList.contains(
                "mac"
            ) ||
            event.target.classList.contains(
                "npt"
            )
        ) {

            calcularMF(
                event.target
            );

        }

    }
);


// =====================================================
// 15. RENDERIZAR ALUNOS
// =====================================================

function renderizarAlunos() {

    if (!lista) {

        throw new Error(
            "Elemento #listaAlunos não encontrado."
        );

    }


    lista.innerHTML =
        "";


    alunos.forEach(
        aluno => {

            const linha =
                document.createElement(
                    "tr"
                );


            const podeEditar =
                alunoPodeEditar(
                    aluno
                );


            linha.innerHTML = `

                <td>
                    ${aluno.numero || ""}
                </td>

                <td>
                    ${aluno.nome || ""}
                </td>

                <td>
                    ${aluno.sexo || ""}
                </td>

                <td>

                    <input
                        type="number"
                        class="mac"
                        min="0"
                        max="20"
                        step="0.1"
                        data-id="${aluno.id}"
                        ${!podeEditar ? "disabled" : ""}
                    >

                </td>

                <td>

                    <input
                        type="number"
                        class="npt"
                        min="0"
                        max="20"
                        step="0.1"
                        data-id="${aluno.id}"
                        ${!podeEditar ? "disabled" : ""}
                    >

                </td>

                <td>

                    <input
                        type="text"
                        class="mf"
                        readonly
                    >

                </td>

                <td>

                    <span
                        class="classificacao"
                    ></span>

                </td>

            `;


            lista.appendChild(
                linha
            );

        }
    );


    atualizarBotaoGuardar();

}


// =====================================================
// 16. CARREGAR NOTAS + CONTROLO
// =====================================================

async function carregarNotas() {

    console.log(
        "📥 A carregar documento:",
        idLancamento
    );


    const notaRef =
        doc(
            db,
            "notas",
            idLancamento
        );


    const snapshot =
        await getDoc(
            notaRef
        );


    // =================================================
    // DOCUMENTO NÃO EXISTE
    // =================================================

    if (
        !snapshot.exists()
    ) {

        console.log(
            "ℹ️ Documento de notas ainda não existe."
        );


        sistemaAberto =
            false;

        alunosAbertos =
            {};


        atualizarEstadoVisual();

        return;

    }


    const dados =
        snapshot.data();


    console.log(
        "📒 DADOS DAS NOTAS:",
        dados
    );


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

        throw new Error(
            "Esta Mini-Pauta pertence a outra escola."
        );

    }


    // =================================================
    // CONTROLO ABERTO / FECHADO
    // =================================================

    sistemaAberto =
        dados.abertoGeral === true;


    alunosAbertos =
        dados.alunosAbertos ||
        {};


    console.log(
        "🔐 CONTROLO:",
        {
            abertoGeral:
                sistemaAberto,

            alunosAbertos:
                alunosAbertos
        }
    );


    // =================================================
    // CARREGAR NOTAS
    // =================================================

    if (
        Array.isArray(
            dados.alunos
        )
    ) {

        dados.alunos.forEach(
            notaAluno => {

                const alunoId =
                    String(
                        notaAluno.id ||
                        ""
                    );


                if (!alunoId)
                    return;


                const mac =
                    document.querySelector(
                        `.mac[data-id="${alunoId}"]`
                    );


                if (!mac)
                    return;


                const linha =
                    mac.closest("tr");


                const npt =
                    linha.querySelector(
                        ".npt"
                    );

                const mf =
                    linha.querySelector(
                        ".mf"
                    );

                const classificacao =
                    linha.querySelector(
                        ".classificacao"
                    );


                if (
                    notaAluno.mac !==
                    undefined
                ) {

                    mac.value =
                        notaAluno.mac;

                }


                if (
                    npt &&
                    notaAluno.npt !==
                    undefined
                ) {

                    npt.value =
                        notaAluno.npt;

                }


                if (
                    mf &&
                    notaAluno.mf !==
                    undefined
                ) {

                    mf.value =
                        notaAluno.mf;

                }


                if (
                    classificacao &&
                    notaAluno.classificacao
                ) {

                    classificacao.textContent =
                        notaAluno.classificacao;

                }


                if (
                    mf &&
                    notaAluno.mf !== ""
                ) {

                    const valor =
                        Number(
                            notaAluno.mf
                        );


                    const limite =
                        ensino ===
                        "ensinoPrimario"
                            ? 5
                            : 10;


                    const reprovado =
                        valor < limite;


                    mf.style.color =
                        reprovado
                            ? "red"
                            : "green";


                    if (
                        classificacao
                    ) {

                        classificacao.style.color =
                            reprovado
                                ? "red"
                                : "green";

                    }

                }

            }
        );

    }


    atualizarEstadoVisual();

}


// =====================================================
// 17. GUARDAR NOTAS
// =====================================================

async function guardarNotasFirestore() {

    try {

        console.log(
            "💾 A guardar notas..."
        );


        // =================================================
        // VERIFICAR PERMISSÃO
        // =================================================

        const podeGuardar =
            alunos.some(
                aluno =>
                    alunoPodeEditar(
                        aluno
                    )
            );


        if (!podeGuardar) {

            alert(
                "🔴 O sistema está fechado para lançamento."
            );

            return;

        }


        const linhas =
            document.querySelectorAll(
                "#listaAlunos tr"
            );


        const alunosNotas =
            [];


        linhas.forEach(
            linha => {

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
                    !nptInput
                ) {

                    return;

                }


                const alunoId =
                    macInput.dataset.id;


                const aluno =
                    alunos.find(
                        item =>
                            String(
                                item.id
                            ) ===
                            String(
                                alunoId
                            )
                    );


                if (!aluno)
                    return;


                alunosNotas.push({

                    id:
                        aluno.id,

                    numero:
                        aluno.numero ||
                        "",

                    nome:
                        aluno.nome ||
                        "",

                    sexo:
                        aluno.sexo ||
                        "",

                    matricula:
                        aluno.matricula ||
                        "",

                    mac:
                        macInput.value.trim(),

                    npt:
                        nptInput.value.trim(),

                    mf:
                        mfInput?.value?.trim() ||
                        "",

                    classificacao:
                        classificacao?.textContent?.trim() ||
                        ""

                });

            }
        );


        // =================================================
        // REFERÊNCIA
        // =================================================

        const notaRef =
            doc(
                db,
                "notas",
                idLancamento
            );


        const notaSnap =
            await getDoc(
                notaRef
            );


        let dadosAtuais =
            {};


        if (
            notaSnap.exists()
        ) {

            dadosAtuais =
                notaSnap.data();


            // =================================================
            // SEGURANÇA
            // =================================================

            if (
                dadosAtuais.escolaId &&
                String(
                    dadosAtuais.escolaId
                ).trim() !==
                String(
                    escolaId
                ).trim()
            ) {

                alert(
                    "❌ Este lançamento pertence a outra escola."
                );

                return;

            }

        }


        // =================================================
        // DADOS
        // =================================================

        const dados =
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
                    trimestre,

                ensino:
                    ensino,

                alunos:
                    alunosNotas,

                // IMPORTANTE:
                // NÃO APAGAR O CONTROLO DO ADMIN

                abertoGeral:
                    dadosAtuais.abertoGeral === true,

                alunosAbertos:
                    dadosAtuais.alunosAbertos ||
                    {},

                atualizadoEm:
                    serverTimestamp()

            };


        if (
            !notaSnap.exists()
        ) {

            dados.criadoEm =
                serverTimestamp();

        }


        // =================================================
        // GRAVAR
        // =================================================

        await setDoc(
            notaRef,
            dados,
            {
                merge: true
            }
        );


        console.log(
            "✅ NOTAS GUARDADAS:",
            dados
        );


        alert(
            "✅ Notas guardadas com sucesso!"
        );

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO GUARDAR:",
            erro
        );


        alert(
            "❌ Não foi possível guardar as notas.\n\n" +
            erro.message
        );

    }

}


// =====================================================
// 18. BOTÃO GUARDAR
// =====================================================

if (
    botaoGuardar
) {

    botaoGuardar.addEventListener(
        "click",
        guardarNotasFirestore
    );

}


// =====================================================
// 19. INICIALIZAÇÃO
// =====================================================

async function iniciarMiniPauta() {

    try {

        console.log(
            "======================================"
        );

        console.log(
            "🚀 A INICIAR MINI-PAUTA..."
        );

        console.log(
            "======================================"
        );


        await carregarTurma();


        await carregarAlunos();


        /*
         * Primeiro cria a tabela.
         * Depois carrega as notas e o
         * estado aberto/fechado.
         */

        renderizarAlunos();


        await carregarNotas();


        atualizarEstadoVisual();


        console.log(
            "======================================"
        );

        console.log(
            "✅ MINI-PAUTA PRONTA"
        );

        console.log(
            "======================================"
        );

    }

    catch (erro) {

        console.error(
            "❌ ERRO NA MINI-PAUTA:",
            erro
        );


        if (lista) {

            lista.innerHTML = `

                <tr>

                    <td colspan="7">

                        ❌ Erro ao carregar Mini-Pauta.

                    </td>

                </tr>

            `;

        }


        alert(
            "❌ Erro ao carregar Mini-Pauta:\n\n" +
            erro.message
        );

    }

}


iniciarMiniPauta();
  
