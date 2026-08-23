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
   - Consultar notas por ano letivo
   - Ver todos os trimestres
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
    "🎓 SGE — student-area.js1 iniciado"
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


        // Atualizar sessão local

        aluno.senha =
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
// VER BOLETIM DO ALUNO
// =====================================================

window.verBoletim =
async function () {

    try {

        const turmaId =
            String(
                aluno.turmaId || ""
            ).trim();


        const alunoId =
            String(
                aluno.id || ""
            ).trim();


        const escolaId =
            String(
                aluno.escolaId || ""
            ).trim();


        if (!turmaId || !alunoId) {

            alert(
                "❌ Não foi possível identificar o aluno ou a turma."
            );

            return;

        }


        // =================================================
        // PROCURAR NOTAS
        // =================================================

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


                // -----------------------------------------
                // FILTRAR ESCOLA
                // -----------------------------------------

                if (
                    escolaId &&
                    dados.escolaId &&
                    String(
                        dados.escolaId
                    ).trim() !== escolaId
                ) {

                    return;

                }


                // -----------------------------------------
                // FILTRAR TURMA
                // -----------------------------------------

                if (
                    String(
                        dados.turmaId || ""
                    ).trim() !== turmaId
                ) {

                    return;

                }


                // -----------------------------------------
                // PROCURAR O ALUNO
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
                        item => {

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


                // -----------------------------------------
                // ADICIONAR DISCIPLINA
                // -----------------------------------------

                disciplinas.push({

                    disciplina:
                        dados.disciplina ||
                        documento.id,

                    trimestre:
                        nomeTrimestre(
                            dados.trimestre
                        ),

                    anoLetivo:
                        obterAnoLetivo(
                            dados
                        ),

                    MAC:
    alunoNota.mac ?? "",

NPT:
    alunoNota.npt ?? "",

MF:
    alunoNota.mf ?? "",

                    classificacao:
                        alunoNota.classificacao ||
                        ""

                });

            }
        );


        // =================================================
        // NENHUMA NOTA
        // =================================================

        if (
            disciplinas.length === 0
        ) {

            alert(
                "📄 Ainda não existem notas disponíveis para gerar o boletim."
            );

            return;

        }


        // =================================================
        // CRIAR JANELA
        // =================================================

        const antiga =
            document.getElementById(
                "janelaBoletimAluno"
            );


        if (antiga) {

            antiga.remove();

        }


        let linhas = "";


        disciplinas.forEach(
            item => {

                linhas += `

                    <tr>

                        <td>
                            ${escaparHTML(
                                item.disciplina
                            )}
                        </td>

                        <td>
                            ${mostrarNota(
                                item.MAC
                            )}
                        </td>

                        <td>
                            ${mostrarNota(
                                item.NPT
                            )}
                        </td>

                        <td>
                            ${mostrarNota(
                                item.MF
                            )}
                        </td>

                        <td>
                            ${escaparHTML(
                                item.classificacao ||
                                "—"
                            )}
                        </td>

                        <td>
                            ${escaparHTML(
                                item.trimestre
                            )}
                        </td>

                    </tr>

                `;

            }
        );


        const html = `

            <div
                id="janelaBoletimAluno"
                style="
                    position:fixed;
                    inset:0;
                    z-index:99999;
                    background:#f1f5f9;
                    overflow:auto;
                    padding:15px;
                "
            >

                <div
                    style="
                        max-width:1000px;
                        margin:15px auto;
                        background:white;
                        border-radius:16px;
                        padding:25px;
                        box-shadow:
                            0 4px 18px
                            rgba(0,0,0,.15);
                    "
                >

                    <div
                        style="
                            text-align:center;
                            border-bottom:
                                2px solid #1e3a8a;
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
                            BOLETIM DE AVALIAÇÃO
                        </h2>

                        <p>
                            Ano Lectivo:
                            ${
                                escaparHTML(
                                    disciplinas[0]
                                        .anoLetivo
                                )
                            }
                        </p>

                    </div>


                    <!-- DADOS DO ALUNO -->

                    <div
                        style="
                            background:#f8fafc;
                            padding:15px;
                            border-radius:10px;
                            margin-bottom:20px;
                            line-height:1.8;
                        "
                    >

                        <strong>Aluno:</strong>
                        ${
                            escaparHTML(
                                aluno.nome || "—"
                            )
                        }

                        <br>

                        <strong>Código:</strong>
                        ${
                            escaparHTML(
                                aluno.codigoAluno || "—"
                            )
                        }

                        <br>

                        <strong>Nº:</strong>
                        ${
                            escaparHTML(
                                aluno.numero || "—"
                            )
                        }

                        <br>

                        <strong>Turma:</strong>
                        ${
                            escaparHTML(
                                aluno.turmaNome || "—"
                            )
                        }

                    </div>


                    <!-- TABELA -->

                    <div
                        style="
                            overflow-x:auto;
                        "
                    >

                        <table
    style="
        width:100%;
        border-collapse:collapse;
        min-width:700px;
        text-align:center;
    "
>

<style>
    #janelaBoletimAluno th,
    #janelaBoletimAluno td {
        text-align: center;
        vertical-align: middle;
    }
</style>

                            <thead>

                                <tr>

                                    <th
                                        style="
                                            border:1px solid #cbd5e1;
                                            padding:10px;
                                            background:#e2e8f0;
                                        "
                                    >
                                        Disciplina
                                    </th>

                                    <th
                                        style="
                                            border:1px solid #cbd5e1;
                                            padding:10px;
                                            background:#e2e8f0;
                                        "
                                    >
                                        MAC
                                    </th>

                                    <th
                                        style="
                                            border:1px solid #cbd5e1;
                                            padding:10px;
                                            background:#e2e8f0;
                                        "
                                    >
                                        NPT
                                    </th>

                                    <th
                                        style="
                                            border:1px solid #cbd5e1;
                                            padding:10px;
                                            background:#e2e8f0;
                                        "
                                    >
                                        MF
                                    </th>

                                    <th
                                        style="
                                            border:1px solid #cbd5e1;
                                            padding:10px;
                                            background:#e2e8f0;
                                        "
                                    >
                                        Classificação
                                    </th>

                                    <th
                                        style="
                                            border:1px solid #cbd5e1;
                                            padding:10px;
                                            background:#e2e8f0;
                                        "
                                    >
                                        Trimestre
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                ${linhas}

                            </tbody>

                        </table>

                    </div>


                    <div
                        style="
                            margin-top:25px;
                            display:flex;
                            gap:10px;
                            flex-wrap:wrap;
                        "
                    >

                        <button
                            id="fecharBoletimAluno"
                            style="
                                padding:12px 20px;
                                border:none;
                                border-radius:8px;
                                background:#1e3a8a;
                                color:white;
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
                function () {

                    document
                        .getElementById(
                            "janelaBoletimAluno"
                        )
                        ?.remove();

                }
            );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar boletim:",
            erro
        );


        alert(
            "❌ Não foi possível carregar o boletim.\n\n" +
            erro.message
        );

    }

};


// =====================================================
// CARREGAR DOCUMENTOS DE NOTAS
// =====================================================

async function carregarDocumentosNotas() {

    const turmaId =
        String(
            aluno.turmaId || ""
        ).trim();


    if (!turmaId) {

        throw new Error(
            "Turma do aluno não identificada."
        );

    }


    const resultado =
        await getDocs(
            collection(
                db,
                "notas"
            )
        );


    const documentos = [];


    resultado.forEach(
        documento => {

            const dados =
                documento.data();


            const idTurma =
                String(
                    dados.turmaId || ""
                ).trim();


            if (
                idTurma !== turmaId
            ) {

                return;

            }


            if (
                dados.escolaId &&
                aluno.escolaId &&
                String(
                    dados.escolaId
                ).trim() !==
                String(
                    aluno.escolaId
                ).trim()
            ) {

                return;

            }


            documentos.push({

                id:
                    documento.id,

                ...dados

            });

        }
    );


    return documentos;

}


// =====================================================
// ENCONTRAR ALUNO DENTRO DAS NOTAS
// =====================================================

function encontrarAlunoNasNotas(
    lista
) {

    const numeroAluno =
        String(
            aluno.numero || ""
        ).trim();


    const codigoAluno =
        String(
            aluno.codigoAluno || ""
        ).trim();


    const nomeAluno =
        String(
            aluno.nome || ""
        )
        .trim()
        .toLowerCase();


    // ---------------------------------------------
    // PRIMEIRA TENTATIVA — NÚMERO
    // ---------------------------------------------

    if (numeroAluno) {

        const encontrado =
            lista.find(
                item =>

                    String(
                        item.numero || ""
                    ).trim() ===
                    numeroAluno
            );


        if (encontrado) {

            return encontrado;

        }

    }


    // ---------------------------------------------
    // SEGUNDA TENTATIVA — CÓDIGO
    // ---------------------------------------------

    if (codigoAluno) {

        const encontrado =
            lista.find(
                item =>

                    String(
                        item.codigoAluno || ""
                    ).trim() ===
                    codigoAluno
            );


        if (encontrado) {

            return encontrado;

        }

    }


    // ---------------------------------------------
    // TERCEIRA TENTATIVA — NOME
    // ---------------------------------------------

    if (nomeAluno) {

        const encontrado =
            lista.find(
                item =>

                    String(
                        item.nome || ""
                    )
                    .trim()
                    .toLowerCase() ===
                    nomeAluno
            );


        if (encontrado) {

            return encontrado;

        }

    }


    return null;

}


// =====================================================
// CRIAR TABELA DE NOTAS
// =====================================================

function construirTabelaNotas(
    documentos
) {

    let linhas = "";


    documentos.forEach(
        documento => {

            const alunoNota =
                encontrarAlunoNasNotas(
                    Array.isArray(
                        documento.alunos
                    )
                        ? documento.alunos
                        : []
                );


            if (!alunoNota) {

                return;

            }


            const trimestre =
                nomeTrimestre(
                    documento.trimestre
                );


            const ano =
                obterAnoLetivo(
                    documento
                );


            linhas += `

                <tr>

                    <td>
                        ${escaparHTML(
                            ano
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            documento.disciplina || "—"
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            trimestre
                        )}
                    </td>

                    <td>
                        ${mostrarNota(
                            alunoNota.mac
                        )}
                    </td>

                    <td>
                        ${mostrarNota(
                            alunoNota.npt
                        )}
                    </td>

                    <td>
                        ${mostrarNota(
                            alunoNota.mf
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            alunoNota.classificacao || "—"
                        )}
                    </td>

                </tr>

            `;

        }
    );


    if (!linhas) {

        linhas = `

            <tr>

                <td
                    colspan="7"
                    style="
                        padding:20px;
                        text-align:center;
                    "
                >
                    Nenhuma nota encontrada.
                </td>

            </tr>

        `;

    }


    return linhas;

}


// =====================================================
// JANELA
// =====================================================

function criarJanelaNotas(
    documentos
) {

    const antiga =
        document.getElementById(
            "janelaNotasAluno"
        );


    if (antiga) {

        antiga.remove();

    }


    const anos =
        [
            ...new Set(
                documentos.map(
                    documento =>
                        obterAnoLetivo(
                            documento
                        )
                )
            )
        ];


    anos.sort(
        (a, b) =>
            String(b).localeCompare(
                String(a)
            )
    );


    const opcoesAno =
        anos.map(
            ano => `

                <option value="${escaparHTML(
                    ano
                )}">
                    ${escaparHTML(
                        ano
                    )}
                </option>

            `
        ).join("");


    const html = `

        <div
            id="janelaNotasAluno"
            style="
                position:fixed;
                inset:0;
                z-index:99999;
                background:#f1f5f9;
                overflow:auto;
                padding:15px;
            "
        >

            <div
                style="
                    max-width:1100px;
                    margin:15px auto;
                    background:white;
                    border-radius:16px;
                    padding:20px;
                    box-shadow:0 4px 18px rgba(0,0,0,.15);
                "
            >

                <div
                    style="
                        text-align:center;
                        color:#1e3a8a;
                    "
                >

                    <div
                        style="
                            font-size:45px;
                        "
                    >
                        📊
                    </div>


                    <h2>
                        Minhas Notas
                    </h2>


                    <p>
                        ${escaparHTML(
                            aluno.nome || "Aluno"
                        )}
                    </p>

                </div>


                <div
                    style="
                        display:flex;
                        gap:10px;
                        flex-wrap:wrap;
                        margin:20px 0;
                    "
                >

                    <select
                        id="anoNotasAluno"
                        style="
                            flex:1;
                            min-width:180px;
                            padding:12px;
                            border:1px solid #cbd5e1;
                            border-radius:8px;
                        "
                    >

                        <option value="">
                            Todos os anos
                        </option>

                        ${opcoesAno}

                    </select>


                    <button
                        id="baixarNotasAluno"
                        style="
                            padding:12px 18px;
                            border:0;
                            border-radius:8px;
                            background:#16a34a;
                            color:white;
                            font-weight:bold;
                            cursor:pointer;
                        "
                    >
                        📥 Baixar / Imprimir
                    </button>

                </div>


                <div
                    style="
                        overflow-x:auto;
                    "
                >

                    <table
                        id="tabelaNotasAluno"
                        style="
                            width:100%;
                            min-width:750px;
                            border-collapse:collapse;
                        "
                    >

                        <thead>

                            <tr>

                                <th
                                    style="
                                        border:1px solid #999;
                                        padding:9px;
                                        background:#1e3a8a;
                                        color:white;
                                    "
                                >
                                    Ano
                                </th>

                                <th
                                    style="
                                        border:1px solid #999;
                                        padding:9px;
                                        background:#1e3a8a;
                                        color:white;
                                    "
                                >
                                    Disciplina
                                </th>

                                <th
                                    style="
                                        border:1px solid #999;
                                        padding:9px;
                                        background:#1e3a8a;
                                        color:white;
                                    "
                                >
                                    Trimestre
                                </th>

                                <th
                                    style="
                                        border:1px solid #999;
                                        padding:9px;
                                        background:#1e3a8a;
                                        color:white;
                                    "
                                >
                                    MAC
                                </th>

                                <th
                                    style="
                                        border:1px solid #999;
                                        padding:9px;
                                        background:#1e3a8a;
                                        color:white;
                                    "
                                >
                                    NPT
                                </th>

                                <th
                                    style="
                                        border:1px solid #999;
                                        padding:9px;
                                        background:#1e3a8a;
                                        color:white;
                                    "
                                >
                                    MF
                                </th>

                                <th
                                    style="
                                        border:1px solid #999;
                                        padding:9px;
                                        background:#1e3a8a;
                                        color:white;
                                    "
                                >
                                    Classificação
                                </th>

                            </tr>

                        </thead>


                        <tbody
                            id="corpoNotasAluno"
                        >

                            ${construirTabelaNotas(
                                documentos
                            )}

                        </tbody>

                    </table>

                </div>


                <button
                    id="fecharNotasAluno"
                    style="
                        width:100%;
                        margin-top:20px;
                        padding:14px;
                        border:0;
                        border-radius:9px;
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


    const seletorAno =
        document.getElementById(
            "anoNotasAluno"
        );


    const corpo =
        document.getElementById(
            "corpoNotasAluno"
        );


    seletorAno?.addEventListener(
        "change",
        function () {

            const anoSelecionado =
                this.value;


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


            corpo.innerHTML =
                construirTabelaNotas(
                    filtrados
                );

        }
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


    document
        .getElementById(
            "baixarNotasAluno"
        )
        ?.addEventListener(
            "click",
            function () {

                imprimirNotasAluno(
                    documentos,
                    seletorAno?.value || ""
                );

            }
        );

}

// =====================================================
// VERIFICAR SITUAÇÃO FINANCEIRA DO ALUNO
// =====================================================

async function verificarFinanceiroAluno() {

    const escolaId =
        String(
            aluno.escolaId ||
            sessionStorage.getItem("escolaId") ||
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

    const resultado =
        await getDoc(
            referencia
        );

    // Não existe documento financeiro
    if (!resultado.exists()) {

        return {
            existe: false,
            pago1: false,
            pago2: false,
            pago3: false,
            temPagamento: false
        };

    }

    const dados =
        resultado.data();

    const pago1 =
        dados?.["1trimestre"]?.pago === true;

    const pago2 =
        dados?.["2trimestre"]?.pago === true;

    const pago3 =
        dados?.["3trimestre"]?.pago === true;

    return {

        existe: true,

        pago1,
        pago2,
        pago3,

        temPagamento:
            pago1 ||
            pago2 ||
            pago3

    };

}

// =====================================================
// VER NOTAS
// =====================================================

window.verNotas =
async function () {

    try {

        // =============================================
        // PRIMEIRO — VERIFICAR FINANCEIRO
        // =============================================

        const financeiro =
            await verificarFinanceiroAluno();


        console.log(
            "💰 SITUAÇÃO FINANCEIRA:",
            financeiro
        );


        // =============================================
        // NÃO TEM NENHUM PAGAMENTO
        // =============================================

        if (
            !financeiro.temPagamento
        ) {

            alert(
                "🔒 ACESSO ÀS NOTAS BLOQUEADO\n\n" +

                "A sua situação financeira " +
                "não possui nenhum trimestre pago.\n\n" +

                "Regularize a situação financeira " +
                "para consultar as suas notas."
            );

            return;

        }


        // =============================================
        // EXISTEM PAGAMENTOS
        // =============================================

        const documentos =
            await carregarDocumentosNotas();


        if (
            documentos.length === 0
        ) {

            alert(
                "📊 Ainda não existem notas lançadas " +
                "para a sua turma."
            );

            return;

        }


        criarJanelaNotas(
            documentos
        );

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO CARREGAR NOTAS:",
            erro
        );


        alert(
            "❌ Não foi possível verificar o acesso às notas.\n\n" +
            erro.message
        );

    }

};

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

                    font-family:Arial,
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

                    border:1px solid #222;

                    padding:7px;

                    text-align:center;

                }


                th {

                    background:#e5e7eb;

                }


                .rodape {

                    margin-top:40px;

                    border-top:1px solid #999;

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

                        <th>Ano</th>
                        <th>Disciplina</th>
                        <th>Trimestre</th>
                        <th>MAC</th>
                        <th>NPT</th>
                        <th>MF</th>
                        <th>Classificação</th>

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
