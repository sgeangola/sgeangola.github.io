// =====================================================
// LOGIN EXCLUSIVO DO SUPER ADMIN
// SGE ANGOLA
// =====================================================

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


import {
    auth,
    db
} from "./firebase.js";


// =====================================================
// UID DO SUPER ADMIN
// =====================================================

const SUPER_ADMIN_UID =
    "OSw3412BOxgBJ13pwhifIQOXf2h1";


// =====================================================
// ELEMENTOS
// =====================================================

const formulario =
    document.getElementById(
        "loginSuperAdmin"
    );


const mensagem =
    document.getElementById(
        "mensagem"
    );


const botao =
    document.getElementById(
        "btnEntrar"
    );


// =====================================================
// MENSAGEM
// =====================================================

function mostrarMensagem(
    texto,
    erro = false
) {

    mensagem.textContent =
        texto;

    mensagem.style.display =
        "block";


    if (erro) {

        mensagem.style.background =
            "#fde8e8";

        mensagem.style.color =
            "#a52626";

    }

    else {

        mensagem.style.background =
            "#e5f7eb";

        mensagem.style.color =
            "#18743a";

    }

}


// =====================================================
// LOGIN
// =====================================================

formulario.addEventListener(
    "submit",
    async (event) => {

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

            mostrarMensagem(
                "Preencha todos os campos.",
                true
            );

            return;

        }


        try {

            botao.disabled =
                true;

            botao.textContent =
                "A entrar...";


            // =========================================
            // AUTENTICAR NO FIREBASE
            // =========================================

            const resultado =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const usuario =
                resultado.user;


            console.log(
                "Super Admin autenticado:",
                usuario.email
            );


            console.log(
                "UID:",
                usuario.uid
            );


            // =========================================
            // VERIFICAR UID
            // =========================================

            if (
                usuario.uid !==
                SUPER_ADMIN_UID
            ) {

                await auth.signOut();


                mostrarMensagem(
                    "Esta conta não pertence ao Super Administrador.",
                    true
                );


                botao.disabled =
                    false;

                botao.textContent =
                    "Entrar no Super Admin";


                return;

            }


            // =========================================
            // VERIFICAR DOCUMENTO
            // =========================================

            const referencia =
                doc(
                    db,
                    "superAdmins",
                    usuario.uid
                );


            const documento =
                await getDoc(
                    referencia
                );


            if (!documento.exists()) {

                await auth.signOut();


                mostrarMensagem(
                    "Conta de Super Admin não configurada no Firestore.",
                    true
                );


                botao.disabled =
                    false;

                botao.textContent =
                    "Entrar no Super Admin";


                return;

            }


            const dados =
                documento.data();


            // =========================================
            // VERIFICAR ATIVO
            // =========================================

            if (
                dados.ativo !== true
            ) {

                await auth.signOut();


                mostrarMensagem(
                    "A conta do Super Admin está desativada.",
                    true
                );


                botao.disabled =
                    false;

                botao.textContent =
                    "Entrar no Super Admin";


                return;

            }


            // =========================================
            // SUCESSO
            // =========================================

            mostrarMensagem(
                "Login efetuado com sucesso!"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "./super-admin.html";

                },
                700
            );


        }

        catch (erro) {

            console.error(
                "Erro no login Super Admin:",
                erro
            );


            let texto =
                "Não foi possível iniciar sessão.";


            if (
                erro.code ===
                "auth/invalid-credential"
            ) {

                texto =
                    "E-mail ou palavra-passe incorretos.";

            }

            else if (
                erro.code ===
                "auth/invalid-login-credentials"
            ) {

                texto =
                    "E-mail ou palavra-passe incorretos.";

            }

            else if (
                erro.code ===
                "auth/network-request-failed"
            ) {

                texto =
                    "Sem ligação à Internet.";

            }


            mostrarMensagem(
                texto,
                true
            );


            botao.disabled =
                false;

            botao.textContent =
                "Entrar no Super Admin";

        }

    }
);
