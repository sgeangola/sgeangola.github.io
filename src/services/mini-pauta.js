// =====================================================
// MINI-PAUTA.JS
// SGE ANGOLA
// BLOCO 1 — IDENTIFICAÇÃO
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
// ESCOLA ATUAL
// =====================================================

const escolaId =
    String(
        sessionStorage.getItem("escolaId") ||
        localStorage.getItem("escolaId") ||
        ""
    ).trim();


if (!escolaId) {

    alert("❌ Escola não identificada.");

    throw new Error(
        "escolaId não encontrado."
    );

}


console.log(
    "🏫 ESCOLA ATUAL:",
    escolaId
);


// =====================================================
// TURMA
// =====================================================

const turmaId =
    String(
        localStorage.getItem("turmaId") || ""
    ).trim();


const turmaNome =
    localStorage.getItem("turmaNome") || "";


const disciplina =
    localStorage.getItem("disciplina") || "";


const trimestre =
    localStorage.getItem("trimestre") || "";


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
    "🏫 escolaId:",
    escolaId
);

console.log(
    "🏫 turmaId:",
    turmaId
);

console.log(
    "🏫 turmaNome:",
    turmaNome
);

console.log(
    "📚 disciplina:",
    disciplina
);

console.log(
    "📅 trimestre:",
    trimestre
);

    // =====================================================
// BLOCO 2 — CARREGAR TURMA
// =====================================================

let turmaDados = null;
let ensino = "ensinoPrimario";


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
            "A turma não existe no Firestore."
        );

    }


    turmaDados =
        turmaSnap.data();


    console.log(
        "📦 DADOS DA TURMA:",
        turmaDados
    );


    // =================================================
    // CONFIRMAR ESCOLA
    // =================================================

    const escolaDaTurma =
        String(
            turmaDados.escolaId || ""
        ).trim();


    console.log(
        "🏫 escola da sessão:",
        escolaId
    );

    console.log(
        "🏫 escola da turma:",
        escolaDaTurma
    );


    if (
        escolaDaTurma &&
        escolaDaTurma !== escolaId
    ) {

        throw new Error(
            "A turma pertence a outra escola.\n\n" +
            "Escola da sessão: " +
            escolaId +
            "\n" +
            "Escola da turma: " +
            escolaDaTurma
        );

    }


    // =================================================
    // ENSINO
    // =================================================

    ensino =
        turmaDados.ensino ||
        "ensinoPrimario";


    console.log(
        "📚 Ensino:",
        ensino
    );

}

    // =====================================================
// BLOCO 3 — CARREGAR ALUNOS DA TURMA
// =====================================================

let alunos = [];


async function carregarAlunosDaTurma() {

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

            const dados =
                documento.data();


            alunos.push({

                id:
                    documento.id,

                ...dados

            });

        }
    );


    // =================================================
    // ORDENAR PELO NÚMERO
    // =================================================

    alunos.sort(
        (a, b) => {

            return (
                Number(a.numero || 0) -
                Number(b.numero || 0)
            );

        }
    );


    console.log(
        "✅ ALUNOS ENCONTRADOS:",
        alunos.length
    );


    console.table(
        alunos
    );


    if (
        alunos.length === 0
    ) {

        throw new Error(
            "Nenhum aluno encontrado nesta turma."
        );

    }


    return alunos;

}

// =====================================================
// BLOCO 4 — INICIALIZAÇÃO
// =====================================================

async function iniciarMiniPauta() {

    try {

        console.log(
            "===================================="
        );

        console.log(
            "📋 INICIANDO MINI-PAUTA"
        );

        console.log(
            "===================================="
        );


        await carregarTurma();

        await carregarAlunosDaTurma();


        console.log(
            "👨‍🎓 Alunos:",
            alunos.length
        );


        // Criar tabela
        renderizarAlunos();


        // Carregar notas já existentes
        await carregarNotasNaTabela();


        console.log(
            "===================================="
        );

        console.log(
            "✅ MINI-PAUTA PRONTA"
        );

        console.log(
            "===================================="
        );

    }

    catch (erro) {

        console.error(
            "❌ ERRO NA MINI-PAUTA:",
            erro
        );


        alert(
            "❌ Erro ao carregar Mini-Pauta:\n\n" +
            erro.message
        );

    }

}


iniciarMiniPauta();

// =====================================================
// BLOCO 5 — RENDERIZAR ALUNOS
// =====================================================

function renderizarAlunos() {

    const lista =
        document.getElementById(
            "listaAlunos"
        );


    if (!lista) {

        console.error(
            "❌ Elemento #listaAlunos não encontrado."
        );

        return;

    }


    lista.innerHTML = "";


    alunos.forEach(
        aluno => {

            const linha =
                document.createElement("tr");


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
                    <span class="classificacao"></span>
                </td>

            `;


            lista.appendChild(
                linha
            );

        }
    );


    console.log(
        "✅ Tabela criada com",
        alunos.length,
        "alunos."
    );

}

// =====================================================
// BLOCO 6 — CÁLCULO DA MF
// =====================================================

function classificarNota(nota) {

    nota = Number(nota);


    // ================================================
    // ENSINO PRIMÁRIO
    // ================================================

    if (ensino === "ensinoPrimario") {

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


    // ================================================
    // PRIMEIRO CICLO
    // ================================================

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
// CALCULAR MF DE UMA LINHA
// =====================================================

function calcularMF(input) {

    const linha =
        input.closest("tr");


    if (!linha) {
        return;
    }


    const mac =
        linha.querySelector(".mac");

    const npt =
        linha.querySelector(".npt");

    const mf =
        linha.querySelector(".mf");

    const classificacao =
        linha.querySelector(".classificacao");


    if (
        !mac ||
        !npt ||
        !mf ||
        !classificacao
    ) {

        return;

    }


    // ================================================
    // SE UM DOS CAMPOS ESTIVER VAZIO
    // ================================================

    if (
        mac.value === "" ||
        npt.value === ""
    ) {

        mf.value = "";

        classificacao.textContent = "";

        return;
    }


    const valorMAC =
        Number(mac.value);

    const valorNPT =
        Number(npt.value);


    // ================================================
    // VALIDAR NOTAS
    // ================================================

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


    // ================================================
    // CALCULAR MF
    // ================================================

    const media =
        (
            (valorMAC + valorNPT) / 2
        ).toFixed(1);


    mf.value =
        media;


    // ================================================
    // CLASSIFICAÇÃO
    // ================================================

    classificacao.textContent =
        classificarNota(media);


    // ================================================
    // COR DA CLASSIFICAÇÃO
    // ================================================

    const limite =
        ensino === "ensinoPrimario"
            ? 5
            : 10;


    if (
        Number(media) < limite
    ) {

        mf.style.color = "red";

        classificacao.style.color =
            "red";

    }

    else {

        mf.style.color = "green";

        classificacao.style.color =
            "green";

    }


    console.log(
        "📊 Nota calculada:",
        {
            mac: valorMAC,
            npt: valorNPT,
            mf: media,
            classificacao:
                classificacao.textContent
        }
    );

}


// =====================================================
// DISPONIBILIZAR PARA O HTML
// =====================================================

window.calcularMF =
    calcularMF;


// =====================================================
// DETECTAR ALTERAÇÃO NOS CAMPOS
// =====================================================

document.addEventListener(
    "input",
    function(event) {

        if (
            event.target.classList.contains("mac") ||
            event.target.classList.contains("npt")
        ) {

            calcularMF(
                event.target
            );

        }

    }
);

/// =====================================================
// BLOCO 7 — GUARDAR NOTAS
// =====================================================

async function guardarNotasFirestore() {

    try {

        console.log(
            "💾 A preparar gravação das notas..."
        );


        // ================================================
        // VERIFICAR SE HÁ ALUNOS
        // ================================================

        if (!alunos || alunos.length === 0) {

            alert(
                "❌ Não existem alunos para guardar."
            );

            return;

        }


        // ================================================
        // RECOLHER NOTAS DA TABELA
        // ================================================

        const linhas =
            document.querySelectorAll(
                "#listaAlunos tr"
            );


        const alunosNotas = [];


        linhas.forEach(
            linha => {

                const macInput =
                    linha.querySelector(".mac");

                const nptInput =
                    linha.querySelector(".npt");

                const mfInput =
                    linha.querySelector(".mf");

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
                            String(item.id) ===
                            String(alunoId)
                    );


                if (!aluno) {

                    return;

                }


                const mac =
                    macInput.value.trim();


                const npt =
                    nptInput.value.trim();


                const mf =
                    mfInput?.value?.trim() || "";


                const classe =
                    classificacao?.textContent?.trim() || "";


                // =========================================
                // GUARDAR DADOS DO ALUNO
                // =========================================

                alunosNotas.push({

                    id:
                        aluno.id,

                    numero:
                        aluno.numero || "",

                    nome:
                        aluno.nome || "",

                    sexo:
                        aluno.sexo || "",

                    matricula:
                        aluno.matricula || "",

                    mac:
                        mac,

                    npt:
                        npt,

                    mf:
                        mf,

                    classificacao:
                        classe

                });

            }
        );


        // ================================================
        // REFERÊNCIA DO DOCUMENTO
        // ================================================

        const notaRef =
            doc(
                db,
                "notas",
                idLancamento
            );


        // ================================================
        // VERIFICAR DOCUMENTO EXISTENTE
        // ================================================

        const notaSnap =
            await getDoc(
                notaRef
            );


        let dadosAtuais = {};


        if (
            notaSnap.exists()
        ) {

            dadosAtuais =
                notaSnap.data();


            // ============================================
            // SEGURANÇA DA ESCOLA
            // ============================================

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
                    "❌ Não é possível guardar.\n\n" +
                    "Este lançamento pertence a outra escola."
                );

                return;

            }

        }


        // ================================================
        // DADOS DO DOCUMENTO
        // ================================================

        const dadosParaGuardar = {

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

            // manter controle existente
            abertoGeral:
                dadosAtuais.abertoGeral === true,

            alunosAbertos:
                dadosAtuais.alunosAbertos || {},

            atualizadoEm:
                serverTimestamp()

        };


        // ================================================
        // CRIAR DOCUMENTO
        // ================================================

        if (
            !notaSnap.exists()
        ) {

            dadosParaGuardar.criadoEm =
                serverTimestamp();

        }


        // ================================================
        // GRAVAR
        // ================================================

        await setDoc(
            notaRef,
            dadosParaGuardar,
            {
                merge: true
            }
        );


        console.log(
            "✅ NOTAS GUARDADAS:",
            dadosParaGuardar
        );


        alert(
            "✅ Notas guardadas com sucesso!"
        );

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO GUARDAR NOTAS:",
            erro
        );


        alert(
            "❌ Não foi possível guardar as notas.\n\n" +
            erro.message
        );

    }

}


// =====================================================
// LIGAR AO BOTÃO
// =====================================================

const botaoGuardar =
    document.getElementById(
        "guardarNotas"
    );


if (botaoGuardar) {

    botaoGuardar.addEventListener(
        "click",
        guardarNotasFirestore
    );

}

// =====================================================
// BLOCO 8 — CARREGAR NOTAS EXISTENTES NA TABELA
// =====================================================

async function carregarNotasNaTabela() {

    try {

        console.log(
            "📥 A carregar notas existentes..."
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


        // ================================================
        // NÃO EXISTE DOCUMENTO DE NOTAS
        // ================================================

        if (!snapshot.exists()) {

            console.log(
                "ℹ️ Ainda não existem notas guardadas."
            );

            return;

        }


        const dados =
            snapshot.data();


        console.log(
            "📒 NOTAS ENCONTRADAS:",
            dados
        );


        // ================================================
        // SEGURANÇA DA ESCOLA
        // ================================================

        if (
            dados.escolaId &&
            String(
                dados.escolaId
            ).trim() !==
            String(
                escolaId
            ).trim()
        ) {

            console.error(
                "❌ As notas pertencem a outra escola."
            );

            return;

        }


        // ================================================
        // VERIFICAR LISTA DE ALUNOS
        // ================================================

        if (
            !Array.isArray(
                dados.alunos
            )
        ) {

            console.log(
                "ℹ️ O documento não possui alunos."
            );

            return;

        }


        // ================================================
        // PERCORRER NOTAS
        // ================================================

        dados.alunos.forEach(
            notaAluno => {

                const alunoId =
                    String(
                        notaAluno.id || ""
                    );


                if (!alunoId) {

                    return;

                }


                // =========================================
                // PROCURAR LINHA DO ALUNO
                // =========================================

                const macInput =
                    document.querySelector(
                        `.mac[data-id="${alunoId}"]`
                    );


                if (!macInput) {

                    console.warn(
                        "⚠️ Linha não encontrada:",
                        alunoId
                    );

                    return;

                }


                const linha =
                    macInput.closest("tr");


                if (!linha) {

                    return;

                }


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


                // =========================================
                // MAC
                // =========================================

                if (
                    macInput &&
                    notaAluno.mac !== undefined &&
                    notaAluno.mac !== ""
                ) {

                    macInput.value =
                        notaAluno.mac;

                }


                // =========================================
                // NPT
                // =========================================

                if (
                    nptInput &&
                    notaAluno.npt !== undefined &&
                    notaAluno.npt !== ""
                ) {

                    nptInput.value =
                        notaAluno.npt;

                }


                // =========================================
                // MF
                // =========================================

                if (
                    mfInput &&
                    notaAluno.mf !== undefined
                ) {

                    mfInput.value =
                        notaAluno.mf;

                }


                // =========================================
                // CLASSIFICAÇÃO
                // =========================================

                if (
                    classificacao &&
                    notaAluno.classificacao
                ) {

                    classificacao.textContent =
                        notaAluno.classificacao;

                }


                // =========================================
                // ATUALIZAR CORES
                // =========================================

                if (
                    mfInput &&
                    notaAluno.mf !== ""
                ) {

                    const valorMF =
                        Number(
                            notaAluno.mf
                        );


                    const limite =
                        ensino === "ensinoPrimario"
                            ? 5
                            : 10;


                    if (
                        valorMF < limite
                    ) {

                        mfInput.style.color =
                            "red";

                        if (
                            classificacao
                        ) {

                            classificacao.style.color =
                                "red";

                        }

                    }

                    else {

                        mfInput.style.color =
                            "green";

                        if (
                            classificacao
                        ) {

                            classificacao.style.color =
                                "green";

                        }

                    }

                }

            }
        );


        console.log(
            "✅ Notas carregadas na Mini-Pauta."
        );

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO CARREGAR NOTAS:",
            erro
        );

    }

}

