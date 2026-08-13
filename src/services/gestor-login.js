// =====================================================
// LOGIN DO GESTOR — SGE ANGOLA
// =====================================================

import { login } from "./auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

import { db } from "./firebase.js";


// =====================================================
// FORMULÁRIO
// =====================================================

const form =
    document.getElementById("loginForm");


// =====================================================
// LOGIN
// =====================================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const email =
        document
            .getElementById("email")
            .value
            .trim();


    const password =
        document
            .getElementById("password")
            .value;


    if (!email || !password) {

        alert(
            "Informe o e-mail e a senha."
        );

        return;
    }


    try {

        // =================================================
        // AUTENTICAR GESTOR
        // =================================================

        const result =
            await login(
                email,
                password
            );


        if (!result.success) {

            alert(
                "Erro no login: " +
                result.message
            );

            return;
        }


        // =================================================
        // UID DO GESTOR
        // =================================================

        const uidGestor =
            result.user?.uid;


        if (!uidGestor) {

            throw new Error(
                "Não foi possível identificar o gestor."
            );
        }


        console.log(
            "UID DO GESTOR:",
            uidGestor
        );


        // =================================================
        // PROCURAR A ESCOLA DO GESTOR
        // =================================================

        const consulta =
            query(
                collection(db, "escolas"),
                where(
                    "gestorUid",
                    "==",
                    uidGestor
                )
            );


        const resultado =
            await getDocs(consulta);


        if (resultado.empty) {

            alert(
                "A conta foi autenticada, mas nenhuma escola está associada a este gestor."
            );

            return;
        }


        // =================================================
        // PEGAR A ESCOLA
        // =================================================

        const documento =
            resultado.docs[0];


        const escola =
            documento.data();


        const escolaId =
            documento.id;


        console.log(
            "ESCOLA ENCONTRADA:",
            escola
        );


        // =================================================
        // GUARDAR DADOS DA SESSÃO
        // =================================================

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


        // =================================================
        // LOGIN CONCLUÍDO
        // =================================================

        alert(
            "Login efetuado com sucesso!"
        );


        // =================================================
        // IR PARA O DASHBOARD
        // =================================================

        window.location.href =
            "../páginas/dashboard-gestor.html";


    } catch (erro) {

        console.error(
            "ERRO NO LOGIN DO GESTOR:",
            erro
        );


        alert(
            "Erro ao entrar: " +
            (erro.message ||
             "Erro desconhecido.")
        );

    }

});
