import { login } from "./auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

import { db } from "./firebase.js";


const form = document.getElementById("loginForm");
const botao = form.querySelector("button");


form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    if (!email || !password) {

        alert("Preencha o e-mail e a senha.");

        return;
    }


    botao.disabled = true;
    botao.textContent = "A entrar...";


    try {

        console.log("ETAPA 1: iniciando login");


        // ==========================================
        // FIREBASE AUTHENTICATION
        // ==========================================

        const resultado =
            await login(email, password);


        console.log(
            "ETAPA 2: resultado do Firebase Auth",
            resultado
        );


        if (!resultado.success) {

            throw new Error(
                resultado.message
            );
        }


        const usuario =
            resultado.user;


        if (!usuario) {

            throw new Error(
                "Usuário autenticado não foi encontrado."
            );
        }


        const uidGestor =
            usuario.uid;


        console.log(
            "ETAPA 3: UID do gestor:",
            uidGestor
        );


        botao.textContent =
            "A procurar escola...";


        // ==========================================
        // FIRESTORE
        // ==========================================

        const consulta =
            query(
                collection(db, "escolas"),
                where(
                    "gestorUid",
                    "==",
                    uidGestor
                )
            );


        console.log(
            "ETAPA 4: consulta criada"
        );


        const resultadoEscolas =
            await getDocs(consulta);


        console.log(
            "ETAPA 5: escolas encontradas:",
            resultadoEscolas.size
        );


        if (resultadoEscolas.empty) {

            throw new Error(
                "O gestor entrou no Firebase, mas não está associado a nenhuma escola."
            );
        }


        // ==========================================
        // ESCOLA
        // ==========================================

        const documento =
            resultadoEscolas.docs[0];

        const escola =
            documento.data();

        const escolaId =
            documento.id;


        console.log(
            "ETAPA 6: escola encontrada:",
            escola
        );


        // ==========================================
        // SESSÃO
        // ==========================================

        sessionStorage.setItem(
            "escolaId",
            escolaId
        );

        sessionStorage.setItem(
            "gestorUid",
            uidGestor
        );

        sessionStorage.setItem(
            "nomeEscola",
            escola.nome || ""
        );

        sessionStorage.setItem(
            "logoEscola",
            escola.logoUrl || ""
        );

        sessionStorage.setItem(
            "nomeGestor",
            escola.nomeGestor || ""
        );

        sessionStorage.setItem(
            "emailGestor",
            escola.emailGestor || email
        );

        sessionStorage.setItem(
            "provinciaEscola",
            escola.provincia || ""
        );

        sessionStorage.setItem(
            "municipioEscola",
            escola.municipio || ""
        );

        sessionStorage.setItem(
            "anoLetivo",
            escola.anoLetivoAtual || ""
        );


        console.log(
            "ETAPA 7: sessão criada"
        );


        // ==========================================
        // DASHBOARD
        // ==========================================

        botao.textContent =
            "Entrando...";


        window.location.href =
            "../pages/dashboard-gestor.html";


    } catch (erro) {

        console.error(
            "ERRO COMPLETO:",
            erro
        );


        alert(
            "ERRO:\n\n" +
            (erro.message ||
             "Erro desconhecido.")
        );


        botao.disabled = false;

        botao.textContent =
            "Entrar";
    }

});
