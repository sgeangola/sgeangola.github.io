// =====================================================
// LOGIN DO GESTOR - SGE ANGOLA
// Verifica se a escola está autorizada pelo Super Admin
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


// =====================================================
// FORMULÁRIO
// =====================================================

const form =
    document.getElementById("loginForm");


if (!form) {

    console.error(
        "FORMULÁRIO loginForm NÃO ENCONTRADO."
    );

} else {


    form.addEventListener(
        "submit",
        async (event) => {

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


            if (!email || !password) {

                alert(
                    "Preencha o e-mail e a palavra-passe."
                );

                return;

            }


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
                    "===================================="
                );

                console.log(
                    "GESTOR AUTENTICADO"
                );

                console.log(
                    "E-mail:",
                    user.email
                );

                console.log(
                    "UID:",
                    user.uid
                );


                // =================================================
                // PROCURAR ESCOLA DO GESTOR
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

                    await auth.signOut();

                    return;

                }


                // =================================================
                // PEGAR ESCOLA
                // =================================================

                let escolaId = null;

                let escola = null;


                resultado.forEach(
                    (documento) => {

                        escolaId =
                            documento.id;

                        escola =
                            documento.data();

                    }
                );


                console.log(
                    "ESCOLA ENCONTRADA:",
                    escolaId
                );

                console.log(
                    "DADOS DA ESCOLA:",
                    escola
                );


                // =================================================
                // ESTADO DA ESCOLA
                // =================================================

                const estado =
                    escola.estado ||
                    "pendente";


                const ativo =
                    escola.ativo === true;


                console.log(
                    "ESTADO:",
                    estado
                );

                console.log(
                    "ATIVO:",
                    ativo
                );


                // =================================================
                // ESCOLA REJEITADA
                // =================================================

                if (
                    estado === "rejeitado"
                ) {

                    alert(
                        "A candidatura da sua escola foi rejeitada pelo Super Administrador."
                    );

                    await auth.signOut();

                    return;

                }


                // =================================================
                // ESCOLA PENDENTE
                // =================================================

                if (
                    estado === "pendente"
                ) {

                    alert(
                        "A sua escola ainda está pendente de aprovação pelo Super Administrador.\n\n" +
                        "Aguarde a aprovação para poder utilizar o sistema."
                    );

                    await auth.signOut();

                    return;

                }


                // =================================================
                // ESCOLA APROVADA / ATIVA
                // =================================================
                //
                // O SUPER ADMIN grava:
                //
                // estado: "ativo"
                // ativo: true
                //
                // Portanto é isso que verificamos aqui.
                // =================================================

                if (
                    estado === "ativo" &&
                    ativo === true
                ) {


                    console.log(
                        "ESCOLA AUTORIZADA!"
                    );


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
                    // LOGIN CONCLUÍDO
                    // =============================================

                    alert(
                        "Login efetuado com sucesso!"
                    );


                    window.location.href =
                        "../pages/dashboard-gestor.html";


                    return;

                }


                // =================================================
                // ESTADO NÃO RECONHECIDO
                // =================================================

                console.warn(
                    "Estado da escola não reconhecido:",
                    estado,
                    ativo
                );


                alert(
                    "A escola ainda não está autorizada a utilizar o sistema."
                );


                await auth.signOut();

            }


            catch (erro) {

                console.error(
                    "===================================="
                );

                console.error(
                    "ERRO NO LOGIN DO GESTOR:"
                );

                console.error(
                    erro
                );


                alert(
                    "Ocorreu um erro ao verificar a escola.\n\n" +
                    erro.message
                );

            }

        }
    );

}
