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


alert("🔥 NOTAS.JS CARREGOUO!");

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
