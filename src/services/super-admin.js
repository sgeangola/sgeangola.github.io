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
// CONFIGURAÇÃO DO SUPER ADMIN
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

const painelAdmin =
    document.getElementById("painelAdmin");

const nomeAdmin =
    document.getElementById("nomeAdmin");

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

    if (painelAdmin) {

        painelAdmin.style.display =
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

    if (painelAdmin) {

        painelAdmin.style.display =
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

    if (painelAdmin) {

        painelAdmin.style.display =
            "none";

    }

    if (acessoNegado) {

        acessoNegado.style.display =
            "flex";

    }

}


// =====================================================
// MENSAGEM
// =====================================================

function mostrarMensagem(
    texto,
    tipo = "sucesso"
) {

    if (!mensagem) return;


    mensagem.textContent =
        texto;


    mensagem.style.display =
        "block";


    if (tipo === "erro") {

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


    setTimeout(() => {

        mensagem.style.display =
            "none";

    }, 4000);

}


// =====================================================
// ESCAPAR HTML
// =====================================================

function escaparHTML(texto) {

    return String(texto || "")

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
        usuario?.email
    );

    console.log(
        "UID:",
        usuario?.uid
    );


    // -------------------------------------------------
    // VERIFICAR LOGIN
    // -------------------------------------------------

    if (!usuario) {

        console.warn(
            "Nenhum utilizador autenticado."
        );

        window.location.href =
            "./login.html";

        return false;

    }


    // -------------------------------------------------
    // VERIFICAR UID
    // -------------------------------------------------

    if (
        usuario.uid !==
        SUPER_ADMIN_UID
    ) {

        console.warn(
            "UID não pertence ao Super Admin."
        );

        mostrarAcessoNegado();

        return false;

    }


    // -------------------------------------------------
    // BUSCAR SUPER ADMIN NO FIRESTORE
    // -------------------------------------------------

    try {

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


        if (!resultado.exists()) {

            console.error(
                "Documento superAdmins não existe."
            );

            mostrarAcessoNegado();

            return false;

        }


        const dados =
            resultado.data();


        console.log(
            "Dados do Super Admin:",
            dados
        );


        // -------------------------------------------------
        // VERIFICAR ATIVO
        // -------------------------------------------------

        if (
            dados.ativo !== true
        ) {

            console.warn(
                "Super Admin está desativado."
            );

            mostrarAcessoNegado();

            return false;

        }


        // -------------------------------------------------
        // MOSTRAR NOME
        // -------------------------------------------------

        if (nomeAdmin) {

            nomeAdmin.textContent =
                dados.nome ||
                usuario.email ||
                "Super Admin";

        }


        console.log(
            "SUPER ADMIN AUTORIZADO."
        );


        mostrarPainel();


        // -------------------------------------------------
        // CARREGAR ESCOLAS
        // -------------------------------------------------

        await carregarEscolas();


        return true;

    }

    catch (erro) {

        console.error(
            "ERRO AO VERIFICAR SUPER ADMIN:",
            erro
        );


        if (
            erro.code ===
            "unavailable"
        ) {

            mostrarMensagem(
                "Não foi possível ligar ao Firebase. Verifique a Internet.",
                "erro"
            );

        }

        else {

            mostrarMensagem(
                "Erro ao verificar o Super Admin: " +
                erro.message,
                "erro"
            );

        }


        // Não confundir erro de ligação
        // com acesso negado.

        if (carregando) {

            carregando.style.display =
                "none";

        }

        if (painelAdmin) {

            painelAdmin.style.display =
                "none";

        }

        return false;

    }

}


// =====================================================
// CARREGAR ESCOLAS
// =====================================================

async function carregarEscolas() {

    try {

        if (listaEscolas) {

            listaEscolas.innerHTML = `

                <tr>

                    <td colspan="6">

                        A carregar escolas...

                    </td>

                </tr>

            `;

        }


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


        const escolas = [];


        resultado.forEach(
            documento => {

                const escola =
                    documento.data();


                escolas.push({

                    id:
                        documento.id,

                    ...escola

                });


                if (
                    escola.estado ===
                    "pendente"
                ) {

                    pendentes++;

                }

                else if (
                    escola.estado ===
                    "ativo"
                ) {

                    ativas++;

                }

                else if (
                    escola.estado ===
                    "rejeitado"
                ) {

                    rejeitadas++;

                }

            }
        );


        // -------------------------------------------------
        // ESTATÍSTICAS
        // -------------------------------------------------

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
                escolas.length;

        }


        // -------------------------------------------------
        // TABELA
        // -------------------------------------------------

        mostrarEscolas(
            escolas
        );

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

                    </td>

                </tr>

            `;

        }


        mostrarMensagem(
            "Erro ao carregar escolas: " +
            erro.message,
            "erro"
        );

    }

}


// =====================================================
// MOSTRAR ESCOLAS NA TABELA
// =====================================================

function mostrarEscolas(
    escolas
) {

    if (!listaEscolas) return;


    if (!escolas.length) {

        listaEscolas.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;"
                >

                    Nenhuma escola registada.

                </td>

            </tr>

        `;

        return;

    }


    listaEscolas.innerHTML = "";


    escolas.forEach(
        escola => {

            const tr =
                document.createElement(
                    "tr"
                );


            const nome =
                escaparHTML(
                    escola.nome ||
                    "Sem nome"
                );


            const gestor =
                escaparHTML(
                    escola.nomeGestor ||
                    escola.gestor ||
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
                    escola.telefoneGestor ||
                    "—"
                );


            const estado =
                escola.estado ||
                "pendente";


            let estadoTexto =
                "Pendente";


            let estadoClasse =
                "estado-pendente";


            if (
                estado ===
                "ativo"
            ) {

                estadoTexto =
                    "Ativo";

                estadoClasse =
                    "estado-ativo";

            }

            else if (
                estado ===
                "rejeitado"
            ) {

                estadoTexto =
                    "Rejeitado";

                estadoClasse =
                    "estado-rejeitado";

            }


            tr.innerHTML = `

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
                            onclick="verEscola('${escola.id}')"
                        >
                            👁️ Ver
                        </button>


                        ${
                            estado !== "ativo"
                            ? `
                                <button
                                    class="btn-aprovar"
                                    onclick="aprovarEscola('${escola.id}')"
                                >
                                    ✓ Aprovar
                                </button>
                            `
                            : ""
                        }


                        ${
                            estado !== "rejeitado"
                            ? `
                                <button
                                    class="btn-rejeitar"
                                    onclick="rejeitarEscola('${escola.id}')"
                                >
                                    ✕ Rejeitar
                                </button>
                            `
                            : ""
                        }


                        <button
                            class="btn-eliminar"
                            onclick="eliminarEscola('${escola.id}')"
                        >
                            🗑️ Eliminar
                        </button>

                    </div>

                </td>

            `;


            listaEscolas.appendChild(
                tr
            );

        }
    );

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

            alert(
                "Escola não encontrada."
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
                : (
                    escola.ensinos ||
                    ""
                );


        alert(

`================================
          ESCOLA
================================

Nome:
${escola.nome || ""}

Província:
${escola.provincia || ""}

Município:
${escola.municipio || ""}

Telefone:
${escola.telefone || ""}

E-mail:
${escola.email || ""}

Tipo:
${escola.tipoEscola || ""}

Ano letivo:
${escola.anoLetivoAtual || ""}

Ensinos:
${ensinos}

Gestor:
${escola.nomeGestor || ""}

E-mail do gestor:
${escola.emailGestor || ""}

Estado:
${escola.estado || ""}

Motivo da rejeição:
${escola.motivoRejeicao || ""}

ID:
${id}

================================`

        );

    }

    catch (erro) {

        console.error(
            "Erro ao ver escola:",
            erro
        );

        mostrarMensagem(
            "Erro ao consultar escola.",
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

`Deseja aprovar esta escola?

${escola.nome || "Sem nome"}

O gestor poderá utilizar a escola após a aprovação.`

            );


        if (!confirmar) {

            return;

        }


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
            "Erro ao aprovar:",
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


        if (
            motivo === null
        ) {

            return;

        }


        if (
            motivo.trim() === ""
        ) {

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
            "Erro ao rejeitar:",
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

Apenas o documento desta escola na coleção "escolas" será eliminado.

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

para confirmar a eliminação.

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
            "Erro ao eliminar:",
            erro
        );


        mostrarMensagem(
            "Erro ao eliminar escola: " +
            erro.message,
            "erro"
        );

    }

};


// =====================================================
// TERMINAR SESSÃO
// =====================================================

window.terminarSessao =
async function() {

    try {

        await signOut(
            auth
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


console.log(
    "===================================="
);

console.log(
    "INICIANDO SUPER ADMIN"
);

console.log(
    "===================================="
);


onAuthStateChanged(

    auth,

    async usuario => {

        console.log(
            "AUTH STATE:",
            usuario
                ? usuario.email
                : "não autenticado"
        );


        if (!usuario) {

            console.log(
                "Nenhum utilizador autenticado."
            );


            window.location.href =
                "./login.html";

            return;

        }


        await verificarSuperAdmin(
            usuario
        );

    }

);
