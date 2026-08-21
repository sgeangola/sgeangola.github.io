// =====================================================
// LOGIN DO GESTOR - SGE ANGOLA
// Verifica se a escola está aprovada antes de entrar
// =====================================================

import { login } from "./auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";


const form = document.getElementById("loginForm");


form.addEventListener("submit", async (event) => {

    event.preventDefault();


    // =================================================
    // CAMPOS
    // =================================================

    const email =
        document
        .getElementById("email")
        .value
        .trim();


    const password =
        document
        .getElementById("password")
        .value;


    try {

        // =================================================
        // LOGIN FIREBASE
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
        // UTILIZADOR AUTENTICADO
        // =================================================

        const user =
            auth.currentUser;


        if (!user) {

            alert(
                "Não foi possível identificar o utilizador."
            );

            return;

        }


        console.log(
            "GESTOR AUTENTICADO:",
            user.uid
        );


        // =================================================
        // PROCURAR A ESCOLA DO GESTOR
        // =================================================

        const escolasRef =
            collection(
                db,
                "escolas"
            );


        const consulta =
            query(
                escolasRef,
                where(
                    "gestorUid",
                    "==",
                    user.uid
                )
            );


        const resultado =
            await getDocs(
                consulta
            );


        // =================================================
        // ESCOLA NÃO ENCONTRADA
        // =================================================

        if (resultado.empty) {

            alert(
                "A sua conta não está associada a nenhuma escola."
            );

            return;

        }


        // =================================================
        // PEGAR ESCOLA
        // =================================================

        let escolaId = null;

        let escola = null;


        resultado.forEach(
            (doc) => {

                escolaId =
                    doc.id;

                escola =
                    doc.data();

            }
        );


        console.log(
            "ESCOLA ENCONTRADA:",
            escolaId,
            escola
        );


        // =================================================
        // VERIFICAR ESTADO
        // =================================================

        const estado =
            escola.estado || "pendente";


        const ativo =
            escola.ativo === true;


        // =================================================
        // ESCOLA PENDENTE
        // =================================================

        if (
            estado === "pendente" ||
            !ativo
        ) {

            alert(
                "A sua escola ainda está pendente de aprovação pelo Super Administrador.\n\n" +
                "Aguarde a aprovação para poder utilizar o sistema."
            );


            // IMPORTANTE:
            // Não deixar a sessão continuar aberta.

            await auth.signOut();


            return;

        }


        // =================================================
        // ESCOLA REJEITADA
        // =================================================

        if (
            estado === "rejeitada"
        ) {

            alert(
                "A candidatura da sua escola foi rejeitada pelo Super Administrador."
            );


            await auth.signOut();


            return;

        }


        // =================================================
        // ESCOLA APROVADA
        // =================================================

        if (
            estado === "aprovada" &&
            ativo === true
        ) {


            // =============================================
            // GUARDAR ESCOLA ATUAL
            // =============================================

            localStorage.setItem(
                "escolaId",
                escolaId
            );


            sessionStorage.setItem(
                "escolaId",
                escolaId
            );


            sessionStorage.setItem(
                "nomeEscola",
                escola.nome || ""
            );


            sessionStorage.setItem(
                "tipoEscola",
                escola.tipoEscola || ""
            );


            sessionStorage.setItem(
                "ensinos",
                JSON.stringify(
                    escola.ensinos || []
                )
            );


            sessionStorage.setItem(
                "estruturaEscola",
                JSON.stringify(
                    escola.estrutura || {}
                )
            );


            // =============================================
            // ENTRAR NO DASHBOARD
            // =============================================

            alert(
                "Login efetuado com sucesso!"
            );


            window.location.href =
                "../pages/dashboard-gestor.html";


            return;

        }


        // =================================================
        // ESTADO DESCONHECIDO
        // =================================================

        alert(
            "A escola ainda não está autorizada a utilizar o sistema."
        );


        await auth.signOut();


    }
    catch (erro) {

        console.error(
            "ERRO NO LOGIN:",
            erro
        );


        alert(
            "Ocorreu um erro ao verificar a escola.\n\n" +
            erro.message
        );

    }

});
