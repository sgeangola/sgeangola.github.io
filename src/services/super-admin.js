// =====================================================
// SGE ANGOLA
// SUPER ADMIN — GESTÃO DA PLATAFORMA
// =====================================================

import {
    signInWithEmailAndPassword,
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

const SUPER_ADMIN_EMAIL =
    "dariofranco@gmail.com";


// ⚠️ COLOQUE AQUI A SENHA DA CONTA
const SUPER_ADMIN_PASSWORD =
    "correia123df.";


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
// ESTADO
// =====================================================

let escolasCache = [];


// =====================================================
// INTERFACE
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
// MENSAGEM
// =====================================================

function mostrarMensagem(
    texto,
    tipo = "sucesso"
) {

    if (!mensagem) {

        alert(texto);

        return;

    }


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


    setTimeout(
        () => {

            mensagem.style.display =
                "none";

        },
        4000
    );

}


// =====================================================
// PROTEGER HTML
// =====================================================

function escaparHTML(texto) {

    return String(
        texto ?? ""
    )
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
        // UID
        // =================================================

        if (
            usuario.uid !==
            SUPER_ADMIN_UID
        ) {

            console.error(
                "UID não pertence ao Super Admin."
            );

            mostrarAcessoNegado();

            return false;

        }


        // =================================================
        // DOCUMENTO SUPER ADMIN
        // =================================================

        console.log(
            "Consultando Firestore..."
        );


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


        console.log(
            "Firestore respondeu."
        );


        if (
            !resultado.exists()
        ) {

            console.error(
                "Documento do Super Admin não existe."
            );

            mostrarAcessoNegado();

            alert(
                "O documento do Super Admin não foi encontrado no Firestore."
            );

            return false;

        }


        const dados =
            resultado.data();


        console.log(
            "Dados do Super Admin:",
            dados
        );


        // =================================================
        // ATIVO
        // =================================================

        if (
            dados.ativo !== true
        ) {

            console.error(
                "Super Admin está desativado."
            );

            mostrarAcessoNegado();

            alert(
                "A conta do Super Admin está desativada."
            );

            return false;

        }


        // =================================================
        // NOME
        // =================================================

        if (nomeAdmin) {

            nomeAdmin.textContent =
                dados.nome ||
                usuario.email ||
                "Super Admin";

        }


        console.log(
            "✅ SUPER ADMIN AUTORIZADO"
        );


        mostrarPainel();


        return true;

    }

    catch (erro) {

        console.error(
            "===================================="
        );

        console.error(
            "ERRO AO VERIFICAR SUPER ADMIN"
        );

        console.error(
            erro
        );


        if (
            erro.code ===
            "unavailable"
        ) {

            alert(
                "O Firestore não conseguiu conectar ao servidor.\n\nVerifique a Internet e tente novamente."
            );

        }

        else {

            alert(
                "Erro ao verificar o Super Admin:\n\n" +
                erro.message
            );

        }


        mostrarAcessoNegado();

        return false;

    }

}


// =====================================================
// CARREGAR ESCOLAS
// =====================================================

async function carregarEscolas() {

    try {

        console.log(
            "Carregando escolas..."
        );


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


        escolasCache = [];


        resultado.forEach(
            documento => {

                escolasCache.push({

                    id:
                        documento.id,

                    ...documento.data()

                });

            }
        );


        console.log(
            "Escolas encontradas:",
            escolasCache.length
        );


        atualizarEstatisticas();

        mostrarEscolas();


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


        if (
            erro.code ===
            "unavailable"
        ) {

            mostrarMensagem(
                "Não foi possível conectar ao Firestore.",
                "erro"
            );

        }

        else if (
            erro.code ===
            "permission-denied"
        ) {

            mostrarMensagem(
                "Sem permissão para consultar as escolas.",
                "erro"
            );

        }

        else {

            mostrarMensagem(
                erro.message,
                "erro"
            );

        }

    }

}


// =====================================================
// ESTATÍSTICAS
// =====================================================

function atualizarEstatisticas() {

    const pendentes =
        escolasCache.filter(
            escola =>
                escola.estado ===
                "pendente"
        );

    const ativas =
        escolasCache.filter(
            escola =>
                escola.estado ===
                "ativo"
        );

    const rejeitadas =
        escolasCache.filter(
            escola =>
                escola.estado ===
                "rejeitado"
        );


    if (totalPendentes) {

        totalPendentes.textContent =
            pendentes.length;

    }


    if (totalAtivas) {

        totalAtivas.textContent =
            ativas.length;

    }


    if (totalRejeitadas) {

        totalRejeitadas.textContent =
            rejeitadas.length;

    }


    if (totalEscolas) {

        totalEscolas.textContent =
            escolasCache.length;

    }

}


// =====================================================
// MOSTRAR ESCOLAS NA TABELA
// =====================================================

function mostrarEscolas() {

    if (!listaEscolas) {

        return;

    }


    if (!escolasCache.length) {

        listaEscolas.innerHTML = `

            <tr>

                <td colspan="6">

                    Não existem escolas registadas.

                </td>

            </tr>

        `;

        return;

    }


    listaEscolas.innerHTML = "";


    escolasCache.forEach(
        escola => {

            const linha =
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


            const estado =
                escola.estado ||
                "pendente";


            let textoEstado =
                "Pendente";


            let classeEstado =
                "estado-pendente";


            if (
                estado ===
                "ativo"
            ) {

                textoEstado =
                    "Ativo";

                classeEstado =
                    "estado-ativo";

            }

            else if (
                estado ===
                "rejeitado"
            ) {

                textoEstado =
                    "Rejeitado";

                classeEstado =
                    "estado-rejeitado";

            }


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
                        class="estado ${classeEstado}"
                    >

                        ${textoEstado}

                    </span>

                </td>


                <td>

                    <div class="acoes">

                        <button
                            class="btn-ver"
                            onclick="verEscola('${escola.id}')"
                        >
                            Ver
                        </button>


                        <button
                            class="btn-aprovar"
                            onclick="aprovarEscola('${escola.id}')"
                        >
                            Aprovar
                        </button>


                        <button
                            class="btn-rejeitar"
                            onclick="rejeitarEscola('${escola.id}')"
                        >
                            Rejeitar
                        </button>


                        <button
                            class="btn-eliminar"
                            onclick="eliminarEscola('${escola.id}')"
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

}


// =====================================================
// ENCONTRAR ESCOLA
// =====================================================

function encontrarEscola(id) {

    return escolasCache.find(
        escola =>
            escola.id === id
    );

}


// =====================================================
// VER ESCOLA
// =====================================================

window.verEscola =
function(id) {

    const escola =
        encontrarEscola(id);


    if (!escola) {

        alert(
            "Escola não encontrada."
        );

        return;

    }


    const ensinos =
        Array.isArray(
            escola.ensinos
        )
            ? escola.ensinos.join(", ")
            : "—";


    alert(

`================================
ESCOLA
================================

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

Gestor:
${escola.nomeGestor || "—"}

E-mail do gestor:
${escola.emailGestor || "—"}

Estado:
${escola.estado || "—"}

ID:
${id}

================================`
    );

};


// =====================================================
// APROVAR ESCOLA
// =====================================================

window.aprovarEscola =
async function(id) {

    const escola =
        encontrarEscola(id);


    if (!escola) {

        mostrarMensagem(
            "Escola não encontrada.",
            "erro"
        );

        return;

    }


    if (
        escola.estado ===
        "ativo"
    ) {

        alert(
            "Esta escola já está ativa."
        );

        return;

    }


    const confirmar =
        confirm(

`Deseja aprovar esta escola?

Escola:
${escola.nome || "Sem nome"}

Gestor:
${escola.nomeGestor || "—"}

Após a aprovação, o estado ficará como ATIVO.`

        );


    if (!confirmar) {

        return;

    }


    try {

        await updateDoc(

            doc(
                db,
                "escolas",
                id
            ),

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

    const escola =
        encontrarEscola(id);


    if (!escola) {

        mostrarMensagem(
            "Escola não encontrada.",
            "erro"
        );

        return;

    }


    const motivo =
        prompt(

`Motivo da rejeição:

Escola:
${escola.nome || "Sem nome"}

Digite o motivo:`

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
            "Digite o motivo da rejeição."
        );

        return;

    }


    try {

        await updateDoc(

            doc(
                db,
                "escolas",
                id
            ),

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

    const escola =
        encontrarEscola(id);


    if (!escola) {

        mostrarMensagem(
            "Escola não encontrada.",
            "erro"
        );

        return;

    }


    const nome =
        escola.nome ||
        "Sem nome";


    const primeiraConfirmacao =
        confirm(

`ATENÇÃO!

Você está prestes a eliminar:

${nome}

Apenas o documento desta escola na coleção "escolas" será eliminado.

Os dados relacionados de alunos, professores, turmas, notas ou outras coleções NÃO serão eliminados automaticamente.

Deseja continuar?`

        );


    if (!primeiraConfirmacao) {

        return;

    }


    const segundaConfirmacao =
        prompt(

`CONFIRMAÇÃO FINAL

Escreva exatamente:

ELIMINAR

para confirmar a eliminação.

Escola:
${nome}`

        );


    if (
        segundaConfirmacao !==
        "ELIMINAR"
    ) {

        alert(
            "Eliminação cancelada."
        );

        return;

    }


    try {

        await deleteDoc(

            doc(
                db,
                "escolas",
                id
            )

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
            "Não foi possível eliminar a escola: " +
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
            "Erro ao terminar sessão:\n\n" +
            erro.message
        );

    }

};


// =====================================================
// INICIALIZAÇÃO
// =====================================================

async function iniciarSuperAdmin() {

    mostrarCarregando();


    try {

        console.log(
            "===================================="
        );

        console.log(
            "INICIANDO SUPER ADMIN"
        );


        // =================================================
        // VERIFICAR SESSÃO EXISTENTE
        // =================================================

        const usuarioAtual =
            auth.currentUser;


        if (
            usuarioAtual
        ) {

            console.log(
                "Utilizador já autenticado:",
                usuarioAtual.email
            );


            const autorizado =
                await verificarSuperAdmin(
                    usuarioAtual
                );


            if (autorizado) {

                await carregarEscolas();

            }


            return;

        }


        // =================================================
        // LOGIN AUTOMÁTICO
        // =================================================

        console.log(
            "A fazer login automático..."
        );


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


        const autorizado =
            await verificarSuperAdmin(
                resultado.user
            );


        if (autorizado) {

            await carregarEscolas();

        }

    }

    catch (erro) {

        console.error(
            "===================================="
        );

        console.error(
            "ERRO AO INICIAR SUPER ADMIN"
        );

        console.error(
            erro
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
                "A conta do Super Admin não existe."
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

        else if (
            erro.code ===
            "permission-denied"
        ) {

            alert(
                "O Firebase não permite acessar os dados do Super Admin."
            );

        }

        else if (
            erro.code ===
            "unavailable"
        ) {

            alert(
                "O Firestore está sem conexão.\n\nVerifique a Internet e tente novamente."
            );

        }

        else {

            alert(
                "Erro ao abrir o Super Admin:\n\n" +
                erro.message
            );

        }


        mostrarAcessoNegado();

    }

}


// =====================================================
// OBSERVAR AUTH
// =====================================================

onAuthStateChanged(
    auth,
    usuario => {

        console.log(
            "AUTH STATE:",
            usuario
                ? usuario.email
                : "não autenticado"
        );

    }
);


// =====================================================
// INICIAR
// =====================================================

iniciarSuperAdmin();
