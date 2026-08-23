// =====================================================
// MINI-PAUTA.JS
// SGE ANGOLA
// VERSÃO COMPLETA
// NOTAS + ABERTO/FECHADO
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
    alert("❌ Escola não identificada.");
    throw new Error("escolaId não encontrado.");
}

if (!turmaId) {
    alert("❌ Turma não identificada.");
    throw new Error("turmaId não encontrado.");
}

if (!disciplina) {
    alert("❌ Disciplina não identificada.");
    throw new Error("disciplina não encontrada.");
}

if (!trimestre) {
    alert("❌ Trimestre não identificado.");
    throw new Error("trimestre não encontrado.");
}


// =====================================================
// 2. NORMALIZAÇÃO
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


console.log("🏫 ESCOLA:", escolaId);
console.log("🏫 TURMA:", turmaId);
console.log("🏫 TURMA NOME:", turmaNome);
console.log("📚 DISCIPLINA:", disciplina);
console.log("📅 TRIMESTRE:", trimestre);
console.log("🔑 ID LANÇAMENTO:", idLancamento);


// =====================================================
// 3. VARIÁVEIS
// =====================================================

let turmaDados = null;

let ensino = "ensinoPrimario";

let alunos = [];

let sistemaAberto = false;

let alunosAbertos = {};


// =====================================================
// 4. ELEMENTOS
// =====================================================

const lista =
    document.getElementById("listaAlunos");

const botaoGuardar =
    document.getElementById("guardarNotas");

const estadoPauta =
    document.getElementById("estadoPauta");

const info =
    document.getElementById("info");


// =====================================================
// 5. INFORMAÇÕES
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

    const turmaRef =
        doc(
            db,
            "turmas",
            turmaId
        );

    const turmaSnap =
        await getDoc(turmaRef);


    if (!turmaSnap.exists()) {

        throw new Error(
            "A turma não existe no Firestore.\n\n" +
            "ID: " +
            turmaId
        );

    }


    turmaDados =
        turmaSnap.data();


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

    const alunosRef =
        collection(
            db,
            "turmas",
            turmaId,
            "alunos"
        );


    const snapshot =
        await getDocs(alunosRef);


    alunos = [];


    snapshot.forEach(
        documento => {

            alunos.push({

                id: documento.id,

                ...documento.data()

            });

        }
    );


    alunos.sort(
        (a, b) =>
            Number(a.numero || 0) -
            Number(b.numero || 0)
    );


    if (alunos.length === 0) {

        throw new Error(
            "Nenhum aluno encontrado nesta turma."
        );

    }


    console.log(
        "👨‍🎓 ALUNOS:",
        alunos
    );

}


// =====================================================
// 8. VERIFICAR SE PODE EDITAR
// =====================================================

function alunoPodeEditar(aluno) {

    if (sistemaAberto === true) {

        return true;

    }


    const controle =
        alunosAbertos?.[aluno.id];


    if (
        controle &&
        controle.edicaoAberta === true
    ) {

        return true;

    }


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
// 9. ESTADO VISUAL
// =====================================================

function atualizarEstadoVisual() {

    if (!estadoPauta)
        return;


    if (sistemaAberto) {

        estadoPauta.textContent =
            "🟢 Sistema aberto — todos os alunos podem receber notas.";

        estadoPauta.style.color =
            "green";

    } else {

        const existeIndividual =
            alunos.some(
                aluno =>
                    alunoPodeEditar(aluno)
            );


        if (existeIndividual) {

            estadoPauta.textContent =
                "🟡 Sistema fechado — apenas alunos autorizados podem ser editados.";

            estadoPauta.style.color =
                "#d97706";

        } else {

            estadoPauta.textContent =
                "🔴 Sistema fechado — lançamento bloqueado.";

            estadoPauta.style.color =
                "red";

        }

    }


    atualizarBloqueios();

}


// =====================================================
// 10. BLOQUEAR / LIBERAR CAMPOS
// =====================================================

function atualizarBloqueios() {

    alunos.forEach(
        aluno => {

            const podeEditar =
                alunoPodeEditar(aluno);


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

}


// =====================================================
// 12. CLASSIFICAÇÃO
// =====================================================

function classificarNota(nota) {

    nota =
        Number(nota);


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

function calcularMF(input) {

    const linha =
        input.closest("tr");


    if (!linha)
        return;


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
            (valorMAC + valorNPT) / 2
        ).toFixed(1);


    mf.value =
        media;


    classificacao.textContent =
        classificarNota(media);


    const limite =
        ensino === "ensinoPrimario"
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
// 14. INPUT DAS NOTAS
// =====================================================

document.addEventListener(
    "input",
    event => {

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


// =====================================================
// 15. RENDERIZAR ALUNOS
// =====================================================

function renderizarAlunos() {

    if (!lista) {

        throw new Error(
            "Elemento #listaAlunos não encontrado."
        );

    }


    lista.innerHTML = "";


    alunos.forEach(
        aluno => {

            const linha =
                document.createElement("tr");


            const podeEditar =
                alunoPodeEditar(aluno);


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


            lista.appendChild(linha);

        }
    );


    atualizarBotaoGuardar();

}


// =====================================================
// 16. CARREGAR NOTAS
// =====================================================

async function carregarNotas() {

    console.log(
        "📥 A carregar notas:",
        idLancamento
    );


    const notaRef =
        doc(
            db,
            "notas",
            idLancamento
        );


    const snapshot =
        await getDoc(notaRef);


    if (!snapshot.exists()) {

        console.log(
            "ℹ️ Ainda não existem notas."
        );


        sistemaAberto = false;

        alunosAbertos = {};


        atualizarEstadoVisual();

        return;

    }


    const dados =
        snapshot.data();


    console.log(
        "📒 DADOS DO FIRESTORE:",
        dados
    );


    // =================================================
    // SEGURANÇA
    // =================================================

    if (
        dados.escolaId &&
        String(dados.escolaId).trim() !==
        String(escolaId).trim()
    ) {

        throw new Error(
            "Esta Mini-Pauta pertence a outra escola."
        );

    }


    // =================================================
    // ABERTO / FECHADO
    // =================================================

    sistemaAberto =
        dados.abertoGeral === true;


    alunosAbertos =
        dados.alunosAbertos || {};


    // =================================================
    // NOTAS
    // =================================================

    if (
        !Array.isArray(dados.alunos)
    ) {

        atualizarEstadoVisual();

        return;

    }


    dados.alunos.forEach(
        notaAluno => {

            const alunoId =
                String(
                    notaAluno.id ||
                    notaAluno.alunoId ||
                    ""
                ).trim();


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


            if (!linha)
                return;


            const npt =
                linha.querySelector(".npt");

            const mf =
                linha.querySelector(".mf");

            const classificacao =
                linha.querySelector(".classificacao");


            // =================================================
            // MAC
            // =================================================

            const valorMAC =
                notaAluno.mac ??
                notaAluno.MAC ??
                notaAluno.notaMAC ??
                "";


            // =================================================
            // NPT
            // =================================================

            const valorNPT =
                notaAluno.npt ??
                notaAluno.NPT ??
                notaAluno.notaNPT ??
                "";


            // =================================================
            // MF
            // =================================================

            const valorMF =
                notaAluno.mf ??
                notaAluno.MF ??
                notaAluno.mediaFinal ??
                "";


            // =================================================
            // CLASSIFICAÇÃO
            // =================================================

            const valorClassificacao =
                notaAluno.classificacao ??
                notaAluno.Classificacao ??
                "";


            if (
                valorMAC !== "" &&
                valorMAC !== null &&
                valorMAC !== undefined
            ) {

                mac.value =
                    valorMAC;

            }


            if (
                npt &&
                valorNPT !== "" &&
                valorNPT !== null &&
                valorNPT !== undefined
            ) {

                npt.value =
                    valorNPT;

            }


            if (
                mf &&
                valorMF !== "" &&
                valorMF !== null &&
                valorMF !== undefined
            ) {

                mf.value =
                    valorMF;

            }


            if (classificacao) {

                if (valorClassificacao !== "") {

                    classificacao.textContent =
                        valorClassificacao;

                }

            }


            // =================================================
            // SE MF NÃO ESTIVER GUARDADA,
            // CALCULAR
            // =================================================

            if (
                valorMF === "" &&
                mac.value !== "" &&
                npt &&
                npt.value !== ""
            ) {

                calcularMF(mac);

            }


            // =================================================
            // COR
            // =================================================

            const valorFinal =
                Number(
                    mf?.value || ""
                );


            if (
                mf &&
                !isNaN(valorFinal)
            ) {

                const limite =
                    ensino === "ensinoPrimario"
                        ? 5
                        : 10;


                const reprovado =
                    valorFinal < limite;


                mf.style.color =
                    reprovado
                        ? "red"
                        : "green";


                if (classificacao) {

                    classificacao.style.color =
                        reprovado
                            ? "red"
                            : "green";

                }

            }

        }
    );


    atualizarEstadoVisual();


    console.log(
        "✅ NOTAS CARREGADAS."
    );

}


// =====================================================
// 17. GUARDAR NOTAS NO FIRESTORE
// =====================================================

async function guardarNotasFirestore() {

    try {

        console.log(
            "💾 A guardar notas..."
        );


        // =================================================
        // VERIFICAR ESCOLA
        // =================================================

        const notaRef =
            doc(
                db,
                "notas",
                idLancamento
            );


        const notaSnap =
            await getDoc(notaRef);


        let dadosAtuais = {};


        if (notaSnap.exists()) {

            dadosAtuais =
                notaSnap.data();


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
        // VERIFICAR PERMISSÃO
        // =================================================

        const alunosNotas = [];


        for (
            const aluno
            of alunos
        ) {

            const podeEditar =
                alunoPodeEditar(aluno);


            const mac =
                document.querySelector(
                    `.mac[data-id="${aluno.id}"]`
                );


            const npt =
                document.querySelector(
                    `.npt[data-id="${aluno.id}"]`
                );


            if (!mac || !npt)
                continue;


            // =============================================
            // ALUNO BLOQUEADO
            // =============================================

            if (!podeEditar) {

                // Não alterar notas de aluno bloqueado.
                // Se já existirem notas, preservá-las.

                continue;

            }


            // =============================================
            // VALORES
            // =============================================

            const valorMAC =
                mac.value === ""
                    ? ""
                    : Number(mac.value);


            const valorNPT =
                npt.value === ""
                    ? ""
                    : Number(npt.value);


            // =============================================
            // VALIDAR
            // =============================================

            if (
                valorMAC !== "" &&
                (
                    valorMAC < 0 ||
                    valorMAC > 20
                )
            ) {

                throw new Error(
                    `MAC inválida para ${aluno.nome}.`
                );

            }


            if (
                valorNPT !== "" &&
                (
                    valorNPT < 0 ||
                    valorNPT > 20
                )
            ) {

                throw new Error(
                    `NPT inválida para ${aluno.nome}.`
                );

            }


            // =============================================
            // CALCULAR MF
            // =============================================

            let valorMF = "";

            let valorClassificacao = "";


            if (
                valorMAC !== "" &&
                valorNPT !== ""
            ) {

                valorMF =
                    Number(
                        (
                            (
                                valorMAC +
                                valorNPT
                            ) / 2
                        ).toFixed(1)
                    );


                valorClassificacao =
                    classificarNota(
                        valorMF
                    );

            }


            // =============================================
            // GUARDAR
            // =============================================

            alunosNotas.push({

                id:
                    aluno.id,

                alunoId:
                    aluno.id,

                codigoAluno:
                    aluno.codigoAluno || "",

                numero:
                    aluno.numero || "",

                nome:
                    aluno.nome || "",

                mac:
                    valorMAC,

                npt:
                    valorNPT,

                mf:
                    valorMF,

                classificacao:
                    valorClassificacao

            });

        }


        // =================================================
        // PRESERVAR ALUNOS BLOQUEADOS
        // =================================================

        const notasAntigas =
            Array.isArray(
                dadosAtuais.alunos
            )
                ? dadosAtuais.alunos
                : [];


        notasAntigas.forEach(
            notaAntiga => {

                const alunoExiste =
                    alunosNotas.some(
                        nota =>
                            String(nota.id) ===
                            String(
                                notaAntiga.id ||
                                notaAntiga.alunoId
                            )
                    );


                if (!alunoExiste) {

                    alunosNotas.push(
                        notaAntiga
                    );

                }

            }
        );


        // =================================================
        // DADOS FINAIS
        // =================================================

        const dados = {

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

            // NÃO APAGAR CONTROLO DO ADMIN
            abertoGeral:
                dadosAtuais.abertoGeral === true,

            alunosAbertos:
                dadosAtuais.alunosAbertos || {},

            atualizadoEm:
                serverTimestamp()

        };


        if (!notaSnap.exists()) {

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


        // Recarregar para confirmar
        await carregarNotas();

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

if (botaoGuardar) {

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


        // Primeiro cria a tabela
        renderizarAlunos();


        // Depois coloca as notas existentes
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

                    <td colspan="7"
                        style="text-align:center;padding:20px;">

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
