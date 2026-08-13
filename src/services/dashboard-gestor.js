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

let usuarioAtual = null;


// =====================================================
// CARREGAR DASHBOARD
// =====================================================

async function iniciarDashboard() {

    console.log(
        "Iniciando Dashboard do Gestor..."
    );


    // -----------------------------------------------
    // PRIMEIRO: ENCONTRAR A ESCOLA
    // -----------------------------------------------

    const encontrouEscola =
        await carregarInformacoesUsuario();


    if (!encontrouEscola) {

        console.error(
            "Não foi possível identificar a escola do gestor."
        );

        return;

    }


    // -----------------------------------------------
    // DEPOIS: ESTATÍSTICAS DA ESCOLA
    // -----------------------------------------------

    await carregarEstatisticas();


    // -----------------------------------------------
    // ATIVIDADES DA ESCOLA
    // -----------------------------------------------

    await carregarAtividadesRecentes();

}


// =====================================================
// INFORMAÇÕES DO GESTOR + ESCOLA
// =====================================================

async function carregarInformacoesUsuario() {

    try {

        const usuario =
            auth.currentUser;


        if (!usuario) {

            console.warn(
                "Nenhum gestor autenticado."
            );

            return false;

        }


        usuarioAtual =
            usuario;


        console.log(
            "GESTOR AUTENTICADO:",
            usuario.email
        );


        console.log(
            "UID DO GESTOR:",
            usuario.uid
        );


        // =================================================
        // PROCURAR A ESCOLA PELO gestorUid
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


        // =================================================
        // ESCOLA NÃO ENCONTRADA
        // =================================================

        if (resultado.empty) {

            console.error(
                "Nenhuma escola pertence ao gestor:",
                usuario.uid
            );


            if (schoolName) {

                schoolName.textContent =
                    "🏫 Escola não encontrada";

            }


            if (userInfo) {

                userInfo.textContent =
                    `Administrador: ${usuario.email}`;

            }


            return false;

        }


        // =================================================
        // DOCUMENTO DA ESCOLA
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
            "ESCOLA ATUAL"
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
            "TIPO:",
            escolaAtual.tipoEscola
        );

        console.log(
            "ENSINOS:",
            escolaAtual.ensinos
        );

        console.log(
            "GESTOR UID:",
            escolaAtual.gestorUid
        );

        console.log(
            "===================================="
        );


        // =================================================
        // NOME + LOGOTIPO
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
                            src="${logo}"
                            alt="Logotipo da escola"
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

            }

            else {

                schoolName.innerHTML = `

                    <span
                        style="
                            display:flex;
                            align-items:center;
                            gap:10px;
                        "
                    >

                        <span
                            style="
                                font-size:32px;
                            "
                        >
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
        // INFORMAÇÃO DO GESTOR
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
        // GUARDAR DADOS DA ESCOLA
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
            "nomeGestor",
            escolaAtual.nomeGestor || ""
        );


        sessionStorage.setItem(
            "emailGestor",
            usuario.email || ""
        );


        // =================================================
        // CONFIGURAR MENU
        // =================================================

        configurarMenu();


        return true;

    }
    catch (erro) {

        console.error(
            "ERRO AO CARREGAR ESCOLA:",
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
// CONFIGURAR MENU DA ESCOLA
// =====================================================

function configurarMenu() {

    if (!escolaAtual) {

        return;

    }


    const tipoEscola =
        escolaAtual.tipoEscola ||
        "";


    const ensinos =
        Array.isArray(
            escolaAtual.ensinos
        )
        ? escolaAtual.ensinos
        : [];


    console.log(
        "CONFIGURAÇÃO DO MENU:"
    );


    console.log(
        "Tipo:",
        tipoEscola
    );


    console.log(
        "Ensinos:",
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
                texto.includes(
                    "financeiro"
                )
            ) {

                if (
                    tipoEscola ===
                    "publica"
                ) {

                    link.style.display =
                        "none";

                }

                else {

                    link.style.display =
                        "flex";

                }

            }

        }
    );


    // =================================================
    // GUARDAR CONFIGURAÇÃO
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

    if (!escolaIdAtual) {

        console.warn(
            "escolaIdAtual não definido."
        );

        return;

    }


    console.log(
        "Carregando estatísticas da escola:",
        escolaIdAtual
    );


    // =================================================
    // ALUNOS
    // =================================================

    try {

        let total =
            0;


        // ---------------------------------------------
        // PRIMEIRO TENTAR ALUNOS COM escolaId
        // ---------------------------------------------

        const consultaAlunos =
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


        const alunosSnapshot =
            await getDocs(
                consultaAlunos
            );


        total =
            alunosSnapshot.size;


        // ---------------------------------------------
        // SE EXISTIR ESTRUTURA ANTIGA
        // turmas/{turma}/alunos
        // ---------------------------------------------

        if (
            total === 0
        ) {

            const turmasSnapshot =
                await getDocs(
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
                    )
                );


            for (
                const turmaDoc
                of turmasSnapshot.docs
            ) {

                try {

                    const alunosSub =
                        await getDocs(
                            collection(
                                db,
                                "turmas",
                                turmaDoc.id,
                                "alunos"
                            )
                        );


                    total +=
                        alunosSub.size;

                }
                catch(erro) {

                    console.warn(
                        "Não foi possível ler alunos da turma:",
                        turmaDoc.id
                    );

                }

            }

        }


        if (totalStudents) {

            totalStudents.textContent =
                total;

        }


        console.log(
            "TOTAL DE ALUNOS:",
            total
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


        if (totalTeachers) {

            totalTeachers.textContent =
                snapshot.size;

        }


        console.log(
            "TOTAL DE PROFESSORES:",
            snapshot.size
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


        if (totalClasses) {

            totalClasses.textContent =
                snapshot.size;

        }


        console.log(
            "TOTAL DE TURMAS:",
            snapshot.size
        );

    }
    catch (erro) {

        console.error(
            "Erro ao contar turmas:",
            erro
        );


        if (totalClasses) {

            totalClasses.textContent =
                "0";

        }

    }


    // =================================================
    // DISCIPLINAS
    // =================================================

    try {

        let totalDisciplinas =
            0;


        // ---------------------------------------------
        // PRIMEIRO: CONFIGURAÇÃO DA ESCOLA
        // ---------------------------------------------

        const consultaConfig =
            query(
                collection(
                    db,
                    "config"
                ),
                where(
                    "escolaId",
                    "==",
                    escolaIdAtual
                )
            );


        const configSnapshot =
            await getDocs(
                consultaConfig
            );


        configSnapshot.forEach(
            documento => {

                const dados =
                    documento.data();


                if (
                    dados.disciplinas
                ) {

                    const disciplinas =
                        dados.disciplinas;


                    Object.values(
                        disciplinas
                    ).forEach(
                        lista => {

                            if (
                                Array.isArray(
                                    lista
                                )
                            ) {

                                totalDisciplinas +=
                                    lista.length;

                            }

                        }
                    );

                }

            }
        );


        // ---------------------------------------------
        // SE NÃO HOUVER CONFIG POR ESCOLA,
        // OBTER DISCIPLINAS DAS TURMAS DA ESCOLA
        // ---------------------------------------------

        if (
            totalDisciplinas === 0
        ) {

            const turmasSnapshot =
                await getDocs(
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
                    )
                );


            const conjunto =
                new Set();


            turmasSnapshot.forEach(
                documento => {

                    const dados =
                        documento.data();


                    if (
                        Array.isArray(
                            dados.disciplinas
                        )
                    ) {

                        dados.disciplinas
                            .forEach(
                                disciplina => {

                                    conjunto.add(
                                        disciplina
                                    );

                                }
                            );

                    }

                }
            );


            totalDisciplinas =
                conjunto.size;

        }


        if (totalSubjects) {

            totalSubjects.textContent =
                totalDisciplinas;

        }


        console.log(
            "TOTAL DE DISCIPLINAS:",
            totalDisciplinas
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


    if (!escolaIdAtual) {

        activity.innerHTML = `
            <div style="
                padding:15px;
                text-align:center;
                color:#64748b;
            ">
                📭 Nenhuma atividade registada.
            </div>
        `;

        return;

    }


    try {

        // =================================================
        // SOMENTE ATIVIDADES DESTA ESCOLA
        // =================================================

        const referencia =
            collection(
                db,
                "atividades"
            );


        const consulta =
            query(
                referencia,

                where(
                    "escolaId",
                    "==",
                    escolaIdAtual
                ),

                orderBy(
                    "data",
                    "desc"
                ),

                limit(10)
            );


        const resultado =
            await getDocs(
                consulta
            );


        // =================================================
        // NENHUMA ATIVIDADE
        // =================================================

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


        // =================================================
        // LIMPAR
        // =================================================

        activity.innerHTML =
            "";


        // =================================================
        // MOSTRAR
        // =================================================

        resultado.forEach(
            documento => {

                const dados =
                    documento.data();


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

                                ${escaparHTML(
                                    descricao
                                )}

                            </div>


                            <div style="
                                font-size:13px;
                                color:#64748b;
                                margin-top:4px;
                            ">

                                👤 ${escaparHTML(
                                    utilizador
                                )}

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

    }
    catch (erro) {

        console.error(
            "Erro ao carregar atividades:",
            erro
        );

      // -------------------------------------------------
        // SE FALHAR POR ÍNDICE DO FIRESTORE
        // NÃO PARAR O DASHBOARD
        // -------------------------------------------------

        activity.innerHTML = `

            <div style="
                padding:15px;
                color:#64748b;
            ">

                📭 Nenhuma atividade registada.

            </div>

        `;

    }

}


// =====================================================
// ÍCONE DA ATIVIDADE
// =====================================================

function obterIconeAtividade(
    tipo
) {

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

function formatarDataAtividade(
    timestamp
) {

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
// ESCAPAR HTML
// =====================================================

function escaparHTML(
    valor
) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

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
                    "Erro ao terminar sessão:",
                    erro
                );

            }


            sessionStorage.clear();


            localStorage.removeItem(
                "gestorLogado"
            );


            localStorage.removeItem(
                "professorLogado"
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
            "ESTADO DO LOGIN:"
        );

        console.log(
            usuario
        );

        console.log(
            "===================================="
        );


        if (!usuario) {

            console.warn(
                "Nenhum gestor autenticado."
            );


            window.location.href =
                "login-gestor.html";


            return;

        }


        console.log(
            "GESTOR AUTENTICADO:"
        );

        console.log(
            usuario.email
        );


        console.log(
            "UID:"
        );

        console.log(
            usuario.uid
        );


        await iniciarDashboard();

    }
);
