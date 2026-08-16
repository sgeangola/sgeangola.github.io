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

    try {

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


        alert(
            "DEBUG DO ALUNO\n\n" +

            "Nome: " +
            nomeAluno +

            "\n\nTurma ID:\n" +
            turmaId +

            "\n\nNúmero:\n" +
            numeroAluno
        );


        const notasSnapshot =
            await getDocs(
                collection(
                    db,
                    "notas"
                )
            );


        alert(
            "Documentos de notas encontrados: " +
            notasSnapshot.size
        );


        let encontrados = 0;


        for (
            const notaDoc
            of notasSnapshot.docs
        ) {

            const dadosNota =
                notaDoc.data();


            const idTurmaNota =
                String(
                    dadosNota.turmaId || ""
                ).trim();


            if (
                idTurmaNota === turmaId
            ) {

                encontrados++;


                const alunos =
                    Array.isArray(
                        dadosNota.alunos
                    )
                    ? dadosNota.alunos
                    : [];


                alert(
                    "NOTA ENCONTRADA\n\n" +

                    "Documento:\n" +
                    notaDoc.id +

                    "\n\nDisciplina:\n" +
                    (
                        dadosNota.disciplina ||
                        "—"
                    ) +

                    "\n\nTrimestre:\n" +
                    (
                        dadosNota.trimestre ||
                        "—"
                    ) +

                    "\n\nAlunos no documento: " +
                    alunos.length
                );

            }

        }


        alert(
            "RESULTADO FINAL\n\n" +

            "Turma do aluno:\n" +
            turmaId +

            "\n\nDocumentos da mesma turma: " +
            encontrados
        );


    }
    catch (error) {

        alert(
            "ERRO\n\n" +
            error.message
        );

        console.error(error);

    }

};
