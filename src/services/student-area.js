/* =====================================================
   SGE — ÁREA DO ALUNO
   student-area.js
   BLOCO 1/3 — SESSÃO + PERFIL + FUNÇÕES BASE
===================================================== */

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


// =====================================================
// INÍCIO
// =====================================================

console.log(
    "🎓 SGE — student-area.js iniciado"
);


// =====================================================
// VERIFICAR SESSÃO DO ALUNO
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
// LER SESSÃO
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
// NORMALIZAR DADOS DO ALUNO
// =====================================================

aluno.id =
    String(
        aluno.id || ""
    ).trim();

aluno.turmaId =
    String(
        aluno.turmaId || ""
    ).trim();

aluno.escolaId =
    String(
        aluno.escolaId || ""
    ).trim();

aluno.codigoAluno =
    String(
        aluno.codigoAluno || ""
    ).trim();

aluno.numero =
    String(
        aluno.numero || ""
    ).trim();


// =====================================================
// DEBUG
// =====================================================

console.log(
    "===================================="
);

console.log(
    "🎓 ALUNO LOGADO"
);

console.log(
    "ID:",
    aluno.id
);

console.log(
    "NOME:",
    aluno.nome
);

console.log(
    "CÓDIGO:",
    aluno.codigoAluno
);

console.log(
    "NÚMERO:",
    aluno.numero
);

console.log(
    "TURMA:",
    aluno.turmaNome
);

console.log(
    "TURMA ID:",
    aluno.turmaId
);

console.log(
    "ESCOLA ID:",
    aluno.escolaId
);

console.log(
    "===================================="
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
// PREENCHER NOME
// =====================================================

if (nomeElemento) {

    nomeElemento.textContent =
        aluno.nome ||
        "Aluno";

}


// =====================================================
// PREENCHER CÓDIGO
// =====================================================

if (codigoElemento) {

    codigoElemento.textContent =
        "Código: " +
        (
            aluno.codigoAluno ||
            "—"
        );

}


// =====================================================
// PREENCHER TURMA
// =====================================================

if (turmaElemento) {

    turmaElemento.textContent =
        "Turma: " +
        (
            aluno.turmaNome ||
            "—"
        );

}


// =====================================================
// PREENCHER ESTADO
// =====================================================

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
// NORMALIZAR TEXTO
// =====================================================

function normalizarTexto(
    valor
) {

    return String(
        valor ?? ""
    )
    .trim()
    .toLowerCase();

}


// =====================================================
// NORMALIZAR TRIMESTRE
// =====================================================

function normalizarTrimestre(
    trimestre
) {

    let valor =
        String(
            trimestre || ""
        )
        .trim();


    valor =
        valor
        .replace(
            /º|°|ª/g,
            ""
        )
        .replace(
            /trimestre/gi,
            ""
        )
        .trim();


    if (
        valor === "1"
    ) {

        return "1";

    }

    if (
        valor === "2"
    ) {

        return "2";

    }

    if (
        valor === "3"
    ) {

        return "3";

    }


    return valor;

}


// =====================================================
// NOME DO TRIMESTRE
// =====================================================

function nomeTrimestre(
    trimestre
) {

    const numero =
        normalizarTrimestre(
            trimestre
        );


    if (
        numero === "1"
    ) {

        return "1.º Trimestre";

    }

    if (
        numero === "2"
    ) {

        return "2.º Trimestre";

    }

    if (
        numero === "3"
    ) {

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
    valor
) {

    return String(
        valor ?? ""
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

        dados.anoLetivo ||

        dados.anoLectivo ||

        dados.ano ||

        dados.anoLetivoAtual ||

        aluno.anoLetivo ||

        aluno.anoLectivo ||

        ""

    );

}


// =====================================================
// OBTER DOCUMENTO DO ALUNO
// =====================================================

async function obterDocumentoAluno() {

    if (
        !aluno.turmaId ||
        !aluno.id
    ) {

        throw new Error(
            "Não foi possível identificar o documento do aluno."
        );

    }


    const referencia =
        doc(
            db,
            "turmas",
            aluno.turmaId,
            "alunos",
            aluno.id
        );


    const snapshot =
        await getDoc(
            referencia
        );


    if (
        !snapshot.exists()
    ) {

        throw new Error(
            "Documento do aluno não encontrado no Firestore."
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
                        <strong>Código:</strong><br>
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
            () => {

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
            () => {

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


    try {

        const documento =
            await obterDocumentoAluno();


        const senhaAtual =
            String(
                documento.dados.senha ||
                documento.dados.senhaAcesso ||
                ""
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
                "A nova senha deve ter pelo menos 4 caracteres."
            );

            return;

        }


        const confirmar =
            prompt(
                "Digite novamente a nova senha:"
            );


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
                    novaSenha.trim(),

                senhaAcesso:
                    novaSenha.trim()

            }
        );


        aluno.senha =
            novaSenha.trim();

        aluno.senhaAcesso =
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
            "❌ ERRO AO ALTERAR SENHA:",
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


    if (
        !confirmar
    ) {

        return;

    }


    localStorage.removeItem(
        "alunoLogado"
    );


    window.location.href =
        "student-login.html";

};


// =====================================================
// DEBUG FINAL DO BLOCO 1
// =====================================================

console.log(
    "✅ BLOCO 1/3 DO STUDENT-AREA CARREGADO"
);

// =====================================================
// SGE — ÁREA DO ALUNO
// BLOCO 2/3 — ANO + TRIMESTRE + FINANCEIRO + VER NOTAS
// =====================================================


// =====================================================
// MOSTRAR NOTA
// =====================================================

function mostrarNota(valor) {

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
// OBTER VALOR DA NOTA
// ACEITA MAIÚSCULAS E MINÚSCULAS
// =====================================================

function obterNota(objeto, campo) {

    if (!objeto) {
        return "";
    }

    return (
        objeto[campo] ??
        objeto[campo.toUpperCase()] ??
        objeto[campo.toLowerCase()] ??
        ""
    );

}


// =====================================================
// VERIFICAR SE O ALUNO É O MESMO
// =====================================================

function pertenceAoAluno(item) {

    if (!item) {
        return false;
    }

    const numeroItem =
        String(
            item.numero ?? ""
        ).trim();

    const codigoItem =
        String(
            item.codigoAluno ?? ""
        ).trim();

    const idItem =
        String(
            item.id ?? ""
        ).trim();

    const nomeItem =
        normalizarTexto(
            item.nome
        );


    if (
        aluno.id &&
        idItem &&
        aluno.id === idItem
    ) {

        return true;

    }


    if (
        aluno.numero &&
        numeroItem &&
        aluno.numero === numeroItem
    ) {

        return true;

    }


    if (
        aluno.codigoAluno &&
        codigoItem &&
        aluno.codigoAluno === codigoItem
    ) {

        return true;

    }


    if (
        aluno.nome &&
        nomeItem &&
        normalizarTexto(
            aluno.nome
        ) === nomeItem
    ) {

        return true;

    }


    return false;

}


// =====================================================
// OBTER ESCOLA
// =====================================================

async function obterDadosEscola() {

    if (
        !aluno.escolaId
    ) {

        return {

            id: "",
            nome: "SGE Angola"

        };

    }


    try {

        const referencia =
            doc(
                db,
                "escolas",
                aluno.escolaId
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
                    aluno.escolaId,

                nome:
                    dados.nome ||
                    dados.nomeEscola ||
                    "SGE Angola",

                logo:
                    dados.logo ||
                    ""

            };

        }

    }

    catch (erro) {

        console.warn(
            "⚠️ Não foi possível carregar escola:",
            erro
        );

    }


    return {

        id:
            aluno.escolaId,

        nome:
            "SGE Angola",

        logo:
            ""

    };

}


// =====================================================
// OBTER TODOS OS LANÇAMENTOS DE NOTAS
// =====================================================

async function obterLancamentosNotas() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "notas"
            )
        );


    const resultado = [];


    snapshot.forEach(
        documento => {

            const dados =
                documento.data();


            // -----------------------------------------
            // ESCOLA
            // -----------------------------------------

            if (
                aluno.escolaId &&
                dados.escolaId &&
                String(
                    dados.escolaId
                ).trim() !==
                String(
                    aluno.escolaId
                ).trim()
            ) {

                return;

            }


            // -----------------------------------------
            // TURMA
            // -----------------------------------------

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


            // -----------------------------------------
            // ALUNOS
            // -----------------------------------------

            if (
                !Array.isArray(
                    dados.alunos
                )
            ) {

                return;

            }


            const alunoNota =
                dados.alunos.find(
                    item =>
                        pertenceAoAluno(
                            item
                        )
                );


            if (
                !alunoNota
            ) {

                return;

            }


            resultado.push({

                id:
                    documento.id,

                dados:
                    dados,

                aluno:
                    alunoNota

            });

        }
    );


    return resultado;

}


// =====================================================
// DESCOBRIR ANOS LETIVOS
// =====================================================

async function obterAnosLetivos() {

    const lancamentos =
        await obterLancamentosNotas();


    const anos =
        [];


    lancamentos.forEach(
        item => {

            const ano =
                normalizarAnoLetivo(
                    obterAnoLetivo(
                        item.dados
                    )
                );


            if (
                ano &&
                !anos.includes(
                    ano
                )
            ) {

                anos.push(
                    ano
                );

            }

        }
    );


    // Se ainda não houver ano nas notas,
    // tentar o ano do próprio aluno.

    if (
        aluno.anoLetivo &&
        !anos.includes(
            String(
                aluno.anoLetivo
            )
        )
    ) {

        anos.push(
            String(
                aluno.anoLetivo
            )
        );

    }


    anos.sort(
        (a, b) =>
            String(b)
            .localeCompare(
                String(a)
            )
    );


    return anos;

}


// =====================================================
// FINANCEIRO
// =====================================================

function valorIndicaPago(valor) {

    if (
        valor === true
    ) {

        return true;

    }


    const texto =
        normalizarTexto(
            valor
        );


    return (

        texto === "pago" ||

        texto === "sim" ||

        texto === "true" ||

        texto === "1" ||

        texto === "regularizado" ||

        texto === "ativo"

    );

}


// =====================================================
// VERIFICAR PAGAMENTO
// =====================================================

async function verificarPagamento(
    anoLetivo,
    trimestre
) {

    console.log(
        "💰 A verificar financeiro:",
        {
            alunoId:
                aluno.id,

            alunoCodigo:
                aluno.codigoAluno,

            turmaId:
                aluno.turmaId,

            anoLetivo:
                anoLetivo,

            trimestre:
                trimestre
        }
    );


    try {

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


                // -------------------------------------
                // ESCOLA
                // -------------------------------------

                if (
                    aluno.escolaId &&
                    dados.escolaId &&
                    String(
                        dados.escolaId
                    ).trim() !==
                    String(
                        aluno.escolaId
                    ).trim()
                ) {

                    return;

                }


                // -------------------------------------
                // TURMA
                // -------------------------------------

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


                // -------------------------------------
                // ANO
                // -------------------------------------

                const anoFinanceiro =
                    normalizarAnoLetivo(
                        dados.anoLetivo ||
                        dados.anoLectivo ||
                        dados.ano ||
                        ""
                    );


                if (
                    anoFinanceiro &&
                    anoFinanceiro !==
                    String(
                        anoLetivo
                    ).trim()
                ) {

                    return;

                }


                // -------------------------------------
                // TRIMESTRE
                // -------------------------------------

                const trimestreFinanceiro =
                    normalizarTrimestre(
                        dados.trimestre ||
                        dados.periodo ||
                        ""
                    );


                if (
                    trimestreFinanceiro &&
                    trimestreFinanceiro !==
                    normalizarTrimestre(
                        trimestre
                    )
                ) {

                    return;

                }


                // -------------------------------------
                // PROCURAR ALUNO
                // -------------------------------------

                const correspondeAluno = (

                    String(
                        dados.alunoId ||
                        ""
                    ).trim() ===
                    aluno.id

                    ||

                    String(
                        dados.codigoAluno ||
                        ""
                    ).trim() ===
                    aluno.codigoAluno

                    ||

                    String(
                        dados.numero ||
                        ""
                    ).trim() ===
                    aluno.numero

                    ||

                    normalizarTexto(
                        dados.nome
                    ) ===
                    normalizarTexto(
                        aluno.nome
                    )

                );


                // -------------------------------------
                // CASO TENHA ARRAY DE ALUNOS
                // -------------------------------------

                let correspondeArray =
                    false;

                let pagamentoAluno =
                    null;


                if (
                    Array.isArray(
                        dados.alunos
                    )
                ) {

                    const encontradoAluno =
                        dados.alunos.find(
                            item =>
                                pertenceAoAluno(
                                    item
                                )
                        );


                    if (
                        encontradoAluno
                    ) {

                        correspondeArray =
                            true;

                        pagamentoAluno =
                            encontradoAluno;

                    }

                }


                if (
                    !correspondeAluno &&
                    !correspondeArray
                ) {

                    return;

                }


                encontrado =
                    true;


                // -------------------------------------
                // VERIFICAR CAMPOS DE PAGAMENTO
                // -------------------------------------

                const valorPagamento =

                    pagamentoAluno?.pago ??

                    pagamentoAluno?.estadoPagamento ??

                    pagamentoAluno?.situacaoFinanceira ??

                    pagamentoAluno?.status ??

                    dados.pago ??

                    dados.estadoPagamento ??

                    dados.situacaoFinanceira ??

                    dados.status ??

                    dados.estado ??

                    false;


                if (
                    valorIndicaPago(
                        valorPagamento
                    )
                ) {

                    pago =
                        true;

                }

            }
        );


        console.log(
            "💰 RESULTADO FINANCEIRO:",
            {
                encontrado:
                    encontrado,

                pago:
                    pago
            }
        );


        /*
         * Se não existir nenhum lançamento financeiro,
         * não vamos bloquear automaticamente.
         *
         * Isto evita bloquear alunos enquanto o módulo
         * financeiro ainda não tiver registo.
         */

        if (
            !encontrado
        ) {

            return {

                encontrado:
                    false,

                pago:
                    true

            };

        }


        return {

            encontrado:
                true,

            pago:
                pago

        };

    }

    catch (erro) {

        console.error(
            "❌ Erro ao verificar financeiro:",
            erro
        );


        throw erro;

    }

}


// =====================================================
// JANELA DE SELEÇÃO
// =====================================================

async function abrirSelecaoNotas(
    modo
) {

    const antiga =
        document.getElementById(
            "janelaSelecaoAluno"
        );


    if (
        antiga
    ) {

        antiga.remove();

    }


    let anos;


    try {

        anos =
            await obterAnosLetivos();

    }

    catch (erro) {

        console.error(
            erro
        );

        alert(
            "❌ Não foi possível carregar os anos letivos.\n\n" +
            erro.message
        );

        return;

    }


    if (
        anos.length === 0
    ) {

        alert(
            "📚 Ainda não existem notas disponíveis."
        );

        return;

    }


    const titulo =
        modo === "notas"
            ? "📊 Ver Notas"
            : "📄 Ver Boletim";


    const html = `

        <div
            id="janelaSelecaoAluno"
            style="
                position:fixed;
                inset:0;
                z-index:999999;
                background:rgba(0,0,0,.55);
                display:flex;
                align-items:center;
                justify-content:center;
                padding:20px;
            "
        >

            <div
                style="
                    width:100%;
                    max-width:450px;
                    background:white;
                    border-radius:18px;
                    padding:25px;
                    box-shadow:0 10px 40px rgba(0,0,0,.3);
                "
            >

                <h2
                    style="
                        margin-top:0;
                        color:#1e3a8a;
                        text-align:center;
                    "
                >
                    ${titulo}
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
                    <strong>Ano Letivo</strong>
                </label>


                <select
                    id="anoSelecaoAluno"
                    style="
                        width:100%;
                        padding:13px;
                        margin:8px 0 18px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
                        font-size:16px;
                    "
                >

                    ${anos.map(
                        ano => `
                            <option value="${escaparHTML(ano)}">
                                ${escaparHTML(ano)}
                            </option>
                        `
                    ).join("")}

                </select>


                <label>
                    <strong>Trimestre</strong>
                </label>


                <select
                    id="trimestreSelecaoAluno"
                    style="
                        width:100%;
                        padding:13px;
                        margin:8px 0 20px;
                        border:1px solid #cbd5e1;
                        border-radius:10px;
                        font-size:16px;
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
                    id="fecharSelecaoAluno"
                    style="
                        width:100%;
                        padding:14px;
                        margin-top:10px;
                        border:none;
                        border-radius:10px;
                        background:#e2e8f0;
                        color:#334155;
                        font-size:16px;
                        cursor:pointer;
                    "
                >
                    Cancelar
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
            "fecharSelecaoAluno"
        )
        ?.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "janelaSelecaoAluno"
                    )
                    ?.remove();

            }
        );


    document
        .getElementById(
            "confirmarSelecaoAluno"
        )
        ?.addEventListener(
            "click",
            async () => {

                const botao =
                    document.getElementById(
                        "confirmarSelecaoAluno"
                       );


                const ano =
                    document.getElementById(
                        "anoSelecaoAluno"
                    )?.value;


                const trimestre =
                    document.getElementById(
                        "trimestreSelecaoAluno"
                    )?.value;


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
                    "A verificar...";


                try {

                    const pagamento =
                        await verificarPagamento(
                            ano,
                            trimestre
                        );


                    if (
                        pagamento.pago !== true
                    ) {

                        alert(
                            "🔒 BOLETIM BLOQUEADO\n\n" +

                            "A situação financeira deste trimestre " +
                            "está como NÃO PAGO.\n\n" +

                            "Regularize o pagamento para consultar " +
                            "as notas e o boletim."
                        );


                        botao.disabled =
                            false;

                        botao.textContent =
                            "Continuar";

                        return;

                    }


                    document
                        .getElementById(
                            "janelaSelecaoAluno"
                        )
                        ?.remove();


                    if (
                        modo === "notas"
                    ) {

                        await mostrarNotas(
                            ano,
                            trimestre
                        );

                    }

                    else {

                        await mostrarBoletim(
                            ano,
                            trimestre
                        );

                    }

                }

                catch (erro) {

                    console.error(
                        "❌ Erro na consulta:",
                        erro
                    );


                    alert(
                        "❌ Não foi possível consultar.\n\n" +
                        erro.message
                    );


                    botao.disabled =
                        false;

                    botao.textContent =
                        "Continuar";

                }

            }
        );

}


// =====================================================
// MOSTRAR NOTAS
// =====================================================

async function mostrarNotas(
    anoSelecionado,
    trimestreSelecionado
) {

    const lancamentos =
        await obterLancamentosNotas();


    const trimestreNormalizado =
        normalizarTrimestre(
            trimestreSelecionado
        );


    const notas =
        lancamentos.filter(
            item => {

                const ano =
                    normalizarAnoLetivo(
                        obterAnoLetivo(
                            item.dados
                        )
                    );


                const trimestre =
                    normalizarTrimestre(
                        item.dados.trimestre
                    );


                return (

                    ano ===
                    String(
                        anoSelecionado
                    ).trim()

                    &&

                    trimestre ===
                    trimestreNormalizado

                );

            }
        );


    if (
        notas.length === 0
    ) {

        alert(
            "📚 Não existem notas para o período selecionado."
        );

        return;

    }


    const escola =
        await obterDadosEscola();


    const antiga =
        document.getElementById(
            "janelaNotasAluno"
        );


    if (
        antiga
    ) {

        antiga.remove();

    }


    let linhas = "";


    notas.forEach(
        item => {

            const dados =
                item.dados;

            const nota =
                item.aluno;


            const mac =
                obterNota(
                    nota,
                    "mac"
                );

            const npt =
                obterNota(
                    nota,
                    "npt"
                );

            const mf =
                obterNota(
                    nota,
                    "mf"
                );

            const classificacao =
                nota.classificacao ??
                nota.Classificacao ??
                "";


            linhas += `

                <tr>

                    <td>
                        ${escaparHTML(
                            dados.disciplina ||
                            "—"
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            mostrarNota(mac)
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            mostrarNota(npt)
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            mostrarNota(mf)
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            classificacao ||
                            "—"
                        )}
                    </td>

                </tr>

            `;

        }
    );


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
                        border-bottom:2px solid #2563eb;
                        padding-bottom:15px;
                        margin-bottom:20px;
                    "
                >

                    <h2
                        style="
                            margin:0;
                            color:#1e3a8a;
                        "
                    >
                        ${escaparHTML(
                            escola.nome
                        )}
                    </h2>

                    <h3>
                        Área do Aluno — Minhas Notas
                    </h3>

                    <p>
                        <strong>
                            ${escaparHTML(
                                aluno.nome ||
                                ""
                            )}
                        </strong>
                        <br>
                        ${escaparHTML(
                            aluno.turmaNome ||
                            ""
                        )}
                        <br>
                        ${escaparHTML(
                            anoSelecionado
                        )}
                        —
                        ${escaparHTML(
                            nomeTrimestre(
                                trimestreSelecionado
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

                            <tr>

                                <th
                                    style="
                                        padding:12px;
                                        border:1px solid #cbd5e1;
                                    "
                                >
                                    Disciplina
                                </th>

                                <th
                                    style="
                                        padding:12px;
                                        border:1px solid #cbd5e1;
                                    "
                                >
                                    MAC
                                </th>

                                <th
                                    style="
                                        padding:12px;
                                        border:1px solid #cbd5e1;
                                    "
                                >
                                    NPT
                                </th>

                                <th
                                    style="
                                        padding:12px;
                                        border:1px solid #cbd5e1;
                                    "
                                >
                                    MF
                                </th>

                                <th
                                    style="
                                        padding:12px;
                                        border:1px solid #cbd5e1;
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
                    id="fecharNotasAluno"
                    style="
                        width:100%;
                        margin-top:20px;
                        padding:14px;
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
            () => {

                document
                    .getElementById(
                        "janelaNotasAluno"
                    )
                    ?.remove();

            }
        );

}


// =====================================================
// BOTÃO VER NOTAS
// =====================================================

window.verNotas =
function () {

    console.log(
        "📊 VER NOTAS CLICADO"
    );


    abrirSelecaoNotas(
        "notas"
    );

};


// =====================================================
// DEBUG
// =====================================================

console.log(
    "✅ BLOCO 2/3 DO STUDENT-AREA CARREGADO"
);

alert("Área 2 Carregado");

// =====================================================
// SGE — ÁREA DO ALUNO
// BLOCO 3/3 — BOLETIM + IMPRESSÃO + INICIALIZAÇÃO
// =====================================================


// =====================================================
// MOSTRAR BOLETIM
// =====================================================

async function mostrarBoletim(
    anoSelecionado,
    trimestreSelecionado
) {

    try {

        console.log(
            "📄 A gerar boletim:",
            anoSelecionado,
            trimestreSelecionado
        );


        const lancamentos =
            await obterLancamentosNotas();


        const trimestreNormalizado =
            normalizarTrimestre(
                trimestreSelecionado
            );


        const notas =
            lancamentos.filter(
                item => {

                    const ano =
                        normalizarAnoLetivo(
                            obterAnoLetivo(
                                item.dados
                            )
                        );


                    const trimestre =
                        normalizarTrimestre(
                            item.dados.trimestre
                        );


                    return (

                        ano ===
                        String(
                            anoSelecionado
                        ).trim()

                        &&

                        trimestre ===
                        trimestreNormalizado

                    );

                }
            );


        if (
            notas.length === 0
        ) {

            alert(
                "📄 Não existem notas para gerar o boletim deste período."
            );

            return;

        }


        // =================================================
        // ESCOLA
        // =================================================

        const escola =
            await obterDadosEscola();


        // =================================================
        // REMOVER BOLETIM ANTIGO
        // =================================================

        const antiga =
            document.getElementById(
                "janelaBoletimAluno"
            );


        if (
            antiga
        ) {

            antiga.remove();

        }


        // =================================================
        // LINHAS
        // =================================================

        let linhas = "";


        notas.forEach(
            item => {

                const dados =
                    item.dados;

                const nota =
                    item.aluno;


                const mac =
                    obterNota(
                        nota,
                        "mac"
                    );

                const npt =
                    obterNota(
                        nota,
                        "npt"
                    );

                const mf =
                    obterNota(
                        nota,
                        "mf"
                    );

                const classificacao =
                    nota.classificacao ??
                    nota.Classificacao ??
                    "";


                linhas += `

                    <tr>

                        <td>
                            ${escaparHTML(
                                dados.disciplina ||
                                "—"
                            )}
                        </td>

                        <td>
                            ${escaparHTML(
                                mostrarNota(mac)
                            )}
                        </td>

                        <td>
                            ${escaparHTML(
                                mostrarNota(npt)
                            )}
                        </td>

                        <td>
                            ${escaparHTML(
                                mostrarNota(mf)
                            )}
                        </td>

                        <td>
                            ${escaparHTML(
                                classificacao ||
                                "—"
                            )}
                        </td>

                    </tr>

                `;

            }
        );


        // =================================================
        // BOLETIM
        // =================================================

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
                        max-width:1000px;
                        margin:20px auto;
                        background:white;
                        padding:35px;
                        border-radius:18px;
                        box-shadow:0 5px 25px rgba(0,0,0,.15);
                    "
                >

                    <!-- =================================
                         CABEÇALHO DA ESCOLA
                    ================================== -->

                    <div
                        style="
                            text-align:center;
                            border-bottom:2px solid #1e3a8a;
                            padding-bottom:18px;
                            margin-bottom:20px;
                        "
                    >

                        ${
                            escola.logo
                            ?

                            `
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

                            :

                            ""
                        }


                        <h2
                            style="
                                margin:5px 0;
                                color:#1e3a8a;
                                text-transform:uppercase;
                            "
                        >
                            ${escaparHTML(
                                escola.nome
                            )}
                        </h2>


                        <p
                            style="
                                margin:4px 0;
                                color:#475569;
                            "
                        >
                            BOLETIM DE AVALIAÇÃO
                        </p>


                        <p
                            style="
                                margin:4px 0;
                            "
                        >
                            ${escaparHTML(
                                anoSelecionado
                            )}
                            —
                            ${escaparHTML(
                                nomeTrimestre(
                                    trimestreSelecionado
                                )
                            )}
                        </p>

                    </div>


                    <!-- =================================
                         DADOS DO ALUNO
                    ================================== -->

                    <div
                        style="
                            display:grid;
                            grid-template-columns:
                                repeat(
                                    auto-fit,
                                    minmax(220px,1fr)
                                );
                            gap:10px;
                            margin-bottom:25px;
                        "
                    >

                        <div>
                            <strong>Aluno:</strong><br>
                            ${escaparHTML(
                                aluno.nome ||
                                "—"
                            )}
                        </div>


                        <div>
                            <strong>Número:</strong><br>
                            ${escaparHTML(
                                aluno.numero ||
                                "—"
                            )}
                        </div>


                        <div>
                            <strong>Código:</strong><br>
                            ${escaparHTML(
                                aluno.codigoAluno ||
                                "—"
                            )}
                        </div>


                        <div>
                            <strong>Turma:</strong><br>
                            ${escaparHTML(
                                aluno.turmaNome ||
                                "—"
                            )}
                        </div>


                        <div>
                            <strong>Classe:</strong><br>
                            ${escaparHTML(
                                aluno.classe ||
                                "—"
                            )}
                        </div>

                    </div>


                    <!-- =================================
                         TABELA DE NOTAS
                    ================================== -->

                    <div
                        style="
                            overflow-x:auto;
                        "
                    >

                        <table
                            style="
                                width:100%;
                                border-collapse:collapse;
                                min-width:650px;
                            "
                        >

                            <thead>

                                <tr>

                                    <th
                                        style="
                                            padding:12px;
                                            border:1px solid #94a3b8;
                                            background:#e2e8f0;
                                        "
                                    >
                                        Disciplina
                                    </th>


                                    <th
                                        style="
                                            padding:12px;
                                            border:1px solid #94a3b8;
                                            background:#e2e8f0;
                                        "
                                    >
                                        MAC
                                    </th>


                                    <th
                                        style="
                                            padding:12px;
                                            border:1px solid #94a3b8;
                                            background:#e2e8f0;
                                        "
                                    >
                                        NPT
                                    </th>


                                    <th
                                        style="
                                            padding:12px;
                                            border:1px solid #94a3b8;
                                            background:#e2e8f0;
                                        "
                                    >
                                        MF
                                    </th>


                                    <th
                                        style="
                                            padding:12px;
                                            border:1px solid #94a3b8;
                                            background:#e2e8f0;
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


                    <!-- =================================
                         RODAPÉ
                    ================================== -->

                    <div
                        style="
                            margin-top:35px;
                            text-align:center;
                            color:#64748b;
                            font-size:13px;
                        "
                    >

                        Documento emitido pela
                        ${escaparHTML(
                            escola.nome
                        )}

                    </div>


                    <!-- =================================
                         BOTÕES
                    ================================== -->

                    <div
                        id="acoesBoletimAluno"
                        style="
                            display:flex;
                            gap:10px;
                            margin-top:25px;
                            flex-wrap:wrap;
                        "
                    >

                        <button
                            id="imprimirBoletimAluno"
                            style="
                                flex:1;
                                min-width:180px;
                                padding:14px;
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
                                flex:1;
                                min-width:180px;
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


        // =================================================
        // IMPRIMIR
        // =================================================

        document
            .getElementById(
                "imprimirBoletimAluno"
            )
            ?.addEventListener(
                "click",
                () => {

                    imprimirBoletimAluno(
                        escola.nome
                    );

                }
            );


        console.log(
            "✅ BOLETIM GERADO"
        );

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO GERAR BOLETIM:",
            erro
        );


        alert(
            "❌ Não foi possível gerar o boletim.\n\n" +
            erro.message
        );

    }

}


// =====================================================
// IMPRIMIR BOLETIM
// =====================================================

function imprimirBoletimAluno(
    nomeEscola
) {

    const conteudo =
        document.getElementById(
            "conteudoBoletimAluno"
        );


    if (
        !conteudo
    ) {

        alert(
            "❌ Conteúdo do boletim não encontrado."
        );

        return;

    }


    const janela =
        window.open(
            "",
            "_blank"
        );


    if (
        !janela
    ) {

        alert(
            "⚠️ O navegador bloqueou a janela de impressão."
        );

        return;

    }


    janela.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <title>
                Boletim — ${escaparHTML(
                    nomeEscola
                )}
            </title>

            <style>

                body {
                    font-family:
                        Arial,
                        sans-serif;

                    margin:
                        30px;

                    color:
                        #111827;
                }

                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

                    margin-top:
                        20px;

                }

                th,
                td {

                    border:
                        1px solid #94a3b8;

                    padding:
                        10px;

                    text-align:
                        center;

                }

                th {

                    background:
                        #e2e8f0;

                }

                button {

                    display:
                        none;

                }

                @media print {

                    body {

                        margin:
                            10mm;

                    }

                }

            </style>

        </head>


        <body>

            ${conteudo.innerHTML}

        </body>

        </html>

    `);


    janela.document.close();


    janela.focus();


    setTimeout(
        () => {

            janela.print();

        },
        500
    );

}


// =====================================================
// BOTÃO VER BOLETIM
// =====================================================

window.verBoletim =
function () {

    console.log(
        "📄 VER BOLETIM CLICADO"
    );


    abrirSelecaoNotas(
        "boletim"
    );

};


// =====================================================
// CORRIGIR BOTÕES EXISTENTES
// =====================================================

document.addEventListener(
    "click",
    event => {

        const alvo =
            event.target;


        if (
            alvo.closest(
                "#verNotas"
            )
        ) {

            event.preventDefault();

            window.verNotas();

        }


        if (
            alvo.closest(
                "#verBoletim"
            )
        ) {

            event.preventDefault();

            window.verBoletim();

        }

    }
);


// =====================================================
// INICIALIZAÇÃO
// =====================================================

function inicializarAreaAluno() {

    console.log(
        "======================================"
    );

    console.log(
        "🎓 ÁREA DO ALUNO INICIADA"
    );

    console.log(
        "Aluno:",
        aluno
    );

    console.log(
        "Nome:",
        aluno.nome
    );

    console.log(
        "Escola:",
        aluno.escolaId
    );

    console.log(
        "Turma:",
        aluno.turmaId
    );

    console.log(
        "======================================"
    );

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        inicializarAreaAluno
    );

}

else {

    inicializarAreaAluno();

}


// =====================================================
// EXPORTAÇÃO PARA DEBUG
// =====================================================

window.SGEAluno = {

    aluno:
        aluno,

    verNotas:
        window.verNotas,

    verBoletim:
        window.verBoletim,

    sair:
        window.sairAluno

};


console.log(
    "✅ student-area.js — BLOCO 3/3 CARREGADO"
);

alert("Área 3 Carregado");
