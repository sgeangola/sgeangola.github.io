/* =====================================================
   SGE — ÁREA DO ALUNO
   BLOCO 1 — SESSÃO E PERFIL
===================================================== */

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


console.log("🎓 SGE — student-area.js iniciado");


/* =====================================================
   VERIFICAR SESSÃO
===================================================== */

const dadosAluno =
    localStorage.getItem("alunoLogado");


if (!dadosAluno) {

    alert(
        "Sessão expirada.\n\nFaça login novamente."
    );

    window.location.href =
        "student-login.html";

    throw new Error(
        "Aluno não autenticado."
    );

}


/* =====================================================
   CONVERTER SESSÃO
===================================================== */

let aluno;


try {

    aluno =
        JSON.parse(
            dadosAluno
        );

} catch (erro) {

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


/* =====================================================
   MOSTRAR NO CONSOLE
===================================================== */

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


/* =====================================================
   ELEMENTOS DO HTML
===================================================== */

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


/* =====================================================
   PREENCHER PERFIL
===================================================== */

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


/* =====================================================
   CONFIRMAÇÃO
===================================================== */

console.log(
    "✅ BLOCO 1 — ÁREA DO ALUNO PRONTA"
);

alert(
    "🎓 Área do Aluno carregada com sucesso!"
);

/* =====================================================
   SGE — ÁREA DO ALUNO
   BLOCO 2 — BOTÕES E SESSÃO
===================================================== */


/* =====================================================
   VER DADOS
===================================================== */

window.verDados = function () {

    console.log(
        "👤 Abrindo dados do aluno..."
    );

    const dadosExistentes =
        document.getElementById(
            "janelaDadosAluno"
        );

    if (dadosExistentes) {

        dadosExistentes.remove();

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
                        line-height:2;
                        color:#334155;
                    "
                >

                    <p>
                        <strong>Nome:</strong><br>
                        ${aluno.nome || "—"}
                    </p>

                    <p>
                        <strong>Código do aluno:</strong><br>
                        ${aluno.codigoAluno || "—"}
                    </p>

                    <p>
                        <strong>Número:</strong><br>
                        ${aluno.numero || "—"}
                    </p>

                    <p>
                        <strong>Turma:</strong><br>
                        ${aluno.turmaNome || "—"}
                    </p>

                    <p>
                        <strong>Estado:</strong><br>
                        ${aluno.estado || "ativo"}
                    </p>

                </div>


                <button
                    id="fecharDadosAluno"
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


    const fechar =
        document.getElementById(
            "fecharDadosAluno"
        );


    if (fechar) {

        fechar.onclick =
            function () {

                const janela =
                    document.getElementById(
                        "janelaDadosAluno"
                    );

                if (janela) {

                    janela.remove();

                }

            };

    }

};


/* =====================================================
   ALTERAR SENHA
===================================================== */

window.alterarSenha = function () {

    console.log(
        "🔐 Alterar senha selecionado"
    );


    alert(
        "A função de alteração de senha será ativada na próxima etapa."
    );

};


/* =====================================================
   SAIR DA CONTA
===================================================== */

window.sairAluno = function () {

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


/* =====================================================
   VER BOLETIM — TEMPORÁRIO
===================================================== */

window.verBoletim = function () {

    console.log(
        "📄 Ver boletim selecionado"
    );


    alert(
        "📄 Sistema de boletim será carregado na próxima etapa."
    );

};

/* =====================================================
   SGE — ÁREA DO ALUNO
   BLOCO 3 — SISTEMA DE NOTAS
===================================================== */

window.verNotas = async function () {

    console.log(
        "📊 A carregar notas do aluno..."
    );


    /* =================================================
       VERIFICAR DADOS DO ALUNO
    ================================================= */

    const turmaId =
        String(
            aluno.turmaId || ""
        ).trim();


    const numeroAluno =
        String(
            aluno.numero || ""
        ).trim();


    const nomeAluno =
        String(
            aluno.nome || ""
        ).trim();


    console.log(
        "ALUNO:",
        aluno
    );

    console.log(
        "TURMA ID:",
        turmaId
    );

    console.log(
        "NÚMERO:",
        numeroAluno
    );

    console.log(
        "NOME:",
        nomeAluno
    );


    if (!turmaId) {

        alert(
            "Não foi possível identificar a turma deste aluno."
        );

        return;

    }


    try {

        /* =============================================
           BUSCAR COLEÇÃO DE NOTAS
        ============================================= */

        const notasRef =
            collection(
                db,
                "notas"
            );


        const snapshot =
            await getDocs(
                notasRef
            );

alert(
    "DEBUG NOTAS\n\n" +

    "Aluno: " +
    (aluno.nome || "—") +

    "\n\nTurma ID: " +
    (aluno.turmaId || "—") +

    "\n\nNúmero: " +
    (aluno.numero || "—") +

    "\n\nDocumentos de notas encontrados: " +
    snapshot.size
);

       let resumoNotas = "";

snapshot.forEach(
    documento => {

        const dadosNota =
            documento.data();

        resumoNotas +=
            "\n\nDOCUMENTO: " +
            documento.id +

            "\nTurma ID: " +
            (
                dadosNota.turmaId ||
                "—"
            ) +

            "\nDisciplina: " +
            (
                dadosNota.disciplina ||
                "—"
            ) +

            "\nTrimestre: " +
            (
                dadosNota.trimestre ||
                "—"
            ) +

            "\nAlunos: " +
            (
                Array.isArray(
                    dadosNota.alunos
                )
                    ? dadosNota.alunos.length
                    : "não é array"
            );

    }
);


alert(
    "ESTRUTURA DAS NOTAS:" +
    resumoNotas
);
       
        console.log(
            "Quantidade de documentos de notas:",
            snapshot.size
        );


        /* =============================================
           OBJETO PARA GUARDAR AS NOTAS
        ============================================= */

        const notasAluno = {};


        /* =============================================
           PERCORRER DOCUMENTOS
        ============================================= */

        snapshot.forEach(
            notaDoc => {

                const dadosNota =
                    notaDoc.data();


                console.log(
                    "DOCUMENTO DE NOTA:",
                    notaDoc.id,
                    dadosNota
                );


                /* =====================================
                   VERIFICAR TURMA
                ===================================== */

                const turmaNota =
                    String(
                        dadosNota.turmaId || ""
                    ).trim();


                if (
                    turmaNota !== turmaId
                ) {

                    return;

                }


                /* =====================================
                   DISCIPLINA
                ===================================== */

                const disciplina =
                    String(
                        dadosNota.disciplina || ""
                    ).trim();


                /* =====================================
                   TRIMESTRE
                ===================================== */

                const trimestre =
                    String(
                        dadosNota.trimestre || ""
                    ).trim();


                if (
                    !disciplina ||
                    !trimestre
                ) {

                    return;

                }


                /* =====================================
                   LISTA DE ALUNOS
                ===================================== */

                const listaAlunos =
                    Array.isArray(
                        dadosNota.alunos
                    )
                    ? dadosNota.alunos
                    : [];


                let alunoEncontrado =
                    null;


                /* =====================================
                   PROCURAR PELO NÚMERO
                ===================================== */

                if (
                    numeroAluno
                ) {

                    alunoEncontrado =
                        listaAlunos.find(
                            item => {

                                return (
                                    String(
                                        item.numero || ""
                                    ).trim()
                                    === numeroAluno
                                );

                            }
                        );

                }


                /* =====================================
                   SE NÃO ENCONTRAR,
                   PROCURAR PELO CÓDIGO
                ===================================== */

                if (
                    !alunoEncontrado &&
                    aluno.codigoAluno
                ) {

                    const codigo =
                        String(
                            aluno.codigoAluno
                        ).trim();


                    alunoEncontrado =
                        listaAlunos.find(
                            item => {

                                return (
                                    String(
                                        item.codigoAluno || ""
                                    ).trim()
                                    === codigo
                                );

                            }
                        );

                }


                /* =====================================
                   SE NÃO ENCONTRAR,
                   PROCURAR PELO NOME
                ===================================== */

                if (
                    !alunoEncontrado &&
                    nomeAluno
                ) {

                    alunoEncontrado =
                        listaAlunos.find(
                            item => {

                                return (
                                    String(
                                        item.nome || ""
                                    )
                                    .trim()
                                    .toLowerCase()
                                    ===
                                    nomeAluno
                                    .trim()
                                    .toLowerCase()
                                );

                            }
                        );

                }


                /* =====================================
                   ALUNO NÃO ENCONTRADO
                ===================================== */

                if (
                    !alunoEncontrado
                ) {

                    return;

                }


                /* =====================================
                   CRIAR DISCIPLINA
                ===================================== */

                if (
                    !notasAluno[disciplina]
                ) {

                    notasAluno[disciplina] = {};

                }


                /* =====================================
                   GUARDAR NOTAS
                ===================================== */

                notasAluno[
                    disciplina
                ][
                    trimestre
                ] = {

                    MAC:
                        alunoEncontrado.MAC ?? "",

                    NPT:
                        alunoEncontrado.NPT ?? "",

                    MF:
                        alunoEncontrado.MF ?? "",

                    classificacao:
                        alunoEncontrado.classificacao
                        || ""

                };

            }
        );


        console.log(
            "📊 NOTAS ENCONTRADAS:",
            notasAluno
        );


        /* =============================================
           VERIFICAR SE EXISTEM NOTAS
        ============================================= */

        const disciplinas =
            Object.keys(
                notasAluno
            );


        if (
            disciplinas.length === 0
        ) {

            alert(
                "Ainda não existem notas para este aluno."
            );

            return;

        }


        /* =============================================
           FECHAR JANELA ANTIGA
        ============================================= */

        const janelaAntiga =
            document.getElementById(
                "janelaNotas"
            );


        if (
            janelaAntiga
        ) {

            janelaAntiga.remove();

        }


        /* =============================================
           CRIAR JANELA
        ============================================= */

        let html = `

        <div
            id="janelaNotas"
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
                    width:100%;
                    max-width:900px;
                    margin:auto;
                    padding-bottom:40px;
                "
            >

                <!-- CABEÇALHO -->

                <div
                    style="
                        background:#1e3a8a;
                        color:white;
                        padding:25px;
                        border-radius:16px;
                        text-align:center;
                        margin-bottom:20px;
                    "
                >

                    <div
                        style="
                            font-size:45px;
                        "
                    >
                        📊
                    </div>


                    <h2
                        style="
                            margin:8px 0;
                        "
                    >
                        Minhas Notas
                    </h2>


                    <div>
                        ${aluno.nome || "Aluno"}
                    </div>


                    <small>
                        ${aluno.turmaNome || ""}
                    </small>

                </div>

        `;


        /* =============================================
           DISCIPLINAS
        ============================================= */

        disciplinas.forEach(
            disciplina => {

                html += `

                <div
                    style="
                        background:white;
                        border-radius:15px;
                        padding:18px;
                        margin-bottom:18px;
                        box-shadow:
                            0 3px 10px
                            rgba(0,0,0,.08);
                    "
                >

                    <h3
                        style="
                            margin:0 0 15px;
                            color:#1e3a8a;
                            border-bottom:
                                2px solid #e2e8f0;
                            padding-bottom:10px;
                        "
                    >
                        📚 ${disciplina}
                    </h3>

                `;


                const notas =
                    notasAluno[
                        disciplina
                    ];


                const trimestres =
                    Object.keys(
                        notas
                    ).sort(
                        (
                            a,
                            b
                        ) => {

                            const numeroA =
                                obterNumeroTrimestre(
                                    a
                                );

                            const numeroB =
                                obterNumeroTrimestre(
                                    b
                                );

                            return (
                                numeroA -
                                numeroB
                            );

                        }
                    );


                trimestres.forEach(
                    trimestre => {

                        const nota =
                            notas[
                                trimestre
                            ];


                        html += `

                        <div
                            style="
                                border:
                                    1px solid #e2e8f0;
                                border-radius:12px;
                                overflow:hidden;
                                margin-bottom:15px;
                            "
                        >

                            <div
                                style="
                                    background:#e0f2fe;
                                    color:#1e3a8a;
                                    padding:12px;
                                    font-weight:bold;
                                "
                            >

                                📝
                                ${formatarNomeTrimestre(
                                    trimestre
                                )}

                            </div>


                            <div
                                style="
                                    display:grid;
                                    grid-template-columns:
                                    repeat(4,1fr);
                                    gap:8px;
                                    padding:15px;
                                    text-align:center;
                                "
                            >

                                <div>

                                    <small>
                                        MAC
                                    </small>

                                    <strong
                                        style="
                                            display:block;
                                            font-size:20px;
                                            margin-top:5px;
                                        "
                                    >
                                        ${
                                            nota.MAC !== ""
                                            ? nota.MAC
                                            : "—"
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <small>
                                        NPT
                                    </small>

                                    <strong
                                        style="
                                            display:block;
                                            font-size:20px;
                                            margin-top:5px;
                                        "
                                    >
                                        ${
                                            nota.NPT !== ""
                                            ? nota.NPT
                                            : "—"
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <small>
                                        MF
                                    </small>

                                    <strong
                                        style="
                                            display:block;
                                            font-size:20px;
                                            margin-top:5px;
                                        "
                                    >
                                        ${
                                            nota.MF !== ""
                                            ? nota.MF
                                            : "—"
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <small>
                                        Classificação
                                    </small>

                                    <strong
                                        style="
                                            display:block;
                                            margin-top:5px;
                                            font-size:14px;
                                        "
                                    >
                                        ${
                                            nota.classificacao
                                            || "—"
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>

                        `;

                    }
                );


                html += `

                </div>

                `;

            }
        );


        /* =============================================
           BOTÃO VOLTAR
        ============================================= */

        html += `

                <button
                    id="fecharNotas"
                    style="
                        width:100%;
                        padding:15px;
                        border:none;
                        border-radius:10px;
                        background:#dc2626;
                        color:white;
                        font-size:16px;
                        font-weight:bold;
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


        /* =============================================
           BOTÃO FECHAR
        ============================================= */

        const fechar =
            document.getElementById(
                "fecharNotas"
            );


        if (fechar) {

            fechar.onclick =
                function () {

                    const janela =
                        document.getElementById(
                            "janelaNotas"
                        );


                    if (
                        janela
                    ) {

                        janela.remove();

                    }

                };

        }


    }

    catch (erro) {

        console.error(
            "❌ ERRO AO CARREGAR NOTAS:",
            erro
        );


        alert(
            "Erro ao carregar notas:\n\n" +
            erro.message
        );

    }

};


/* =====================================================
   AUXILIAR — NÚMERO DO TRIMESTRE
===================================================== */

function obterNumeroTrimestre(
    valor
) {

    const texto =
        String(
            valor || ""
        )
        .trim()
        .toLowerCase();


    if (
        texto.includes("1")
    ) {

        return 1;

    }


    if (
        texto.includes("2")
    ) {

        return 2;

    }


    if (
        texto.includes("3")
    ) {

        return 3;

    }


    return 99;

}


/* =====================================================
   AUXILIAR — NOME DO TRIMESTRE
===================================================== */

function formatarNomeTrimestre(
    valor
) {

    const numero =
        obterNumeroTrimestre(
            valor
        );


    if (
        numero === 1
    ) {

        return "1.º Trimestre";

    }


    if (
        numero === 2
    ) {

        return "2.º Trimestre";

    }


    if (
        numero === 3
    ) {

        return "3.º Trimestre";

    }


    return String(
        valor || "Trimestre"
    );

}


console.log(
    "✅ BLOCO 3 — SISTEMA DE NOTAS ATIVO"
);


console.log(
    "✅ BLOCO 2 — BOTÕES DA ÁREA DO ALUNO ATIVOS"
);
