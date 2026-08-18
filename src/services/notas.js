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


alert("🔥 NOTAS.JS CARREGOU!");

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
