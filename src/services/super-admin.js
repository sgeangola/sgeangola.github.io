import {
onAuthStateChanged
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
// CONFIGURAÇÃO DO SUPER ADMIN
// =====================================================

const SUPER_ADMIN_UID =
"OSw3412BOxgBJ13pwhifIQOXf2h1";

// =====================================================
// ELEMENTOS
// =====================================================

const carregando =
document.getElementById("carregando");

const acessoNegado =
document.getElementById("acessoNegado");

const painel =
document.getElementById("painelAdmin");

// =====================================================
// MOSTRAR / ESCONDER
// =====================================================

function mostrarCarregando() {

if (carregando) {
    carregando.style.display = "flex";
}

if (acessoNegado) {
    acessoNegado.style.display = "none";
}

if (painel) {
    painel.style.display = "none";
}

}

function mostrarPainel() {

if (carregando) {
    carregando.style.display = "none";
}

if (acessoNegado) {
    acessoNegado.style.display = "none";
}

if (painel) {
    painel.style.display = "block";
}

}

function mostrarAcessoNegado() {

if (carregando) {
    carregando.style.display = "none";
}

if (painel) {
    painel.style.display = "none";
}

if (acessoNegado) {
    acessoNegado.style.display = "flex";
}

}

// =====================================================
// VERIFICAR SUPER ADMIN
// =====================================================

async function verificarSuperAdmin(
usuario
) {

try {

    // =============================================
    // VERIFICAR UID
    // =============================================

    if (
        !usuario ||
        usuario.uid !== SUPER_ADMIN_UID
    ) {

        console.warn(
            "Utilizador não é Super Admin."
        );

        mostrarAcessoNegado();

        return;

    }


    // =============================================
    // VERIFICAR DOCUMENTO NO FIRESTORE
    // =============================================

    const referencia =
        doc(
            db,
            "superAdmins",
            usuario.uid
        );


    const resultado =
        await getDoc(
            referencia
        );


    if (!resultado.exists()) {

        console.error(
            "Documento do Super Admin não encontrado."
        );

        mostrarAcessoNegado();

        return;

    }


    const dados =
        resultado.data();


    // =============================================
    // VERIFICAR SE ESTÁ ATIVO
    // =============================================

    if (
        dados.ativo !== true
    ) {

        console.warn(
            "Conta Super Admin desativada."
        );

        mostrarAcessoNegado();

        return;

    }


    // =============================================
    // ACESSO AUTORIZADO
    // =============================================

    console.log(
        "SUPER ADMIN AUTORIZADO:",
        usuario.email
    );


    // Mostrar nome no painel
    const nomeAdmin =
        document.getElementById(
            "nomeAdmin"
        );

    if (nomeAdmin) {

        nomeAdmin.textContent =
            dados.nome ||
            usuario.email ||
            "Super Admin";

    }


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
// PROTEÇÃO DE ACESSO
// =====================================================

mostrarCarregando();

onAuthStateChanged(
auth,
async usuario => {

    // =============================================
    // NÃO ESTÁ LOGADO
    // =============================================

    if (!usuario) {

        window.location.href =
            "./login.html";

        return;

    }


    // =============================================
    // ESTÁ LOGADO
    // =============================================

    await verificarSuperAdmin(
        usuario
    );

}

);
