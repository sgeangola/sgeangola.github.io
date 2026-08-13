// =====================================================
// DASHBOARD GESTOR - SIGEA
// =====================================================

alert("DASHBOARD-GESTOR.JS CARREGADO ✅");


// =====================================================
// FIREBASE
// =====================================================

import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
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
// VARIÁVEIS DA ESCOLA ATUAL
// =====================================================

let escolaAtual = null;

let escolaIdAtual = null;

let turmasDaEscola = [];


// =====================================================
// CARREGAR DASHBOARD
// =====================================================

async function iniciarDashboard(usuario) {

    console.log(
        "Iniciando Dashboard do Gestor..."
    );

    console.log(
        "UID do gestor:",
        usuario.uid
    );

    console.log(
        "E-mail:",
        usuario.email
    );


    // ================================================
    // 1. ENCONTRAR A ESCOLA DO GESTOR
    // ================================================

    const encontrou =
        await carregarInformacoesUsuario(usuario);


    if (!encontrou) {

        console.error(
            "Não foi possível encontrar a escola deste gestor."
        );

        return;

    }


    // ================================================
    // 2. CARREGAR TURMAS DA ESCOLA
    // ================================================

    await carregarTurmasDaEscola();


    // ================================================
    // 3. CARREGAR ESTATÍSTICAS
    // ================================================

    await carregarEstatisticas();


    // ================================================
    // 4. ATIVIDADES
    // ================================================

    await carregarAtividadesRecentes();

}


// =====================================================
// INFORMAÇÕES DO UTILIZADOR / ESCOLA
// =====================================================

async function carregarInformacoesUsuario(usuario) {

    try {

        console.log(
            "Procurando escola pelo gestorUid..."
        );


        const consulta =
            query(
                collection(db, "escolas"),
                where(
                    "gestorUid",
                    "==",
                    usuario.uid
                ),
                limit(1)
            );


        const resultado =
            await getDocs(consulta);


        if (resultado.empty) {

            console.warn(
                "Nenhuma escola encontrada para este gestor."
            );


            if (schoolName) {

                schoolName.textContent =
                    "🏫 Escola";

            }


            if (userInfo) {

                userInfo.textContent =
                    `Administrador: ${usuario.email}`;

            }


            return false;

        }


        // ============================================
        // ESCOLA ENCONTRADA
        // ============================================

        const escolaDoc =
            resultado.docs[0];


        escolaAtual =
            escolaDoc.data();


        escolaIdAtual =
            escolaDoc.id;


        console.log(
            "===================================="
        );

        console.log(
            "ESCOLA ENCONTRADA"
        );

        console.log(
            "ID:",
            escolaIdAtual
        );

        console.log(
            "NOME:",
            escolaAtual.nome
        );

        console.log(
            "LOGO:",
            escolaAtual.logoUrl
        );

        console.log(
            "===================================="
        );


        // ============================================
        // NOME + LOGOTIPO
        // ============================================

        if (schoolName) {

            const nome =
                escolaAtual.nome ||
                "Escola";


            const logo =
                escolaAtual.logoUrl ||
                "";


            if (logo) {

                schoolName.innerHTML = `

                    <span style="
                        display:flex;
                        align-items:center;
                        gap:10px;
                    ">

                        <img
                            src="${logo}"
                            alt="Logotipo da escola"
                            style="
                                width:42px;
                                height:42px;
                                object-fit:contain;
                                border-radius:8px;
                                background:white;
                                flex-shrink:0;
                            "
                        >

                        <span style="
                            line-height:1.2;
                        ">
                            ${nome}
                        </span>

                    </span>

                `;

            }
            else {

                schoolName.innerHTML = `

                    <span style="
                        display:flex;
                        align-items:center;
                        gap:10px;
                    ">

                        <span style="
                            font-size:32px;
                        ">
                            🏫
                        </span>

                        <span>
                            ${nome}
                        </span>

                    </span>

                `;

            }

        }


        // ============================================
        // GESTOR
        // ============================================

        if (userInfo) {

            userInfo.textContent =
                `Administrador: ${
                    escolaAtual.nomeGestor ||
                    usuario.email ||
                    "Gestor"
                }`;

        }


        // ============================================
        // GUARDAR ESCOLA
        // ============================================

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
            "nomeGestor",
            escolaAtual.nomeGestor || ""
        );

        sessionStorage.setItem(
            "emailGestor",
            usuario.email || ""
        );


        return true;


    }
    catch (erro) {

        console.error(
            "Erro ao carregar escola:",
            erro
        );


        if (schoolName) {

            schoolName.textContent =
                "🏫 Escola";

        }


        if (userInfo) {

            userInfo.textContent =
                "Administrador";

        }


        return false;

    }

}


// =====================================================
// CARREGAR TURMAS DA ESCOLA
// =====================================================

async function carregarTurmasDaEscola() {

    try {

        if (!escolaIdAtual) {

            console.warn(
                "escolaIdAtual não encontrado."
            );

            turmasDaEscola = [];

            return;

        }


        console.log(
            "Carregando turmas da escola:",
            escolaIdAtual
        );


        const consulta =
            query(
                collection(db, "turmas"),
                where(
                    "escolaId",
                    "==",
                    escolaIdAtual
                )
            );


        const resultado =
            await getDocs(consulta);


        turmasDaEscola =
            resultado.docs;


        console.log(
            "Turmas encontradas:",
            turmasDaEscola.length
        );


        turmasDaEscola.forEach(
            documento => {

                console.log(
                    "Turma:",
                    documento.id,
                    documento.data().nome
                );

            }
        );


    }
    catch (erro) {

        console.error(
            "Erro ao carregar turmas da escola:",
            erro
        );

        turmasDaEscola = [];

    }

}


// =====================================================
// ESTATÍSTICAS
// =====================================================

async function carregarEstatisticas() {

    // =================================================
    // TURMAS
    // =================================================

    try {

        if (totalClasses) {

            totalClasses.textContent =
                turmasDaEscola.length;

        }

    }
    catch (erro) {

        console.error(
            "Erro ao contar turmas:",
            erro
        );

    }


    // =================================================
    // ALUNOS
    // =================================================

    try {

        let totalAlunos = 0;


        for (
            const turmaDoc
            of turmasDaEscola
        ) {

            const alunosRef =
                collection(
                    db,
                    "turmas",
                    turmaDoc.id,
                    "alunos"
                );


            const alunosSnapshot =
                await getDocs(alunosRef);


            totalAlunos +=
                alunosSnapshot.size;

        }


        // ---------------------------------------------
        // COMPATIBILIDADE
        // ---------------------------------------------
        // Alguns alunos do teu sistema podem estar na
        // coleção global "alunos".
        //
        // Primeiro tentamos as subcoleções das turmas,
        // que é a estrutura principal.
        // ---------------------------------------------

        if (totalStudents) {

            totalStudents.textContent =
                totalAlunos;

        }


        console.log(
            "Total de alunos:",
            totalAlunos
        );


    }
    catch (erro) {

        console.error(
            "Erro ao contar alunos:",
            erro
        );


        if (totalStudents) {

            totalStudents.textContent =
                "0";

        }

    }


    // =================================================
    // PROFESSORES
    // =================================================

    try {

        const professoresSnapshot =
            await getDocs(
                collection(
                    db,
                    "professores"
                )
            );


        let professoresDaEscola =
            new Set();


        // ---------------------------------------------
        // IDs DAS TURMAS DA ESCOLA
        // ---------------------------------------------

        const idsTurmas =
            new Set(
                turmasDaEscola.map(
                    turma => turma.id
                )
            );


        // ---------------------------------------------
        // VERIFICAR ATRIBUIÇÕES
        // ---------------------------------------------

        professoresSnapshot.forEach(
            professorDoc => {

                const professor =
                    professorDoc.data();


                const atribuicoes =
                    Array.isArray(
                        professor.atribuicoes
                    )
                    ? professor.atribuicoes
                    : [];


                const pertence =
                    atribuicoes.some(
                        atribuicao => {

                            return idsTurmas.has(
                                atribuicao.turmaId
                            );

                        }
                    );


                if (pertence) {

                    professoresDaEscola.add(
                        professorDoc.id
                    );

                }

            }
        );


        if (totalTeachers) {

            totalTeachers.textContent =
                professoresDaEscola.size;

        }


        console.log(
            "Professores da escola:",
            professoresDaEscola.size
        );


    }
    catch (erro) {

        console.error(
            "Erro ao contar professores:",
            erro
        );


        if (totalTeachers) {

            totalTeachers.textContent =
                "0";

        }

    }


    // =================================================
    // DISCIPLINAS
    // =================================================

    try {

        const disciplinas =
            new Set();


        // ---------------------------------------------
        // PEGAR DISCIPLINAS SOMENTE DAS TURMAS DA ESCOLA
        // ---------------------------------------------

        turmasDaEscola.forEach(
            turmaDoc => {

                const turma =
                    turmaDoc.data();


                if (
                    Array.isArray(
                        turma.disciplinas
                    )
                ) {

                    turma.disciplinas.forEach(
                        disciplina => {

                            if (disciplina) {

                                disciplinas.add(
                                    disciplina
                                );

                            }

                        }
                    );

                }

            }
        );


        if (totalSubjects) {

            totalSubjects.textContent =
                disciplinas.size;

        }


        console.log(
            "Disciplinas da escola:",
            disciplinas.size
        );


    }
    catch (erro) {

        console.error(
            "Erro ao contar disciplinas:",
            erro
        );


        if (totalSubjects) {

            totalSubjects.textContent =
                "0";

        }

    }

}


// =====================================================
// ATIVIDADES RECENTES
// =====================================================

async function carregarAtividadesRecentes() {

    if (!activity) {

        console.warn(
            "Elemento #activity não encontrado."
        );

        return;

    }


    try {

        const referencia =
            collection(
                db,
                "atividades"
            );


        const consulta =
            query(
                referencia,
                orderBy(
                    "data",
                    "desc"
                ),
                limit(10)
            );


        const resultado =
            await getDocs(consulta);


        if (resultado.empty) {

            activity.innerHTML = `

                <div style="
                    padding:15px;
                    text-align:center;
                    color:#64748b;
                ">

                    📭 Nenhuma atividade
                    registada ainda.

                </div>

            `;

            return;

        }


        activity.innerHTML = "";


        resultado.forEach(
            documento => {

                const dados =
                    documento.data();


                // -------------------------------------
                // SE A ATIVIDADE POSSUI ESCOLA ID,
                // MOSTRAR SOMENTE A ESCOLA ATUAL
                // -------------------------------------

                if (
                    dados.escolaId &&
                    dados.escolaId !==
                    escolaIdAtual
                ) {

                    return;

                }


                const item =
                    document.createElement(
                        "div"
                    );


                item.style.padding =
                    "12px 0";


                item.style.borderBottom =
                    "1px solid #e2e8f0";


                const icone =
                    obterIconeAtividade(
                        dados.tipo
                    );


                const descricao =
                    dados.descricao ||
                    "Atividade realizada";


                const utilizador =
                    dados.utilizador ||
                    "Sistema";


                const data =
                    formatarDataAtividade(
                        dados.data
                    );


                item.innerHTML = `

                    <div style="
                        display:flex;
                        gap:12px;
                        align-items:flex-start;
                    ">

                        <div style="
                            font-size:22px;
                        ">

                            ${icone}

                        </div>


                        <div style="
                            flex:1;
                        ">

                            <div style="
                                font-weight:bold;
                                color:#1e293b;
                            ">

                                ${descricao}

                            </div>


                            <div style="
                                font-size:13px;
                                color:#64748b;
                                margin-top:4px;
                            ">

                                👤 ${utilizador}

                                ${
                                    data
                                    ? " • " + data
                                    : ""
                                }

                            </div>

                        </div>

                    </div>

                `;


                activity.appendChild(
                    item
                );

            }
        );


        // ---------------------------------------------
        // CASO TODAS TENHAM SIDO FILTRADAS
        // ---------------------------------------------

        if (
            activity.children.length === 0
        ) {

            activity.innerHTML = `

                <div style="
                    padding:15px;
                    text-align:center;
                    color:#64748b;
                ">

                    📭 Nenhuma atividade
                    registada ainda.

                </div>

            `;

        }


    }
    catch (erro) {

        console.error(
            "Erro ao carregar atividades:",
            erro
        );


        activity.innerHTML = `

            <div style="
                padding:15px;
                color:#b91c1c;
            ">

                ⚠️ Não foi possível
                carregar as atividades.

            </div>

        `;

    }

}


// =====================================================
// ÍCONE DA ATIVIDADE
// =====================================================

function obterIconeAtividade(tipo) {

    switch (tipo) {

        case "aluno":
            return "👨‍🎓";

        case "professor":
            return "👨‍🏫";

        case "turma":
            return "🏫";

        case "disciplina":
            return "📚";

        case "nota":
            return "📝";

        case "financeiro":
            return "💰";

        case "pauta":
            return "📑";

        case "configuracao":
            return "⚙️";

        case "sistema":
            return "🔧";

        default:
            return "📌";

    }

}


// =====================================================
// FORMATAR DATA
// =====================================================

function formatarDataAtividade(timestamp) {

    if (!timestamp) {

        return "";

    }


    try {

        if (
            typeof timestamp.toDate ===
            "function"
        ) {

            const data =
                timestamp.toDate();


            return data.toLocaleString(
                "pt-PT",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        }


        return "";

    }
    catch (erro) {

        console.error(
            "Erro ao formatar data:",
            erro
        );

        return "";

    }

}


// =====================================================
// SAIR
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            const confirmar =
                confirm(
                    "Deseja realmente sair?"
                );


            if (!confirmar) {

                return;

            }


            try {

                await signOut(auth);

            }
            catch (erro) {

                console.error(
                    "Erro ao sair:",
                    erro
                );

            }


            localStorage.removeItem(
                "gestorLogado"
            );

            localStorage.removeItem(
                "professorLogado"
            );

            sessionStorage.removeItem(
                "escolaId"
            );

            sessionStorage.removeItem(
                "nomeEscola"
            );

            sessionStorage.removeItem(
                "logoEscola"
            );


            window.location.href =
                "login-gestor.html";

        }
    );

}


// =====================================================
// AUTENTICAÇÃO
// =====================================================

onAuthStateChanged(
    auth,
    async usuario => {

        console.log(
            "===================================="
        );

        console.log(
            "ESTADO DO LOGIN:",
            usuario
        );


        if (!usuario) {

            console.log(
                "Nenhum gestor autenticado."
            );


            window.location.href =
                "login-gestor.html";


            return;

        }


        console.log(
            "GESTOR AUTENTICADO:",
            usuario.email
        );


        console.log(
            "UID:",
            usuario.uid
        );


        await iniciarDashboard(
            usuario
        );

    }
);


// =====================================================
// FIM
// =====================================================

alert(
    "DASHBOARD-GESTOR.JS CARREGADO df COMPLETAMENTE ✅"
);
