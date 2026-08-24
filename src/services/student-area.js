/* =====================================================
   SGE — ÁREA DO ALUNO
   student-area.js
   BLOCO 1/4

   - Sessão
   - Perfil
   - Utilidades
   - Escola
   - Identificação
===================================================== */

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

alert("Carregar...");

console.log(
    "🎓 SGE — student-area.js iniciado"
);


// =====================================================
// SESSÃO DO ALUNO
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
        "❌ Erro ao ler alunoLogado:",
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
// DADOS DO ALUNO
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
// ELEMENTOS
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
    )
    .trim();

}


// =====================================================
// OBTER ANO LETIVO
// =====================================================

function obterAnoLetivo(
    dados
) {

    return (

        dados?.anoLetivo ||

        dados?.anoLectivo ||

        dados?.ano ||

        dados?.anoLetivoAtual ||

        "Ano letivo atual"

    );

}


// =====================================================
// OBTER NOTA
// ACEITA MAIÚSCULAS E MINÚSCULAS
// =====================================================

function obterNota(
    dados,
    campo
) {

    if (!dados) {

        return "";

    }


    const campoMinusculo =
        campo.toLowerCase();

    const campoMaiusculo =
        campo.toUpperCase();


    return (

        dados[campoMinusculo] ??
        dados[campoMaiusculo] ??
        dados[
            "nota" +
            campoMaiusculo
        ] ??
        dados[
            "nota" +
            campoMinusculo
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
    // SE O ALUNO NÃO TIVER escolaId,
    // TENTAR OBTER ATRAVÉS DA TURMA
    // -------------------------------------------------

    if (!escolaId && aluno.turmaId) {

        try {

            const turmaSnap =
                await getDoc(
                    doc(
                        db,
                        "turmas",
                        String(
                            aluno.turmaId
                        ).trim()
                    )
                );


            if (
                turmaSnap.exists()
            ) {

                escolaId =
                    String(
                        turmaSnap.data().escolaId ||
                        ""
                    ).trim();

            }

        }
        catch (erro) {

            console.warn(
                "⚠️ Não foi possível obter escola pela turma:",
                erro
            );

        }

    }


    if (!escolaId) {

        return {

            nome:
                "Escola",

            logo:
                ""

        };

    }


    try {

        const escolaSnap =
            await getDoc(
                doc(
                    db,
                    "escolas",
                    escolaId
                )
            );


        if (
            escolaSnap.exists()
        ) {

            const dados =
                escolaSnap.data();


            return {

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

        nome:
            "Escola",

        logo:
            ""

    };

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
// VER DADOS DO ALUNO
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


            if (
                String(
                    dados.turmaId || ""
                ).trim() !== turmaId
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


    return Array.from(
        anos
    )
    .sort(
        (a, b) =>
            b.localeCompare(
                a
            )
    );

}


// =====================================================
// ABRIR MENU DE SELEÇÃO
// =====================================================

async function abrirSelecaoNotas(
    tipo
) {

    const antigo =
        document.getElementById(
            "janelaSelecaoNotas"
        );


    if (antigo) {

        antigo.remove();

    }


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

    }


    // =================================================
    // SE NÃO EXISTIR ANO, MOSTRAR O ATUAL
    // =================================================

    if (
        anos.length === 0
    ) {

        const anoAluno =
            aluno.anoLetivo ||
            aluno.anoLectivo ||
            "";


        if (anoAluno) {

            anos.push(
                String(
                    anoAluno
                )
            );

        }

    }


    const opcoesAnos =
        anos.length > 0

            ? anos.map(
                ano =>
                    `
                    <option value="${escaparHTML(ano)}">
                        ${escaparHTML(ano)}
                    </option>
                    `
              ).join("")

            : `
                <option value="">
                    Nenhum ano disponível
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
                    max-width:550px;
                    margin:40px auto;
                    background:white;
                    border-radius:18px;
                    padding:25px;
                    box-shadow:0 5px 25px rgba(0,0,0,.15);
                "
            >

                <div
                    style="
                        text-align:center;
                        font-size:50px;
                    "
                >
                    ${
                        tipo === "boletim"
                            ? "📄"
                            : "📚"
                    }
                </div>


                <h2
                    style="
                        text-align:center;
                        color:#1e3a8a;
                    "
                >
                    ${
                        tipo === "boletim"
                            ? "Ver Boletim"
                            : "Ver Notas"
                    }
                </h2>


                <p
                    style="
                        text-align:center;
                        color:#64748b;
                    "
                >
                    Selecione o ano letivo e o trimestre.
                </p>


                <label>
                    <strong>
                        Ano letivo
                    </strong>
                </label>


                <select
                    id="anoNotasAluno"
                    style="
                        width:100%;
                        padding:14px;
                        margin-top:8px;
                        margin-bottom:20px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
                        font-size:16px;
                        background:white;
                    "
                >

                    ${opcoesAnos}

                </select>


                <label>
                    <strong>
                        Trimestre
                    </strong>
                </label>


                <select
                    id="trimestreNotasAluno"
                    style="
                        width:100%;
                        padding:14px;
                        margin-top:8px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
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
                    style="
                        width:100%;
                        margin-top:25px;
                        padding:14px;
                        border:none;
                        border-radius:10px;
                        background:#2563eb;
                        color:white;
                        font-size:16px;
                        cursor:pointer;
                    "
                >
                    Continuar
                </button>


                <button
                    id="fecharSelecaoNotas"
                    style="
                        width:100%;
                        margin-top:10px;
                        padding:14px;
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


    document
        .getElementById(
            "fecharSelecaoNotas"
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


    document
        .getElementById(
            "confirmarSelecaoNotas"
        )
        ?.addEventListener(
            "click",
            async () => {

                const ano =
                    document
                        .getElementById(
                            "anoNotasAluno"
                        )
                        ?.value
                        .trim();


                const trimestre =
                    document
                        .getElementById(
                            "trimestreNotasAluno"
                        )
                        ?.value
                        .trim();


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


                document
                    .getElementById(
                        "janelaSelecaoNotas"
                    )
                    ?.remove();


                if (
                    tipo === "boletim"
                ) {

                    await verificarPagamentoEBoletim(
                        ano,
                        trimestre
                    );

                }
                else {

                    await verificarPagamentoENotas(
                        ano,
                        trimestre
                    );

                }

            }
        );

       }

// =====================================================
// VERIFICAR PAGAMENTO ANTES DAS NOTAS
// =====================================================

async function verificarPagamentoENotas(
    ano,
    trimestre
) {

    try {

        console.log(
            "💰 A verificar pagamento para VER NOTAS..."
        );


        const pagamento =
            await verificarSituacaoFinanceira(
                ano,
                trimestre
            );


        console.log(
            "💰 RESULTADO FINANCEIRO:",
            pagamento
        );


        if (
            pagamento.pago !== true
        ) {

            mostrarBloqueioFinanceiro(
                ano,
                trimestre,
                "notas"
            );

            return;

        }


        await carregarNotasAluno(
            ano,
            trimestre
        );

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO VERIFICAR PAGAMENTO:",
            erro
        );


        alert(
            "❌ Não foi possível verificar a situação financeira.\n\n" +
            erro.message
        );

    }

}


// =====================================================
// VERIFICAR PAGAMENTO ANTES DO BOLETIM
// =====================================================

async function verificarPagamentoEBoletim(
    ano,
    trimestre
) {

    try {

        console.log(
            "💰 A verificar pagamento para VER BOLETIM..."
        );


        const pagamento =
            await verificarSituacaoFinanceira(
                ano,
                trimestre
            );


        console.log(
            "💰 RESULTADO FINANCEIRO:",
            pagamento
        );


        if (
            pagamento.pago !== true
        ) {

            mostrarBloqueioFinanceiro(
                ano,
                trimestre,
                "boletim"
            );

            return;

        }


        await carregarBoletimAluno(
            ano,
            trimestre
        );

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO VERIFICAR PAGAMENTO:",
            erro
        );


        alert(
            "❌ Não foi possível verificar a situação financeira.\n\n" +
            erro.message
        );

    }

}


// =====================================================
// VERIFICAR SITUAÇÃO FINANCEIRA
//
// A função aceita várias estruturas possíveis,
// para não quebrar caso o financeiro use nomes
// diferentes para os campos.
// =====================================================

async function verificarSituacaoFinanceira(
    ano,
    trimestre
) {

    const alunoId =
        String(
            aluno.id || ""
        ).trim();


    const codigoAluno =
        String(
            aluno.codigoAluno || ""
        ).trim();


    const numeroAluno =
        String(
            aluno.numero || ""
        ).trim();


    const turmaId =
        String(
            aluno.turmaId || ""
        ).trim();


    const escolaId =
        String(
            aluno.escolaId || ""
        ).trim();


    const snapshot =
        await getDocs(
            collection(
                db,
                "financeiro"
            )
        );


    console.log(
        "💰 DOCUMENTOS FINANCEIROS:",
        snapshot.size
    );


    let encontrado =
        null;


    snapshot.forEach(
        documento => {

            if (encontrado) {

                return;

            }


            const dados =
                documento.data();


            console.log(
                "💰 FINANCEIRO:",
                documento.id,
                dados
            );


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
            // ANO
            // =========================================

            const anoFinanceiro =
                obterAnoLetivo(
                    dados
                );


            if (
                anoFinanceiro &&
                String(
                    anoFinanceiro
                ).trim() !==
                String(
                    ano
                ).trim()
            ) {

                return;

            }


            // =========================================
            // TRIMESTRE
            // =========================================

            if (
                dados.trimestre !==
                undefined &&
                dados.trimestre !==
                null &&
                String(
                    normalizarTrimestre(
                        dados.trimestre
                    )
                ) !==
                String(
                    normalizarTrimestre(
                        trimestre
                    )
                )
            ) {

                return;

            }


            // =========================================
            // PROCURAR ALUNO
            // =========================================

            const idFinanceiro =
                String(
                    dados.alunoId ||
                    dados.idAluno ||
                    dados.id ||
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


            const mesmoAluno =

                (
                    alunoId &&
                    idFinanceiro &&
                    alunoId ===
                    idFinanceiro
                )

                ||

                (
                    codigoAluno &&
                    codigoFinanceiro &&
                    codigoAluno ===
                    codigoFinanceiro
                )

                ||

                (
                    numeroAluno &&
                    numeroFinanceiro &&
                    numeroAluno ===
                    numeroFinanceiro
                );


            if (
                mesmoAluno
            ) {

                encontrado =
                    dados;

                return;

            }


            // =========================================
            // CASO O FINANCEIRO GUARDE ALUNOS EM ARRAY
            // =========================================

            if (
                Array.isArray(
                    dados.alunos
                )
            ) {

                const alunoFinanceiro =
                    dados.alunos.find(
                        item => {

                            const id =
                                String(
                                    item.id ||
                                    item.alunoId ||
                                    ""
                                ).trim();


                            const codigo =
                                String(
                                    item.codigoAluno ||
                                    item.codigo ||
                                    ""
                                ).trim();


                            const numero =
                                String(
                                    item.numero ||
                                    item.numeroAluno ||
                                    ""
                                ).trim();


                            return (

                                (
                                    alunoId &&
                                    id &&
                                    id === alunoId
                                )

                                ||

                                (
                                    codigoAluno &&
                                    codigo &&
                                    codigo === codigoAluno
                                )

                                ||

                                (
                                    numeroAluno &&
                                    numero &&
                                    numero === numeroAluno
                                )

                            );

                        }
                    );


                if (
                    alunoFinanceiro
                ) {

                    encontrado = {

                        ...dados,

                        ...alunoFinanceiro

                    };

                }

            }

        }
    );


    // =================================================
    // NENHUM REGISTRO
    // =================================================

    if (
        !encontrado
    ) {

        console.warn(
            "⚠️ Nenhum registo financeiro encontrado."
        );


        // ---------------------------------------------
        // POR SEGURANÇA, NÃO LIBERAR
        // ---------------------------------------------

        return {

            pago:
                false,

            encontrado:
                false

        };

    }


    // =================================================
    // DETECTAR ESTADO DE PAGAMENTO
    // =================================================

    const estado =
        String(

            encontrado.estadoPagamento ||

            encontrado.estadoFinanceiro ||

            encontrado.situacao ||

            encontrado.estado ||

            encontrado.status ||

            ""

        )
        .trim()
        .toLowerCase();


    const pagoCampo =
        encontrado.pago;


    const pagamentoConfirmado =

        pagoCampo === true

        ||

        estado === "pago"

        ||

        estado === "paga"

        ||

        estado === "quitado"

        ||

        estado === "quitada"

        ||

        estado === "liquidado"

        ||

        estado === "liquidada"

        ||

        estado === "sim"

        ||

        estado === "true";


    return {

        pago:
            pagamentoConfirmado,

        encontrado:
            true,

        dados:
            encontrado

    };

}


// =====================================================
// BLOQUEIO FINANCEIRO
// =====================================================

function mostrarBloqueioFinanceiro(
    ano,
    trimestre,
    tipo
) {

    const antigo =
        document.getElementById(
            "janelaFinanceiroBloqueado"
        );


    if (antigo) {

        antigo.remove();

    }


    const html = `

        <div
            id="janelaFinanceiroBloqueado"
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
                    max-width:500px;
                    margin:50px auto;
                    background:white;
                    border-radius:18px;
                    padding:30px;
                    text-align:center;
                    box-shadow:0 5px 25px rgba(0,0,0,.15);
                "
            >

                <div
                    style="
                        font-size:65px;
                        margin-bottom:15px;
                    "
                >
                    🔒
                </div>


                <h2
                    style="
                        color:#dc2626;
                        margin-bottom:15px;
                    "
                >
                    Acesso bloqueado
                </h2>


                <p
                    style="
                        color:#475569;
                        line-height:1.7;
                    "
                >

                    A visualização do
                    ${
                        tipo === "boletim"
                            ? "boletim"
                            : "notas"
                    }
                    está bloqueada porque a situação
                    financeira deste período consta
                    como <strong>não paga</strong>.

                </p>


                <p
                    style="
                        color:#64748b;
                    "
                >

                    Ano letivo:
                    <strong>
                        ${escaparHTML(ano)}
                    </strong>

                    <br>

                    Trimestre:
                    <strong>
                        ${escaparHTML(
                            nomeTrimestre(
                                trimestre
                            )
                        )}
                    </strong>

                </p>


                <button
                    id="fecharFinanceiroBloqueado"
                    style="
                        width:100%;
                        padding:14px;
                        margin-top:20px;
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
            "fecharFinanceiroBloqueado"
        )
        ?.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "janelaFinanceiroBloqueado"
                    )
                    ?.remove();

            }
        );

}


// =====================================================
// CARREGAR NOTAS DO ALUNO
// =====================================================

async function carregarNotasAluno(
    anoSelecionado,
    trimestreSelecionado
) {

    console.log(
        "📚 A CARREGAR NOTAS:",
        {
            anoSelecionado,
            trimestreSelecionado
        }
    );


    const turmaId =
        String(
            aluno.turmaId || ""
        ).trim();


    const alunoId =
        String(
            aluno.id || ""
        ).trim();


    const codigoAluno =
        String(
            aluno.codigoAluno || ""
        ).trim();


    const numeroAluno =
        String(
            aluno.numero || ""
        ).trim();


    const nomeAluno =
        String(
            aluno.nome || ""
        )
        .trim()
        .toLowerCase();


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


    const resultados = [];


    snapshot.forEach(
        documento => {

            const dados =
                documento.data();


            // =========================================
            // TURMA
            // =========================================

            if (
                String(
                    dados.turmaId || ""
                ).trim() !== turmaId
            ) {

                return;

            }


            // =========================================
            // ANO
            // =========================================

            const anoNota =
                normalizarAnoLetivo(
                    obterAnoLetivo(
                        dados
                    )
                );


            if (
                anoNota !==
                normalizarAnoLetivo(
                    anoSelecionado
                )
            ) {

                return;

            }


            // =========================================
            // TRIMESTRE
            // =========================================

            if (
                normalizarTrimestre(
                    dados.trimestre
                ) !==
                normalizarTrimestre(
                    trimestreSelecionado
                )
            ) {

                return;

            }


            // =========================================
            // ALUNOS
            // =========================================

            if (
                !Array.isArray(
                    dados.alunos
                )
            ) {

                return;

            }


            // =========================================
            // PROCURAR O ALUNO
            // =========================================

            const alunoNota =
                dados.alunos.find(
                    item => {

                        const id =
                            String(
                                item.id ||
                                item.alunoId ||
                                ""
                            ).trim();


                        const codigo =
                            String(
                                item.codigoAluno ||
                                ""
                            ).trim();


                        const numero =
                            String(
                                item.numero ||
                                ""
                            ).trim();


                        const nome =
                            String(
                                item.nome ||
                                ""
                            )
                            .trim()
                            .toLowerCase();


                        return (

                            (
                                alunoId &&
                                id &&
                                id === alunoId
                            )

                            ||

                            (
                                codigoAluno &&
                                codigo &&
                                codigo === codigoAluno
                            )

                            ||

                            (
                                numeroAluno &&
                                numero &&
                                numero === numeroAluno
                            )

                            ||

                            (
                                nomeAluno &&
                                nome &&
                                nome === nomeAluno
                            )

                        );

                    }
                );


            if (
                !alunoNota
            ) {

                return;

            }


            // =================================================
            // AQUI ESTÁ A CORREÇÃO PRINCIPAL
            //
            // MINI-PAUTA GRAVA:
            // mac
            // npt
            // mf
            //
            // A ÁREA DO ALUNO AGORA ACEITA TAMBÉM:
            // MAC
            // NPT
            // MF
            // =================================================

       const MAC =
                obterNota(
                    alunoNota,
                    "MAC"
                );


            const NPT =
                obterNota(
                    alunoNota,
                    "NPT"
                );


            const MF =
                obterNota(
                    alunoNota,
                    "MF"
                );


            const classificacao =
                alunoNota.classificacao ??
                alunoNota.Classificacao ??
                "";


            resultados.push({

                disciplina:
                    dados.disciplina ||
                    documento.id,

                trimestre:
                    dados.trimestre,

                anoLetivo:
                    obterAnoLetivo(
                        dados
                    ),

                MAC:
                    MAC,

                NPT:
                    NPT,

                MF:
                    MF,

                classificacao:
                    classificacao

            });

        }
    );


    console.log(
        "✅ RESULTADOS DAS NOTAS:",
        resultados
    );


    if (
        resultados.length === 0
    ) {

        alert(
            "📚 Ainda não existem notas lançadas para este aluno no período selecionado."
        );

        return;

    }


    mostrarNotasAluno(
        resultados,
        anoSelecionado,
        trimestreSelecionado
    );

}


// =====================================================
// MOSTRAR NOTAS
// =====================================================

async function mostrarNotasAluno(
    notas,
    anoSelecionado,
    trimestreSelecionado
) {

    const antiga =
        document.getElementById(
            "janelaNotasAluno"
        );


    if (antiga) {

        antiga.remove();

    }


    let linhas = "";


    notas.forEach(
        item => {

            linhas += `

                <tr>

                    <td
                        style="
                            border:1px solid #cbd5e1;
                            padding:12px;
                        "
                    >
                        ${escaparHTML(
                            item.disciplina ||
                            "—"
                        )}
                    </td>


                    <td
                        style="
                            border:1px solid #cbd5e1;
                            padding:12px;
                            text-align:center;
                        "
                    >
                        ${escaparHTML(
                            mostrarNota(
                                item.MAC
                            )
                        )}
                    </td>


                    <td
                        style="
                            border:1px solid #cbd5e1;
                            padding:12px;
                            text-align:center;
                        "
                    >
                        ${escaparHTML(
                            mostrarNota(
                                item.NPT
                            )
                        )}
                    </td>


                    <td
                        style="
                            border:1px solid #cbd5e1;
                            padding:12px;
                            text-align:center;
                        "
                    >
                        ${escaparHTML(
                            mostrarNota(
                                item.MF
                            )
                        )}
                    </td>


                    <td
                        style="
                            border:1px solid #cbd5e1;
                            padding:12px;
                            text-align:center;
                        "
                    >
                        ${escaparHTML(
                            item.classificacao ||
                            "—"
                        )}
                    </td>

                </tr>

            `;

        }
    );


    const escola =
        await obterDadosEscola();

}

// =====================================================
// CONTINUAÇÃO — MOSTRAR NOTAS
// =====================================================

    const escolaNome =
        escola?.nome ||
        "Escola";


    const escolaLogo =
        escola?.logo ||
        "";


    const logoHTML =
        escolaLogo
            ? `
                <img
                    src="${escaparHTML(escolaLogo)}"
                    alt="Logo"
                    style="
                        max-width:90px;
                        max-height:90px;
                        object-fit:contain;
                        margin-bottom:10px;
                    "
                >
              `
            : "";


    const html = `

        <div
            id="janelaNotasAluno"
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
                    max-width:1000px;
                    margin:20px auto;
                    background:white;
                    border-radius:18px;
                    padding:25px;
                    box-shadow:0 5px 25px rgba(0,0,0,.15);
                "
            >

                <div
                    style="
                        text-align:center;
                        margin-bottom:25px;
                    "
                >

                    ${logoHTML}

                    <h2
                        style="
                            margin:0;
                            color:#1e3a8a;
                        "
                    >
                        ${escaparHTML(
                            escolaNome
                        )}
                    </h2>


                    <h3
                        style="
                            margin:10px 0;
                            color:#334155;
                        "
                    >
                        📚 Minhas Notas
                    </h3>


                    <p
                        style="
                            margin:5px;
                        "
                    >
                        <strong>
                            ${escaparHTML(
                                aluno.nome ||
                                "Aluno"
                            )}
                        </strong>
                    </p>


                    <p
                        style="
                            margin:5px;
                            color:#64748b;
                        "
                    >
                        Código:
                        ${escaparHTML(
                            aluno.codigoAluno ||
                            "—"
                        )}
                    </p>


                    <p
                        style="
                            margin:5px;
                            color:#64748b;
                        "
                    >
                        Turma:
                        ${escaparHTML(
                            aluno.turmaNome ||
                            "—"
                        )}
                    </p>


                    <p
                        style="
                            margin:10px 0;
                            color:#475569;
                        "
                    >
                        <strong>
                            ${escaparHTML(
                                anoSelecionado
                            )}
                        </strong>
                        —
                        <strong>
                            ${escaparHTML(
                                nomeTrimestre(
                                    trimestreSelecionado
                                )
                            )}
                        </strong>
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
                            min-width:700px;
                            border-collapse:collapse;
                        "
                    >

                        <thead>

                            <tr>

                                <th
                                    style="
                                        border:1px solid #cbd5e1;
                                        padding:12px;
                                        background:#dbeafe;
                                        color:#1e3a8a;
                                    "
                                >
                                    Disciplina
                                </th>


                                <th
                                    style="
                                        border:1px solid #cbd5e1;
                                        padding:12px;
                                        background:#dbeafe;
                                        color:#1e3a8a;
                                    "
                                >
                                    MAC
                                </th>


                                <th
                                    style="
                                        border:1px solid #cbd5e1;
                                        padding:12px;
                                        background:#dbeafe;
                                        color:#1e3a8a;
                                    "
                                >
                                    NPT
                                </th>


                                <th
                                    style="
                                        border:1px solid #cbd5e1;
                                        padding:12px;
                                        background:#dbeafe;
                                        color:#1e3a8a;
                                    "
                                >
                                    MF
                                </th>


                                <th
                                    style="
                                        border:1px solid #cbd5e1;
                                        padding:12px;
                                        background:#dbeafe;
                                        color:#1e3a8a;
                                    "
                                >
                                    Classificação
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${linhas}

                        </tbody>

                    </table>

                </div>


                <button
                    id="imprimirNotasAluno"
                    style="
                        width:100%;
                        margin-top:25px;
                        padding:14px;
                        border:none;
                        border-radius:10px;
                        background:#2563eb;
                        color:white;
                        font-size:16px;
                        cursor:pointer;
                    "
                >
                    🖨️ Imprimir notas
                </button>


                <button
                    id="fecharNotasAluno"
                    style="
                        width:100%;
                        margin-top:10px;
                        padding:14px;
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


    // =================================================
    // FECHAR
    // =================================================

    document
        .getElementById(
            "fecharNotasAluno"
        )
        ?.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "janelaNotasAluno"
                    )
                    ?.remove();

            }
        );


    // =================================================
    // IMPRIMIR
    // =================================================

    document
        .getElementById(
            "imprimirNotasAluno"
        )
        ?.addEventListener(
            "click",
            () => {

                window.print();

            }
        );

}


// =====================================================
// CARREGAR BOLETIM
// =====================================================

async function carregarBoletimAluno(
    anoSelecionado,
    trimestreSelecionado
) {

    console.log(
        "📄 A CARREGAR BOLETIM:",
        {
            anoSelecionado,
            trimestreSelecionado
        }
    );


    const turmaId =
        String(
            aluno.turmaId || ""
        ).trim();


    const alunoId =
        String(
            aluno.id || ""
        ).trim();


    const codigoAluno =
        String(
            aluno.codigoAluno || ""
        ).trim();


    const numeroAluno =
        String(
            aluno.numero || ""
        ).trim();


    const nomeAluno =
        String(
            aluno.nome || ""
        )
        .trim()
        .toLowerCase();


    const snapshot =
        await getDocs(
            collection(
                db,
                "notas"
            )
        );


    const disciplinas = [];


    snapshot.forEach(
        documento => {

            const dados =
                documento.data();


            if (
                String(
                    dados.turmaId || ""
                ).trim() !== turmaId
            ) {

                return;

            }


            if (
                normalizarAnoLetivo(
                    obterAnoLetivo(
                        dados
                    )
                ) !==
                normalizarAnoLetivo(
                    anoSelecionado
                )
            ) {

                return;

            }


            if (
                normalizarTrimestre(
                    dados.trimestre
                ) !==
                normalizarTrimestre(
                    trimestreSelecionado
                )
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

                        const id =
                            String(
                                item.id ||
                                item.alunoId ||
                                ""
                            ).trim();


                        const codigo =
                            String(
                                item.codigoAluno ||
                                ""
                            ).trim();


                        const numero =
                            String(
                                item.numero ||
                                ""
                            ).trim();


                        const nome =
                            String(
                                item.nome ||
                                ""
                            )
                            .trim()
                            .toLowerCase();


                        return (

                            (
                                alunoId &&
                                id &&
                                id === alunoId
                            )

                            ||

                            (
                                codigoAluno &&
                                codigo &&
                                codigo === codigoAluno
                            )

                            ||

                            (
                                numeroAluno &&
                                numero &&
                                numero === numeroAluno
                            )

                            ||

                            (
                                nomeAluno &&
                                nome &&
                                nome === nomeAluno
                            )

                        );

                    }
                );


            if (
                !alunoNota
            ) {

                return;

            }


            disciplinas.push({

                disciplina:
                    dados.disciplina ||
                    documento.id,

                MAC:
                    obterNota(
                        alunoNota,
                        "MAC"
                    ),

                NPT:
                    obterNota(
                        alunoNota,
                        "NPT"
                    ),

                MF:
                    obterNota(
                        alunoNota,
                        "MF"
                    ),

                classificacao:
                    alunoNota.classificacao ??
                    alunoNota.Classificacao ??
                    ""

            });

        }
    );


    if (
        disciplinas.length === 0
    ) {

        alert(
            "📄 Ainda não existem notas lançadas para gerar o boletim."
        );

        return;

    }


    const escola =
        await obterDadosEscola();


    const escolaNome =
        escola?.nome ||
        "Escola";


    const escolaLogo =
        escola?.logo ||
        "";


    const logoHTML =
        escolaLogo
            ? `
                <img
                    src="${escaparHTML(escolaLogo)}"
                    style="
                        max-width:100px;
                        max-height:100px;
                        object-fit:contain;
                    "
                >
              `
            : "";


    let linhas = "";


    disciplinas.forEach(
        item => {

            linhas += `

                <tr>

                    <td
                        style="
                            border:1px solid #999;
                            padding:10px;
                        "
                    >
                        ${escaparHTML(
                            item.disciplina
                        )}
                    </td>


                    <td
                        style="
                            border:1px solid #999;
                            padding:10px;
                            text-align:center;
                        "
                    >
                        ${escaparHTML(
                            mostrarNota(
                                item.MAC
                            )
                        )}
                    </td>


                    <td
                        style="
                            border:1px solid #999;
                            padding:10px;
                            text-align:center;
                        "
                    >
                        ${escaparHTML(
                            mostrarNota(
                                item.NPT
                            )
                        )}
                    </td>


                    <td
                        style="
                            border:1px solid #999;
                            padding:10px;
                            text-align:center;
                        "
                    >
                        ${escaparHTML(
                            mostrarNota(
                                item.MF
                            )
                        )}
                    </td>


                    <td
                        style="
                            border:1px solid #999;
                            padding:10px;
                            text-align:center;
                        "
                    >
                        ${escaparHTML(
                            item.classificacao ||
                            "—"
                        )}
                    </td>

                </tr>

            `;

        }
    );


    const antiga =
        document.getElementById(
            "janelaBoletimAluno"
        );


    if (antiga) {

        antiga.remove();

    }


    const html = `

        <div
            id="janelaBoletimAluno"
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
                id="conteudoBoletimAluno"
                style="
                    max-width:900px;
                    margin:20px auto;
                    background:white;
                    padding:35px;
                    box-shadow:0 5px 25px rgba(0,0,0,.15);
                "
            >

                <div
                    style="
                        text-align:center;
                        margin-bottom:25px;
                    "
                >

                    ${logoHTML}

                    <h2
                        style="
                            margin:8px 0;
                            color:#1e3a8a;
                        "
                    >
                        ${escaparHTML(
                            escolaNome
                        )}
                    </h2>


                    <h3>
                        BOLETIM DE NOTAS
                    </h3>


                    <p>
                        <strong>
                            Aluno:
                        </strong>
                        ${escaparHTML(
                            aluno.nome ||
                            "—"
                        )}
                    </p>


                    <p>
                        <strong>
                            Código:
                        </strong>
                        ${escaparHTML(
                            aluno.codigoAluno ||
                            "—"
                        )}
                    </p>


                    <p>
                        <strong>
                            Turma:
                        </strong>
                        ${escaparHTML(
                            aluno.turmaNome ||
                            "—"
                        )}
                    </p>


                    <p>
                        <strong>
                            Ano letivo:
                        </strong>
                        ${escaparHTML(
                            anoSelecionado
                        )}
                    </p>


                    <p>
                        <strong>
                            ${escaparHTML(
                                nomeTrimestre(
                                    trimestreSelecionado
                                )
                            )}
                        </strong>
                    </p>

                </div>


                <table
                    style="
                        width:100%;
                        border-collapse:collapse;
                    "
                >

                    <thead>

                        <tr>

                            <th
                                style="
                                    border:1px solid #999;
                                    padding:10px;
                                "
                            >
                                Disciplina
                            </th>

                            <th
                                style="
                                    border:1px solid #999;
                                    padding:10px;
                                "
                            >
                                MAC
                            </th>

                            <th
                                style="
                                    border:1px solid #999;
                                    padding:10px;
                                "
                            >
                                NPT
                            </th>

                            <th
                                style="
                                    border:1px solid #999;
                                    padding:10px;
                                "
                            >
                                MF
                            </th>

                            <th
                                style="
                                    border:1px solid #999;
                                    padding:10px;
                                "
                            >
                                Classificação
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${linhas}

                    </tbody>

                </table>


                <button
                    id="imprimirBoletimAluno"
                    style="
                        width:100%;
                        margin-top:25px;
                        padding:14px;
                        border:none;
                        border-radius:10px;
                        background:#2563eb;
                        color:white;
                        font-size:16px;
                        cursor:pointer;
                    "
                >
                    🖨️ Imprimir boletim
                </button>


                <button
                    id="fecharBoletimAluno"
                    style="
                        width:100%;
                        margin-top:10px;
                        padding:14px;
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
            "fecharBoletimAluno"
        )
        ?.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "janelaBoletimAluno"
                    )
                    ?.remove();

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
// BOTÃO VER BOLETIM
// =====================================================

window.verBoletim =
async function () {

    console.log(
        "📄 VER BOLETIM CLICADO"
    );


    try {

        await abrirSelecaoNotas(
            "boletim"
        );

    }
    catch (erro) {

        console.error(
            "❌ ERRO AO ABRIR BOLETIM:",
            erro
        );


        alert(
            "❌ Não foi possível abrir o boletim.\n\n" +
            erro.message
        );

    }

};


// =====================================================
// PROTEÇÃO CONTRA ERROS GERAIS
// =====================================================

window.addEventListener(
    "error",
    event => {

        console.error(
            "❌ ERRO NO STUDENT AREA:",
            event.error ||
            event.message
        );

    }
);


// =====================================================
// FINAL
// =====================================================

console.log(
    "======================================"
);

console.log(
    "✅ SGE — ÁREA DO ALUNO CARREGADA"
);

alert("Carregado");

console.log(
    "📚 Ver Notas disponível"
);

console.log(
    "📄 Ver Boletim disponível"
);

console.log(
    "💰 Bloqueio financeiro ativo"
);

console.log(
    "🏫 Nome da escola ativo"
);

console.log(
    "======================================"
);
