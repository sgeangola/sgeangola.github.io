// =====================================================
// SGE ANGOLA
// SUPER ADMIN — GESTÃO DA PLATAFORMA
// =====================================================

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";


// =====================================================
// CONFIGURAÇÃO
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

const listaEscolas =
    document.getElementById("listaEscolas");

const totalPendentes =
    document.getElementById("totalPendentes");

const totalAtivas =
    document.getElementById("totalAtivas");

const totalRejeitadas =
    document.getElementById("totalRejeitadas");

const totalEscolas =
    document.getElementById("totalEscolas");

const mensagem =
    document.getElementById("mensagem");

const nomeAdmin =
    document.getElementById("nomeAdmin");


// =====================================================
// MENSAGEM
// =====================================================

function mostrarMensagem(
    texto,
    tipo = "sucesso"
) {

    if (!mensagem) return;

    mensagem.textContent = texto;

    mensagem.style.display = "block";

    if (tipo === "erro") {

        mensagem.style.background =
            "#fde8e8";

        mensagem.style.color =
            "#a52626";

    } else {

        mensagem.style.background =
            "#e5f7eb";

        mensagem.style.color =
            "#18743a";

    }

    setTimeout(() => {

        mensagem.style.display = "none";

    }, 4000);

}


// =====================================================
// ESTADOS DA PÁGINA
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
// ESCAPAR HTML
// =====================================================

function escaparHTML(texto) {

    return String(texto || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// ESTADO VISUAL
// =====================================================

function textoEstado(estado) {

    if (estado === "ativo") {

        return "Ativo";

    }

    if (estado === "rejeitado") {

        return "Rejeitado";

    }

    return "Pendente";

}


function classeEstado(estado) {

    if (estado === "ativo") {

        return "estado-ativo";

    }

    if (estado === "rejeitado") {

        return "estado-rejeitado";

    }

    return "estado-pendente";

}


// =====================================================
// CARREGAR ESCOLAS
// =====================================================

async function carregarEscolas() {

    try {

        if (!listaEscolas) return;

        listaEscolas.innerHTML = `

            <tr>

                <td colspan="6">
                    A carregar escolas...
                </td>

            </tr>

        `;


        const resultado =
            await getDocs(
                collection(
                    db,
                    "escolas"
                )
            );


        let pendentes = 0;
        let ativas = 0;
        let rejeitadas = 0;


        listaEscolas.innerHTML = "";


        if (resultado.empty) {

            listaEscolas.innerHTML = `

                <tr>

                    <td colspan="6">

                        Ainda não existem
                        escolas registadas.

                    </td>

                </tr>

            `;

        }


        resultado.forEach(
            documento => {

                const escola =
                    documento.data();


                const id =
                    documento.id;


                const estado =
                    escola.estado ||
                    "pendente";


                // =====================================
                // ESTATÍSTICAS
                // =====================================

                if (estado === "pendente") {

                    pendentes++;

                }

                else if (estado === "ativo") {

                    ativas++;

                }

                else if (estado === "rejeitado") {

                    rejeitadas++;

                }


                // =====================================
                // DADOS
                // =====================================

                const nome =
                    escaparHTML(
                        escola.nome ||
                        "Sem nome"
                    );


                const gestor =
                    escaparHTML(
                        escola.nomeGestor ||
                        "—"
                    );


                const email =
                    escaparHTML(
                        escola.emailGestor ||
                        escola.email ||
                        "—"
                    );


                const telefone =
                    escaparHTML(
                        escola.telefone ||
                        "—"
                    );


                const estadoTexto =
                    textoEstado(
                        estado
                    );


                const estadoClasse =
                    classeEstado(
                        estado
                    );


                // =====================================
                // LINHA
                // =====================================

                const linha =
                    document.createElement(
                        "tr"
                    );


                linha.innerHTML = `

                    <td>
                        <strong>
                            ${nome}
                        </strong>
                    </td>

                    <td>
                        ${gestor}
                    </td>

                    <td>
                        ${email}
                    </td>

                    <td>
                        ${telefone}
                    </td>

                    <td>

                        <span
                            class="estado ${estadoClasse}"
                        >

                            ${estadoTexto}

                        </span>

                    </td>

                    <td>

                        <div class="acoes">

                            <button
                                class="btn-ver"
                                onclick="verEscola('${id}')"
                            >
                                Ver
                            </button>


                            ${
                                estado === "pendente"
                                ? `

                                <button
                                    class="btn-aprovar"
                                    onclick="aprovarEscola('${id}')"
                                >
                                    Aprovar
                                </button>


                                <button
                                    class="btn-rejeitar"
                                    onclick="rejeitarEscola('${id}')"
                                >
                                    Rejeitar
                                </button>

                                `
                                : ""
                            }


                            <button
                                class="btn-eliminar"
                                onclick="eliminarEscola('${id}')"
                            >
                                Eliminar
                            </button>

                        </div>

                    </td>

                `;


                listaEscolas.appendChild(
                    linha
                );

            }
        );


        // =============================================
        // ATUALIZAR NÚMEROS
        // =============================================

        if (totalPendentes) {

            totalPendentes.textContent =
                pendentes;

        }


        if (totalAtivas) {

            totalAtivas.textContent =
                ativas;

        }


        if (totalRejeitadas) {

            totalRejeitadas.textContent =
                rejeitadas;

        }


        if (totalEscolas) {

            totalEscolas.textContent =
                resultado.size;

        }


    }

    catch (erro) {

        console.error(
            "Erro ao carregar escolas:",
            erro
        );


        if (listaEscolas) {

            listaEscolas.innerHTML = `

                <tr>

                    <td colspan="6">

                        Erro ao carregar escolas.

                        <br><br>

                        ${escaparHTML(
                            erro.message
                        )}

                    </td>

                </tr>

            `;

        }


        mostrarMensagem(
            "Não foi possível carregar as escolas.",
            "erro"
        );

    }

}


// =====================================================
// VER ESCOLA
// =====================================================

window.verEscola =
async function(id) {

    try {

        const referencia =
            doc(
                db,
                "escolas",
                id
            );


        const resultado =
            await getDoc(
                referencia
            );


        if (!resultado.exists()) {

            mostrarMensagem(
                "Escola não encontrada.",
                "erro"
            );

            return;

        }


        const escola =
            resultado.data();


        const ensinos =
            Array.isArray(
                escola.ensinos
            )
                ? escola.ensinos.join(", ")
                : "—";


        alert(

`========================================
             DADOS DA ESCOLA
========================================

Nome:
${escola.nome || "—"}

Província:
${escola.provincia || "—"}

Município:
${escola.municipio || "—"}

Telefone:
${escola.telefone || "—"}

E-mail:
${escola.email || "—"}

Tipo:
${escola.tipoEscola || "—"}

Ano letivo:
${escola.anoLetivoAtual || "—"}

Ensinos:
${ensinos}

GESTOR
----------------------------------------

Nome:
${escola.nomeGestor || "—"}

E-mail:
${escola.emailGestor || "—"}

Estado:
${escola.estado || "—"}

Ativo:
${escola.ativo === true ? "Sim" : "Não"}

ID:
${id}

========================================`

        );

    }

    catch (erro) {

        console.error(
            "Erro ao ver escola:",
            erro
        );

        mostrarMensagem(
            erro.message,
            "erro"
        );

    }

};


// =====================================================
// APROVAR ESCOLA
// =====================================================

window.aprovarEscola =
async function(id) {

    try {

        const referencia =
            doc(
                db,
                "escolas",
                id
            );


        const resultado =
            await getDoc(
                referencia
            );


        if (!resultado.exists()) {

            mostrarMensagem(
                "Escola não encontrada.",
                "erro"
            );

            return;

        }


        const escola =
            resultado.data();


        const confirmar =
            confirm(

`Deseja aprovar a escola?

${escola.nome || "Sem nome"}

O gestor poderá utilizar a escola
após a aprovação.`

            );


        if (!confirmar) return;


        await updateDoc(

            referencia,

            {

                estado:
                    "ativo",

                ativo:
                    true,

                aprovadoEm:
                    serverTimestamp(),

                motivoRejeicao:
                    ""

            }

        );


        mostrarMensagem(
            "Escola aprovada com sucesso!"
        );


        await carregarEscolas();

    }

    catch (erro) {

        console.error(
            "Erro ao aprovar escola:",
            erro
        );

        mostrarMensagem(
            "Erro ao aprovar escola: " +
            erro.message,
            "erro"
        );

    }

};


// =====================================================
// REJEITAR ESCOLA
// =====================================================

window.rejeitarEscola =
async function(id) {

    try {

        const referencia =
            doc(
                db,
                "escolas",
                id
            );


        const resultado =
            await getDoc(
                referencia
            );


        if (!resultado.exists()) {

            mostrarMensagem(
                "Escola não encontrada.",
                "erro"
            );

            return;

        }


        const escola =
            resultado.data();


        const motivo =
            prompt(

`Motivo da rejeição:

Escola:
${escola.nome || "Sem nome"}

Digite o motivo da rejeição:`

            );


        if (motivo === null) {

            return;

        }


        if (!motivo.trim()) {

            alert(
                "Informe o motivo da rejeição."
            );

            return;

        }


        await updateDoc(

            referencia,

            {

                estado:
                    "rejeitado",

                ativo:
                    false,

                motivoRejeicao:
                    motivo.trim(),

                rejeitadoEm:
                    serverTimestamp()

            }

        );


        mostrarMensagem(
            "Escola rejeitada."
        );


        await carregarEscolas();

    }

    catch (erro) {

        console.error(
            "Erro ao rejeitar escola:",
            erro
        );

        mostrarMensagem(
            "Erro ao rejeitar escola: " +
            erro.message,
            "erro"
        );

    }

};


// =====================================================
// ELIMINAR ESCOLA
// =====================================================

window.eliminarEscola =
async function(id) {

    try {

        const referencia =
            doc(
                db,
                "escolas",
                id
            );


        const resultado =
            await getDoc(
                referencia
            );


        if (!resultado.exists()) {

            mostrarMensagem(
                "Escola não encontrada.",
                "erro"
            );

            return;

        }


        const escola =
            resultado.data();


        const nome =
            escola.nome ||
            "Sem nome";


        const confirmar =
            confirm(

`ATENÇÃO!

Você está prestes a eliminar:

${nome}

Esta ação elimina o cadastro da escola
na coleção "escolas".

Deseja continuar?`

            );


        if (!confirmar) {

            return;

        }


        const confirmacao =
            prompt(

`CONFIRMAÇÃO FINAL

Digite exatamente:

ELIMINAR

Escola:
${nome}`

            );


        if (
            confirmacao !==
            "ELIMINAR"
        ) {

            alert(
                "Eliminação cancelada."
            );

            return;

        }


        await deleteDoc(
            referencia
        );


        mostrarMensagem(
            "Escola eliminada com sucesso!"
        );


        await carregarEscolas();

    }

    catch (erro) {

        console.error(
            "Erro ao eliminar escola:",
            erro
        );

        mostrarMensagem(
            "Não foi possível eliminar a escola: " +
            erro.message,
            "erro"
        );

    }

};


// =====================================================
// TERMINAR SESSÃO
// =====================================================

async function terminarSessao() {

    try {

        await signOut(auth);

        window.location.href =
            "./login.html";

    }

    catch (erro) {

        console.error(
            "Erro ao terminar sessão:",
            erro
        );

        mostrarMensagem(
            "Não foi possível terminar a sessão.",
            "erro"
        );

    }

}


// =====================================================
// DISPONIBILIZAR BOTÃO DE LOGOUT
// =====================================================

window.terminarSessao =
    terminarSessao;


// =====================================================
// VERIFICAR SUPER ADMIN
// =====================================================

async function verificarSuperAdmin(
    usuario
) {

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


    // =============================================
    // VERIFICAR UID
    // =============================================

    if (
        usuario.uid !==
        SUPER_ADMIN_UID
    ) {

        console.warn(
            "UID não pertence ao Super Admin."
        );

        mostrarAcessoNegado();

        return;

    }


    // =============================================
    // BUSCAR SUPER ADMIN
    // =============================================

    try {

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
                "Documento superAdmins não encontrado."
            );

            mostrarAcessoNegado();

            return;

        }


        const dados =
            resultado.data();


        if (
            dados.ativo !== true
        ) {

            console.error(
                "Super Admin está desativado."
            );

            mostrarAcessoNegado();

            return;

        }


        // =========================================
        // NOME
        // =========================================

if (nomeAdmin) {

            nomeAdmin.textContent =
                dados.nome ||
                usuario.email ||
                "Super Admin";

        }


        console.log(
            "SUPER ADMIN AUTORIZADO!"
        );


        mostrarPainel();


        await carregarEscolas();

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


        // =============================================
        // NÃO ESTÁ LOGADO
        // =============================================

        if (!usuario) {

            console.log(
                "Nenhum utilizador autenticado."
            );


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
