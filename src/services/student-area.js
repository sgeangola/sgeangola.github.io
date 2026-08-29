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

alert("✅ BLOCO 2 — student-area.js carregado");

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

window.verNotas = async function () {

    try {

        const turmaId =
            String(
                aluno.turmaId || ""
            ).trim();


        if (!turmaId) {

            alert(
                "❌ O aluno não possui turmaId."
            );

            return;

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

            alert(
                "❌ A turma não foi encontrada no Firestore.\n\n" +
                "ID: " +
                turmaId
            );

            return;

        }


        const dadosTurma =
            turmaSnap.data();


        console.log(
            "🏫 DADOS COMPLETOS DA TURMA:",
            dadosTurma
        );


        alert(
            "DADOS DA TURMA\n\n" +

            JSON.stringify(
                dadosTurma,
                null,
                2
            )
        );

    }
    catch (erro) {

        console.error(
            "❌ ERRO:",
            erro
        );


        alert(
            "❌ Erro ao consultar a turma:\n\n" +
            erro.message
        );

    }

};


console.log(
    "✅ BLOCO 2/4 — VER NOTAS carregado."
);
