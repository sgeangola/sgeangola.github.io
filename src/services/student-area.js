/* =====================================================
   SGE ANGOLA — ÁREA DO ALUNO
   student-area.js
   BLOCO 1/4

   FUNÇÕES:
   - Carregamento do módulo
   - Sessão do aluno
   - Perfil
   - Identificação da turma
   - Identificação da escola
   - Nome da escola
   - Utilidades
===================================================== */

alert("✅ BLOCO 1 — student-area.js carregado");

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

console.log("🎓 SGE — BLOCO 1 iniciado");


// =====================================================
// SESSÃO DO ALUNO
// =====================================================

const dadosAluno =
    localStorage.getItem("alunoLogado");


if (!dadosAluno) {

    alert(
        "❌ Sessão do aluno não encontrada.\n\n" +
        "Faça login novamente."
    );

    window.location.href =
        "student-login.html";

    throw new Error(
        "Aluno não autenticado."
    );
}


// =====================================================
// CONVERTER SESSÃO
// =====================================================

let aluno;

try {

    aluno =
        JSON.parse(
            dadosAluno
        );

}
catch (erro) {

    console.error(
        "❌ Erro ao converter alunoLogado:",
        erro
    );

    localStorage.removeItem(
        "alunoLogado"
    );

    window.location.href =
        "student-login.html";

    throw erro;
}


// =====================================================
// CONFIRMAR DADOS PRINCIPAIS
// =====================================================

console.log(
    "======================================"
);

console.log(
    "🎓 ALUNO LOGADO"
);

console.log(
    aluno
);

console.log(
    "ID:",
    aluno.id
);

console.log(
    "Nome:",
    aluno.nome
);

console.log(
    "Código:",
    aluno.codigoAluno
);

console.log(
    "Turma:",
    aluno.turmaNome
);

console.log(
    "Turma ID:",
    aluno.turmaId
);

console.log(
    "Escola ID:",
    aluno.escolaId
);

console.log(
    "======================================"
);


// =====================================================
// ELEMENTOS DO PERFIL
// =====================================================

const nomeElemento =
    document.getElementById(
        "nomeAluno"
    );

const codigoElemento =
    document.getElementById(
        "codigo"
    );

const turmaElemento =
    document.getElementById(
        "turma"
    );

const estadoElemento =
    document.getElementById(
        "estado"
    );


// =====================================================
// PREENCHER PERFIL
// =====================================================

if (nomeElemento) {

    nomeElemento.textContent =
        aluno.nome ||
        "Aluno";

}


if (codigoElemento) {

    codigoElemento.textContent =
        "Código: " +
        (
            aluno.codigoAluno ||
            "—"
        );

}


if (turmaElemento) {

    turmaElemento.textContent =
        "Turma: " +
        (
            aluno.turmaNome ||
            "—"
        );

}


if (estadoElemento) {

    estadoElemento.textContent =
        "Estado: " +
        (
            aluno.estado ||
            "ativo"
        );

}


// =====================================================
// ESCAPAR HTML
// =====================================================

function escaparHTML(valor) {

    return String(
        valor ?? ""
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
// MOSTRAR VALOR DE NOTA
// =====================================================

function mostrarNota(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "—";

    }

    return String(
        valor
    );

}


// =====================================================
// NORMALIZAR TRIMESTRE
// =====================================================

function normalizarTrimestre(
    trimestre
) {

    return String(
        trimestre || ""
    )
    .replace(
        /º|°|ª/g,
        ""
    )
    .replace(
        /Trimestre/gi,
        ""
    )
    .replace(
        /\s+/g,
        ""
    )
    .trim();

}


// =====================================================
// NOME DO TRIMESTRE
// =====================================================

function nomeTrimestre(
    trimestre
) {

    const valor =
        normalizarTrimestre(
            trimestre
        );


    if (valor === "1") {

        return "1.º Trimestre";

    }


    if (valor === "2") {

        return "2.º Trimestre";

    }


    if (valor === "3") {

        return "3.º Trimestre";

    }


    return (
        trimestre ||
        "—"
    );

}


// =====================================================
// NORMALIZAR ANO LETIVO
// =====================================================

function normalizarAnoLetivo(
    ano
) {

    return String(
        ano || ""
    ).trim();

}


// =====================================================
// OBTER ANO LETIVO
// =====================================================

function obterAnoLetivo(
    dados
) {

    if (!dados) {

        return "";

    }


    return (

        dados.anoLetivo ||

        dados.anoLectivo ||

        dados.ano ||

        dados.anoLetivoAtual ||

        ""

    );

}


// =====================================================
// OBTER NOTA
// =====================================================

function obterNota(
    dados,
    campo
) {

    if (!dados) {

        return "";

    }


    const minusculo =
        String(
            campo
        ).toLowerCase();


    const maiusculo =
        String(
            campo
        ).toUpperCase();


    return (

        dados[minusculo] ??

        dados[maiusculo] ??

        dados[
            "nota" +
            maiusculo
        ] ??

        dados[
            "nota" +
            minusculo
        ] ??

        ""

    );

}


// =====================================================
// OBTER DADOS DA ESCOLA
// =====================================================

async function obterDadosEscola() {

    let escolaId =
        String(
            aluno.escolaId || ""
        ).trim();


    // -------------------------------------------------
    // TENTAR OBTER ESCOLA PELA TURMA
    // -------------------------------------------------

    if (
        !escolaId &&
        aluno.turmaId
    ) {

        try {

            const turmaRef =
                doc(
                    db,
                    "turmas",
                    String(
                        aluno.turmaId
                    ).trim()
                );


            const turmaSnap =
                await getDoc(
                    turmaRef
                );


            if (
                turmaSnap.exists()
            ) {

                const dadosTurma =
                    turmaSnap.data();


                escolaId =
                    String(
                        dadosTurma.escolaId ||
                        ""
                    ).trim();

            }

        }
        catch (erro) {

            console.error(
                "❌ Erro ao procurar escola pela turma:",
                erro
            );

        }

    }


    // -------------------------------------------------
    // ESCOLA NÃO IDENTIFICADA
    // -------------------------------------------------

    if (!escolaId) {

        return {

            id: "",

            nome: "Escola",

            logo: ""

        };

    }


    // -------------------------------------------------
    // PROCURAR ESCOLA
    // -------------------------------------------------

    try {

        const escolaRef =
            doc(
                db,
                "escolas",
                escolaId
            );


        const escolaSnap =
            await getDoc(
                escolaRef
            );


        if (
            escolaSnap.exists()
        ) {

            const dados =
                escolaSnap.data();


            return {

                id: escolaId,

                nome:
                    dados.nome ||
                    "Escola",

                logo:
                    dados.logo ||
                    dados.logoUrl ||
                    ""

            };

        }

    }
    catch (erro) {

        console.error(
            "❌ Erro ao carregar escola:",
            erro
        );

    }


    return {

        id: escolaId,

        nome: "Escola",

        logo: ""

    };

}


// =====================================================
// MOSTRAR NOME DA ESCOLA
// =====================================================

async function carregarNomeEscola() {

    try {

        const escola =
            await obterDadosEscola();


        console.log(
            "🏫 ESCOLA:",
            escola
        );


        const elementos =
            document.querySelectorAll(
                "[data-nome-escola]"
            );


        elementos.forEach(
            elemento => {

                elemento.textContent =
                    escola.nome;

            }
        );


        const nomeEscola =
            document.getElementById(
                "nomeEscola"
            );


        if (nomeEscola) {

            nomeEscola.textContent =
                escola.nome;

        }


        const logoEscola =
            document.getElementById(
                "logoEscola"
            );


        if (
            logoEscola &&
            escola.logo
        ) {

            logoEscola.src =
                escola.logo;

            logoEscola.style.display =
                "block";

        }

    }
    catch (erro) {

        console.error(
            "❌ Erro ao carregar nome da escola:",
            erro
        );

    }

}


// =====================================================
// DOCUMENTO DO ALUNO
// =====================================================

async function obterDocumentoAluno() {

    const turmaId =
        String(
            aluno.turmaId || ""
        ).trim();


    const alunoId =
        String(
            aluno.id || ""
        ).trim();


    if (
        !turmaId ||
        !alunoId
    ) {

        throw new Error(
            "Não foi possível identificar o aluno."
        );

    }


    const referencia =
        doc(
            db,
            "turmas",
            turmaId,
            "alunos",
            alunoId
        );


    const snapshot =
        await getDoc(
            referencia
        );


    if (
        !snapshot.exists()
    ) {

        throw new Error(
            "Documento do aluno não encontrado."
        );

    }


    return {

        referencia,

        dados:
            snapshot.data()

    };

}


// =====================================================
// ALTERAR SENHA
// =====================================================

window.alterarSenha =
async function () {

    const antiga =
        prompt(
            "🔐 ALTERAR SENHA\n\n" +
            "Digite a senha atual:"
        );


    if (
        antiga === null
    ) {

        return;

    }


    try {

        const documento =
            await obterDocumentoAluno();


        const senhaAtual =
            String(
                documento.dados.senha || ""
            );


        if (
            antiga !== senhaAtual
        ) {

            alert(
                "❌ A senha atual está incorreta."
            );

            return;

        }


        const novaSenha =
            prompt(
                "Digite a nova senha:"
            );


        if (
            novaSenha === null
        ) {

            return;

        }


        if (
            novaSenha.trim().length < 4
        ) {

            alert(
                "❌ A nova senha deve ter pelo menos 4 caracteres."
            );

            return;

        }


        const confirmar =
            prompt(
                "Digite novamente a nova senha:"
            );


        if (
            confirmar !== novaSenha
        ) {

            alert(
                "❌ As senhas não coincidem."
            );

            return;

        }


        await updateDoc(
            documento.referencia,
            {

                senha:
                    novaSenha.trim()

            }
        );


        aluno.senha =
            novaSenha.trim();


        localStorage.setItem(
            "alunoLogado",
            JSON.stringify(
                aluno
            )
        );


        alert(
            "✅ Senha alterada com sucesso!"
        );

    }
    catch (erro) {

        console.error(
            "❌ Erro ao alterar senha:",
            erro
        );


        alert(
            "❌ Não foi possível alterar a senha.\n\n" +
            erro.message
        );

    }

};


// =====================================================
// SAIR
// =====================================================

window.sairAluno =
function () {

    const confirmar =
        confirm(
            "Deseja realmente sair da Área do Aluno?"
        );


    if (!confirmar) {

        return;

    }


    localStorage.removeItem(
        "alunoLogado"
    );


    window.location.href =
        "student-login.html";

};


// =====================================================
// INICIALIZAÇÃO DO BLOCO 1
// =====================================================

carregarNomeEscola();

console.log(
    "✅ BLOCO 1/4 concluído."
);

alert(
    "✅ BLOCO 1/4 funcionando!"
);

/* =====================================================
   SGE ANGOLA — ÁREA DO ALUNO
   BLOCO 2/4

   - Carregar dados da turma
   - Obter ano letivo
   - Verificar anos disponíveis
   - Preparar acesso às notas
===================================================== */


// =====================================================
// DADOS DA TURMA
// =====================================================

let dadosTurmaAluno = null;

let anoLetivoAluno = "";


// =====================================================
// CARREGAR TURMA DO ALUNO
// =====================================================

async function carregarTurmaAluno() {

    try {

        const turmaId =
            String(
                aluno.turmaId || ""
            ).trim();


        if (!turmaId) {

            throw new Error(
                "O aluno não possui turmaId."
            );

        }


        const turmaRef =
            doc(
                db,
                "turmas",
                turmaId
            );


        const turmaSnap =
            await getDoc(
                turmaRef
            );


        if (!turmaSnap.exists()) {

            throw new Error(
                "A turma do aluno não foi encontrada."
            );

        }


        dadosTurmaAluno =
            turmaSnap.data();


        console.log(
            "🏫 DADOS DA TURMA:",
            dadosTurmaAluno
        );


        // =================================================
        // ANO LETIVO
        // =================================================

        anoLetivoAluno =
            String(
                dadosTurmaAluno.anoLetivo ||
                dadosTurmaAluno.anoLectivo ||
                dadosTurmaAluno.ano ||
                ""
            ).trim();


        console.log(
            "📅 ANO LETIVO DO ALUNO:",
            anoLetivoAluno
        );


        if (!anoLetivoAluno) {

            throw new Error(
                "A turma não possui ano letivo definido."
            );

        }


        return dadosTurmaAluno;

    }
    catch (erro) {

        console.error(
            "❌ Erro ao carregar turma:",
            erro
        );

        throw erro;

    }

}


// =====================================================
// OBTER NOTAS DO ALUNO
// =====================================================

async function obterNotasAluno() {

    try {

        await carregarTurmaAluno();


        const turmaId =
            String(
                aluno.turmaId
            ).trim();


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "notas"
                )
            );


        const notasEncontradas = [];


        snapshot.forEach(
            documento => {

                const dados =
                    documento.data();


                // -----------------------------------------
                // VERIFICAR TURMA
                // -----------------------------------------

                if (
                    String(
                        dados.turmaId || ""
                    ).trim() !== turmaId
                ) {

                    return;

                }


                // -----------------------------------------
                // VERIFICAR ANO LETIVO
                // -----------------------------------------

                const ano =
                    String(
                        dados.anoLetivo ||
                        dados.anoLectivo ||
                        dados.ano ||
                        ""
                    ).trim();


                if (
                    ano &&
                    ano !== anoLetivoAluno
                ) {

                    return;

                }


                notasEncontradas.push({

                    id:
                        documento.id,

                    ...dados

                });

            }
        );


        console.log(
            "📚 NOTAS ENCONTRADAS:",
            notasEncontradas
        );


        return notasEncontradas;

    }
    catch (erro) {

        console.error(
            "❌ Erro ao procurar notas:",
            erro
        );

        throw erro;

    }

}


// =====================================================
// VER NOTAS
// =====================================================

window.verNotas =
async function () {

    try {

        // ---------------------------------------------
        // CARREGAR TURMA
        // ---------------------------------------------

        await carregarTurmaAluno();


        // ---------------------------------------------
        // CONFIRMAR ANO
        // ---------------------------------------------

        if (!anoLetivoAluno) {

            alert(
                "⚠️ A turma ainda não possui ano letivo definido."
            );

            return;

        }


        // ---------------------------------------------
        // PROCURAR NOTAS
        // ---------------------------------------------

        const notas =
            await obterNotasAluno();


        // ---------------------------------------------
        // TESTE
        // ---------------------------------------------

        if (
            notas.length === 0
        ) {

            alert(
                "📚 VER NOTAS\n\n" +

                "Aluno: " +
                (
                    aluno.nome ||
                    "—"
                ) +

                "\n\nTurma: " +
                (
                    dadosTurmaAluno.nome ||
                    aluno.turmaNome ||
                    "—"
                ) +

                "\n\nAno letivo: " +
                anoLetivoAluno +

                "\n\n⚠️ Ainda não existem notas lançadas para esta turma."
            );

            return;

        }


        alert(
            "✅ NOTAS ENCONTRADAS!\n\n" +

            "Ano letivo: " +
            anoLetivoAluno +

            "\n\nQuantidade de lançamentos: " +
            notas.length
        );


        console.log(
            "📊 LANÇAMENTOS:",
            notas
        );

    }
    catch (erro) {

        console.error(
            "❌ ERRO AO VER NOTAS:",
            erro
        );


        alert(
            "❌ Não foi possível carregar as notas.\n\n" +
            erro.message
        );

    }

};


// =====================================================
// INICIALIZAR BLOCO 2
// =====================================================

carregarTurmaAluno()
    .then(
        () => {

            console.log(
                "✅ BLOCO 2/4 — TURMA CARREGADA"
            );

            console.log(
                "📅 Ano letivo:",
                anoLetivoAluno
            );

        }
    )
    .catch(
        erro => {

            console.error(
                "❌ BLOCO 2:",
                erro
            );

        }
    );

// =====================================================
// SGE ANGOLA — ÁREA DO ALUNO
// student-area.js
// BLOCO 2/4
//
// VER NOTAS
// - Seleção do ano letivo
// - Seleção do trimestre
// - Verificação financeira
// - Preparação para carregar notas
//
// IMPORTANTE:
// Este bloco NÃO altera o Bloco 1.
// =====================================================


// =====================================================
// NORMALIZAR TEXTO
// =====================================================

function normalizarTexto(valor) {

    return String(valor ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


// =====================================================
// NORMALIZAR ANO LETIVO
// =====================================================

function normalizarAno(valor) {

    return String(valor ?? "")
        .trim();

}


// =====================================================
// NORMALIZAR TRIMESTRE
// =====================================================

function normalizarTrimestreAluno(valor) {

    const texto =
        String(valor ?? "")
            .trim()
            .replace(/º|°|ª/g, "")
            .replace(/trimestre/gi, "")
            .replace(/\s+/g, "");

    if (texto === "1")
        return "1";

    if (texto === "2")
        return "2";

    if (texto === "3")
        return "3";

    return texto;

}


// =====================================================
// NOME DO TRIMESTRE
// =====================================================

function nomeTrimestreAluno(valor) {

    const trimestre =
        normalizarTrimestreAluno(valor);

    if (trimestre === "1")
        return "1.º Trimestre";

    if (trimestre === "2")
        return "2.º Trimestre";

    if (trimestre === "3")
        return "3.º Trimestre";

    return String(valor || "Trimestre");

}


// =====================================================
// OBTER ANO DO ALUNO
// =====================================================

function obterAnoAluno() {

    return normalizarAno(

        aluno.anoLetivo ||

        aluno.anoLectivo ||

        aluno.ano ||

        aluno.anoLetivoAtual ||

        ""

    );

}


// =====================================================
// PROCURAR ANOS LETIVOS NAS NOTAS
//
// Procuramos documentos da coleção "notas"
// associados à turma do aluno.
//
// NÃO mostramos "não existem anos" imediatamente.
// Se não houver documentos, usamos o ano do aluno.
// =====================================================

async function obterAnosParaNotas() {

    const turmaId =
        String(
            aluno.turmaId || ""
        ).trim();


    if (!turmaId) {

        throw new Error(
            "A turma do aluno não foi identificada."
        );

    }


    const anos =
        new Set();


    try {

        const notasSnapshot =
            await getDocs(
                collection(
                    db,
                    "notas"
                )
            );


        notasSnapshot.forEach(
            documento => {

                const dados =
                    documento.data() || {};


                const turmaNota =
                    String(
                        dados.turmaId || ""
                    ).trim();


                if (
                    turmaNota &&
                    turmaNota !== turmaId
                ) {

                    return;

                }


                const ano =
                    normalizarAno(

                        dados.anoLetivo ||

                        dados.anoLectivo ||

                        dados.ano ||

                        dados.anoLetivoAtual ||

                        ""

                    );


                if (ano) {

                    anos.add(
                        ano
                    );

                }

            }
        );

    }
    catch (erro) {

        console.error(
            "❌ Erro ao procurar anos nas notas:",
            erro
        );

    }


    // -------------------------------------------------
    // SE O FIRESTORE NÃO TIVER O ANO,
    // USAR O ANO GUARDADO NA SESSÃO DO ALUNO
    // -------------------------------------------------

    const anoAluno =
        obterAnoAluno();


    if (anoAluno) {

        anos.add(
            anoAluno
        );

    }


    // -------------------------------------------------
    // ORDENAR DO MAIS RECENTE PARA O MAIS ANTIGO
    // -------------------------------------------------

    return Array.from(
        anos
    ).sort(
        (a, b) =>
            b.localeCompare(a)
    );

}


// =====================================================
// CRIAR JANELA DE SELEÇÃO
// =====================================================

function criarJanelaSelecaoNotas(
    anos
) {

    const antiga =
        document.getElementById(
            "janelaSelecaoNotas"
        );


    if (antiga) {

        antiga.remove();

    }


    const opcoesAno =
        anos.length

            ? anos.map(
                ano => `
                    <option value="${escaparHTML(ano)}">
                        ${escaparHTML(ano)}
                    </option>
                `
            ).join("")

            : `
                <option value="">
                    Nenhum ano letivo disponível
                </option>
            `;


    const html = `

        <div
            id="janelaSelecaoNotas"
            style="
                position:fixed;
                inset:0;
                z-index:999999;
                background:#f1f5f9;
                overflow:auto;
                padding:20px;
            "
        >

            <div
                style="
                    width:100%;
                    max-width:500px;
                    margin:40px auto;
                    background:white;
                    border-radius:18px;
                    padding:25px;
                    box-shadow:0 5px 20px rgba(0,0,0,.15);
                "
            >

                <div
                    style="
                        text-align:center;
                        font-size:45px;
                        margin-bottom:10px;
                    "
                >
                    📊
                </div>


                <h2
                    style="
                        text-align:center;
                        color:#1e3a8a;
                        margin-top:0;
                    "
                >
                    Ver Notas
                </h2>


                <p
                    style="
                        text-align:center;
                        color:#64748b;
                        margin-bottom:25px;
                    "
                >
                    Selecione o ano letivo e o trimestre.
                </p>


                <label
                    style="
                        display:block;
                        margin-bottom:7px;
                        font-weight:bold;
                    "
                >
                    Ano Letivo
                </label>


                <select
                    id="anoNotasAluno"
                    style="
                        width:100%;
                        padding:13px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
                        margin-bottom:18px;
                        font-size:16px;
                        background:white;
                    "
                >

                    ${opcoesAno}

                </select>


                <label
                    style="
                        display:block;
                        margin-bottom:7px;
                        font-weight:bold;
                    "
                >
                    Trimestre
                </label>


                <select
                    id="trimestreNotasAluno"
                    style="
                        width:100%;
                        padding:13px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
                        margin-bottom:20px;
                        font-size:16px;
                        background:white;
                    "
                >

                    <option value="">
                        Selecionar trimestre
                    </option>

                    <option value="1">
                        1.º Trimestre
                    </option>

                    <option value="2">
                        2.º Trimestre
                    </option>

                    <option value="3">
                        3.º Trimestre
                    </option>

                </select>


                <button
                    id="confirmarSelecaoNotas"
                    type="button"
                    style="
                        width:100%;
                        padding:14px;
                        border:none;
                        border-radius:10px;
                        background:#1e3a8a;
                        color:white;
                        font-size:16px;
                        cursor:pointer;
                    "
                >
                    🔎 Continuar
                </button>


                <button
                    id="fecharSelecaoNotas"
                    type="button"
                    style="
                        width:100%;
                        padding:13px;
                        margin-top:10px;
                        border:none;
                        border-radius:10px;
                        background:#e2e8f0;
                        color:#334155;
                        font-size:16px;
                        cursor:pointer;
                    "
                >
                    ← Voltar
                </button>

            </div>

        </div>

    `;


    document.body.insertAdjacentHTML(
        "beforeend",
        html
    );


    document
        .getElementById(
            "fecharSelecaoNotas"
        )
        ?.addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "janelaSelecaoNotas"
                    )
                    ?.remove();

            }
        );


    document
        .getElementById(
            "confirmarSelecaoNotas"
        )
        ?.addEventListener(
            "click",
            async function () {

                const ano =
                    document
                        .getElementById(
                            "anoNotasAluno"
                        )
                        ?.value;


                const trimestre =
                    document
                        .getElementById(
                            "trimestreNotasAluno"
                        )
                        ?.value;


                if (!ano) {

                    alert(
                        "❌ Selecione o ano letivo."
                    );

                    return;

                }


                if (!trimestre) {

                    alert(
                        "❌ Selecione o trimestre."
                    );

                    return;

                }


                await processarSelecaoNotas(
                    ano,
                    trimestre
                );

            }
        );

}


// =====================================================
// VERIFICAR SITUAÇÃO FINANCEIRA
//
// IMPORTANTE:
// Aqui NÃO vamos inventar uma coleção financeira.
// Primeiro procuramos os dados financeiros existentes
// no documento do aluno.
//
// Se o documento tiver campos financeiros conhecidos,
// eles serão analisados.
// =====================================================

async function verificarSituacaoFinanceira(
    ano,
    trimestre
) {

    console.log(
        "💰 Verificando situação financeira:",
        {
            ano,
            trimestre
        }
    );


    try {

        const documento =
            await obterDocumentoAluno();


        const dadosAlunoFirestore =
            documento.dados || {};


        console.log(
            "💰 DADOS FINANCEIROS DO ALUNO:",
            dadosAlunoFirestore
        );


        // -------------------------------------------------
        // CAMPOS DIRETOS DE ESTADO
        // -------------------------------------------------

        const camposEstado = [

            "situacaoFinanceira",

            "situacao_financeira",

            "estadoFinanceiro",

            "estado_financeiro",

            "financeiro",

            "pagamento",

            "statusPagamento",

            "estadoPagamento",

            "mensalidade",

            "propina"

        ];


        for (
            const campo
            of camposEstado
        ) {

            if (
                dadosAlunoFirestore[campo] !==
                undefined &&
                dadosAlunoFirestore[campo] !==
                null
            ) {

                const valor =
                    dadosAlunoFirestore[campo];


                console.log(
                    "💰 Campo financeiro encontrado:",
                    campo,
                    valor
                );


                if (
                    typeof valor === "object" &&
                    !Array.isArray(valor)
                ) {

                    const resultado =
                        analisarObjetoFinanceiro(
                            valor,
                            ano,
                            trimestre
                        );


                    if (
                        resultado !== null
                    ) {

                        return resultado;

                    }

                }


                const resultado =
                    interpretarEstadoPagamento(
                        valor
                    );


                if (
                    resultado !== null
                ) {

                    return resultado;

                }

            }

        }


        // -------------------------------------------------
        // CAMPOS DE PAGAMENTO DENTRO DO ALUNO
        // -------------------------------------------------

        const possiveisPagamentos = [

            dadosAlunoFirestore.pagamentos,

            dadosAlunoFirestore.pagamentosPorAno,

            dadosAlunoFirestore.financeiroPorAno,

            dadosAlunoFirestore.mensalidades

        ];


        for (
            const pagamentos
            of possiveisPagamentos
        ) {

            if (!pagamentos)
                continue;


            const resultado =
                analisarObjetoFinanceiro(
                    pagamentos,
                    ano,
                    trimestre
                );


            if (
                resultado !== null
            ) {

                return resultado;

            }

        }


    }
    catch (erro) {

        console.error(
            "❌ Erro ao verificar situação financeira:",
            erro
        );

    }


    // -------------------------------------------------
    // ATENÇÃO:
    // Se ainda não encontrarmos a estrutura financeira,
    // NÃO vamos bloquear definitivamente nesta fase.
    //
    // Retornamos "desconhecido" para podermos identificar
    // a estrutura real no teste.
    // -------------------------------------------------

    return {

        pago: null,

        encontrado: false,

        mensagem:
            "Situação financeira não identificada."

    };

}


// =====================================================
// ANALISAR OBJETO FINANCEIRO
// =====================================================

function analisarObjetoFinanceiro(
    objeto,
    ano,
    trimestre
) {

    if (
        !objeto ||
        typeof objeto !== "object"
    ) {

        return null;

    }


    // -------------------------------------------------
    // PROCURAR PELO ANO
    // -------------------------------------------------

    const anoChave =
        Object.keys(objeto)
            .find(
                chave =>
                    normalizarAno(chave) ===
                    normalizarAno(ano)
            );


    if (anoChave) {

        const dadosAno =
            objeto[anoChave];


        // ---------------------------------------------
        // SE FOR UM ESTADO DIRETO
        // ---------------------------------------------

        const estado =
            interpretarEstadoPagamento(
                dadosAno
            );


        if (
            estado !== null
        ) {

            return {

                pago: estado,

                encontrado: true

            };

        }


        // ---------------------------------------------
        // PROCURAR TRIMESTRE
        // ---------------------------------------------

        if (
            dadosAno &&
            typeof dadosAno === "object"
        ) {

            const chavesTrimestre =
                Object.keys(
                    dadosAno
                );


            for (
                const chave
                of chavesTrimestre
            ) {

                if (
                    normalizarTrimestreAluno(
                        chave
                    ) ===
                    normalizarTrimestreAluno(
                        trimestre
                    )
                ) {

                    const resultado =
                        interpretarEstadoPagamento(
                            dadosAno[chave]
                        );


                    if (
                        resultado !== null
                    ) {

                        return {

                            pago: resultado,

                            encontrado: true

                        };

                    }

                }

            }

        }

    }


    return null;

}


// =====================================================
// INTERPRETAR ESTADO DE PAGAMENTO
// =====================================================

function interpretarEstadoPagamento(
    valor
) {

    if (
        typeof valor === "boolean"
    ) {

        return valor;

    }


    if (
        typeof valor === "number"
    ) {

        return valor > 0;

    }


    if (
        typeof valor !== "string"
    ) {

        return null;

    }


    const texto =
        normalizarTexto(
            valor
        );


    if (
        [
            "pago",
            "pagamento pago",
            "regular",
            "ativo",
            "quitado",
            "liquidado",
            "sim",
            "true"
        ].includes(texto)
    ) {

        return true;

    }


    if (
        [
            "nao pago",
            "não pago",
            "pendente",
            "em atraso",
            "atrasado",
            "em divida",
            "divida",
            "devedor",
            "bloqueado",
            "nao",
            "false"
        ].includes(texto)
    ) {

        return false;

    }


    return null;

}


// =====================================================
// PROCESSAR SELEÇÃO
// =====================================================

async function processarSelecaoNotas(
    ano,
    trimestre
) {

    const botao =
        document.getElementById(
            "confirmarSelecaoNotas"
        );


    if (botao) {

        botao.disabled =
            true;

        botao.textContent =
            "⏳ A verificar...";

    }


    try {

        const resultadoFinanceiro =
            await verificarSituacaoFinanceira(
                ano,
                trimestre
            );


        console.log(
            "💰 RESULTADO FINANCEIRO:",
            resultadoFinanceiro
        );


        // -------------------------------------------------
        // NÃO IDENTIFICADO
       // =====================================================
    
        if (
            resultadoFinanceiro.pago === null
        ) {

            alert(
                "⚠️ Não foi possível identificar a situação financeira deste aluno.\n\n" +
                "O acesso às notas não será aberto até a situação financeira ser confirmada."
            );

            return;

        }


        // -------------------------------------------------
        // NÃO PAGO
        // -------------------------------------------------

        if (
            resultadoFinanceiro.pago !== true
        ) {

            alert(
                "🔒 Acesso às notas bloqueado.\n\n" +
                "O pagamento referente ao período selecionado não está regularizado."
            );

            return;

        }


        // -------------------------------------------------
        // PAGO
        // -------------------------------------------------

        document
            .getElementById(
                "janelaSelecaoNotas"
            )
            ?.remove();


        alert(
            "✅ Pagamento confirmado.\n\n" +
            `${ano} — ${nomeTrimestreAluno(trimestre)}\n\n` +
            "A carregar notas..."
        );


        // -------------------------------------------------
        // AQUI ENTRARÁ O CARREGAMENTO DAS NOTAS
        // NO PRÓXIMO BLOCO.
        // -------------------------------------------------

        console.log(
            "📊 ACESSO ÀS NOTAS LIBERADO:",
            {
                ano,
                trimestre
            }
        );


        localStorage.setItem(
            "notasAnoSelecionado",
            String(ano)
        );


        localStorage.setItem(
            "notasTrimestreSelecionado",
            String(trimestre)
        );


    }
    catch (erro) {

        console.error(
            "❌ Erro ao processar notas:",
            erro
        );


        alert(
            "❌ Ocorreu um erro ao verificar o acesso às notas.\n\n" +
            erro.message
        );

    }
    finally {

        if (botao) {

            botao.disabled =
                false;

            botao.textContent =
                "🔎 Continuar";

        }

    }

}


// =====================================================
// VER NOTAS
// =====================================================

console.log(
    "✅ BLOCO 2/4 — VER NOTAS carregado."
);

/* =====================================================
   SGE ANGOLA — ÁREA DO ALUNO
   student-area.js
   BLOCO 3/4

   FUNÇÕES:
   - Situação financeira do aluno
   - Verificação de pagamento por trimestre
   - Ver Notas
   - Seleção de ano letivo
   - Seleção de trimestre
   - Preparação para boletim
===================================================== */


console.log("📚 SGE — BLOCO 3 iniciado");


// =====================================================
// CONFIGURAÇÃO FINANCEIRA
// =====================================================

let dadosFinanceiros = null;


// =====================================================
// OBTER ID FINANCEIRO
//
// A Área Financeira utiliza:
//
// financeiro/{escolaId}_{alunoId}
//
// =====================================================

function obterIdFinanceiroAluno() {

    const escolaId =
        String(
            aluno.escolaId || ""
        ).trim();

    const alunoId =
        String(
            aluno.id || ""
        ).trim();


    if (
        !escolaId ||
        !alunoId
    ) {

        console.error(
            "❌ Não foi possível criar o ID financeiro."
        );

        console.log(
            "Escola ID:",
            escolaId
        );

        console.log(
            "Aluno ID:",
            alunoId
        );

        return "";

    }


    return `${escolaId}_${alunoId}`;

}


// =====================================================
// CARREGAR SITUAÇÃO FINANCEIRA
// =====================================================

async function carregarSituacaoFinanceira() {

    try {

        const financeiroId =
            obterIdFinanceiroAluno();


        if (!financeiroId) {

            console.warn(
                "⚠️ ID financeiro não identificado."
            );

            dadosFinanceiros = {

                "1trimestre": {
                    pago: false
                },

                "2trimestre": {
                    pago: false
                },

                "3trimestre": {
                    pago: false
                }

            };

            return dadosFinanceiros;

        }


        console.log(
            "💰 ID FINANCEIRO:",
            financeiroId
        );


        const referencia =
            doc(
                db,
                "financeiro",
                financeiroId
            );


        const snapshot =
            await getDoc(
                referencia
            );


        if (
            !snapshot.exists()
        ) {

            console.log(
                "ℹ️ Ainda não existe documento financeiro para este aluno."
            );


            dadosFinanceiros = {

                alunoId:
                    aluno.id,

                "1trimestre": {
                    pago: false
                },

                "2trimestre": {
                    pago: false
                },

                "3trimestre": {
                    pago: false
                },

                comunicado:
                    ""

            };


            return dadosFinanceiros;

        }


        dadosFinanceiros =
            snapshot.data();


        console.log(
            "💰 DADOS FINANCEIROS:",
            dadosFinanceiros
        );


        return dadosFinanceiros;

    }
    catch (erro) {

        console.error(
            "❌ Erro ao carregar situação financeira:",
            erro
        );


        dadosFinanceiros = {

            "1trimestre": {
                pago: false
            },

            "2trimestre": {
                pago: false
            },

            "3trimestre": {
                pago: false
            }

        };


        return dadosFinanceiros;

    }

}


// =====================================================
// VERIFICAR PAGAMENTO DO TRIMESTRE
// =====================================================

function trimestrePago(
    trimestre
) {

    if (
        !dadosFinanceiros
    ) {

        return false;

    }


    const numero =
        normalizarTrimestre(
            trimestre
        );


    const chave =
        `${numero}trimestre`;


    const dados =
        dadosFinanceiros[
            chave
        ];


    return (
        dados?.pago === true
    );

}


// =====================================================
// TEXTO DA SITUAÇÃO FINANCEIRA
// =====================================================

function mensagemFinanceira(
    trimestre
) {

    const numero =
        normalizarTrimestre(
            trimestre
        );


    const nome =
        nomeTrimestre(
            numero
        );


    return (
        "🔒 O acesso às notas do " +
        nome +
        " está bloqueado.\n\n" +

        "A situação financeira deste " +
        "trimestre ainda não está regularizada.\n\n" +

        "Entre em contacto com a secretaria da escola."
    );

}


// =====================================================
// VERIFICAR SE O ALUNO PODE VER O TRIMESTRE
// =====================================================

function podeVerTrimestre(
    trimestre
) {

    return trimestrePago(
        trimestre
    );

}


// =====================================================
// OBTER ANOS LETIVOS DAS NOTAS
// =====================================================

async function obterAnosLetivosNotas() {

    try {

        const turmaId =
            String(
                aluno.turmaId || ""
            ).trim();


        if (!turmaId) {

            throw new Error(
                "Turma do aluno não identificada."
            );

        }


        console.log(
            "📚 Procurando notas da turma:",
            turmaId
        );


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "notas"
                )
            );


        const anos =
            new Set();


        snapshot.forEach(
            documento => {

                const dados =
                    documento.data();


                /*
                Verificar turma.
                */

                const turmaNota =
                    String(
                        dados.turmaId || ""
                    ).trim();


                if (
                    turmaNota &&
                    turmaNota !== turmaId
                ) {

                    return;

                }


                /*
                Obter ano letivo.
                */

                const ano =
                    obterAnoLetivo(
                        dados
                    );


                if (ano) {

                    anos.add(
                        normalizarAnoLetivo(
                            ano
                        )
                    );

                }

            }
        );


        /*
        Se não encontrou através
        do campo turmaId, verificar
        o ano da turma do aluno.
        */

        if (
            anos.size === 0
        ) {

            try {

                const turmaSnap =
                    await getDoc(
                        doc(
                            db,
                            "turmas",
                            turmaId
                        )
                    );


                if (
                    turmaSnap.exists()
                ) {

                    const turma =
                        turmaSnap.data();


                    const anoTurma =
                        obterAnoLetivo(
                            turma
                        );


                    if (
                        anoTurma
                    ) {

                        anos.add(
                            normalizarAnoLetivo(
                                anoTurma
                            )
                        );

                    }

                }

            }
            catch (erro) {

                console.warn(
                    "⚠️ Não foi possível obter ano pela turma:",
                    erro
                );

            }

        }


        const resultado =
            Array.from(
                anos
            )
            .filter(
                ano => ano !== ""
            )
            .sort(
                (a, b) =>
                    b.localeCompare(
                        a
                    )
            );


        console.log(
            "📅 ANOS LETIVOS ENCONTRADOS:",
            resultado
        );


        return resultado;

    }
    catch (erro) {

        console.error(
            "❌ Erro ao procurar anos letivos:",
            erro
        );


        return [];

    }

}


// =====================================================
// PROCURAR NOTAS DO ALUNO
// =====================================================

async function procurarNotasAluno(
    anoLetivo,
    trimestre
) {

    const turmaId =
        String(
            aluno.turmaId || ""
        ).trim();


    const alunoId =
        String(
            aluno.id || ""
        ).trim();


    const trimestreNormalizado =
        normalizarTrimestre(
            trimestre
        );


    if (
        !turmaId ||
        !alunoId
    ) {

        throw new Error(
            "Dados do aluno ou da turma não identificados."
        );

    }


    console.log(
        "🔎 PROCURAR NOTAS"
    );

    console.log(
        "Turma:",
        turmaId
    );

    console.log(
        "Aluno:",
        alunoId
    );

    console.log(
        "Ano:",
        anoLetivo
    );

    console.log(
        "Trimestre:",
        trimestreNormalizado
    );


    const snapshot =
        await getDocs(
            collection(
                db,
                "notas"
            )
        );


    const resultados = [];


    snapshot.forEach(
        documento => {

            const dados =
                documento.data();


            /*
            Verificar turma.
            */

            if (
                dados.turmaId &&
                String(
                    dados.turmaId
                ).trim() !== turmaId
            ) {

                return;

            }


            /*
            Verificar ano letivo,
            quando existir.
            */

            const ano =
                normalizarAnoLetivo(
                    obterAnoLetivo(
                        dados
                    )
                );


            if (
                ano &&
                anoLetivo &&
                ano !==
                String(
                    anoLetivo
                ).trim()
            ) {

                return;

            }


            /*
            Verificar trimestre.
            */

            const trimestreDados =
                normalizarTrimestre(
                    dados.trimestre ||
                    dados.Trimestre ||
                    dados.periodo ||
                    dados.Periodo ||
                    ""
                );


            if (
                trimestreDados &&
                trimestreDados !==
                trimestreNormalizado
            ) {

                return;

            }


            /*
            Procurar aluno dentro
            do array de alunos.
            */

            if (
                !Array.isArray(
                    dados.alunos
                )
            ) {

                return;

            }


            dados.alunos.forEach(
                notaAluno => {

                    const id =
                        String(
                            notaAluno.id ||
                            notaAluno.alunoId ||
                            ""
                        ).trim();


                    if (
                        id !== alunoId
                    ) {

                        return;

                    }


                    resultados.push({

                        documentoId:
                            documento.id,

                        dados:
                            notaAluno,

                        documento:
                            dados

                    });

                }
            );

        }
    );


    console.log(
        "📊 RESULTADOS DE NOTAS:",
        resultados
    );


    return resultados;

}


// =====================================================
// MOSTRAR JANELA DE NOTAS
// =====================================================

async function mostrarNotas(
    anoLetivo,
    trimestre
) {

    const antigo =
        document.getElementById(
            "janelaNotasAluno"
        );


    if (antigo) {

        antigo.remove();

    }


    const numeroTrimestre =
        normalizarTrimestre(
            trimestre
        );


    /*
    =============================================
    VERIFICAR FINANCEIRO
    =============================================
    */

    if (
        !podeVerTrimestre(
            numeroTrimestre
        )
    ) {

        alert(
            mensagemFinanceira(
                numeroTrimestre
            )
        );

        return;

    }


    /*
    =============================================
    CARREGAR NOTAS
    =============================================
    */

    let resultados = [];


    try {

        resultados =
            await procurarNotasAluno(
                anoLetivo,
                numeroTrimestre
            );

    }
    catch (erro) {

        console.error(
            "❌ Erro ao procurar notas:",
            erro
        );


        alert(
            "❌ Não foi possível carregar as notas.\n\n" +
            erro.message
        );

        return;

    }


    /*
    =============================================
    CRIAR JANELA
    =============================================
    */

    const html = `

        <div
            id="janelaNotasAluno"
            style="
                position:fixed;
                inset:0;
                z-index:99999;
                background:#f1f5f9;
                overflow-y:auto;
                padding:20px;
            "
        >

            <div
                style="
                    max-width:700px;
                    margin:20px auto;
                    background:white;
                    border-radius:16px;
                    padding:20px;
                    box-shadow:0 4px 15px rgba(0,0,0,.15);
                "
            >

                <div
                    style="
                        text-align:center;
                        font-size:45px;
                    "
                >
                    📊
                </div>


                <h2
                    style="
                        text-align:center;
                        color:#1e3a8a;
                    "
                >
                    Minhas Notas
                </h2>


                <p
                    style="
                        text-align:center;
                        color:#64748b;
                    "
                >
                    ${escaparHTML(
                        nomeTrimestre(
                            numeroTrimestre
                        )
                    )}
                    <br>
                    Ano letivo:
                    ${escaparHTML(
                        anoLetivo
                    )}
                </p>


                ${
                    resultados.length === 0

                    ?

                    `
                    <div
                        style="
                            padding:20px;
                            text-align:center;
                            background:#f8fafc;
                            border-radius:10px;
                        "
                    >
                        📭 Ainda não existem notas
                        lançadas para este período.
                    </div>
                    `

                    :

                    `
                    <div
                        style="
                            overflow-x:auto;
                        "
                    >

                        <table
                            style="
                                width:100%;
                                border-collapse:collapse;
                            "
                        >

                            <thead>

                                <tr
                                    style="
                                        background:#1e3a8a;
                                        color:white;
                                    "
                                >

                                    <th
                                        style="
                                            padding:10px;
                                        "
                                    >
                                        Disciplina
                                    </th>

                                    <th
                                        style="
                                            padding:10px;
                                        "
                                    >
                                        MAC
                                    </th>

                                    <th
                                        style="
                                            padding:10px;
                                        "
                                    >
                                        NPT
                                    </th>

                                    <th
                                        style="
                                            padding:10px;
                                        "
                                    >
                                        MF
                                    </th>

                                    <th
                                        style="
                                            padding:10px;
                                        "
                                    >
                                        Classificação
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                ${
                                    resultados.map(
                                        item => {

                                            const dados =
                                                item.dados;

                                            const documento =
                                                item.documento;


                                            const disciplina =
                                                dados.disciplina ||
                                                dados.Disciplina ||
                                                documento.disciplina ||
                                                documento.Disciplina ||
                                                "—";


                                            const mac =
                                                obterNota(
                                                    dados,
                                                    "mac"
                                                );


                                            const npt =
                                                obterNota(
                                                    dados,
                                                    "npt"
                                                );


                                            const mf =
                                                obterNota(
                                                    dados,
                                                    "mf"
                                                );


                                            const classificacao =
                                                dados.classificacao ||
                                                dados.Classificacao ||
                                                "—";


                                            return `

                                                <tr>

                                                    <td
                                                        style="
                                                            padding:10px;
                                                            border-bottom:1px solid #e2e8f0;
                                                        "
                                                    >
                                                        ${escaparHTML(
                                                            disciplina
                                                        )}
                                                    </td>

                                                    <td
                                                        style="
                                                            padding:10px;
                                                            text-align:center;
                                                            border-bottom:1px solid #e2e8f0;
                                                        "
                                                    >
                                                        ${escaparHTML(
                                                            mostrarNota(
                                                                mac
                                                            )
                                                        )}
                                                    </td>

                                                    <td
                                                        style="
                                                            padding:10px;
                                                            text-align:center;
                                                            border-bottom:1px solid #e2e8f0;
                                                        "
                                                    >
                                                        ${escaparHTML(
                                                            mostrarNota(
                                                                npt
                                                            )
                                                        )}
                                                    </td>

                                                    <td
                                                        style="
                                                            padding:10px;
                                                            text-align:center;
                                                            font-weight:bold;
                                                            border-bottom:1px solid #e2e8f0;
                                                        "
                                                    >
                                                        ${escaparHTML(
                                                            mostrarNota(
                                                                mf
                                                            )
                                                        )}
                                                    </td>

                                                    <td
                                                        style="
                                                            padding:10px;
                                                            text-align:center;
                                                            border-bottom:1px solid #e2e8f0;
                                                        "
                                                    >
                                                        ${escaparHTML(
                                                            classificacao
                                                        )}
                                                    </td>

                                                </tr>

                                            `;

                                        }
                                    ).join("")
                                }

                            </tbody>

                        </table>

                    </div>
                    `
                }


                <button
                    id="fecharNotasAluno"
                    type="button"
                    style="
                        width:100%;
                        padding:14px;
                        margin-top:20px;
                        border:none;
                        border-radius:10px;
                        background:#1e3a8a;
                        color:white;
                        font-size:16px;
                    "
                >
                    ← Voltar
                </button>

            </div>

        </div>

    `;


    document.body.insertAdjacentHTML(
        "beforeend",
        html
    );


    document
        .getElementById(
            "fecharNotasAluno"
        )
        ?.addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "janelaNotasAluno"
                    )
                    ?.remove();

            }
        );

}


// =====================================================
// VER NOTAS
// =====================================================

window.verNotas =
async function () {

    console.log(
        "📊 VER NOTAS CLICADO"
    );


    /*
    Carregar financeiro primeiro.
    */

    await carregarSituacaoFinanceira();


    /*
    Procurar anos letivos.
    */

    const anos =
        await obterAnosLetivosNotas();


    /*
    =============================================
    SE NÃO EXISTIR ANO
    =============================================
    */

    if (
        anos.length === 0
    ) {

        alert(
            "ℹ️ Ainda não existem anos letivos disponíveis para este aluno."
        );

        return;

    }


    /*
    =============================================
    SE EXISTIR APENAS UM ANO
    =============================================
    */

    if (
        anos.length === 1
    ) {

        abrirSelecaoTrimestre(
            anos[0]
        );

        return;

    }


    /*
    =============================================
    VÁRIOS ANOS
    =============================================
    */

    abrirSelecaoAno(
        anos
    );

};


// =====================================================
// SELEÇÃO DE ANO
// =====================================================

function abrirSelecaoAno(
    anos
) {

    const antigo =
        document.getElementById(
            "janelaSelecaoAnoNotas"
        );


    if (antigo) {

        antigo.remove();

    }


    const html = `

        <div
            id="janelaSelecaoAnoNotas"
            style="
                position:fixed;
                inset:0;
                z-index:99999;
                background:#f1f5f9;
                overflow:auto;
                padding:20px;
            "
        >

            <div
                style="
                    max-width:500px;
                    margin:40px auto;
                    background:white;
                    padding:25px;
                    border-radius:16px;
                    box-shadow:0 4px 15px rgba(0,0,0,.15);
                "
            >

                <div
                    style="
                        text-align:center;
                        font-size:50px;
                    "
                >
                    📅
                </div>


                <h2
                    style="
                        text-align:center;
                        color:#1e3a8a;
                    "
                >
                    Selecionar Ano Letivo
                </h2>


                <div
                    style="
                        margin-top:20px;
                    "
                >

                    ${
                        anos.map(
                            ano =>
                                `
                                <button
                                    type="button"
                                    class="botaoAnoNotas"
                                    data-ano="${escaparHTML(ano)}"
                                    style="
                                        width:100%;
                                        padding:14px;
                                        margin-bottom:10px;
                                        border:none;
                                        border-radius:10px;
                                        background:#1e3a8a;
                                        color:white;
                                        font-size:16px;
                                    "
                                >
                                    📚 ${escaparHTML(ano)}
                                </button>
                                `
                        ).join("")
                    }

                </div>


                <button
                    id="fecharSelecaoAnoNotas"
                    type="button"
                    style="
                        width:100%;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#64748b;
                        color:white;
                        font-size:15px;
                    "
                >
                    ← Voltar
                </button>

            </div>

        </div>

    `;


    document.body.insertAdjacentHTML(
        "beforeend",
        html
    );


    document
        .querySelectorAll(
            ".botaoAnoNotas"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    function () {

                        const ano =
                            this.dataset.ano;


                        document
                            .getElementById(
                                "janelaSelecaoAnoNotas"
                            )
                            ?.remove();


                        abrirSelecaoTrimestre(
                            ano
                        );

                    }
                );

            }
        );


    document
        .getElementById(
            "fecharSelecaoAnoNotas"
        )
        ?.addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "janelaSelecaoAnoNotas"
                    )
                    ?.remove();

            }
        );

}


// =====================================================
// SELEÇÃO DE TRIMESTRE
// =====================================================

function abrirSelecaoTrimestre(
    anoLetivo
) {

    const antigo =
        document.getElementById(
            "janelaSelecaoTrimestreNotas"
        );


    if (antigo) {

        antigo.remove();

    }


    const trimestres = [
        "1",
        "2",
        "3"
    ];


    const html = `

        <div
            id="janelaSelecaoTrimestreNotas"
            style="
                position:fixed;
                inset:0;
                z-index:99999;
                background:#f1f5f9;
                overflow:auto;
                padding:20px;
            "
        >

            <div
                style="
                    max-width:500px;
                    margin:40px auto;
                    background:white;
                    padding:25px;
                    border-radius:16px;
                    box-shadow:0 4px 15px rgba(0,0,0,.15);
                "
            >

                <div
                    style="
                        text-align:center;
                        font-size:50px;
                    "
                >
                    📊
                </div>


                <h2
                    style="
                        text-align:center;
                        color:#1e3a8a;
                    "
                >
                    Ver Notas
                </h2>


                <p
                    style="
                        text-align:center;
                        color:#64748b;
                    "
                >
                    Ano letivo:
                    <strong>
                        ${escaparHTML(anoLetivo)}
                    </strong>
                </p>


                <div>

                    ${
                        trimestres.map(
                            trimestre => {

                                const pago =
                                    trimestrePago(
                                        trimestre
                                    );


                                return `

                                    <button
                                        type="button"
                                        class="botaoTrimestreNotas"
                                        data-trimestre="${trimestre}"
                                        style="
                                            width:100%;
                                            padding:15px;
                                            margin-bottom:10px;
                                            border:none;
                                            border-radius:10px;
                                            background:${
                                                pago
                                                    ? "#1e3a8a"
                                                    : "#94a3b8"
                                            };
                                            color:white;
                                            font-size:16px;
                                            text-align:left;
                                        "
                                    >

                                        ${
                                            pago
                                                ? "🟢"
                                                : "🔒"
                                        }

                                        ${nomeTrimestre(
                                            trimestre
                                        )}

                                        ${
                                            pago
                                                ? " — Disponível"
                                                : " — Bloqueado"
                                        }

                                    </button>

                                `;

                            }
                        ).join("")
                    }

                </div>


                <button
                    id="fecharSelecaoTrimestreNotas"
                    type="button"
                    style="
                        width:100%;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#64748b;
                        color:white;
                        font-size:15px;
                    "
                >
                    ← Voltar
                </button>

            </div>

        </div>

    `;


    document.body.insertAdjacentHTML(
        "beforeend",
        html
    );


    document
        .querySelectorAll(
            ".botaoTrimestreNotas"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    async function () {

                        const trimestre =
                            this.dataset.trimestre;


                        /*
                        Verificar novamente
                        antes de abrir.
                        */

                        if (
                            !podeVerTrimestre(
                                trimestre
                            )
                        ) {

                            alert(
                                mensagemFinanceira(
                                    trimestre
                                )
                            );

                            return;

                        }


                        document
                            .getElementById(
                                "janelaSelecaoTrimestreNotas"
                            )
                            ?.remove();


                        await mostrarNotas(
                            anoLetivo,
                            trimestre
                        );

                    }
                );

            }
        );


    document
        .getElementById(
            "fecharSelecaoTrimestreNotas"
        )
        ?.addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "janelaSelecaoTrimestreNotas"
                    )
                    ?.remove();

            }
        );

}


// =====================================================
// VER BOLETIM
// =====================================================

window.verBoletim =
async function () {

    console.log(
        "📄 VER BOLETIM CLICADO"
    );


    await carregarSituacaoFinanceira();


    /*
    Por enquanto o Bloco 3 apenas
    confirma a situação financeira.
    
    A abertura do boletim será
    completada no Bloco 4.
    */


    const primeiro =
        trimestrePago(
            "1"
        );

    const segundo =
        trimestrePago(
            "2"
        );

    const terceiro =
        trimestrePago(
            "3"
        );


    if (
        !primeiro &&
        !segundo &&
        !terceiro
    ) {

        alert(
            "🔒 O acesso ao boletim está bloqueado.\n\n" +
            "Não existe nenhum trimestre regularizado."
        );

        return;

    }


    alert(
        "📄 Boletim\n\n" +
        "A situação financeira permite continuar.\n\n" +
        "A abertura do boletim será concluída no Bloco 4."
    );

};


// =====================================================
// INICIALIZAÇÃO DO BLOCO 3
// =====================================================

console.log(
    "======================================"
);

console.log(
    "💰 TESTE FINANCEIRO"
);

console.log(
    "Escola:",
    aluno.escolaId
);

console.log(
    "Aluno:",
    aluno.id
);

console.log(
    "ID financeiro:",
    obterIdFinanceiroAluno()
);

console.log(
    "======================================"
);

console.log(
    "✅ BLOCO 3/4 carregado."
);

// =====================================================
// SGE ANGOLA — ÁREA DO ALUNO
// BLOCO 4/4
//
// FUNÇÕES:
// - Verificar situação financeira
// - Bloquear/liberar Ver Notas
// - Bloquear/liberar Ver Boletim
// - Mostrar comunicado financeiro
// =====================================================

console.log("💰 SGE — BLOCO 4 iniciado");


// =====================================================
// OBTER ID FINANCEIRO
// =====================================================

function obterIdFinanceiroAluno() {

    const escolaId =
        String(
            aluno.escolaId || ""
        ).trim();

    const alunoId =
        String(
            aluno.id || ""
        ).trim();


    if (
        !escolaId ||
        !alunoId
    ) {

        throw new Error(
            "Não foi possível identificar o aluno financeiramente."
        );

    }


    return `${escolaId}_${alunoId}`;

}


// =====================================================
// OBTER SITUAÇÃO FINANCEIRA
// =====================================================

async function obterSituacaoFinanceira() {

    try {

        const financeiroId =
            obterIdFinanceiroAluno();


        const referencia =
            doc(
                db,
                "financeiro",
                financeiroId
            );


        const snapshot =
            await getDoc(
                referencia
            );


        /*
        =============================================
        SE NÃO EXISTIR DOCUMENTO FINANCEIRO
        =============================================
        */

        if (
            !snapshot.exists()
        ) {

            return {

                existe: false,

                regular: true,

                comunicado: "",

                dados: {}

            };

        }


        const dados =
            snapshot.data();


        /*
        =============================================
        VERIFICAR TRIMESTRES
        =============================================
        */

        const primeiro =
            dados["1trimestre"]?.pago === true;

        const segundo =
            dados["2trimestre"]?.pago === true;

        const terceiro =
            dados["3trimestre"]?.pago === true;


        /*
        =============================================
        SITUAÇÃO
        =============================================

        Se algum trimestre estiver Não Pago,
        o aluno fica com acesso bloqueado.
        */

        const regular =
            primeiro &&
            segundo &&
            terceiro;


        return {

            existe: true,

            regular:

                regular,

            primeiro:

                primeiro,

            segundo:

                segundo,

            terceiro:

                terceiro,

            comunicado:

                dados.comunicado || "",

            dados:

                dados

        };

    }
    catch (erro) {

        console.error(
            "❌ Erro ao verificar situação financeira:",
            erro
        );


        /*
        Em caso de erro não vamos
        bloquear automaticamente o aluno.
        */

        return {

            existe: false,

            regular: true,

            comunicado: "",

            erro: true

        };

    }

}


// =====================================================
// MOSTRAR AVISO FINANCEIRO
// =====================================================

function mostrarAvisoFinanceiro(
    situacao
) {

    const antigo =
        document.getElementById(
            "avisoFinanceiroAluno"
        );


    if (antigo) {

        antigo.remove();

    }


    /*
    Se estiver regular,
    não mostrar aviso.
    */

    if (
        situacao.regular
    ) {

        return;

    }


    const pendencias = [];


    if (
        !situacao.primeiro
    ) {

        pendencias.push(
            "1.º Trimestre"
        );

    }


    if (
        !situacao.segundo
    ) {

        pendencias.push(
            "2.º Trimestre"
        );

    }


    if (
        !situacao.terceiro
    ) {

        pendencias.push(
            "3.º Trimestre"
        );

    }


    const comunicado =
        situacao.comunicado
            ? `
                <p style="
                    margin:12px 0 0;
                    font-size:14px;
                ">
                    <strong>Comunicado:</strong><br>
                    ${escaparHTML(
                        situacao.comunicado
                    )}
                </p>
              `
            : "";


    const html = `

        <div
            id="avisoFinanceiroAluno"
            style="
                margin:20px 0;
                padding:18px;
                border-radius:14px;
                background:#fff7ed;
                border:2px solid #f97316;
                color:#9a3412;
                text-align:center;
            "
        >

            <div style="
                font-size:35px;
                margin-bottom:8px;
            ">
                💰
            </div>


            <strong style="
                font-size:18px;
            ">
                Situação financeira pendente
            </strong>


            <p style="
                margin:10px 0;
                line-height:1.6;
            ">
                Existem pagamentos pendentes.
            </p>


            <p style="
                margin:8px 0;
                font-size:14px;
            ">
                <strong>Trimestres pendentes:</strong><br>
                ${pendencias.join(", ")}
            </p>


            ${comunicado}

        </div>

    `;


    /*
    Colocar o aviso antes do menu.
    */

    const menu =
        document.querySelector(
            ".menu"
        );


    if (menu) {

        menu.insertAdjacentHTML(
            "beforebegin",
            html
        );

    }

}


// =====================================================
// VERIFICAR FINANCEIRO ANTES DAS NOTAS
// =====================================================

window.verNotas =
async function () {

    console.log(
        "📊 Ver Notas clicado."
    );


    try {

        const situacao =
            await obterSituacaoFinanceira();


        /*
        =============================================
        ALUNO COM PAGAMENTOS PENDENTES
        =============================================
        */

        if (
            !situacao.regular
        ) {

            mostrarAvisoFinanceiro(
                situacao
            );


            alert(
                "🔒 Acesso às notas bloqueado.\n\n" +
                "Regularize a situação financeira para consultar as notas."
            );


            return;

        }


        /*
        =============================================
        FINANCEIRO REGULAR
        =============================================
        */

        console.log(
            "✅ Financeiro regular. Abrindo notas."
        );


        abrirNotasAluno();

    }
    catch (erro) {

        console.error(
            "❌ Erro ao verificar financeiro:",
            erro
        );


        alert(
            "Não foi possível verificar a situação financeira.\n\n" +
            erro.message
        );

    }

};


// =====================================================
// VERIFICAR FINANCEIRO ANTES DO BOLETIM
// =====================================================

window.verBoletim =
async function () {

    console.log(
        "📄 Ver Boletim clicado."
    );


    try {

        const situacao =
            await obterSituacaoFinanceira();


        /*
        =============================================
        BLOQUEADO
        =============================================
        */

        if (
            !situacao.regular
        ) {

            mostrarAvisoFinanceiro(
                situacao
            );


            alert(
                "🔒 Acesso ao boletim bloqueado.\n\n" +
                "Regularize a situação financeira para consultar o boletim."
            );


            return;

        }


        /*
        =============================================
        LIBERADO
        =============================================
        */

        console.log(
            "✅ Financeiro regular. Abrindo boletim."
        );


        abrirBoletimAluno();

    }
    catch (erro) {

        console.error(
            "❌ Erro ao verificar financeiro:",
            erro
        );


        alert(
            "Não foi possível verificar a situação financeira.\n\n" +
            erro.message
        );

    }

};


// =====================================================
// FUNÇÃO TEMPORÁRIA — NOTAS
// =====================================================

function abrirNotasAluno() {

    alert(
        "✅ Situação financeira regular.\n\n" +
        "Acesso às notas autorizado."
    );


    /*
    Nesta fase apenas testamos
    o controle financeiro.

    Depois ligaremos aqui
    o sistema de notas.
    */

}


// =====================================================
// FUNÇÃO TEMPORÁRIA — BOLETIM
// =====================================================

function abrirBoletimAluno() {

    alert(
        "✅ Situação financeira regular.\n\n" +
        "Acesso ao boletim autorizado."
    );


    /*
    Nesta fase apenas testamos
    o controle financeiro.

    Depois ligaremos aqui
    o sistema real de boletim.
    */

}


// =====================================================
// VERIFICAR FINANCEIRO AO ABRIR A ÁREA
// =====================================================

async function verificarFinanceiroInicial() {

    try {

        const situacao =
            await obterSituacaoFinanceira();


        console.log(
            "💰 SITUAÇÃO FINANCEIRA DO ALUNO:",
            situacao
        );


        if (
            !situacao.regular
        ) {

            mostrarAvisoFinanceiro(
                situacao
            );

        }

    }
    catch (erro) {

        console.error(
            "Erro na verificação financeira inicial:",
            erro
        );

    }

}


// =====================================================
// INICIAR BLOCO 4
// =====================================================

verificarFinanceiroInicial();


console.log(
    "✅ BLOCO 4/4 carregado."
);

alert(
    "✅ BLOCO 4 — Controle financeiro carregado!"
);
