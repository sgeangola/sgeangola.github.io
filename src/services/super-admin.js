/* =====================================================
SUPER ADMIN — SGE ANGOLA
Gestão profissional das escolas
===================================================== */

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

    mensagem.style.background = "#fee2e2";
    mensagem.style.color = "#991b1b";
    mensagem.style.borderColor = "#fecaca";

} else {

    mensagem.style.background = "#dcfce7";
    mensagem.style.color = "#166534";
    mensagem.style.borderColor = "#bbf7d0";

}

setTimeout(() => {

    mensagem.style.display = "none";

}, 4000);

}

// =====================================================
// ESCAPAR HTML
// =====================================================

function escaparHTML(texto) {

return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

// =====================================================
// NOME DO ESTADO
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

return "estado-pendente";

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


    // =============================================
    // MENSAGEM DE CARREGAMENTO
    // =============================================

    listaEscolas.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="vazio"
            >
                A carregar escolas...
            </td>

        </tr>

    `;


    // =============================================
    // BUSCAR FIRESTORE
    // =============================================

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

    const pendentes =
        escolas.filter(
            escola =>
                escola.estado === "pendente"
        );

    const ativas =
        escolas.filter(
            escola =>
                escola.estado === "ativo"
        );

    const rejeitadas =
        escolas.filter(
            escola =>
                escola.estado === "rejeitado"
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
            escolas.length;

    }


    // =============================================
    // MOSTRAR TODAS AS ESCOLAS
    // =============================================

    mostrarEscolas(escolas);

}

catch (erro) {

    console.error(
        "ERRO AO CARREGAR ESCOLAS:",
        erro
    );


    if (listaEscolas) {

        listaEscolas.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="vazio"
                >
                    Não foi possível carregar
                    as escolas.
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

function mostrarEscolas(escolas) {

if (!listaEscolas) return;


// =============================================
// NENHUMA ESCOLA
// =============================================

if (!escolas.length) {

    listaEscolas.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="vazio"
            >

                Não existem escolas registadas.

            </td>

        </tr>

    `;

    return;

}


listaEscolas.innerHTML = "";


// =============================================
// CRIAR LINHAS
// =============================================

escolas.forEach(
    escola => {

        const tr =
            document.createElement("tr");


        // =========================================
        // DADOS
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


        // =========================================
        // LINHA
        // =========================================

        tr.innerHTML = `

            <td>

                <span class="nome-escola">
                    ${nome}
                </span>

                <span class="sub-info">
                    ${provincia}
                    ${municipio
                        ? " • " + municipio
                        : ""}
                </span>

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

                <div class="acoes">

                    <button
                        class="btn btn-ver"
                        data-acao="ver"
                        data-id="${escola.id}"
                    >
                        👁️ Ver
                    </button>


                    ${
                        estado === "pendente"
                        ?
                        `
                        <button
                            class="btn btn-aprovar"
                            data-acao="aprovar"
                            data-id="${escola.id}"
                        >
                            ✅ Aprovar
                        </button>

                        <button
                            class="btn btn-rejeitar"
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
                        class="btn btn-eliminar"
                        data-acao="eliminar"
                        data-id="${escola.id}"
                    >
                        🗑️ Apagar
                    </button>

                </div>

            </td>

        `;


        listaEscolas.appendChild(tr);

    }
);

}

// =====================================================
// EVENTOS DOS BOTÕES
// =====================================================

if (listaEscolas) {

listaEscolas.addEventListener(
    "click",
    evento => {

        const botao =
            evento.target.closest("button");

        if (!botao) return;


        const id =
            botao.dataset.id;

        const acao =
            botao.dataset.acao;


        if (!id || !acao) return;


        if (acao === "ver") {

            verEscola(id);

        }


        else if (acao === "aprovar") {

            aprovarEscola(id);

        }


        else if (acao === "rejeitar") {

            rejeitarEscola(id);

        }


        else if (acao === "eliminar") {

            eliminarEscola(id);

        }

    }
);

}

// =====================================================
// VER ESCOLA
// =====================================================

async function verEscola(id) {

try {

    const referencia =
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


    let escola = null;


    resultado.forEach(
        documento => {

            if (
                documento.id === id
            ) {

                escola = {

                    id:
                        documento.id,

                    ...documento.data()

                };

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


    const ensinos =
        Array.isArray(escola.ensinos)
            ? escola.ensinos.join(", ")
            : "Não informado";


    alert(`

========================================
SGE ANGOLA
DADOS DA ESCOLA

Escola:
${escola.nome || ""}

Província:
${escola.provincia || ""}

Município:
${escola.municipio || ""}

Telefone:
${escola.telefone || "Não informado"}

E-mail:
${escola.email || "Não informado"}

Tipo:
${escola.tipoEscola || ""}

Ano letivo:
${escola.anoLetivoAtual || ""}

Ensinos:
${ensinos}

---

GESTOR

Nome:
${escola.nomeGestor || ""}

E-mail:
${escola.emailGestor || ""}

---

Estado:
${nomeEstado(escola.estado)}

Ativo:
${escola.ativo ? "Sim" : "Não"}

${escola.motivoRejeicao
? "Motivo da rejeição: ${escola.motivoRejeicao}"
: ""}

---

ID DA ESCOLA:

${id}

========================================

    `);

}

catch (erro) {

    console.error(
        "ERRO AO VER ESCOLA:",
        erro
    );

    mostrarMensagem(
        "Erro ao consultar a escola.",
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
        await obterEscola(id);


    if (!escola) {

        mostrarMensagem(
            "Escola não encontrada.",
            "erro"
        );

        return;

    }


    const confirmar =
        confirm(`

Deseja aprovar esta escola?

Escola:
${escola.nome}

Gestor:
${escola.nomeGestor}

Após a aprovação, o gestor
poderá utilizar o sistema.

    `);


    if (!confirmar) return;


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
        "ERRO AO APROVAR:",
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

async function rejeitarEscola(id) {

try {

    const escola =
        await obterEscola(id);


    if (!escola) {

        mostrarMensagem(
            "Escola não encontrada.",
            "erro"
        );

        return;

    }


    const motivo =
        prompt(`

Motivo da rejeição:

Escola:
${escola.nome}

Digite o motivo da rejeição:

    `);


    if (motivo === null) {

        return;

    }


    if (!motivo.trim()) {

        mostrarMensagem(
            "Informe o motivo da rejeição.",
            "erro"
        );

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


    carregarEscolas();

}

catch (erro) {

    console.error(
        "ERRO AO REJEITAR:",
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

async function eliminarEscola(id) {

try {

    const escola =
        await obterEscola(id);


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
        confirm(`

⚠️ ATENÇÃO

Você está prestes a apagar a escola:

${nome}

O documento da escola será removido
da coleção "escolas".

Os alunos, turmas e professores
não serão apagados automaticamente.

Deseja continuar?

    `);


    if (!confirmar) {

        return;

    }


    // =============================================
    // SEGUNDA CONFIRMAÇÃO
    // =============================================

    const confirmacao =
        prompt(`

CONFIRMAÇÃO FINAL

Para apagar esta escola,
escreva exatamente:

APAGAR

Escola:
${nome}

    `);


    if (
        confirmacao !== "APAGAR"
    ) {

        mostrarMensagem(
            "Operação cancelada."
        );

        return;

    }


    // =============================================
    // APAGAR
    // =============================================

    await deleteDoc(

        doc(
            db,
            "escolas",
            id
        )

    );


    mostrarMensagem(
        "Escola apagada com sucesso!"
    );


    carregarEscolas();

}

catch (erro) {

    console.error(
        "ERRO AO APAGAR ESCOLA:",
        erro
    );

    mostrarMensagem(
        "Não foi possível apagar a escola: " +
        erro.message,
        "erro"
    );

}

}

// =====================================================
// OBTER ESCOLA
// =====================================================

async function obterEscola(id) {

const resultado =
    await getDocs(
        collection(
            db,
            "escolas"
        )
    );


let escola = null;


resultado.forEach(
    documento => {

        if (
            documento.id === id
        ) {

            escola = {

                id:
                    documento.id,

                ...documento.data()

            };

        }

    }
);


return escola;

}

// =====================================================
// INICIALIZAÇÃO
// =====================================================

carregarEscolas();
