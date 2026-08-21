// =====================================================
// SUPER ADMIN - SGE ANGOLA
// Gestão completa das escolas da plataforma
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

alert("CARREGOU");

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

const btnSair =
    document.getElementById("btnSair");


// =====================================================
// MOSTRAR CARREGAMENTO
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


// =====================================================
// MOSTRAR PAINEL
// =====================================================

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


// =====================================================
// MOSTRAR ACESSO NEGADO
// =====================================================

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
            "#fee2e2";

        mensagem.style.color =
            "#991b1b";

    }

    else {

        mensagem.style.background =
            "#dcfce7";

        mensagem.style.color =
            "#166534";

    }

    setTimeout(() => {

        mensagem.style.display = "none";

    }, 4000);

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
// TEXTO DO ESTADO
// =====================================================

function nomeEstado(estado) {

    if (estado === "pendente") {
        return "Pendente";
    }

    if (estado === "ativo") {
        return "Ativa";
    }

    if (estado === "rejeitado") {
        return "Rejeitada";
    }

    return estado || "Desconhecido";

}


// =====================================================
// CLASSE DO ESTADO
// =====================================================

function classeEstado(estado) {

    if (estado === "pendente") {
        return "estado-pendente";
    }

    if (estado === "ativo") {
        return "estado-ativo";
    }

    if (estado === "rejeitado") {
        return "estado-rejeitado";
    }

    return "estado-desconhecido";

}


// =====================================================
// CARREGAR ESCOLAS
// =====================================================

async function carregarEscolas() {

    try {

        if (!listaEscolas) {

            console.error(
                "Elemento listaEscolas não encontrado."
            );

            return;

        }


        listaEscolas.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="carregando"
                >
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


        const escolas = [];


        resultado.forEach(
            documento => {

                const escola =
                    documento.data();


                const dados = {

                    id:
                        documento.id,

                    ...escola

                };


                escolas.push(
                    dados
                );


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


        // =============================================
        // ESTATÍSTICAS
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
                escolas.length;

        }


        // =============================================
        // ORDENAR
        // PENDENTES PRIMEIRO
        // =============================================

        escolas.sort(
            (a, b) => {

                const ordem = {

                    pendente: 1,
                    ativo: 2,
                    rejeitado: 3

                };

                return (
                    (ordem[a.estado] || 99) -
                    (ordem[b.estado] || 99)
                );

            }
        );


        // =============================================
        // NENHUMA ESCOLA
        // =============================================

        if (!escolas.length) {

            listaEscolas.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="sem-escolas"
                    >

                        Nenhuma escola registada.

                    </td>

                </tr>

            `;

            return;

        }


        // =============================================
        // TABELA
        // =============================================

        listaEscolas.innerHTML = "";


        escolas.forEach(
            escola => {

                const nome =
                    escaparHTML(
                        escola.nome ||
                        "Sem nome"
                    );


                const gestor =
                    escaparHTML(
                        escola.nomeGestor ||
                        "Não informado"
                    );


                const email =
                    escaparHTML(
                        escola.emailGestor ||
                        escola.email ||
                        "Não informado"
                    );


                const telefone =
                    escaparHTML(
                        escola.telefone ||
                        "Não informado"
                    );


                const estado =
                    escola.estado ||
                    "pendente";


                const linha =
                    document.createElement(
                        "tr"
                    );


                linha.innerHTML = `

                    <td>

                        <div class="escola-nome">

                            <strong>
                                ${nome}
                            </strong>

                        </div>

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
                            class="estado ${classeEstado(estado)}"
                        >

                            ${nomeEstado(estado)}

                        </span>

                    </td>


                    <td>

                        <div class="acoes-tabela">

                            <button
                                class="btn-acao btn-ver"
                                data-id="${escola.id}"
                                data-acao="ver"
                            >
                                Ver
                            </button>


                            ${
                                estado === "pendente"
                                ?
                                `
                                <button
                                    class="btn-acao btn-aprovar"
                                    data-id="${escola.id}"
                                    data-acao="aprovar"
                                >
                                    Aprovar
                                </button>

                                <button
                                    class="btn-acao btn-rejeitar"
                                    data-id="${escola.id}"
                                    data-acao="rejeitar"
                                >
                                    Rejeitar
                                </button>
                                `
                                :
                                ""
                            }


                            <button
                                class="btn-acao btn-eliminar"
                                data-id="${escola.id}"
                                data-acao="eliminar"
                            >
                                Apagar
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
        // EVENTOS DOS BOTÕES
        // =============================================

        listaEscolas
            .querySelectorAll(
                "[data-acao]"
            )
            .forEach(
                botao => {

                    botao.addEventListener(
                        "click",
                        async () => {

                            const id =
                                botao.dataset.id;

                            const acao =
                                botao.dataset.acao;


                            if (
                                acao ===
                                "ver"
                            ) {

                                await verEscola(
                                    id
                                );

                            }


                            else if (
                                acao ===
                                "aprovar"
                            ) {

                                await aprovarEscola(
                                    id
                                );

                            }


                            else if (
                                acao ===
                                "rejeitar"
                            ) {

                                await rejeitarEscola(
                                    id
                                );

                            }


                            else if (
                                acao ===
                                "eliminar"
                            ) {

                                await eliminarEscola(
                                    id
                                );

                            }

                        }
                    );

                }
            );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar escolas:",
            erro
        );


        listaEscolas.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="erro-tabela"
                >

                    Erro ao carregar escolas.

                </td>

            </tr>

        `;


        mostrarMensagem(
            erro.message ||
            "Erro ao carregar escolas.",
            "erro"
        );

    }

}


// =====================================================
// BUSCAR ESCOLA
// =====================================================

async function buscarEscola(id) {

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

        throw new Error(
            "Escola não encontrada."
        );

    }


    return {

        id: resultado.id,

        ...resultado.data()

    };

}


// =====================================================
// VER ESCOLA
// =====================================================

async function verEscola(id) {

    try {

        const escola =
            await buscarEscola(
                id
            );


        const ensinos =
            Array.isArray(
                escola.ensinos
            )
                ?
                escola.ensinos
                    .map(
                        ensino => {

                            if (
                                ensino ===
                                "ensinoPrimario"
                            ) {

                                return "Ensino Primário";

                            }

                            if (
                                ensino ===
                                "primeiroCiclo"
                            ) {

                                return "Primeiro Ciclo";

                            }

                            return ensino;

                        }
                    )
                    .join(", ")
                :
                "Não informado";


        const modal =
            document.getElementById(
                "modalEscola"
            );


        const dadosModal =
            document.getElementById(
                "dadosModal"
            );


        if (
            modal &&
            dadosModal
        ) {

            dadosModal.innerHTML = `

                <div class="detalhe">

                    <strong>
                        Escola
                    </strong>

                    <span>
                        ${escaparHTML(
                            escola.nome
                        )}
                    </span>

                </div>


                <div class="detalhe">

                    <strong>
                        Província
                    </strong>

                    <span>
                        ${escaparHTML(
                            escola.provincia
                        )}
                    </span>

                </div>


                <div class="detalhe">

                    <strong>
                        Município
                    </strong>

                    <span>
                        ${escaparHTML(
                            escola.municipio
                        )}
                    </span>

                </div>


                <div class="detalhe">

                    <strong>
                        Telefone
                    </strong>

                    <span>
                        ${escaparHTML(
                            escola.telefone
                        )}
                    </span>

                </div>


                <div class="detalhe">

                    <strong>
                        E-mail da escola
                    </strong>

                    <span>
                        ${escaparHTML(
                            escola.email
                        )}
                    </span>

                </div>


                <div class="detalhe">

                    <strong>
                        Tipo
                    </strong>

                    <span>
                        ${
                            escola.tipoEscola ===
                            "publica"
                            ?
                            "Pública"
                            :
                            "Privada"
                        }
                    </span>

                </div>


                <div class="detalhe">

                    <strong>
                        Ano letivo
                    </strong>

                    <span>
                        ${escaparHTML(
                            escola.anoLetivoAtual
                        )}
                    </span>

                </div>


                <div class="detalhe">

                    <strong>
                        Gestor
                    </strong>

                    <span>
                        ${escaparHTML(
                            escola.nomeGestor
                        )}
                    </span>

                </div>


                <div class="detalhe">

                    <strong>
                        E-mail do gestor
                    </strong>

                    <span>
                        ${escaparHTML(
                            escola.emailGestor
                        )}
                    </span>

                </div>


                <div class="detalhe">

                    <strong>
                        Ensino
                    </strong>

                    <span>
                        ${escaparHTML(
                            ensinos
                        )}
                    </span>

                </div>


                <div class="detalhe">

                    <strong>
                        Estado
                    </strong>

                    <span>
                        ${nomeEstado(
                            escola.estado
                        )}
                    </span>

                </div>


                ${
                    escola.motivoRejeicao
                    ?
                    `
                    <div class="detalhe">

                        <strong>
                            Motivo da rejeição
                        </strong>

                        <span>
                            ${escaparHTML(
                                escola.motivoRejeicao
                            )}
                        </span>

                    </div>
                    `
                    :
                    ""
                }

            `;


            modal.style.display =
                "flex";


            return;

        }


        // ===========================================
        // FALLBACK
        // ===========================================

        alert(

`ESCOLA

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

Gestor:
${escola.nomeGestor || ""}

E-mail do gestor:
${escola.emailGestor || ""}

Estado:
${nomeEstado(escola.estado)}

Ensinos:
${ensinos}`

        );

    }

    catch (erro) {

        console.error(
            "Erro ao visualizar escola:",
            erro
        );


        mostrarMensagem(
            erro.message,
            "erro"
        );

    }

}


// =====================================================
// APROVAR ESCOLA
// =====================================================

async function aprovarEscola(id) {

    try {

        const escola =
            await buscarEscola(
                id
            );


        const confirmar =
            confirm(

`Deseja aprovar esta escola?

${escola.nome || "Sem nome"}

Depois da aprovação, o gestor poderá utilizar
a escola normalmente.`

            );


        if (!confirmar) {
            return;
        }


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
            "Erro ao aprovar escola:",
            erro
        );


        mostrarMensagem(
            "Não foi possível aprovar a escola: " +
            erro.message,
            "erro"
        );

    }

}


// =====================================================
// REJEITAR ESCOLA
// =====================================================

async function rejeitarEscola(id) {

    try {

        const escola =
            await buscarEscola(
                id
            );


        const motivo =
            prompt(

`Rejeitar escola:

${escola.nome || "Sem nome"}

Informe o motivo da rejeição:`

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


        const confirmar =
            confirm(

`Confirmar rejeição?

Escola:
${escola.nome || "Sem nome"}

Motivo:
${motivo.trim()}`

            );


        if (!confirmar) {
            return;
        }


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
            "Erro ao rejeitar escola:",
            erro
        );


        mostrarMensagem(
            "Não foi possível rejeitar a escola: " +
            erro.message,
            "erro"
        );

    }

}


// =====================================================
// ELIMINAR ESCOLA
// =====================================================

async function eliminarEscola(id) {

    try {

        const escola =
            await buscarEscola(
                id
            );


        const nome =
            escola.nome ||
            "Sem nome";


        const confirmar =
            confirm(

`ATENÇÃO!

Você está prestes a apagar a escola:

${nome}

O documento será removido da coleção "escolas".

Os alunos, turmas, professores e outros dados
não serão apagados automaticamente.

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
            "Erro ao eliminar escola:",
            erro
        );


        mostrarMensagem(
            "Não foi possível eliminar a escola: " +
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

            try {

                await signOut(
                    auth
                );


                window.location.href =
                    "./login.html";

            }

            catch (erro) {

                console.error(
                    "Erro ao sair:",
                    erro
                );

                mostrarMensagem(
                    "Não foi possível terminar a sessão.",
                    "erro"
                );

            }

        }
    );

}


// =====================================================
// VERIFICAR SUPER ADMIN
// =====================================================

async function verificarSuperAdmin(
    usuario
) {

    try {

        if (!usuario) {

            window.location.href =
                "./login.html";

            return;

        }


        // =============================================
        // BUSCAR SUPER ADMIN PELO UID
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


        // =============================================
        // DOCUMENTO NÃO EXISTE
        // =============================================

        if (
            !resultado.exists()
        ) {

            console.warn(
                "Utilizador autenticado não está registado como Super Admin."
            );

            mostrarAcessoNegado();

            return;

        }


        const dados =
            resultado.data();


        // =============================================
        // VERIFICAR ATIVO
        // =============================================

        if (
            dados.ativo !== true
        ) {

            console.warn(
                "Super Admin está desativado."
            );

            mostrarAcessoNegado();

            return;

        }


        // =============================================
        // MOSTRAR NOME
        // =============================================

        if (nomeAdmin) {

            nomeAdmin.textContent =
                dados.nome ||
                usuario.email ||
                "Super Admin";

        }


        // =============================================
        // MOSTRAR EMAIL
        // =============================================

        const emailAdmin =
            document.getElementById(
                "emailAdmin"
            );


        if (emailAdmin) {

            emailAdmin.textContent =
                dados.email ||
                usuario.email ||
                "";

        }


        // =============================================
        // AUTORIZADO
        // =============================================

        console.log(
            "SUPER ADMIN AUTORIZADO:",
            usuario.uid
        );


        mostrarPainel();


        // =============================================
        // CARREGAR ESCOLAS
        // =============================================

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

        await verificarSuperAdmin(
            usuario
        );

    }
);
