// =====================================================
// SUPER ADMIN - SGE ANGOLA
// Gestão das escolas da plataforma
// =====================================================

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

import {
    db
} from "./firebase.js";


// =====================================================
// ELEMENTOS
// =====================================================

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

        mensagem.style.display =
            "none";

    }, 4000);

}


// =====================================================
// CARREGAR ESCOLAS
// =====================================================

async function carregarEscolas() {

    try {

        listaEscolas.innerHTML =
            "A carregar escolas...";


        const resultado =
            await getDocs(
                collection(
                    db,
                    "escolas"
                )
            );


        let pendentes = [];

        let ativas = [];

        let rejeitadas = [];


        // =============================================
        // SEPARAR ESCOLAS
        // =============================================

        resultado.forEach(
            documento => {

                const escola =
                    documento.data();


                const dados = {

                    id:
                        documento.id,

                    ...escola

                };


                if (
                    escola.estado ===
                    "pendente"
                ) {

                    pendentes.push(
                        dados
                    );

                }

                else if (
                    escola.estado ===
                    "ativo"
                ) {

                    ativas.push(
                        dados
                    );

                }

                else if (
                    escola.estado ===
                    "rejeitado"
                ) {

                    rejeitadas.push(
                        dados
                    );

                }

            }
        );


        // =============================================
        // ATUALIZAR ESTATÍSTICAS
        // =============================================

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
                resultado.size;

        }


        // =============================================
        // MOSTRAR PENDENTES
        // =============================================

        mostrarEscolasPendentes(
            pendentes
        );


    }

    catch (erro) {

        console.error(
            "Erro ao carregar escolas:",
            erro
        );


        listaEscolas.innerHTML =
            "Erro ao carregar escolas.";


        mostrarMensagem(
            erro.message,
            "erro"
        );

    }

}


// =====================================================
// MOSTRAR ESCOLAS PENDENTES
// =====================================================

function mostrarEscolasPendentes(
    escolas
) {

    if (!escolas.length) {

        listaEscolas.innerHTML = `

            <p>
                Não existem escolas pendentes.
            </p>

        `;

        return;

    }


    listaEscolas.innerHTML = "";


    escolas.forEach(
        escola => {


            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "escola";


            // =========================================
            // PROTEÇÃO CONTRA HTML
            // =========================================

            const nome =
                escaparHTML(
                    escola.nome ||
                    "Sem nome"
                );


            const provincia =
                escaparHTML(
                    escola.provincia ||
                    ""
                );


            const municipio =
                escaparHTML(
                    escola.municipio ||
                    ""
                );


            const tipo =
                escola.tipoEscola ===
                "publica"
                    ? "Pública"
                    : "Privada";


            const nomeGestor =
                escaparHTML(
                    escola.nomeGestor ||
                    ""
                );


            const emailGestor =
                escaparHTML(
                    escola.emailGestor ||
                    ""
                );


            elemento.innerHTML = `

                <h3>
                    ${nome}
                </h3>


                <div class="dados">

                    <div>
                        <strong>
                            Província:
                        </strong>

                        ${provincia}
                    </div>


                    <div>
                        <strong>
                            Município:
                        </strong>

                        ${municipio}
                    </div>


                    <div>
                        <strong>
                            Tipo:
                        </strong>

                        ${tipo}
                    </div>


                    <div>
                        <strong>
                            Gestor:
                        </strong>

                        ${nomeGestor}
                    </div>


                    <div>
                        <strong>
                            E-mail:
                        </strong>

                        ${emailGestor}
                    </div>


                    <div>
                        <strong>
                            Estado:
                        </strong>

                        Pendente
                    </div>

                </div>


                <div class="acoes">

                    <button
                        class="btn-ver"
                        onclick="verEscola('${escola.id}')"
                    >
                        👁️ Ver
                    </button>


                    <button
                        class="btn-aprovar"
                        onclick="aprovarEscola('${escola.id}')"
                    >
                        ✅ Aprovar
                    </button>


                    <button
                        class="btn-rejeitar"
                        onclick="rejeitarEscola('${escola.id}')"
                    >
                        ❌ Rejeitar
                    </button>


                    <button
                        class="btn-eliminar"
                        onclick="eliminarEscola('${escola.id}')"
                    >
                        🗑️ Eliminar
                    </button>

                </div>

            `;


            listaEscolas.appendChild(
                elemento
            );

        }
    );

}


// =====================================================
// PROTEGER TEXTO HTML
// =====================================================

function escaparHTML(
    texto
) {

    return String(texto)
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
// VER ESCOLA
// =====================================================

window.verEscola =
async function(id) {


    try {

        const escolaRef =
            doc(
                db,
                "escolas",
                id
            );


        const resultado =
            await getDocs(
                collection(
                    db,
                    "escolas"
                )
            );


        let escolaEncontrada =
            null;


        resultado.forEach(
            documento => {

                if (
                    documento.id ===
                    id
                ) {

                    escolaEncontrada =
                        documento.data();

                }

            }
        );


        if (!escolaEncontrada) {

            alert(
                "Escola não encontrada."
            );

            return;

        }


        const ensinos =
            Array.isArray(
                escolaEncontrada.ensinos
            )
                ? escolaEncontrada.ensinos
                    .join(", ")
                : "";


        alert(

`================================
          ESCOLA
================================

Nome:
${escolaEncontrada.nome || ""}

Província:
${escolaEncontrada.provincia || ""}

Município:
${escolaEncontrada.municipio || ""}

Telefone:
${escolaEncontrada.telefone || ""}

E-mail:
${escolaEncontrada.email || ""}

Tipo:
${escolaEncontrada.tipoEscola || ""}

Ano letivo:
${escolaEncontrada.anoLetivoAtual || ""}

Ensinos:
${ensinos}

Gestor:
${escolaEncontrada.nomeGestor || ""}

E-mail do gestor:
${escolaEncontrada.emailGestor || ""}

Estado:
${escolaEncontrada.estado || ""}

Ativo:
${escolaEncontrada.ativo ? "Sim" : "Não"}

ID da escola:
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

        // =============================================
        // BUSCAR ESCOLA
        // =============================================

        const resultado =
            await getDocs(
                collection(
                    db,
                    "escolas"
                )
            );


        let escola =
            null;


        resultado.forEach(
            documento => {

                if (
                    documento.id ===
                    id
                ) {

                    escola =
                        documento.data();

                }

            }
        );


        if (!escola) {

            mostrarMensagem(
                "Escola não encontrada.",
                "erro"
            );

            return;

        }


        // =============================================
        // CONFIRMAÇÃO
        // =============================================

        const confirmar =
            confirm(

                `Deseja aprovar a escola:

${escola.nome || "Sem nome"}

O gestor poderá utilizar a escola após a aprovação.`

            );


        if (!confirmar) {

            return;

        }


        // =============================================
        // ATUALIZAR
        // =============================================

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


        carregarEscolas();

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

        // =============================================
        // BUSCAR ESCOLA
        // =============================================

        const resultado =
            await getDocs(
                collection(
                    db,
                    "escolas"
                )
            );


        let escola =
            null;


        resultado.forEach(
            documento => {

                if (
                    documento.id ===
                    id
                ) {

                    escola =
                        documento.data();

                }

            }
        );


        if (!escola) {

            mostrarMensagem(
                "Escola não encontrada.",
                "erro"
            );

            return;

        }


        // =============================================
        // MOTIVO
        // =============================================

        const motivo =
            prompt(

                `Motivo da rejeição da escola:

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


        // =============================================
        // ATUALIZAR
        // =============================================

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


        carregarEscolas();

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

        // =============================================
        // BUSCAR ESCOLA
        // =============================================

        const resultado =
            await getDocs(
                collection(
                    db,
                    "escolas"
                )
            );


        let escola =
            null;


        resultado.forEach(
            documento => {

                if (
                    documento.id ===
                    id
                ) {

                    escola =
                        documento.data();

                }

            }
        );


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


        // =============================================
        // PRIMEIRA CONFIRMAÇÃO
        // =============================================

        const confirmar =
            confirm(

`ATENÇÃO!

Você está prestes a eliminar a escola:

${nome}

Esta operação remove o cadastro da escola da coleção "escolas".

Os dados de alunos, turmas, professores e outras coleções NÃO serão eliminados automaticamente.

Deseja continuar?`

            );


        if (!confirmar) {

            return;

        }


        // =============================================
        // CONFIRMAÇÃO FINAL
        // =============================================

        const confirmacao =
            prompt(

`CONFIRMAÇÃO FINAL

Para eliminar esta escola, escreva:

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


        // =============================================
        // ELIMINAR
        // =============================================

        await deleteDoc(

            doc(
                db,
                "escolas",
                id
            )

        );


        // =============================================
        // SUCESSO
        // =============================================

        mostrarMensagem(
            "Escola eliminada com sucesso!"
        );


        // =============================================
        // ATUALIZAR LISTA
        // =============================================

        carregarEscolas();

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
// INICIALIZAÇÃO
// =====================================================

carregarEscolas();
