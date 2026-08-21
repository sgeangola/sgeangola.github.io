// =====================================================
// SGE ANGOLA — SUPER ADMIN
// LOGIN AUTOMÁTICO PARA TESTE
// =====================================================

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
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
// 🔐 DADOS DE ACESSO DO SUPER ADMIN
// ALTERE SOMENTE ESTES DADOS
// =====================================================

const SUPER_ADMIN_EMAIL =
    "dariofranco@gmail.com";

const SUPER_ADMIN_PASSWORD =
    "correia123df.";


// =====================================================
// UID DO SUPER ADMIN
// =====================================================

const SUPER_ADMIN_UID =
    "OSw3412BOxgBJ13pwhifIQOXf2h1";


// =====================================================
// ELEMENTOS DO HTML
// =====================================================

const carregando =
    document.getElementById("carregando");

const acessoNegado =
    document.getElementById("acessoNegado");

const painel =
    document.getElementById("painelAdmin");

const nomeAdmin =
    document.getElementById("nomeAdmin");


// =====================================================
// MOSTRAR CARREGAMENTO
// =====================================================

function mostrarCarregando() {

    if (carregando) {

        carregando.style.display =
            "flex";

    }

    if (acessoNegado) {

        acessoNegado.style.display =
            "none";

    }

    if (painel) {

        painel.style.display =
            "none";

    }

}


// =====================================================
// MOSTRAR PAINEL
// =====================================================

function mostrarPainel() {

    if (carregando) {

        carregando.style.display =
            "none";

    }

    if (acessoNegado) {

        acessoNegado.style.display =
            "none";

    }

    if (painel) {

        painel.style.display =
            "block";

    }

}


// =====================================================
// MOSTRAR ACESSO NEGADO
// =====================================================

function mostrarAcessoNegado() {

    if (carregando) {

        carregando.style.display =
            "none";

    }

    if (painel) {

        painel.style.display =
            "none";

    }

    if (acessoNegado) {

        acessoNegado.style.display =
            "flex";

    }

}


// =====================================================
// VERIFICAR SUPER ADMIN
// =====================================================

async function verificarSuperAdmin(usuario) {

    try {

        console.log(
            "===================================="
        );

        console.log(
            "SUPER ADMIN — VERIFICAÇÃO"
        );

        console.log(
            "E-mail:",
            usuario.email
        );

        console.log(
            "UID:",
            usuario.uid
        );


        // =================================================
        // VERIFICAR UID
        // =================================================

        if (
            usuario.uid !==
            SUPER_ADMIN_UID
        ) {

            console.error(
                "UID NÃO É DO SUPER ADMIN."
            );

            mostrarAcessoNegado();

            return;

        }


        // =================================================
        // BUSCAR SUPER ADMIN NO FIRESTORE
        // =================================================

        const referencia =
            doc(
                db,
                "superAdmins",
                SUPER_ADMIN_UID
            );


        const resultado =
            await getDoc(
                referencia
            );


        if (
            !resultado.exists()
        ) {

            console.error(
                "Documento superAdmins não existe."
            );

            mostrarAcessoNegado();

            return;

        }


        const dados =
            resultado.data();


        console.log(
            "Dados do Super Admin:",
            dados
        );


        // =================================================
        // VERIFICAR ATIVO
        // =================================================

        if (
            dados.ativo !== true
        ) {

            console.error(
                "Super Admin está desativado."
            );

            mostrarAcessoNegado();

            return;

        }


        // =================================================
        // MOSTRAR NOME
        // =================================================

        if (nomeAdmin) {

            nomeAdmin.textContent =
                dados.nome ||
                usuario.email ||
                "Super Admin";

        }


        // =================================================
        // ACESSO AUTORIZADO
        // =================================================

        console.log(
            "✅ SUPER ADMIN AUTORIZADO"
        );


        mostrarPainel();

    }

    catch (erro) {

        console.error(
            "Erro ao verificar Super Admin:",
            erro
        );

        mostrarAcessoNegado();

    }

}


// =====================================================
// LOGIN AUTOMÁTICO
// =====================================================

async function entrarComoSuperAdmin() {

    mostrarCarregando();


    try {

        console.log(
            "Tentando entrar como Super Admin..."
        );


        // =================================================
        // VERIFICAR SE JÁ ESTÁ LOGADO
        // =================================================

        const usuarioAtual =
            auth.currentUser;


        if (usuarioAtual) {

            console.log(
                "Já existe uma sessão:",
                usuarioAtual.email
            );


            await verificarSuperAdmin(
                usuarioAtual
            );

            return;

        }


        // =================================================
        // FAZER LOGIN
        // =================================================

        const resultado =
            await signInWithEmailAndPassword(
                auth,
                SUPER_ADMIN_EMAIL,
                SUPER_ADMIN_PASSWORD
            );


        console.log(
            "Login efetuado:",
            resultado.user.email
        );


        console.log(
            "UID:",
            resultado.user.uid
        );


        // =================================================
        // VERIFICAR SUPER ADMIN
        // =================================================

        await verificarSuperAdmin(
            resultado.user
        );

    }

    catch (erro) {

        console.error(
            "ERRO NO LOGIN DO SUPER ADMIN:",
            erro
        );


        console.error(
            "Código:",
            erro.code
        );


        console.error(
            "Mensagem:",
            erro.message
        );


        if (
            erro.code ===
            "auth/invalid-credential"
        ) {

            alert(
                "E-mail ou código de acesso incorreto."
            );

        }

        else if (
            erro.code ===
            "auth/user-not-found"
        ) {

            alert(
                "A conta do Super Admin não existe no Firebase Authentication."
            );

        }

        else if (
            erro.code ===
            "auth/wrong-password"
        ) {

            alert(
                "Código de acesso incorreto."
            );

        }

        else {

            alert(
                "Erro no acesso:\n\n" +
                erro.message
            );

        }


        mostrarAcessoNegado();

    }

}


// =====================================================
// TERMINAR SESSÃO
// =====================================================

window.terminarSessao =
async function () {

    try {

        await signOut(auth);

        console.log(
            "Sessão terminada."
        );


        window.location.href =
            "./login.html";

    }

    catch (erro) {

        console.error(
            "Erro ao terminar sessão:",
            erro
        );

        alert(
            "Não foi possível terminar a sessão."
        );

    }

};


// =====================================================
// INICIALIZAÇÃO
// =====================================================

mostrarCarregando();


onAuthStateChanged(
    auth,
    async usuario => {

        console.log(
            "AUTH STATE:",
            usuario
                ? usuario.email
                : "não autenticado"
        );


        if (usuario) {

            await verificarSuperAdmin(
                usuario
            );

        }

    }
);


// =====================================================
// INICIAR
// =====================================================

entrarComoSuperAdmin();
