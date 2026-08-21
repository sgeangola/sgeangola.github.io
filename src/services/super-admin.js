// =====================================================
// SUPER ADMIN - SGE ANGOLA
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
// UID DO SUPER ADMIN
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

const nomeAdmin =
    document.getElementById("nomeAdmin");

const emailAdmin =
    document.getElementById("emailAdmin");

const btnSair =
    document.getElementById("btnSair");

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

    if (painel) {

        painel.style.display =
            "none";

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

    return String(
        texto || ""
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
            "Utilizador autenticado:",
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
        // BUSCAR DOCUMENTO
        // =============================================

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
                "Documento Super Admin não encontrado."
            );

            mostrarAcessoNegado();

            return;

        }


        const dados =
            resultado.data();


        console.log(
            "Dados Super Admin:",
            dados
        );


        // =============================================
        // VERIFICAR ATIVO
        // =============================================

        if (
            dados.ativo !== true
        ) {

            console.warn(
                "Super Admin desativado."
            );

            mostrarAcessoNegado();

            return;

        }


        // =============================================
        // MOSTRAR DADOS
        // =============================================

        if (nomeAdmin) {

            nomeAdmin.textContent =
                dados.nome ||
                "Super Admin";

        }


        if (emailAdmin) {

            emailAdmin.textContent =
                usuario.email ||
                "";

        }


        // =============================================
        // AUTORIZADO
        // =============================================

        console.log(
            "SUPER ADMIN AUTORIZADO."
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


        const escolas = [];


        resultado.forEach(
            documento => {

                escolas.push({

                    id:
                        documento.id,

                    ...documento.data()

                });

            }
        );


        // =============================================
        // ESTATÍSTICAS
        // =============================================

        let pendentes = 0;

        let ativas = 0;

        let rejeitadas = 0;


        escolas.forEach(
            escola => {

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


        mostrarTabela(
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

                    <td
                        colspan="6"
                        style="color:#a52626;text-align:center;"
                    >

                        Erro ao carregar escolas.

                    </td>

                </tr>

            `;

        }


        mostrarMensagem(
            erro.message,
            "erro"
        );

    }

}


// =====================================================
// MOSTRAR TABELA
// =====================================================

function mostrarTabela(
    escolas
) {

    if (!listaEscolas) return;


    if (
        escolas.length === 0
    ) {

        listaEscolas.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#718697;
                    "
                >

                    Nenhuma escola registada.

                </td>

            </tr>

        `;

        return;

    }


    listaEscolas.innerHTML =
        "";


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


            let estadoTexto =
                "Pendente";

            let estadoClasse =
                "estado-pendente";


            if (
                escola.estado ===
                "ativo"
            ) {

                estadoTexto =
                    "Ativa";

                estadoClasse =
                    "estado-ativo";

            }


            else if (
                escola.estado ===
                "rejeitado"
            ) {

                estadoTexto =
                    "Rejeitada";

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
                            data-acao="ver"
                            data-id="${escola.id}"
                        >
                            👁️ Ver
                        </button>


                        ${
                            escola.estado ===
                            "pendente"

                            ?

                            `

                            <button
                                class="btn-aprovar"
                                data-acao="aprovar"
                                data-id="${escola.id}"
                            >
                                ✅ Aprovar
                            </button>


                            <button
                                class="btn-rejeitar"
                                data-acao="rejeitar"
                                data-id="${escola.id}"
                            >
                                ❌ Rejeitar
                            </button>

                            `

                            :

                            ""

                        }


                        <button
                            class="btn-eliminar"
                            data-acao="eliminar"
                            data-id="${escola.id}"
                        >
                            🗑️ Apagar
                        </button>

                    </div>

                </td>

            `;


            listaEscolas.appendChild(
                tr
            );

        }
    );


    // =============================================
    // EVENTOS
    // =============================================

    listaEscolas
        .querySelectorAll(
            "button"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        const id =
                            botao.dataset.id;

                        const acao =
                            botao.dataset.acao;


                        if (
                            acao ===
                            "ver"
                        ) {

                            verEscola(id);

                        }


                        else if (
                            acao ===
                            "aprovar"
                        ) {

                            aprovarEscola(id);

                        }


                        else if (
                            acao ===
                            "rejeitar"
                        ) {

                            rejeitarEscola(id);

                        }


                        else if (
                            acao ===
                            "eliminar"
                        ) {

                            eliminarEscola(id);

                        }

                    }
                );

            }
        );

}


// =====================================================
// VER ESCOLA
// =====================================================

async function verEscola(
    id
) {

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


        if (
            !resultado.exists()
        ) {

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

            ?

            escola.ensinos.join(
                ", "
            )

            :

            "—";


        alert(

`DETALHES DA ESCOLA

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

Ativo:
${escola.ativo === true
    ? "Sim"
    : "Não"}

ID:
${id}`

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

}


// =====================================================
// APROVAR ESCOLA
// =====================================================

async function aprovarEscola(
    id
) {

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


        if (
            !resultado.exists()
        ) {

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

}


// =====================================================
// REJEITAR ESCOLA
// =====================================================

async function rejeitarEscola(
    id
) {

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


        if (
            !resultado.exists()
        ) {

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

}


// =====================================================
// APAGAR ESCOLA
// =====================================================

async function eliminarEscola(
    id
) {

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


        if (
            !resultado.exists()
        ) {

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

Você está prestes a apagar:

${nome}

O cadastro da escola será removido da coleção "escolas".

Deseja continuar?`

            );


        if (!confirmar) {

            return;

        }


        const palavra =
            prompt(

`CONFIRMAÇÃO FINAL

Digite:

ELIMINAR

Escola:
${nome}`

            );


        if (
            palavra !==
            "ELIMINAR"
        ) {

            alert(
                "Operação cancelada."
            );

            return;

        }


        await deleteDoc(
            referencia
        );


        mostrarMensagem(
            "Escola apagada com sucesso!"
        );


        await carregarEscolas();

    }

    catch (erro) {

        console.error(
            "Erro ao apagar escola:",
            erro
        );


        mostrarMensagem(
            "Erro ao apagar escola: " +
            erro.message,
            "erro"
        );

    }

}


// =====================================================
// BOTÃO SAIR
// =====================================================

if (btnSair) {

    btnSair.addEventListener(
        "click",
        async () => {

            const confirmar =
                confirm(
                    "Deseja terminar a sessão?"
                );


            if (!confirmar) {

                return;

            }


            try {

                await signOut(
                    auth
                );


                console.log(
                    "Sessão terminada."
                );


                /*
                 * Não dependemos de uma página
                 * de login específica aqui.
                 *
                 * Voltamos para a página
                 * de login do sistema.
                 */

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

        }
    );

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
                : "nenhum utilizador"
        );


        if (!usuario) {

            mostrarAcessoNegado();

            return;

        }


        await verificarSuperAdmin(
            usuario
        );

    }
);
