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


alert("🔥 NOTAS.JS CARREGOUP!");

alert("🔥 FIREBASE E FIRESTORE IMPORTADOS!");

// =====================================================
// ESCOLA
// =====================================================

const escolaId =
    sessionStorage.getItem("escolaId") ||
    localStorage.getItem("escolaId");

alert(
    "🔥 ESCOLA: " +
    (escolaId || "NÃO ENCONTRADA")
);


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


alert("🔥 ELEMENTOS DA PÁGINA CARREGADOS!");

// =====================================================
// DADOS
// =====================================================

let professores = [];
let turmas = [];

let professorSelecionado = null;
let lancamentoSelecionado = null;


alert("🔥 DADOS INICIALIZADOS!");

// =====================================================
// CARREGAR PROFESSORES
// =====================================================

async function carregarProfessores() {

    alert("🔥 1 — ENTROU EM carregarProfessores()");

    professores = [];

    const resultado =
        await getDocs(
            query(
                collection(db, "professores"),
                where("escolaId", "==", escolaId)
            )
        );

    alert(
        "🔥 2 — PROFESSORES ENCONTRADOS: " +
        resultado.size
    );

    resultado.forEach(documento => {

        professores.push({
            id: documento.id,
            ...documento.data()
        });

    });

    console.log(
        "👨‍🏫 PROFESSORES:",
        professores
    );

    alert(
        "🔥 3 — PROFESSORES CARREGADOS!"
    );
}

// =====================================================
// CARREGAR TURMAS
// =====================================================

async function carregarTurmas() {

    alert("🔥 4 — ENTROU EM carregarTurmas()");

    turmas = [];

    const resultado =
        await getDocs(
            query(
                collection(db, "turmas"),
                where("escolaId", "==", escolaId)
            )
        );

    alert(
        "🔥 5 — TURMAS ENCONTRADAS: " +
        resultado.size
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

    alert(
        "🔥 6 — TURMAS CARREGADAS!"
    );
}

// =====================================================
// PREENCHER PROFESSORES
// =====================================================

function preencherProfessores() {

    alert("🔥 9 — ENTROU EM preencherProfessores()");

    if (!filtroProfessor) {

        alert(
            "❌ filtroProfessor NÃO FOI ENCONTRADO!"
        );

        return;
    }

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

    alert(
        "🔥 10 — PROFESSORES COLOCADOS NO SELECT: " +
        professores.length
    );
}

// =====================================================
// PROFESSOR → CLASSES
// =====================================================

function carregarClassesDoProfessor(professorId) {

    alert("🔥 12 — CARREGAR CLASSES DO PROFESSOR");

    if (!filtroClasse) {

        alert(
            "❌ filtroClasse NÃO FOI ENCONTRADO!"
        );

        return;
    }

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

    if (!professorSelecionado) {

        alert(
            "⚠️ PROFESSOR NÃO ENCONTRADO!"
        );

        return;
    }

    const atribuicoes =
        Array.isArray(
            professorSelecionado.atribuicoes
        )
            ? professorSelecionado.atribuicoes
            : [];

    alert(
        "🔥 13 — ATRIBUIÇÕES ENCONTRADAS: " +
        atribuicoes.length
    );

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

    alert(
        "🔥 14 — CLASSES COLOCADAS: " +
        classes.size
    );

    console.log(
        "📚 CLASSES:",
        [...classes.values()]
    );
}

// =====================================================
// EVENTO — PROFESSOR
// =====================================================

filtroProfessor?.addEventListener(
    "change",
    function () {

        alert(
            "🔥 15 — PROFESSOR SELECIONADO: " +
            this.value
        );

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
    }
);

// =====================================================
// CLASSE → TURMAS
// =====================================================

function carregarTurmasDaClasse(classe) {

    alert(
        "🔥 16 — CLASSE SELECIONADA: " +
        classe
    );

    if (!filtroTurma) {

        alert(
            "❌ filtroTurma NÃO FOI ENCONTRADO!"
        );

        return;
    }

    filtroTurma.innerHTML = `
        <option value="">
            Selecionar turma
        </option>
    `;

    filtroTurma.disabled = true;

    if (!professorSelecionado) {

        alert(
            "❌ NENHUM PROFESSOR SELECIONADO!"
        );

        return;
    }

    if (!classe) {

        alert(
            "⚠️ NENHUMA CLASSE SELECIONADA!"
        );

        return;
    }

    const atribuicoes =
        Array.isArray(
            professorSelecionado.atribuicoes
        )
            ? professorSelecionado.atribuicoes
            : [];

    alert(
        "🔥 17 — ATRIBUIÇÕES DO PROFESSOR: " +
        atribuicoes.length
    );

    const idsTurmas = [
        ...new Set(

            atribuicoes

                .filter(atribuicao => {

                    return String(
                        atribuicao.classe || ""
                    ).trim() ===
                    String(classe).trim();

                })

                .map(
                    atribuicao =>
                        atribuicao.turmaId
                )

                .filter(Boolean)

        )
    ];

    alert(
        "🔥 18 — IDs DAS TURMAS ENCONTRADOS: " +
        idsTurmas.length
    );

    console.log(
        "🏫 IDs DAS TURMAS:",
        idsTurmas
    );

    const turmasEncontradas =
        idsTurmas

            .map(id =>

                turmas.find(
                    turma =>
                        turma.id === id
                )

            )

            .filter(Boolean);

    console.log(
        "🏫 TURMAS ENCONTRADAS:",
        turmasEncontradas
    );

    turmasEncontradas.forEach(turma => {

        const option =
            document.createElement("option");

        option.value =
            turma.id;

        option.textContent =
            turma.nome ||
            turma.turma ||
            turma.designacao ||
            "Turma";

        filtroTurma.appendChild(
            option
        );

    });

    filtroTurma.disabled =
        turmasEncontradas.length === 0;

    alert(
        "🔥 19 — TURMAS COLOCADAS NO SELECT: " +
        turmasEncontradas.length
    );
}


// =====================================================
// EVENTO — CLASSE
// =====================================================

filtroClasse?.addEventListener(
    "change",
    function () {

        alert(
            "🔥 20 — EVENTO DA CLASSE FUNCIONOU!"
        );

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
    }
);

// =====================================================
// TURMA → DISCIPLINAS
// =====================================================

function carregarDisciplinasDaTurma(turmaId) {

    alert(
        "🔥 21 — TURMA SELECIONADA: " +
        turmaId
    );

    if (!filtroDisciplina) {

        alert(
            "❌ filtroDisciplina NÃO FOI ENCONTRADO!"
        );

        return;
    }

    filtroDisciplina.innerHTML = `
        <option value="">
            Selecionar disciplina
        </option>
    `;

    filtroDisciplina.disabled = true;

    if (!professorSelecionado) {

        alert(
            "❌ NENHUM PROFESSOR SELECIONADO!"
        );

        return;
    }

    if (!turmaId) {

        alert(
            "⚠️ NENHUMA TURMA SELECIONADA!"
        );

        return;
    }

    const atribuicoes =
        Array.isArray(
            professorSelecionado.atribuicoes
        )
            ? professorSelecionado.atribuicoes
            : [];

    alert(
        "🔥 22 — ATRIBUIÇÕES DO PROFESSOR: " +
        atribuicoes.length
    );

    const disciplinas = new Set();

    atribuicoes.forEach(atribuicao => {

        const atribuicaoTurmaId =
            String(
                atribuicao.turmaId || ""
            ).trim();

        if (
            atribuicaoTurmaId !==
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

    alert(
        "🔥 23 — DISCIPLINAS ENCONTRADAS: " +
        disciplinas.size
    );

    console.log(
        "📚 DISCIPLINAS:",
        [...disciplinas]
    );

    disciplinas.forEach(disciplina => {

        const option =
            document.createElement("option");

        option.value =
            disciplina;

        option.textContent =
            disciplina;

        filtroDisciplina.appendChild(
            option
        );

    });

    filtroDisciplina.disabled =
        disciplinas.size === 0;

    alert(
        "🔥 24 — DISCIPLINAS COLOCADAS NO SELECT: " +
        disciplinas.size
    );
}


// =====================================================
// EVENTO — TURMA
// =====================================================

filtroTurma?.addEventListener(
    "change",
    function () {

        alert(
            "🔥 25 — EVENTO DA TURMA FUNCIONOU!"
        );

        carregarDisciplinasDaTurma(
            this.value
        );

        lancamentoSelecionado = null;
    }
);

// =====================================================
// INICIAR
// =====================================================

async function iniciarNotas() {

    alert("🔥 7 — ENTROU EM iniciarNotas()");

    try {

       await carregarProfessores();

await carregarTurmas();

preencherProfessores();

alert(
    "🔥 11 — PROFESSORES PREENCHIDOS NO SELECT!"
);

    }
    catch (erro) {

        console.error(
            "❌ ERRO:",
            erro
        );

        alert(
            "❌ ERRO AO CARREGAR:\n\n" +
            erro.message
        );
    }
}


// =====================================================
// INICIAR SISTEMA
// =====================================================

iniciarNotas();
