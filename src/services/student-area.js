/* =====================================================
   SGE — ÁREA DO ALUNO
   student-area.js
   VERSÃO COMPLETA

   FUNÇÕES:
   - Sessão do aluno
   - Perfil
   - Meus dados
   - Alterar senha
   - Ver notas
   - Ver notas por ano letivo
   - Ver notas por trimestre
   - Ver boletim por ano/trimestre
   - Verificação financeira por trimestre
   - Baixar / imprimir notas
   - Sair da conta
===================================================== */


// =====================================================
// FIREBASE
// =====================================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


alert(
    "🎓 SGE — student-area.js iniciado"
);


console.log(
    "🎓 SGE — student-area.js iniciado"
);


// =====================================================
// VERIFICAR SESSÃO
// =====================================================

const dadosAluno =
    localStorage.getItem(
        "alunoLogado"
    );


if (!dadosAluno) {

    alert(
        "Sessão expirada.\n\n" +
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
        "Erro ao ler alunoLogado:",
        erro
    );


    localStorage.removeItem(
        "alunoLogado"
    );


    alert(
        "A sessão do aluno está inválida."
    );


    window.location.href =
        "student-login.html";


    throw erro;

}


// =====================================================
// DADOS DO ALUNO
// =====================================================

console.log(
    "================================"
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
    "Número:",
    aluno.numero
);


console.log(
    "Estado:",
    aluno.estado
);


console.log(
    "Escola:",
    aluno.escolaId
);


console.log(
    "================================"
);


// =====================================================
// ELEMENTOS DO HTML
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

function escaparHTML(
    valor
) {

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
// MOSTRAR NOTA
// =====================================================

function mostrarNota(
    valor
) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "—";

    }


    return valor;

}


// =====================================================
// CONVERTER TRIMESTRE
// =====================================================

function nomeTrimestre(
    trimestre
) {

    const valor =
        String(
            trimestre || ""
        )
        .replace(
            "º",
            ""
        )
        .replace(
            "°",
            ""
        )
        .replace(
            "ª",
            ""
        )
        .replace(
            /Trimestre/gi,
            ""
        )
        .trim();


    if (
        valor === "1"
    ) {

        return "1.º Trimestre";

    }


    if (
        valor === "2"
    ) {

        return "2.º Trimestre";

    }


    if (
        valor === "3"
    ) {

        return "3.º Trimestre";

    }


    return (
        trimestre ||
        "—"
    );

}


// =====================================================
// OBTER NÚMERO DO TRIMESTRE
// =====================================================

function obterNumeroTrimestre(
    trimestre
) {

    const texto =
        String(
            trimestre || ""
        )
        .toLowerCase()
        .trim();


    if (
        texto.includes("1")
    ) {

        return "1";

    }


    if (
        texto.includes("2")
    ) {

        return "2";

    }


    if (
        texto.includes("3")
    ) {

        return "3";

    }


    return "";

}


// =====================================================
// OBTER ANO LETIVO
// =====================================================

function obterAnoLetivo(
    dados
) {

    return (

        dados.anoLetivo ||

        dados.anoLectivo ||

        dados.ano ||

        dados.anoLetivoAtual ||

        "Ano letivo atual"

    );

}


// =====================================================
// OBTER ESCOLA
// =====================================================

async function obterDadosEscola() {

    const escolaId =
        String(
            aluno.escolaId ||
            sessionStorage.getItem(
                "escolaId"
            ) ||
            localStorage.getItem(
                "escolaId"
            ) ||
            ""
        ).trim();


    if (!escolaId) {

        return {

            id: "",

            nome:
                "SGE — Sistema de Gestão Escolar"

        };

    }


    try {

        const referencia =
            doc(
                db,
                "escolas",
                escolaId
            );


        const snapshot =
            await getDoc(
                referencia
            );


        if (
            snapshot.exists()
        ) {

            const dados =
                snapshot.data();


            return {

                id:
                    escolaId,

                nome:
                    dados.nome ||
                    dados.nomeEscola ||
                    dados.designacao ||
                    "SGE — Sistema de Gestão Escolar",

                logo:
                    dados.logo ||
                    ""

            };

        }

    }

    catch (erro) {

        console.warn(
            "⚠️ Não foi possível carregar dados da escola:",
            erro
        );

    }


    return {

        id:
            escolaId,

        nome:
            "SGE — Sistema de Gestão Escolar",

        logo:
            ""

    };

}


// =====================================================
// OBTER DOCUMENTO DO ALUNO
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
            "Não foi possível identificar o documento do aluno."
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

        referencia:
            referencia,

        dados:
            snapshot.data()

    };

}


// =====================================================
// VER DADOS
// =====================================================

window.verDados =
function () {

    const antigo =
        document.getElementById(
            "janelaDadosAluno"
        );


    if (antigo) {

        antigo.remove();

    }


    const html = `

        <div
            id="janelaDadosAluno"
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
                    max-width:600px;
                    margin:20px auto;
                    background:white;
                    border-radius:16px;
                    padding:25px;
                    box-shadow:0 4px 15px rgba(0,0,0,.15);
                "
            >

                <div
                    style="
                        text-align:center;
                        font-size:55px;
                    "
                >
                    👤
                </div>


                <h2
                    style="
                        text-align:center;
                        color:#1e3a8a;
                        margin-bottom:25px;
                    "
                >
                    Meus Dados
                </h2>


                <div
                    style="
                        line-height:1.8;
                        color:#334155;
                    "
                >

                    <p>
                        <strong>Nome:</strong><br>
                        ${escaparHTML(
                            aluno.nome || "—"
                        )}
                    </p>


                    <p>
                        <strong>Código do aluno:</strong><br>
                        ${escaparHTML(
                            aluno.codigoAluno || "—"
                        )}
                    </p>


                    <p>
                        <strong>Número:</strong><br>
                        ${escaparHTML(
                            aluno.numero || "—"
                        )}
                    </p>


                    <p>
                        <strong>Turma:</strong><br>
                        ${escaparHTML(
                            aluno.turmaNome || "—"
                        )}
                    </p>


                    <p>
                        <strong>Classe:</strong><br>
                        ${escaparHTML(
                            aluno.classe || "—"
                        )}
                    </p>


                    <p>
                        <strong>Estado:</strong><br>
                        ${escaparHTML(
                            aluno.estado || "ativo"
                        )}
                    </p>

                </div>


                <button
                    id="alterarSenhaAluno"
                    style="
                        width:100%;
                        padding:14px;
                        margin-top:10px;
                        border:none;
                        border-radius:10px;
                        background:#2563eb;
                        color:white;
                        font-size:16px;
                        cursor:pointer;
                    "
                >
                    🔐 Alterar senha
                </button>


                <button
                    id="fecharDadosAluno"
                    style="
                        width:100%;
                        padding:14px;
                        margin-top:10px;
                        border:none;
                        border-radius:10px;
                        background:#1e3a8a;
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


    document
        .getElementById(
            "fecharDadosAluno"
        )
        ?.addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "janelaDadosAluno"
                    )
                    ?.remove();

            }
        );


    document
        .getElementById(
            "alterarSenhaAluno"
        )
        ?.addEventListener(
            "click",
            function () {

                window.alterarSenha();

            }
        );

};


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


    if (
        antiga.trim() === ""
    ) {

        alert(
            "Digite a senha atual."
        );

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
            confirmar === null
        ) {

            return;

        }


        if (
            novaSenha !== confirmar
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
            "Erro ao alterar senha:",
            erro
        );


        alert(
            "❌ Não foi possível alterar a senha.\n\n" +
            erro.message
        );

    }

};


// =====================================================
// SAIR DA CONTA
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


    console.log(
        "🚪 Sessão do aluno encerrada."
    );


    window.location.href =
        "student-login.html";

};


// =====================================================
// CARREGAR DOCUMENTOS DE NOTAS
// =====================================================

async function carregarDocumentosNotas() {

    const turmaId =
        String(
            aluno.turmaId || ""
        ).trim();


    const escolaId =
        String(
            aluno.escolaId || ""
        ).trim();


    if (!turmaId) {

        throw new Error(
            "Turma do aluno não identificada."
        );

    }


    const snapshot =
        await getDocs(
            collection(
                db,
                "notas"
            )
        );


    const documentos = [];


    snapshot.forEach(
        documento => {

            const dados =
                documento.data();


            if (
                escolaId &&
                dados.escolaId &&
                String(
                    dados.escolaId
                ).trim() !== escolaId
            ) {

                return;

            }


            if (
                String(
                    dados.turmaId || ""
                ).trim() !== turmaId
            ) {

                return;

            }


            if (
                !Array.isArray(
                    dados.alunos
                )
            ) {

                return;

            }


            const alunoNota =
                dados.alunos.find(
                    item => {

                        const numero =
                            String(
                                item.numero || ""
                            ).trim();


                        const codigo =
                            String(
                                item.codigoAluno || ""
                            ).trim();


                        const id =
                            String(
                                item.id || ""
                            ).trim();


                        const nome =
                            String(
                                item.nome || ""
                            )
                            .trim()
                            .toLowerCase();


                        return (

                            (
                                aluno.id &&
                                id ===
                                String(
                                    aluno.id
                                ).trim()
                            )

                            ||

                            (
                                aluno.numero &&
                                numero ===
                                String(
                                    aluno.numero
                                ).trim()
                            )

                            ||

                            (
                                aluno.codigoAluno &&
                                codigo ===
                                String(
                                    aluno.codigoAluno
                                ).trim()
                            )

                            ||

                            (
                                aluno.nome &&
                                nome ===
                                String(
                                    aluno.nome
                                )
                                .trim()
                                .toLowerCase()
                            )

                        );

                    }
                );


            if (!alunoNota) {

                return;

            }


            documentos.push({

                id:
                    documento.id,

                disciplina:
                    dados.disciplina ||
                    documento.id,

                trimestre:
                    dados.trimestre ||
                    "",

                anoLetivo:
                    obterAnoLetivo(
                        dados
                    ),

                escolaId:
                    dados.escolaId ||
                    escolaId,

                turmaId:
                    dados.turmaId ||
                    turmaId,

                alunoNota:
                    alunoNota

            });

        }
    );


    console.log(
        "📊 DOCUMENTOS DE NOTAS:",
        documentos
    );


    return documentos;

}


// =====================================================
// VERIFICAR PAGAMENTO DO TRIMESTRE
// =====================================================

async function verificarPagamentoTrimestre(
    trimestreSelecionado
) {

    const escolaId =
        String(
            aluno.escolaId ||
            sessionStorage.getItem(
                "escolaId"
            ) ||
            localStorage.getItem(
                "escolaId"
            ) ||
            ""
        ).trim();


    const alunoId =
        String(
            aluno.id || ""
        ).trim();


    if (!escolaId) {

        throw new Error(
            "Escola do aluno não identificada."
        );

    }


    if (!alunoId) {

        throw new Error(
            "ID do aluno não identificado."
        );

    }


    const financeiroId =
        `${escolaId}_${alunoId}`;


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
            "💰 Documento financeiro não encontrado."
        );


        return false;

    }


    const dados =
        snapshot.data();


    let chave =
        "";


    if (
        String(
            trimestreSelecionado
        ) === "1"
    ) {

        chave =
            "1trimestre";

    }

    else if (
        String(
            trimestreSelecionado
        ) === "2"
    ) {

        chave =
            "2trimestre";

    }

    else if (
        String(
            trimestreSelecionado
        ) === "3"
    ) {

        chave =
            "3trimestre";

    }


    if (!chave) {

        return false;

    }


    const pagamento =
        dados?.[chave];


    console.log(
        "💰 SITUAÇÃO FINANCEIRA:",
        chave,
        pagamento
    );


    return (
        pagamento &&
        pagamento.pago === true
    );

}

// =====================================================
// MENU DE SELEÇÃO — ANO LETIVO + TRIMESTRE
// =====================================================

async function abrirSelecaoNotas(
    tipo
) {

    try {

        const documentos =
            await carregarDocumentosNotas();


        if (
            documentos.length === 0
        ) {

            alert(
                "📄 Ainda não existem notas disponíveis."
            );

            return;

        }


        // =================================================
        // OBTER ANOS LETIVOS DISPONÍVEIS
        // =================================================

        const anos = [
            ...new Set(
                documentos.map(
                    item =>
                        String(
                            item.anoLetivo || ""
                        ).trim()
                )
            )
        ]
        .filter(
            ano =>
                ano !== ""
        );


        if (
            anos.length === 0
        ) {

            alert(
                "❌ Nenhum ano letivo disponível."
            );

            return;

        }


        // =================================================
        // CRIAR JANELA
        // =================================================

        document
            .getElementById(
                "janelaSelecaoNotas"
            )
            ?.remove();


        const janela =
            document.createElement(
                "div"
            );


        janela.id =
            "janelaSelecaoNotas";


        janela.style.cssText = `
            position:fixed;
            inset:0;
            z-index:99999;
            background:rgba(15,23,42,.65);
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;
        `;


        janela.innerHTML = `

            <div
                style="
                    width:100%;
                    max-width:500px;
                    background:white;
                    border-radius:18px;
                    padding:25px;
                    box-shadow:0 10px 30px rgba(0,0,0,.25);
                "
            >

                <div
                    style="
                        text-align:center;
                        font-size:48px;
                        margin-bottom:10px;
                    "
                >
                    ${
                        tipo === "boletim"
                            ? "📄"
                            : "📊"
                    }
                </div>


                <h2
                    style="
                        text-align:center;
                        color:#1e3a8a;
                        margin:0 0 25px;
                    "
                >
                    ${
                        tipo === "boletim"
                            ? "Ver Boletim"
                            : "Ver Notas"
                    }
                </h2>


                <label
                    style="
                        display:block;
                        font-weight:bold;
                        margin-bottom:8px;
                    "
                >
                    Ano Letivo
                </label>


                <select
                    id="anoLetivoSelecionado"
                    style="
                        width:100%;
                        padding:13px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
                        margin-bottom:20px;
                        font-size:16px;
                    "
                >

                    <option value="">
                        Selecionar ano letivo
                    </option>

                    ${
                        anos.map(
                            ano => `
                                <option value="${escaparHTML(ano)}">
                                    ${escaparHTML(ano)}
                                </option>
                            `
                        ).join("")
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
                    id="trimestreSelecionado"
                    style="
                        width:100%;
                        padding:13px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
                        margin-bottom:20px;
                        font-size:16px;
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


                <div
                    id="mensagemFinanceira"
                    style="
                        display:none;
                        margin-bottom:15px;
                        padding:12px;
                        border-radius:10px;
                        text-align:center;
                        font-weight:bold;
                    "
                ></div>


                <button
                    id="abrirResultadoNotas"
                    style="
                        width:100%;
                        padding:14px;
                        border:none;
                        border-radius:10px;
                        background:#2563eb;
                        color:white;
                        font-size:16px;
                        font-weight:bold;
                        cursor:pointer;
                    "
                >
                    ${
                        tipo === "boletim"
                            ? "📄 Ver Boletim"
                            : "📊 Ver Notas"
                    }
                </button>


                <button
                    id="fecharSelecaoNotas"
                    style="
                        width:100%;
                        padding:14px;
                        border:none;
                        border-radius:10px;
                        background:#64748b;
                        color:white;
                        font-size:16px;
                        margin-top:10px;
                        cursor:pointer;
                    "
                >
                    ← Voltar
                </button>

            </div>

        `;


        document.body.appendChild(
            janela
        );


        // =================================================
        // ELEMENTOS
        // =================================================

        const anoSelect =
            document.getElementById(
                "anoLetivoSelecionado"
            );


        const trimestreSelect =
            document.getElementById(
                "trimestreSelecionado"
            );


        const botao =
            document.getElementById(
                "abrirResultadoNotas"
            );


        const mensagem =
            document.getElementById(
                "mensagemFinanceira"
            );


        // =================================================
        // FECHAR
        // =================================================

        document
            .getElementById(
                "fecharSelecaoNotas"
            )
            ?.addEventListener(
                "click",
                () => {

                    janela.remove();

                }
            );


        // =================================================
        // VERIFICAR SE EXISTEM NOTAS
        // =================================================

        function verificarSelecao() {

            const ano =
                anoSelect.value;


            const trimestre =
                trimestreSelect.value;


            botao.disabled =
                !ano ||
                !trimestre;


            if (
                !ano ||
                !trimestre
            ) {

                mensagem.style.display =
                    "none";

                return;

            }


            const existe =
                documentos.some(
                    item => {

                        const anoItem =
                            String(
                                item.anoLetivo ||
                                ""
                            ).trim();


                        const trimestreItem =
                            obterNumeroTrimestre(
                                item.trimestre
                            );


                        return (
                            anoItem === ano &&
                            trimestreItem ===
                            trimestre
                        );

                    }
                );


            if (!existe) {

                mensagem.style.display =
                    "block";

                mensagem.style.background =
                    "#fef3c7";

                mensagem.style.color =
                    "#92400e";

                mensagem.textContent =
                    "⚠️ Ainda não existem notas para este período.";

                botao.disabled =
                    true;

                return;

            }


            mensagem.style.display =
                "block";

            mensagem.style.background =
                "#e0f2fe";

            mensagem.style.color =
                "#075985";

            mensagem.textContent =
                "🔎 Verificando situação financeira...";

        }


        anoSelect.addEventListener(
            "change",
            verificarSelecao
        );


        trimestreSelect.addEventListener(
            "change",
            verificarSelecao
        );


        // =================================================
        // ABRIR RESULTADO
        // =================================================

        botao.addEventListener(
            "click",
            async () => {

                const ano =
                    anoSelect.value;


                const trimestre =
                    trimestreSelect.value;


                if (
                    !ano ||
                    !trimestre
                ) {

                    alert(
                        "Selecione o ano letivo e o trimestre."
                    );

                    return;

                }


                botao.disabled =
                    true;


                botao.textContent =
                    "⏳ A verificar...";


                mensagem.style.display =
                    "block";


                mensagem.style.background =
                    "#e0f2fe";

                mensagem.style.color =
                    "#075985";

                mensagem.textContent =
                    "🔎 A verificar situação financeira...";


                try {

                    // =====================================
                    // VERIFICAR PAGAMENTO
                    // =====================================

                    const pago =
                        await verificarPagamentoTrimestre(
                            trimestre
                        );


                    console.log(
                        "💰 PAGAMENTO:",
                        pago
                    );


                    // =====================================
                    // NÃO PAGO
                    // =====================================

                    if (!pago) {

                        mensagem.style.background =
                            "#fee2e2";

                        mensagem.style.color =
                            "#991b1b";


                        mensagem.textContent =
                            "🔒 Este trimestre está bloqueado porque a situação financeira não está regularizada.";


                        alert(
                            "🔒 Acesso bloqueado.\n\n" +
                            "A situação financeira deste trimestre consta como não paga."
                        );


                        botao.disabled =
                            false;


                        botao.textContent =
                            tipo === "boletim"
                                ? "📄 Ver Boletim"
                                : "📊 Ver Notas";


                        return;

                    }


                    // =====================================
                    // PAGO
                    // =====================================

                    mensagem.style.background =
                        "#dcfce7";

                    mensagem.style.color =
                        "#166534";


                    mensagem.textContent =
                        "✅ Pagamento confirmado. A abrir...";


                    const notasFiltradas =
                        documentos.filter(
                            item => {

                                return (

                                    String(
                                        item.anoLetivo ||
                                        ""
                                    ).trim() ===
                                    String(
                                        ano
                                    ).trim()

                                    &&

                                    obterNumeroTrimestre(
                                        item.trimestre
                                    ) ===
                                    String(
                                        trimestre
                                    )

                                );

                            }
                        );


                    if (
                        notasFiltradas.length === 0
                    ) {

                        alert(
                            "Não existem notas para este período."
                        );


                        botao.disabled =
                            false;


                        return;

                    }


                    janela.remove();


                    if (
                        tipo === "boletim"
                    ) {

                        await mostrarBoletimSelecionado(
                            notasFiltradas,
                            ano,
                            trimestre
                        );

                    }

                    else {

                        await mostrarNotasSelecionadas(
                            notasFiltradas,
                            ano,
                            trimestre
                        );

                    }

                }

                catch (erro) {

                    console.error(
                        "❌ Erro ao verificar acesso:",
                        erro
                    );


                    alert(
                        "❌ Não foi possível verificar o acesso.\n\n" +
                        erro.message
                    );


                    botao.disabled =
                        false;


                    botao.textContent =
                        tipo === "boletim"
                            ? "📄 Ver Boletim"
                            : "📊 Ver Notas";

                }

            }
        );

    }

    catch (erro) {

        console.error(
            "❌ Erro ao abrir seleção:",
            erro
        );


        alert(
            "❌ Não foi possível carregar as opções.\n\n" +
            erro.message
        );

    }

}


// =====================================================
// MOSTRAR NOTAS SELECIONADAS
// =====================================================

async function mostrarNotasSelecionadas(
    documentos,
    ano,
    trimestre
) {

    const escola =
        await obterDadosEscola();


    document
        .getElementById(
            "janelaNotasAluno"
        )
        ?.remove();


    const janela =
        document.createElement(
            "div"
        );


    janela.id =
        "janelaNotasAluno";


    janela.style.cssText = `
        position:fixed;
        inset:0;
        z-index:99999;
        background:#f1f5f9;
        overflow-y:auto;
        padding:20px;
    `;


    let linhas =
        "";


    documentos.forEach(
        item => {

            const nota =
                item.alunoNota ||
                {};


            const mac =
                nota.mac ??
                nota.MAC ??
                "";


            const npt =
                nota.npt ??
                nota.NPT ??
                "";


            const mf =
                nota.mf ??
                nota.MF ??
                "";


            const classificacao =
                nota.classificacao ||
                "";


            linhas += `

                <tr>

                    <td>
                        ${escaparHTML(
                            item.disciplina
                        )}
                    </td>

                    <td>
                        ${mostrarNota(mac)}
                    </td>

                    <td>
                        ${mostrarNota(npt)}
                    </td>

                    <td>
                        ${mostrarNota(mf)}
                    </td>

                    <td>
                        ${escaparHTML(
                            classificacao
                        )}
                    </td>

                </tr>

            `;

        }
    );


    janela.innerHTML = `

        <div
            style="
                max-width:900px;
                margin:20px auto;
                background:white;
                border-radius:18px;
                padding:25px;
                box-shadow:0 4px 20px rgba(0,0,0,.15);
            "
        >

            <div
                style="
                    text-align:center;
                    margin-bottom:20px;
                "
            >

                ${
                    escola.logo
                    ? `
                        <img
                            src="${escaparHTML(
                                escola.logo
                            )}"
                            style="
                                max-width:90px;
                                max-height:90px;
                                object-fit:contain;
                                margin-bottom:10px;
                            "
                        >
                    `
                    : ""
                }


                <h2
                    style="
                        color:#1e3a8a;
                        margin:5px 0;
                    "
                >
                    ${escaparHTML(
                        escola.nome
                    )}
                </h2>


                <h3
                    style="
                        margin:5px 0;
                    "
                >
                    Minhas Notas
                </h3>


                <p>
                    <strong>Aluno:</strong>
                    ${escaparHTML(
                        aluno.nome
                    )}
                </p>


                <p>
                    <strong>Turma:</strong>
                    ${escaparHTML(
                        aluno.turmaNome || "—"
                    )}
     </p>


                <p>
                    <strong>Ano Letivo:</strong>
                    ${escaparHTML(
                        ano
                    )}
                </p>


                <p>
                    <strong>Trimestre:</strong>
                    ${escaparHTML(
                        nomeTrimestre(
                            trimestre
                        )
                    )}
                </p>

            </div>


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

                            <th style="padding:12px;">
                                Disciplina
                            </th>

                            <th style="padding:12px;">
                                MAC
                            </th>

                            <th style="padding:12px;">
                                NPT
                            </th>

                            <th style="padding:12px;">
                                MF
                            </th>

                            <th style="padding:12px;">
                                Classificação
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            linhas ||
                            `
                                <tr>
                                    <td
                                        colspan="5"
                                        style="
                                            text-align:center;
                                            padding:20px;
                                        "
                                    >
                                        Nenhuma nota encontrada.
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>


            <button
                id="imprimirBoletimAluno"
                style="
                    width:100%;
                    padding:14px;
                    margin-top:20px;
                    border:none;
                    border-radius:10px;
                    background:#2563eb;
                    color:white;
                    font-size:16px;
                    cursor:pointer;
                "
            >
                🖨️ Imprimir / Guardar PDF
            </button>


            <button
                id="fecharBoletimAluno"
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

    `;


    document.body.appendChild(
        janela
    );


    document
        .getElementById(
            "fecharBoletimAluno"
        )
        ?.addEventListener(
            "click",
            () => {

                janela.remove();

            }
        );


    document
        .getElementById(
            "imprimirBoletimAluno"
        )
        ?.addEventListener(
            "click",
            () => {

                window.print();

            }
        );

}

// =====================================================
// CARREGAR DOCUMENTOS DE NOTAS
// =====================================================

async function carregarDocumentosNotas() {

    const turmaId =
        String(
            aluno.turmaId || ""
        ).trim();


    const escolaId =
        String(
            aluno.escolaId || ""
        ).trim();


    if (!turmaId) {

        throw new Error(
            "Turma do aluno não identificada."
        );

    }


    const snapshot =
        await getDocs(
            collection(
                db,
                "notas"
            )
        );


    const documentos = [];


    snapshot.forEach(
        documento => {

            const dados =
                documento.data();


            // =============================================
            // FILTRAR TURMA
            // =============================================

            if (
                String(
                    dados.turmaId || ""
                ).trim() !== turmaId
            ) {

                return;

            }


            // =============================================
            // FILTRAR ESCOLA
            // =============================================

            if (
                escolaId &&
                dados.escolaId &&
                String(
                    dados.escolaId
                ).trim() !== escolaId
            ) {

                return;

            }


            // =============================================
            // PROCURAR ALUNO
            // =============================================

            if (
                !Array.isArray(
                    dados.alunos
                )
            ) {

                return;

            }


            const alunoNota =
                dados.alunos.find(
                    item => {

                        const id =
                            String(
                                item.id || ""
                            ).trim();


                        const numero =
                            String(
                                item.numero || ""
                            ).trim();


                        const codigo =
                            String(
                                item.codigoAluno || ""
                            ).trim();


                        const nome =
                            String(
                                item.nome || ""
                            )
                            .trim()
                            .toLowerCase();


                        return (

                            (
                                aluno.id &&
                                id ===
                                String(
                                    aluno.id
                                ).trim()
                            )

                            ||

                            (
                                aluno.numero &&
                                numero ===
                                String(
                                    aluno.numero
                                ).trim()
                            )

                            ||

                            (
                                aluno.codigoAluno &&
                                codigo ===
                                String(
                                    aluno.codigoAluno
                                ).trim()
                            )

                            ||

                            (
                                aluno.nome &&
                                nome ===
                                String(
                                    aluno.nome
                                )
                                .trim()
                                .toLowerCase()
                            )

                        );

                    }
                );


            if (!alunoNota) {

                return;

            }


            documentos.push({

                id:
                    documento.id,

                ...dados,

                alunoNota:
                    alunoNota

            });

        }
    );


    console.log(
        "📊 DOCUMENTOS DE NOTAS DO ALUNO:",
        documentos
    );


    return documentos;

}


// =====================================================
// OBTER NÚMERO DO TRIMESTRE
// =====================================================

function obterNumeroTrimestre(
    trimestre
) {

    const valor =
        String(
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
        .trim();


    if (
        valor.includes("1")
    ) {

        return "1";

    }


    if (
        valor.includes("2")
    ) {

        return "2";

    }


    if (
        valor.includes("3")
    ) {

        return "3";

    }


    return valor;

}


// =====================================================
// OBTER DADOS DA ESCOLA
// =====================================================

async function obterDadosEscola() {

    const escolaId =
        String(
            aluno.escolaId || ""
        ).trim();


    if (!escolaId) {

        return {

            nome:
                "Escola",

            logo:
                ""

        };

    }


    try {

        const escolaRef =
            doc(
                db,
                "escolas",
                escolaId
            );


        const snapshot =
            await getDoc(
                escolaRef
            );


        if (
            snapshot.exists()
        ) {

            const dados =
                snapshot.data();


            return {

                nome:
                    dados.nome ||
                    dados.nomeEscola ||
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
            "Erro ao carregar escola:",
            erro
        );

    }


    return {

        nome:
            "Escola",

        logo:
            ""

    };

}


// =====================================================
// VERIFICAR SITUAÇÃO FINANCEIRA
// =====================================================

async function verificarPagamentoTrimestre(
    trimestre
) {

    const alunoId =
        String(
            aluno.id || ""
        ).trim();


    const turmaId =
        String(
            aluno.turmaId || ""
        ).trim();


    const escolaId =
        String(
            aluno.escolaId || ""
        ).trim();


    const codigoAluno =
        String(
            aluno.codigoAluno || ""
        ).trim();


    if (
        !alunoId &&
        !codigoAluno
    ) {

        throw new Error(
            "Aluno não identificado para verificar o pagamento."
        );

    }


    // =================================================
    // PROCURAR REGISTOS FINANCEIROS
    // =================================================

    const snapshot =
        await getDocs(
            collection(
                db,
                "financeiro"
            )
        );


    let encontrado =
        false;


    let pago =
        false;


    snapshot.forEach(
        documento => {

            const dados =
                documento.data();


            // =========================================
            // ESCOLA
            // =========================================

            if (
                escolaId &&
                dados.escolaId &&
                String(
                    dados.escolaId
                ).trim() !== escolaId
            ) {

                return;

            }


            // =========================================
            // TURMA
            // =========================================

            if (
                turmaId &&
                dados.turmaId &&
                String(
                    dados.turmaId
                ).trim() !== turmaId
            ) {

                return;

            }


            // =========================================
            // IDENTIFICAR ALUNO
            // =========================================

            const idFinanceiro =
                String(
                    dados.alunoId ||
                    dados.idAluno ||
                    ""
                ).trim();


            const codigoFinanceiro =
                String(
                    dados.codigoAluno ||
                    dados.codigo ||
                    ""
                ).trim();


            const numeroFinanceiro =
                String(
                    dados.numero ||
                    dados.numeroAluno ||
                    ""
                ).trim();


            const pertenceAoAluno =

                (
                    alunoId &&
                    idFinanceiro &&
                    idFinanceiro === alunoId
                )

                ||

                (
                    codigoAluno &&
                    codigoFinanceiro &&
                    codigoFinanceiro === codigoAluno
                )

                ||

                (
                    aluno.numero &&
                    numeroFinanceiro &&
                    numeroFinanceiro ===
                    String(
                        aluno.numero
                    ).trim()
                );


            if (
                !pertenceAoAluno
            ) {

                return;

            }


            // =========================================
            // TRIMESTRE
            // =========================================

            const trimestreFinanceiro =
                obterNumeroTrimestre(
                    dados.trimestre ||
                    dados.periodo ||
                    ""
                );


            if (
                trimestreFinanceiro &&
                trimestreFinanceiro !==
                String(
                    trimestre
                )
            ) {

                return;

            }


            encontrado =
                true;


            // =========================================
            // VERIFICAR ESTADO
            // =========================================

            const estado =
                String(
                    dados.estado ||
                    dados.status ||
                    dados.situacao ||
                    dados.estadoPagamento ||
                    ""
                )
                .trim()
                .toLowerCase();


            if (
                dados.pago === true ||
                dados.pagamentoConfirmado === true ||
                estado === "pago" ||
                estado === "paga" ||
                estado === "regularizado" ||
                estado === "regularizada"
            ) {

                pago =
                    true;

            }

        }
    );


    console.log(
        "💰 RESULTADO FINANCEIRO:",
        {
            alunoId,
            codigoAluno,
            trimestre,
            encontrado,
            pago
        }
    );


    // =================================================
    // SEM REGISTO = NÃO PAGO
    // =================================================

    if (
        !encontrado
    ) {

        return false;

    }


    return pago;

}


// =====================================================
// MENU — VER NOTAS
// =====================================================

window.verNotas =
async function () {

    console.log(
        "📊 VER NOTAS"
    );


    await abrirSelecaoNotas(
        "notas"
    );

};


// =====================================================
// MENU — VER BOLETIM
// =====================================================

window.verBoletim =
async function () {

    console.log(
        "📄 VER BOLETIM"
    );


    await abrirSelecaoNotas(
        "boletim"
    );

};


// =====================================================
// LIGAÇÃO AUTOMÁTICA DOS BOTÕES
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // =============================================
        // POSSÍVEIS IDs DO BOTÃO VER NOTAS
        // =============================================

        const botoesNotas = [

            document.getElementById(
                "verNotas"
            ),

            document.getElementById(
                "btnVerNotas"
            ),

            document.getElementById(
                "menuVerNotas"
            )

        ];


        botoesNotas.forEach(
            botao => {

                if (!botao)
                    return;


                botao.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        window.verNotas();

                    }
                );

            }
        );


        // =============================================
        // POSSÍVEIS IDs DO BOTÃO VER BOLETIM
        // =============================================

        const botoesBoletim = [

            document.getElementById(
                "verBoletim"
            ),

            document.getElementById(
                "btnVerBoletim"
            ),

            document.getElementById(
                "menuVerBoletim"
            )

        ];


        botoesBoletim.forEach(
            botao => {

                if (!botao)
                    return;


                botao.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        window.verBoletim();

                    }
                );

            }
        );

    }
);


// =====================================================
// COMPATIBILIDADE COM MENUS EXISTENTES
// =====================================================

window.abrirVerNotas =
function () {

    window.verNotas();

};


window.abrirVerBoletim =
function () {

    window.verBoletim();

};


// =====================================================
// FINAL
// =====================================================

console.log(
    "========================================"
);

alert("COMPLETO CARREGAMENTO");

console.log(
    "🎓 STUDENT-AREA.JS CARREGADO COMPLETAMENTE"
);

console.log(
    "📊 Ver Notas: pronto"
);

console.log(
    "📄 Ver Boletim: pronto"
);

console.log(
    "💰 Controlo financeiro: pronto"
);

console.log(
    "========================================"
);
