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

alert("✅ BLOCO 1 df — student-area.js carregado");

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
   student-area.js
   BLOCO 2/4

   FUNÇÕES:
   - Anos letivos
   - Seleção do ano
   - Seleção do trimestre
   - Menu Ver Notas
   - Menu Ver Boletins
   - Preparação dos dados selecionados
===================================================== */


// =====================================================
// VARIÁVEIS DA SELEÇÃO
// =====================================================

let tipoVisualizacao = "";

let anoSelecionado = "";

let trimestreSelecionado = "";


// =====================================================
// OBTER ANOS LETIVOS DISPONÍVEIS
// =====================================================

async function obterAnosLetivos() {

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
        "📅 Procurando anos letivos..."
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


            const turmaDocumento =
                String(
                    dados.turmaId || ""
                ).trim();


            if (
                turmaDocumento !== turmaId
            ) {

                return;

            }


            const ano =
                obterAnoLetivo(
                    dados
                );


            if (ano) {

                anos.add(
                    String(
                        ano
                    ).trim()
                );

            }

        }
    );


    // -------------------------------------------------
    // SE NÃO ENCONTRAR NAS NOTAS,
    // TENTAR O ANO DA SESSÃO DO ALUNO
    // -------------------------------------------------

    if (
        anos.size === 0
    ) {

        const anoAluno =
            aluno.anoLetivo ||
            aluno.anoLectivo ||
            aluno.ano ||
            "";


        if (anoAluno) {

            anos.add(
                String(
                    anoAluno
                ).trim()
            );

        }

    }


    const resultado =
        Array.from(
            anos
        )
        .filter(
            ano =>
                ano !== ""
        )
        .sort(
            (a, b) =>
                b.localeCompare(
                    a
                )
        );


    console.log(
        "📅 ANOS ENCONTRADOS:",
        resultado
    );


    return resultado;

}


// =====================================================
// OBTER TRIMESTRES DISPONÍVEIS
// =====================================================

async function obterTrimestres(
    ano
) {

    const turmaId =
        String(
            aluno.turmaId || ""
        ).trim();


    const snapshot =
        await getDocs(
            collection(
                db,
                "notas"
            )
        );


    const trimestres =
        new Set();


    snapshot.forEach(
        documento => {

            const dados =
                documento.data();


            const turmaDocumento =
                String(
                    dados.turmaId || ""
                ).trim();


            if (
                turmaDocumento !== turmaId
            ) {

                return;

            }


            const anoDocumento =
                String(
                    obterAnoLetivo(
                        dados
                    )
                ).trim();


            if (
                anoDocumento !==
                String(
                    ano
                ).trim()
            ) {

                return;

            }


            const trimestre =
                dados.trimestre ||
                dados.Trimestre ||
                "";


            if (trimestre) {

                trimestres.add(
                    normalizarTrimestre(
                        trimestre
                    )
                );

            }

        }
    );


    // -------------------------------------------------
    // SE NÃO EXISTIREM TRIMESTRES NO FIRESTORE,
    // MOSTRAR OS 3 PADRÕES
    // -------------------------------------------------

    if (
        trimestres.size === 0
    ) {

        trimestres.add("1");
        trimestres.add("2");
        trimestres.add("3");

    }


    const resultado =
        Array.from(
            trimestres
        )
        .filter(
            valor =>
                valor === "1" ||
                valor === "2" ||
                valor === "3"
        )
        .sort();


    console.log(
        "📚 TRIMESTRES:",
        resultado
    );


    return resultado;

}


// =====================================================
// FECHAR JANELA
// =====================================================

function fecharSelecaoNotas() {

    document
        .getElementById(
            "janelaSelecaoNotas"
        )
        ?.remove();

}


// =====================================================
// ABRIR MENU DE SELEÇÃO
// =====================================================

async function abrirSelecaoNotas(
    tipo
) {

    tipoVisualizacao =
        tipo;


    fecharSelecaoNotas();


    let anos = [];


    try {

        anos =
            await obterAnosLetivos();

    }
    catch (erro) {

        console.error(
            "❌ Erro ao obter anos:",
            erro
        );

        alert(
            "❌ Não foi possível carregar os anos letivos.\n\n" +
            erro.message
        );

        return;

    }


    // -------------------------------------------------
    // SE NÃO EXISTIR ANO
    // -------------------------------------------------

    if (
        anos.length === 0
    ) {

        alert(
            "ℹ️ Ainda não existem anos letivos disponíveis."
        );

        return;

    }


    const opcoesAnos =
        anos
        .map(
            ano =>
                `
                <option value="${escaparHTML(ano)}">
                    ${escaparHTML(ano)}
                </option>
                `
        )
        .join("");


    const html = `

        <div
            id="janelaSelecaoNotas"
            style="
                position:fixed;
                inset:0;
                z-index:999999;
                background:#f1f5f9;
                overflow-y:auto;
                padding:20px;
            "
        >

            <div
                style="
                    max-width:550px;
                    margin:40px auto;
                    background:white;
                    border-radius:18px;
                    padding:25px;
                    box-shadow:0 5px 20px rgba(0,0,0,.18);
                "
            >

                <div
                    style="
                        text-align:center;
                        font-size:50px;
                        margin-bottom:10px;
                    "
                >
                    ${
                        tipo === "notas"
                            ? "📊"
                            : "📄"
                    }
                </div>


                <h2
                    style="
                        text-align:center;
                        color:#1e3a8a;
                        margin-bottom:8px;
                    "
                >
                    ${
                        tipo === "notas"
                            ? "Ver Notas"
                            : "Ver Boletim"
                    }
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
                        font-weight:bold;
                        margin-bottom:8px;
                    "
                >
                    📅 Ano letivo
                </label>


                <select
                    id="anoNotasSelect"
                    style="
                        width:100%;
                        padding:14px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
                        font-size:16px;
                        margin-bottom:20px;
                    "
                >

                    <option value="">
                        Selecionar ano letivo
                    </option>

                    ${opcoesAnos}

                </select>


                <label
                    style="
                        display:block;
                        font-weight:bold;
                        margin-bottom:8px;
                    "
                >
                    📚 Trimestre
                </label>


                <select
                    id="trimestreNotasSelect"
                    disabled
                    style="
                        width:100%;
                        padding:14px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
                        font-size:16px;
                        margin-bottom:25px;
                        background:#f8fafc;
                    "
                >

                    <option value="">
                        Primeiro selecione o ano
                    </option>

                </select>


                <button
                    id="continuarNotas"
                    disabled
                    style="
                        width:100%;
                        padding:14px;
                        border:none;
                        border-radius:10px;
                        background:#2563eb;
                        color:white;
                        font-size:16px;
                        cursor:pointer;
                        opacity:.5;
                    "
                >
                    Continuar →
                </button>


                <button
                    id="fecharSelecaoNotas"
                    style="
                        width:100%;
                        padding:14px;
                        margin-top:10px;
                        border:none;
                        border-radius:10px;
                        background:#64748b;
                        color:white;
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


    const anoSelect =
        document.getElementById(
            "anoNotasSelect"
        );


    const trimestreSelect =
        document.getElementById(
            "trimestreNotasSelect"
        );


    const continuar =
        document.getElementById(
            "continuarNotas"
        );


    const fechar =
        document.getElementById(
            "fecharSelecaoNotas"
        );


    // =================================================
    // SELECIONAR ANO
    // =================================================

    anoSelect?.addEventListener(
        "change",
        async function () {

            const ano =
                this.value;


            anoSelecionado =
                ano;


            trimestreSelecionado =
                "";


            continuar.disabled =
                true;


            continuar.style.opacity =
                ".5";


            trimestreSelect.innerHTML = `
                <option value="">
                    Carregando trimestres...
                </option>
            `;


            trimestreSelect.disabled =
                true;


            if (!ano) {

                trimestreSelect.innerHTML = `
                    <option value="">
                        Primeiro selecione o ano
                    </option>
                `;

                return;

            }


            try {

                const trimestres =
                    await obterTrimestres(
                        ano
                    );


                trimestreSelect.innerHTML = `

                    <option value="">
                        Selecionar trimestre
                    </option>

                    ${
                        trimestres
                        .map(
                            trimestre =>
                                `
                                <option value="${trimestre}">
                                    ${nomeTrimestre(trimestre)}
                                </option>
                                `
                        )
                        .join("")
                    }

                `;


                trimestreSelect.disabled =
                    false;

            }
            catch (erro) {

                console.error(
                    "❌ Erro nos trimestres:",
                    erro
                );


                trimestreSelect.innerHTML = `
                    <option value="">
                        Erro ao carregar
                    </option>
                `;

            }

        }
    );


    // =================================================
    // SELECIONAR TRIMESTRE
    // =================================================

    trimestreSelect?.addEventListener(
        "change",
        function () {

            trimestreSelecionado =
                normalizarTrimestre(
                    this.value
                );


            const podeContinuar =
                anoSelecionado !== "" &&
                trimestreSelecionado !== "";


            continuar.disabled =
                !podeContinuar;


            continuar.style.opacity =
                podeContinuar
                    ? "1"
                    : ".5";

        }
    );


    // =================================================
    // CONTINUAR
    // =================================================

    continuar?.addEventListener(
        "click",
        function () {

            if (
                !anoSelecionado ||
                !trimestreSelecionado
            ) {

                alert(
                    "Selecione o ano e o trimestre."
                );

                return;

            }


            console.log(
                "================================"
            );

            console.log(
                "📌 SELEÇÃO CONFIRMADA"
            );

            console.log(
                "Tipo:",
                tipoVisualizacao
            );

            console.log(
                "Ano:",
                anoSelecionado
            );

            console.log(
                "Trimestre:",
                trimestreSelecionado
            );

            console.log(
                "================================"
            );


            // -------------------------------------------------
            // GUARDAR TEMPORARIAMENTE
            // PARA O BLOCO 3
            // -------------------------------------------------

            window.sgeSelecaoAluno = {

                tipo:
                    tipoVisualizacao,

                anoLetivo:
                    anoSelecionado,

                trimestre:
                    trimestreSelecionado

            };


            fecharSelecaoNotas();


            alert(
                "✅ Seleção realizada!\n\n" +
                "Ano: " +
                anoSelecionado +
                "\n" +
                "Trimestre: " +
                nomeTrimestre(
                    trimestreSelecionado
                ) +
                "\n\n" +
                "O próximo bloco fará a verificação financeira."
            );

        }
    );


    // =================================================
    // FECHAR
    // =================================================

    fechar?.addEventListener(
        "click",
        fecharSelecaoNotas
    );

}


// =====================================================
// FUNÇÕES PÚBLICAS DOS MENUS
// =====================================================

window.verNotas =
function () {

    abrirSelecaoNotas(
        "notas"
    );

};


window.verBoletins =
function () {

    abrirSelecaoNotas(
        "boletins"
    );

};


console.log(
    "✅ BLOCO 2/4 carregado."
);

alert(
    "✅ BLOCO 2/4 carregado!\n\n" +
    "Agora teste os botões Ver Notas e Ver Boletins."
);
