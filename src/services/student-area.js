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
   SGE — ÁREA DO ALUNO
   student-area.js
   BLOCO 2/4

   - Anos letivos
   - Seleção de ano
   - Seleção de trimestre
   - Menu Ver Notas
   - Menu Ver Boletins
===================================================== */


// =====================================================
// OBTER ANOS LETIVOS
// =====================================================

async function obterAnosLetivos() {

    const anos = new Set();

    // -------------------------------------------------
    // 1. ANO EXISTENTE NA SESSÃO DO ALUNO
    // -------------------------------------------------

    const anoSessao =
        aluno.anoLetivo ||
        aluno.anoLectivo ||
        aluno.ano ||
        aluno.anoLetivoAtual ||
        "";

    if (anoSessao) {

        anos.add(
            String(anoSessao).trim()
        );

    }


    // -------------------------------------------------
    // 2. ANO DA TURMA
    // -------------------------------------------------

    if (aluno.turmaId) {

        try {

            const turmaSnap =
                await getDoc(
                    doc(
                        db,
                        "turmas",
                        String(aluno.turmaId).trim()
                    )
                );


            if (turmaSnap.exists()) {

                const turma =
                    turmaSnap.data();


                const anoTurma =
                    turma.anoLetivo ||
                    turma.anoLectivo ||
                    turma.ano ||
                    turma.anoLetivoAtual ||
                    "";


                if (anoTurma) {

                    anos.add(
                        String(anoTurma).trim()
                    );

                }

            }

        }
        catch (erro) {

            console.warn(
                "⚠️ Não foi possível obter o ano da turma:",
                erro
            );

        }

    }


    // -------------------------------------------------
    // 3. PROCURAR NOS DOCUMENTOS DE NOTAS
    // -------------------------------------------------

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
                    documento.data();


                // Apenas notas desta turma
                if (
                    dados.turmaId &&
                    String(
                        dados.turmaId
                    ).trim() !==
                    String(
                        aluno.turmaId
                    ).trim()
                ) {

                    return;

                }


                const ano =
                    dados.anoLetivo ||
                    dados.anoLectivo ||
                    dados.ano ||
                    dados.anoLetivoAtual ||
                    "";


                if (ano) {

                    anos.add(
                        String(
                            ano
                        ).trim()
                    );

                }

            }
        );

    }
    catch (erro) {

        console.warn(
            "⚠️ Não foi possível consultar notas:",
            erro
        );

    }


    // -------------------------------------------------
    // 4. PROCURAR NOS BOLETINS
    // -------------------------------------------------

    try {

        const boletinsSnapshot =
            await getDocs(
                collection(
                    db,
                    "boletins"
                )
            );


        boletinsSnapshot.forEach(
            documento => {

                const dados =
                    documento.data();


                if (
                    dados.turmaId &&
                    String(
                        dados.turmaId
                    ).trim() !==
                    String(
                        aluno.turmaId
                    ).trim()
                ) {

                    return;

                }


                const ano =
                    dados.anoLetivo ||
                    dados.anoLectivo ||
                    dados.ano ||
                    dados.anoLetivoAtual ||
                    "";


                if (ano) {

                    anos.add(
                        String(
                            ano
                        ).trim()
                    );

                }

            }
        );

    }
    catch (erro) {

        console.warn(
            "⚠️ Não foi possível consultar boletins:",
            erro
        );

    }


    // -------------------------------------------------
    // RESULTADO
    // -------------------------------------------------

    const resultado =
        Array.from(
            anos
        )
        .filter(
            ano =>
                ano &&
                ano !== "undefined" &&
                ano !== "null"
        )
        .sort(
            (a, b) =>
                b.localeCompare(a)
        );


    console.log(
        "📅 ANOS LETIVOS ENCONTRADOS:",
        resultado
    );


    return resultado;

}


// =====================================================
// CRIAR MENU DE SELEÇÃO
// =====================================================

function criarJanelaSelecao(
    tipo,
    anos
) {

    const antigo =
        document.getElementById(
            "janelaSelecaoNotas"
        );


    if (antigo) {

        antigo.remove();

    }


    const titulo =
        tipo === "notas"
            ? "📊 Ver Notas"
            : "📄 Ver Boletins";


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
                    max-width:550px;
                    margin:40px auto;
                    background:white;
                    border-radius:18px;
                    padding:25px;
                    box-shadow:0 8px 30px rgba(0,0,0,.15);
                "
            >

                <h2
                    style="
                        text-align:center;
                        color:#1e3a8a;
                        margin-bottom:25px;
                    "
                >
                    ${titulo}
                </h2>


                <label
                    style="
                        display:block;
                        font-weight:bold;
                        margin-bottom:8px;
                    "
                >
                    Ano letivo
                </label>


                <select
                    id="selecionarAnoLetivo"
                    style="
                        width:100%;
                        padding:14px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
                        font-size:16px;
                        margin-bottom:20px;
                    "
                >

                    ${
                        anos.length
                        ?
                        anos.map(
                            ano =>
                                `
                                <option value="${escaparHTML(ano)}">
                                    ${escaparHTML(ano)}
                                </option>
                                `
                        ).join("")
                        :
                        `
                        <option value="">
                            Nenhum ano letivo encontrado
                        </option>
                        `
                    }

                </select>


                <label
                    style="
                        display:block;
                        font-weight:bold;
                        margin-bottom:8px;
                    "
                >
                    Trimestre
                </label>


                <select
                    id="selecionarTrimestre"
                    style="
                        width:100%;
                        padding:14px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
                        font-size:16px;
                        margin-bottom:25px;
                    "
                >

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
                    id="confirmarSelecaoAluno"
                    style="
                        width:100%;
                        padding:15px;
                        border:none;
                        border-radius:10px;
                        background:#2563eb;
                        color:white;
                        font-size:16px;
                        font-weight:bold;
                        cursor:pointer;
                    "
                >
                    Continuar
                </button>


                <button
                    id="fecharSelecaoAluno"
                    style="
                        width:100%;
                        padding:15px;
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


    // -------------------------------------------------
    // VOLTAR
    // -------------------------------------------------

    document
        .getElementById(
            "fecharSelecaoAluno"
        )
        ?.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "janelaSelecaoNotas"
                    )
                    ?.remove();

            }
        );


    // -------------------------------------------------
    // CONTINUAR
    // -------------------------------------------------

    document
        .getElementById(
            "confirmarSelecaoAluno"
        )
        ?.addEventListener(
            "click",
            async () => {

                const ano =
                    document
                        .getElementById(
                            "selecionarAnoLetivo"
                        )
                        ?.value;


                const trimestreSelecionado =
                    document
                        .getElementById(
                            "selecionarTrimestre"
                        )
                        ?.value;


                if (!ano) {

                    alert(
                        "⚠️ Selecione um ano letivo."
                    );

                    return;

                }


                if (!trimestreSelecionado) {

                    alert(
                        "⚠️ Selecione um trimestre."
                    );

                    return;

                }


                console.log(
                    "📅 ANO SELECIONADO:",
                    ano
                );

                console.log(
                    "📚 TRIMESTRE SELECIONADO:",
                    trimestreSelecionado
                );


                // Guardar temporariamente
                sessionStorage.setItem(
                    "alunoAnoLetivo",
                    ano
                );


                sessionStorage.setItem(
                    "alunoTrimestre",
                    trimestreSelecionado
                );


                sessionStorage.setItem(
                    "alunoTipoConsulta",
                    tipo
                );


                // -------------------------------------------------
                // CHAMAR BLOCO ESPECÍFICO
                // -------------------------------------------------

                if (
                    tipo === "notas"
                ) {

                    if (
                        typeof window.carregarNotasAluno ===
                        "function"
                    ) {

                        await window.carregarNotasAluno(
                            ano,
                            trimestreSelecionado
                        );

                    }
                    else {

                        alert(
                            "⚠️ O módulo de notas ainda não foi carregado."
                        );

                        console.error(
                            "window.carregarNotasAluno não existe."
                        );

                    }

                }


                if (
                    tipo === "boletins"
                ) {

                    if (
                        typeof window.carregarBoletimAluno ===
                        "function"
                    ) {

                        await window.carregarBoletimAluno(
                            ano,
                            trimestreSelecionado
                        );

                    }
                    else {

                        alert(
                            "⚠️ O módulo de boletins ainda não foi carregado."
                        );

                        console.error(
                            "window.carregarBoletimAluno não existe."
                        );

                    }

                }

            }
        );

}


// =====================================================
// ABRIR VER NOTAS
// =====================================================

window.verNotas =
async function () {

    console.log(
        "📊 VER NOTAS CLICADO"
    );


    try {

        const anos =
            await obterAnosLetivos();


        criarJanelaSelecao(
            "notas",
            anos
        );

    }
    catch (erro) {

        console.error(
            "❌ Erro em Ver Notas:",
            erro
        );


        alert(
            "❌ Não foi possível carregar os anos letivos.\n\n" +
            erro.message
        );

    }

};


// =====================================================
// ABRIR VER BOLETINS
// =====================================================

window.verBoletins =
async function () {

    console.log(
        "📄 VER BOLETINS CLICADO"
    );


    try {

        const anos =
            await obterAnosLetivos();


        criarJanelaSelecao(
            "boletins",
            anos
        );

    }
    catch (erro) {

        console.error(
            "❌ Erro em Ver Boletins:",
            erro
        );


        alert(
            "❌ Não foi possível abrir os boletins.\n\n" +
            erro.message
        );

    }

};


// =====================================================
// ALIASES PARA HTML ANTIGO
// =====================================================

window.abrirVerNotas =
window.verNotas;


window.abrirVerBoletins =
window.verBoletins;


console.log(
    "✅ BLOCO 2/4 CARREGADO"
);
