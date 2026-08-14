// =====================================================
// DASHBOARD GESTOR - SIGEA
// =====================================================

console.log("DASHBOARD-GESTOR.JS CARREGADO ✅");


// =====================================================
// FIREBASE
// =====================================================

import {
    db,
    auth
} from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where,
    limit
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


// =====================================================
// ELEMENTOS
// =====================================================

const schoolName =
    document.getElementById("schoolName");

const userInfo =
    document.getElementById("userInfo");

const totalStudents =
    document.getElementById("totalStudents");

const totalTeachers =
    document.getElementById("totalTeachers");

const totalClasses =
    document.getElementById("totalClasses");

const totalSubjects =
    document.getElementById("totalSubjects");

const activity =
    document.getElementById("activity");

const logoutBtn =
    document.getElementById("logoutBtn");


// =====================================================
// ESCOLA ATUAL
// =====================================================

let escolaAtual = null;
let escolaIdAtual = null;
let usuarioAtual = null;


// =====================================================
// ESCAPAR HTML
// =====================================================

function escaparHTML(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// ZERAR CARTÕES
// =====================================================

function zerarCartoes() {

    if (totalStudents) {
        totalStudents.textContent = "0";
    }

    if (totalTeachers) {
        totalTeachers.textContent = "0";
    }

    if (totalClasses) {
        totalClasses.textContent = "0";
    }

    if (totalSubjects) {
        totalSubjects.textContent = "0";
    }

}


// =====================================================
// INICIAR DASHBOARD
// =====================================================

async function iniciarDashboard() {

    console.log(
        "===================================="
    );

    console.log(
        "INICIANDO DASHBOARD"
    );

    console.log(
        "===================================="
    );


    // Sempre começar em zero
    zerarCartoes();


    const encontrouEscola =
        await carregarInformacoesUsuario();


    if (!encontrouEscola) {

        console.error(
            "ESCOLA NÃO ENCONTRADA."
        );

        return;

    }


    await carregarEstatisticas();


    await carregarAtividadesRecentes();

}


// =====================================================
// CARREGAR ESCOLA DO GESTOR
// =====================================================

async function carregarInformacoesUsuario() {

    try {

        const usuario =
            auth.currentUser;


        if (!usuario) {

            console.error(
                "Nenhum usuário autenticado."
            );

            return false;

        }


        usuarioAtual =
            usuario;


        console.log(
            "GESTOR:",
            usuario.email
        );

        console.log(
            "UID:",
            usuario.uid
        );


        // =================================================
        // PROCURAR ESCOLA PELO UID DO GESTOR
        // =================================================

        const consulta =
            query(
                collection(
                    db,
                    "escolas"
                ),
                where(
                    "gestorUid",
                    "==",
                    usuario.uid
                ),
                limit(1)
            );


        const resultado =
            await getDocs(
                consulta
            );


        if (resultado.empty) {

            console.error(
                "Nenhuma escola encontrada para este gestor."
            );

            if (schoolName) {

                schoolName.textContent =
                    "🏫 Escola não encontrada";

            }

            if (userInfo) {

                userInfo.textContent =
                    usuario.email || "Gestor";

            }

            zerarCartoes();

            return false;

        }


        // =================================================
        // ESCOLA
        // =================================================

        const escolaDoc =
            resultado.docs[0];


        escolaIdAtual =
            escolaDoc.id;


        escolaAtual =
            escolaDoc.data();


        console.log(
            "===================================="
        );

        console.log(
            "ESCOLA ENCONTRADA"
        );

        console.log(
            "ID DA ESCOLA:",
            escolaIdAtual
        );

        console.log(
            "NOME:",
            escolaAtual.nome
        );

        console.log(
            "TIPO:",
            escolaAtual.tipoEscola
        );

        console.log(
            "ENSINOS:",
            escolaAtual.ensinos
        );

        console.log(
            "===================================="
        );


        // =================================================
        // NOME DA ESCOLA
        // =================================================

        if (schoolName) {

            const nome =
                escolaAtual.nome ||
                "Escola";


            const logo =
                escolaAtual.logoUrl ||
                "";


            if (logo) {

                schoolName.innerHTML = `

                    <span
                        style="
                            display:flex;
                            align-items:center;
                            gap:10px;
                        "
                    >

                        <img
                            src="${escaparHTML(logo)}"
                            alt="Logotipo"
                            style="
                                width:42px;
                                height:42px;
                                object-fit:contain;
                                border-radius:8px;
                                background:#fff;
                            "
                        >

                        <span>
                            ${escaparHTML(nome)}
                        </span>

                    </span>

                `;

            } else {

                schoolName.innerHTML = `

                    <span
                        style="
                            display:flex;
                            align-items:center;
                            gap:10px;
                        "
                    >

                        <span style="font-size:32px;">
                            🏫
                        </span>

                        <span>
                            ${escaparHTML(nome)}
                        </span>

                    </span>

                `;

            }

        }


        // =================================================
        // GESTOR
        // =================================================

        if (userInfo) {

            const nomeGestor =
                escolaAtual.nomeGestor ||
                usuario.email ||
                "Gestor";


            userInfo.textContent =
                `Administrador: ${nomeGestor}`;

        }


        // =================================================
        // GUARDAR ESCOLA NA SESSÃO
        // =================================================

        sessionStorage.setItem(
            "escolaId",
            escolaIdAtual
        );


        sessionStorage.setItem(
            "nomeEscola",
            escolaAtual.nome || ""
        );


        sessionStorage.setItem(
            "logoEscola",
            escolaAtual.logoUrl || ""
        );


        sessionStorage.setItem(
            "provinciaEscola",
            escolaAtual.provincia || ""
        );


        sessionStorage.setItem(
            "municipioEscola",
            escolaAtual.municipio || ""
        );


        sessionStorage.setItem(
            "anoLetivo",
            escolaAtual.anoLetivoAtual || ""
        );


        sessionStorage.setItem(
            "tipoEscola",
            escolaAtual.tipoEscola || ""
        );


        sessionStorage.setItem(
            "ensinos",
            JSON.stringify(
                escolaAtual.ensinos || []
            )
        );


        sessionStorage.setItem(
            "estrutura",
            JSON.stringify(
                escolaAtual.estrutura || {}
            )
        );


        sessionStorage.setItem(
            "nomeGestor",
            escolaAtual.nomeGestor || ""
        );


        sessionStorage.setItem(
            "emailGestor",
            usuario.email || ""
        );


        // =================================================
        // MENU
        // =================================================

        configurarMenu();


        return true;

    }
    catch (erro) {

        console.error(
            "ERRO AO CARREGAR ESCOLA:",
            erro
        );

        zerarCartoes();

        return false;

    }

}


// =====================================================
// CONFIGURAR MENU
// =====================================================

function configurarMenu() {

    if (!escolaAtual) {
        return;
    }


    const tipoEscola =
        String(
            escolaAtual.tipoEscola || ""
        ).toLowerCase();


    const ensinos =
        Array.isArray(
            escolaAtual.ensinos
        )
        ? escolaAtual.ensinos
        : [];


    console.log(
        "TIPO DA ESCOLA:",
        tipoEscola
    );

    console.log(
        "ENSINOS:",
        ensinos
    );


    // =================================================
    // FINANCEIRO
    // =================================================

    const links =
        document.querySelectorAll(
            ".sidebar a"
        );


    links.forEach(
        link => {

            const texto =
                link.textContent
                .trim()
                .toLowerCase();


            if (
                texto.includes("financeiro")
            ) {

                if (
                    tipoEscola === "publica"
                ) {

                    link.style.display =
                        "none";

                } else {

                    link.style.display =
                        "flex";

                }

            }

        }
    );


    // =================================================
    // DATASET
    // =================================================

    document.body.dataset.tipoEscola =
        tipoEscola;


    document.body.dataset.ensinos =
        ensinos.join(",");

}


// =====================================================
// ESTATÍSTICAS
// =====================================================

async function carregarEstatisticas() {

    // =================================================
    // SEGURANÇA
    // =================================================

    if (!escolaIdAtual) {

        console.error(
            "escolaIdAtual não definido."
        );

        zerarCartoes();

        return;

    }


    console.log(
        "===================================="
    );

    console.log(
        "CARREGANDO DADOS DA ESCOLA:"
    );

    console.log(
        escolaIdAtual
    );

    console.log(
        "===================================="
    );


    // =================================================
    // ALUNOS
    // =================================================

    try {

        const consulta =
            query(
                collection(
                    db,
                    "alunos"
                ),
                where(
                    "escolaId",
                    "==",
                    escolaIdAtual
                )
            );


        const snapshot =
            await getDocs(
                consulta
            );


        const total =
            snapshot.size;


        if (totalStudents) {

            totalStudents.textContent =
                total;

        }


        console.log(
            "ALUNOS DESTA ESCOLA:",
            total
        );

    }
    catch (erro) {

        console.error(
            "ERRO ALUNOS:",
            erro
        );


        if (totalStudents) {
            totalStudents.textContent = "0";
        }

    }


    // =================================================
    // PROFESSORES
    // =================================================

    try {

        const consulta =
            query(
                collection(
                    db,
                    "professores"
                ),
                where(
                    "escolaId",
                    "==",
                    escolaIdAtual
                )
            );


        const snapshot =
            await getDocs(
                consulta
            );


        const total =
            snapshot.size;


        if (totalTeachers) {

            totalTeachers.textContent =
                total;

        }


        console.log(
            "PROFESSORES DESTA ESCOLA:",
            total
        );

    }
    catch (erro) {

        console.error(
            "ERRO PROFESSORES:",
            erro
        );


        if (totalTeachers) {
            totalTeachers.textContent = "0";
        }

    }


    // =================================================
    // TURMAS
    // =================================================

    try {

        const consulta =
            query(
                collection(
                    db,
                    "turmas"
                ),
                where(
                    "escolaId",
                    "==",
                    escolaIdAtual
                )
            );


        const snapshot =
            await getDocs(
                consulta
            );


        const total =
            snapshot.size;


        if (totalClasses) {

            totalClasses.textContent =
                total;

        }


        console.log(
            "TURMAS DESTA ESCOLA:",
            total
        );

    }
    catch (erro) {

        console.error(
            "ERRO TURMAS:",
            erro
        );


        if (totalClasses) {
            totalClasses.textContent = "0";
        }

    }


    // =================================================
    // DISCIPLINAS
    // =================================================

    try {

        /*
         * IMPORTANTE:
         *
         * Não vamos utilizar uma configuração global
         * de disciplinas.
         *
         * As disciplinas só serão contabilizadas
         * quando existirem em turmas pertencentes
         * à escola atual.
         */


        const consulta =
            query(
                collection(
                    db,
                    "turmas"
                ),
                where(
                    "escolaId",
                    "==",
                    escolaIdAtual
                )
            );


        const snapshot =
            await getDocs(
                consulta
            );


        const conjunto =
            new Set();


        snapshot.forEach(
            documento => {

                const dados =
                    documento.data();


                if (
                    Array.isArray(
                        dados.disciplinas
                    )
                ) {

                    dados.disciplinas.forEach(
                        disciplina => {

                            if (
                                disciplina
                            ) {

                                conjunto.add(
                                    disciplina
                                );

                            }

                        }
                    );

                }

            }
        );


        const total =
            conjunto.size;


        if (totalSubjects) {

            totalSubjects.textContent =
                total;

        }


        console.log(
            "DISCIPLINAS DESTA ESCOLA:",
            total
        );

    }
    catch (erro) {

        console.error(
            "ERRO DISCIPLINAS:",
            erro
        );


        if (totalSubjects) {
            totalSubjects.textContent = "0";
        }

    }

}


// =====================================================
// ATIVIDADES RECENTES
// =====================================================

async function carregarAtividadesRecentes() {

    if (!activity) {
        return;
    }


    /*
     * Por enquanto não vamos carregar atividades
     * de outras escolas.
     *
     * Quando criarmos a coleção de atividades,
     * ela deverá obrigatoriamente possuir escolaId.
     */


    activity.textContent =
        "Nenhuma atividade ainda.";

}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);


                sessionStorage.clear();


                window.location.href =
                    "../pages/login.html";

            }
            catch (erro) {

                console.error(
                    "ERRO AO SAIR:",
                    erro
                );

                alert(
                    "Não foi possível terminar a sessão."
                );

            }

        }
    );

}


// =====================================================
// AUTENTICAÇÃO
// =====================================================

onAuthStateChanged(
    auth,
    usuario => {

        if (!usuario) {

            console.warn(
                "Usuário não autenticado."
            );


            zerarCartoes();


            /*
             * Ajuste este caminho se a sua página
             * de login tiver outro nome.
             */

            window.location.href =
                "../pages/login.html";


            return;

        }


        console.log(
            "USUÁRIO AUTENTICADO:",
            usuario.email
        );


        iniciarDashboard();

    }
);
