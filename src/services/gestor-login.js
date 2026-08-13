// =====================================================
// LOGIN DO GESTOR — SGE
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
// ELEMENTOS
// =====================================================

const form = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const botao = form.querySelector("button");


// =====================================================
// VERIFICAR FORMULÁRIO
// =====================================================

if (!form) {

    console.error(
        "ERRO: loginForm não encontrado."
    );

} else {


    // =================================================
    // LOGIN
    // =================================================

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email || !password) {

            alert(
                "Preencha o e-mail e a senha."
            );

            return;
        }


        // =================================================
        // DESATIVAR BOTÃO
        // =================================================

        botao.disabled = true;

        botao.textContent =
            "A entrar...";


        try {


            // =================================================
            // 1 — AUTENTICAÇÃO
            // =================================================

            console.log(
                "1. A autenticar gestor..."
            );


            const resultado =
                await login(
                    email,
                    password
                );


            console.log(
                "Resultado do login:",
                resultado
            );


            if (!resultado.success) {

                throw new Error(
                    resultado.message
                );
            }


            // =================================================
            // 2 — UID
            // =================================================

            const usuario =
                resultado.user;


            if (!usuario) {

                throw new Error(
                    "O Firebase não devolveu os dados do utilizador."
                );
            }


            const uidGestor =
                usuario.uid;


            console.log(
                "2. UID do gestor:",
                uidGestor
            );


            botao.textContent =
                "A procurar escola...";


            // =================================================
            // 3 — PROCURAR ESCOLA
            // =================================================

            console.log(
                "3. A procurar escola..."
            );


            const consulta =
                query(
                    collection(db, "escolas"),
                    where(
                        "gestorUid",
                        "==",
                        uidGestor
                    )
                );


            const resultadoEscolas =
                await getDocs(consulta);


            console.log(
                "Escolas encontradas:",
                resultadoEscolas.size
            );


            // =================================================
            // NENHUMA ESCOLA
            // =================================================

            if (resultadoEscolas.empty) {

                throw new Error(
                    "Este gestor não está associado a nenhuma escola."
                );
            }


            // =================================================
            // 4 — PEGAR ESCOLA
            // =================================================

            const documento =
                resultadoEscolas.docs[0];


            const escola =
                documento.data();


            const escolaId =
                documento.id;


            console.log(
                "4. Escola encontrada:",
                escola
            );


            // =================================================
            // 5 — GUARDAR SESSÃO
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
            // 6 — SUCESSO
            // =================================================

            console.log(
                "5. Login concluído."
            );


            botao.textContent =
                "Entrando...";


            // Pequeno intervalo para garantir
            // que a sessão seja gravada

            setTimeout(() => {

                window.location.href =
                    "../pages/dashboard-gestor.html";

            }, 300);


        } catch (erro) {

            console.error(
                "ERRO NO LOGIN:",
                erro
            );


            alert(
                "Não foi possível entrar:\n\n" +
                (erro.message ||
                 "Erro desconhecido.")
            );


            botao.disabled = false;

            botao.textContent =
                "Entrar";
        }

    });

                }
