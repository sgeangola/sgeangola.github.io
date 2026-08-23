/* =====================================================
   SGE — ÁREA DO ALUNO
   student-area.js
   BLOCO 1/3

   FUNÇÕES:
   - Sessão do aluno
   - Identificação da escola
   - Perfil do aluno
   - Nome da escola
   - Preparação do controlo financeiro
   - Firebase
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
    "Escola ID:",
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
// NOME DA ESCOLA
// =====================================================

const nomeEscolaElemento =
    document.getElementById(
        "nomeEscola"
    );


// =====================================================
// VARIÁVEIS
// =====================================================

let dadosEscola =
    null;

let escolaNome =
    "Escola";


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
// FUNÇÃO ESCAPAR HTML
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
// CARREGAR ESCOLA
// =====================================================

async function carregarEscola() {

    try {

        const escolaId =
            String(
                aluno.escolaId ||
                sessionStorage.getItem(
                    "escolaId"
                ) ||
                ""
            ).trim();


        if (!escolaId) {

            console.warn(
                "⚠️ escolaId não encontrado."
            );

            return;

        }


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
            !snapshot.exists()
        ) {

            console.warn(
                "⚠️ Escola não encontrada:",
                escolaId
            );

            return;

        }


        dadosEscola =
            snapshot.data();


        escolaNome =
            dadosEscola.nome ||
            "Escola";


        console.log(
            "🏫 ESCOLA:",
            escolaNome
        );


        if (nomeEscolaElemento) {

            nomeEscolaElemento.textContent =
                escolaNome;

        }


        // Guardar também para outras páginas

        sessionStorage.setItem(
            "nomeEscola",
            escolaNome
        );


    }
    catch (erro) {

        console.error(
            "❌ Erro ao carregar escola:",
            erro
        );

    }

}


// =====================================================
// NORMALIZAR NOTA
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
        .replace("º", "")
        .replace("°", "")
        .replace("ª", "")
        .replace(
            /Trimestre/gi,
            ""
        )
        .trim();


    if (valor === "1") {

        return "1.º Trimestre";

    }

    if (valor === "2") {

        return "2.º Trimestre";

    }

    if (valor === "3") {

        return "3.º Trimestre";

    }


    return
        trimestre ||
        "—";

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
// INICIAR
// =====================================================

carregarEscola();

// =====================================================
// SGE — ÁREA DO ALUNO
// student-area.js
// BLOCO 2/3
// =====================================================


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
                        <strong>Escola:</strong><br>
                        ${escaparHTML(
                            escolaNome
                        )}
                    </p>


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
            JSON.stringify(aluno)
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
// CONTROLO FINANCEIRO
// =====================================================
//
// REGRA:
//
// Pago     → pode ver notas e boletim
// Não pago → bloqueado
//
// Esta função deverá ser usada tanto pelo
// Ver Notas como pelo Ver Boletim.
// =====================================================

async function verificarFinanceiroAluno() {

    try {

        const escolaId =
            String(
                aluno.escolaId || ""
            ).trim();


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


        if (!escolaId) {

            console.warn(
                "⚠️ escolaId não encontrado."
            );

            return false;

        }


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "financeiro"
                )
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


                if (
                    dados.escolaId &&
                    String(
                        dados.escolaId
                    ).trim() !== escolaId
                ) {

                    return;

                }


                const dadosTurma =
                    String(
                        dados.turmaId || ""
                    ).trim();


                if (
                    turmaId &&
                    dadosTurma &&
                    dadosTurma !== turmaId
                ) {

                    return;

                }


                const id =
                    String(
                        dados.alunoId || ""
                    ).trim();


                const codigo =
                    String(
                        dados.codigoAluno || ""
                    ).trim();


                const numero =
                    String(
                        dados.numero || ""
                    ).trim();


                if (
                    (
                        alunoId &&
                        id === alunoId
                    )
                    ||
                    (
                        codigoAluno &&
                        codigo === codigoAluno
                    )
                    ||
                    (
                        numeroAluno &&
                        numero === numeroAluno
                    )
                ) {

                    encontrado =
                        dados;

                }

            }
        );


        if (!encontrado) {

            console.warn(
                "⚠️ Registo financeiro do aluno não encontrado."
            );

            return false;

        }


        const estado =
            String(
                encontrado.estado ||
                encontrado.situacao ||
                encontrado.status ||
                ""
            )
            .trim()
            .toLowerCase();


        const pago =
            estado === "pago" ||
            estado === "pagamento efetuado" ||
            estado === "paga";


        console.log(
            "💰 ESTADO FINANCEIRO:",
            estado
        );


        return pago;

    }

    catch (erro) {

        console.error(
            "❌ Erro ao verificar financeiro:",
            erro
        );


        return false;

    }

}


// Tornar disponível para Ver Notas / Ver Boletim

window.verificarFinanceiroAluno =
    verificarFinanceiroAluno;

// =====================================================
// IMPRIMIR / BAIXAR NOTAS
// =====================================================

function imprimirNotasAluno(
    documentos,
    anoSelecionado = ""
) {

    const filtrados =
        anoSelecionado
            ? documentos.filter(
                documento =>
                    String(
                        obterAnoLetivo(
                            documento
                        )
                    ) ===
                    String(
                        anoSelecionado
                    )
            )
            : documentos;


    const linhas =
        construirTabelaNotas(
            filtrados
        );


    const janela =
        window.open(
            "",
            "_blank"
        );


    if (!janela) {

        alert(
            "⚠️ O navegador bloqueou a janela."
        );

        return;

    }


    janela.document.write(`

        <!DOCTYPE html>

        <html lang="pt">

        <head>

            <meta charset="UTF-8">

            <title>
                Notas — ${escaparHTML(
                    aluno.nome || "Aluno"
                )}
            </title>


            <style>

                body {

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;

                    padding:25px;

                }


                h1,
                h2,
                p {

                    text-align:center;

                }


                table {

                    width:100%;

                    border-collapse:collapse;

                    margin-top:20px;

                    font-size:12px;

                }


                th,
                td {

                    border:
                        1px solid #222;

                    padding:7px;

                    text-align:center;

                }


                th {

                    background:#e5e7eb;

                }


                .rodape {

                    margin-top:40px;

                    border-top:
                        1px solid #999;

                    padding-top:10px;

                    text-align:center;

                    font-size:11px;

                    color:#555;

                }


                @page {

                    size:A4 landscape;

                    margin:10mm;

                }

            </style>

        </head>


        <body>


            <h1>
                SGE
            </h1>


            <h2>
                Histórico de Notas
            </h2>


            <p>

                <strong>Aluno:</strong>

                ${escaparHTML(
                    aluno.nome || "—"
                )}

            </p>


            <p>

                <strong>Código:</strong>

                ${escaparHTML(
                    aluno.codigoAluno || "—"
                )}

                &nbsp;&nbsp;&nbsp;

                <strong>Turma:</strong>

                ${escaparHTML(
                    aluno.turmaNome || "—"
                )}

            </p>


            ${
                anoSelecionado
                    ? `
                        <p>

                            <strong>
                                Ano letivo:
                            </strong>

                            ${escaparHTML(
                                anoSelecionado
                            )}

                        </p>
                    `
                    : ""
            }


            <table>

                <thead>

                    <tr>

                        <th>
                            Ano
                        </th>

                        <th>
                            Disciplina
                        </th>

                        <th>
                            Trimestre
                        </th>

                        <th>
                            MAC
                        </th>

                        <th>
                            NPT
                        </th>

                        <th>
                            MF
                        </th>

                        <th>
                            Classificação
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${linhas}

                </tbody>

            </table>


            <div class="rodape">

                SGE — Sistema de Gestão Escolar

                <br>

                Histórico de notas do aluno

            </div>


        </body>

        </html>

    `);


    janela.document.close();


    janela.onload =
        function () {

            janela.focus();

            janela.print();

        };

}


// =====================================================
// INICIAR
// =====================================================

console.log(
    "✅ BLOCO 1 — SESSÃO E PERFIL PRONTO"
);


console.log(
    "✅ BLOCO 2 — DADOS / SENHA PRONTO"
);


console.log(
    "✅ BLOCO 3 — NOTAS PRONTO"
);


console.log(
    "🎓 ÁREA DO ALUNO PRONTA"
);
