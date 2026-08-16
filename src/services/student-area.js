/* =====================================================
   SGE ANGOLA
   STUDENT AREA — V2
   BLOCO 1/6
===================================================== */

console.log("🚀 SGE STUDENT AREA V2 — CARREGADO");

alert("🚀 ÁREA DO ALUNO V2 CARREGADA ✅");


/* =====================================================
   FIREBASE
===================================================== */

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


/* =====================================================
   SESSÃO DO ALUNO
===================================================== */

const dadosAluno =
    localStorage.getItem("alunoLogado");


if (!dadosAluno) {

    console.error(
        "❌ Nenhuma sessão de aluno encontrada."
    );

    alert(
        "Sessão expirada. Faça login novamente."
    );

    window.location.href =
        "student-login.html";

    throw new Error(
        "Aluno não autenticado."
    );

}


/* =====================================================
   CONVERTER DADOS DA SESSÃO
===================================================== */

let aluno;

try {

    aluno =
        JSON.parse(
            dadosAluno
        );

} catch (erro) {

    console.error(
        "❌ Erro ao ler alunoLogado:",
        erro
    );

    localStorage.removeItem(
        "alunoLogado"
    );

    alert(
        "A sessão do aluno está inválida. Faça login novamente."
    );

    window.location.href =
        "student-login.html";

    throw erro;

}


/* =====================================================
   CONFIRMAÇÃO DA SESSÃO
===================================================== */

console.log(
    "======================================"
);

console.log(
    "👨‍🎓 ALUNO LOGADO"
);

console.log(
    aluno
);

console.log(
    "ID:",
    aluno.id
);

console.log(
    "Código:",
    aluno.codigoAluno
);

console.log(
    "Nome:",
    aluno.nome
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
    "======================================"
);


/* =====================================================
   FUNÇÃO PARA TEXTO SEGURO
===================================================== */

function textoSeguro(valor, padrao = "") {

    if (
        valor === null ||
        valor === undefined
    ) {

        return padrao;

    }

    return String(valor).trim();

}


/* =====================================================
   DADOS NORMALIZADOS DO ALUNO
===================================================== */

const alunoAtual = {

    id:
        textoSeguro(
            aluno.id
        ),

    codigoAluno:
        textoSeguro(
            aluno.codigoAluno
        ),

    nome:
        textoSeguro(
            aluno.nome,
            "Aluno"
        ),

    turmaId:
        textoSeguro(
            aluno.turmaId
        ),

    turmaNome:
        textoSeguro(
            aluno.turmaNome,
            "—"
        ),

    numero:
        textoSeguro(
            aluno.numero
        ),

    estado:
        textoSeguro(
            aluno.estado,
            "ativo"
        )

};


console.log(
    "✅ DADOS NORMALIZADOS:",
    alunoAtual
);


/* =====================================================
   ELEMENTOS DA PÁGINA
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
   MOSTRAR DADOS DO ALUNO
===================================================== */

if (nomeElemento) {

    nomeElemento.textContent =
        alunoAtual.nome;

}


if (codigoElemento) {

    codigoElemento.textContent =
        "Código: " +
        (
            alunoAtual.codigoAluno ||
            "—"
        );

}


if (turmaElemento) {

    turmaElemento.textContent =
        "Turma: " +
        (
            alunoAtual.turmaNome ||
            "—"
        );

}


if (estadoElemento) {

    estadoElemento.textContent =
        "Estado: " +
        (
            alunoAtual.estado ||
            "ativo"
        );

}


/* =====================================================
   FUNÇÃO GLOBAL — SAIR
===================================================== */

window.sairAluno =
    function () {

        const confirmar =
            confirm(
                "Deseja realmente terminar a sessão?"
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


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

console.log(
    "✅ BLOCO 1/6 FINALIZADO"
);

console.log(
    "👨‍🎓 Área do aluno pronta para receber o BLOCO 2."
);

        /* =====================================================
   SGE ANGOLA
   STUDENT AREA — V2
   BLOCO 2/6
   FUNÇÕES AUXILIARES + NOTAS
===================================================== */


/* =====================================================
   IDENTIFICAR TRIMESTRE
===================================================== */

function obterTrimestre(valor) {

    const texto =
        textoSeguro(valor)
        .toLowerCase();


    if (
        texto === "1" ||
        texto === "1º" ||
        texto === "1.º" ||
        texto === "1°" ||
        texto.includes("1 trimestre") ||
        texto.includes("1º trimestre") ||
        texto.includes("1.º trimestre") ||
        texto.includes("1° trimestre")
    ) {

        return 1;

    }


    if (
        texto === "2" ||
        texto === "2º" ||
        texto === "2.º" ||
        texto === "2°" ||
        texto.includes("2 trimestre") ||
        texto.includes("2º trimestre") ||
        texto.includes("2.º trimestre") ||
        texto.includes("2° trimestre")
    ) {

        return 2;

    }


    if (
        texto === "3" ||
        texto === "3º" ||
        texto === "3.º" ||
        texto === "3°" ||
        texto.includes("3 trimestre") ||
        texto.includes("3º trimestre") ||
        texto.includes("3.º trimestre") ||
        texto.includes("3° trimestre")
    ) {

        return 3;

    }


    return 99;

}


/* =====================================================
   FORMATAR TRIMESTRE
===================================================== */

function formatarTrimestre(numero) {

    switch (numero) {

        case 1:
            return "1.º Trimestre";

        case 2:
            return "2.º Trimestre";

        case 3:
            return "3.º Trimestre";

        default:
            return "Trimestre";

    }

}


/* =====================================================
   CONVERTER NOTA
===================================================== */

function converterNota(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return null;

    }


    const texto =
        String(valor)
        .trim()
        .replace(",", ".");


    const numero =
        Number(texto);


    if (
        Number.isFinite(numero)
    ) {

        return numero;

    }


    return null;

}


/* =====================================================
   FORMATAR NOTA
===================================================== */

function formatarNota(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "—";

    }


    return String(valor);

}


/* =====================================================
   CALCULAR MÉDIA ANUAL
===================================================== */

function calcularMediaAnual(notas) {

    const valores = [];


    Object.values(notas)
    .forEach(
        nota => {

            const mf =
                converterNota(
                    nota.MF
                );


            if (
                mf !== null
            ) {

                valores.push(
                    mf
                );

            }

        }
    );


    if (
        valores.length === 0
    ) {

        return null;

    }


    const soma =
        valores.reduce(
            (
                total,
                valor
            ) => {

                return total + valor;

            },
            0
        );


    return (
        soma /
        valores.length
    );

}


/* =====================================================
   CLASSIFICAÇÃO AUTOMÁTICA
===================================================== */

function obterClassificacao(valor) {

    const nota =
        converterNota(valor);


    if (
        nota === null
    ) {

        return "—";

    }


    if (nota <= 4) {

        return "Mau";

    }


    if (nota <= 9) {

        return "Medíocre";

    }


    if (nota <= 13) {

        return "Suficiente";

    }


    if (nota <= 16) {

        return "Bom";

    }


    if (nota <= 20) {

        return "Muito Bom";

    }


    return "—";

}


/* =====================================================
   NORMALIZAR NOME
===================================================== */

function normalizarNome(nome) {

    return textoSeguro(nome)
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


/* =====================================================
   PROCURAR ALUNO DENTRO DA LISTA
===================================================== */

function encontrarAlunoNaLista(
    lista,
    aluno
) {

    if (
        !Array.isArray(lista)
    ) {

        return null;

    }


    /* -----------------------------------------------
       1 — PROCURAR PELO ID
    ------------------------------------------------ */

    if (
        aluno.id
    ) {

        const encontrado =
            lista.find(
                item =>
                    textoSeguro(
                        item.id
                    ) ===
                    textoSeguro(
                        aluno.id
                    )
            );


        if (encontrado) {

            return encontrado;

        }

    }


    /* -----------------------------------------------
       2 — PROCURAR PELO CÓDIGO
    ------------------------------------------------ */

    if (
        aluno.codigoAluno
    ) {

        const encontrado =
            lista.find(
                item =>
                    textoSeguro(
                        item.codigoAluno
                    ) ===
                    textoSeguro(
                        aluno.codigoAluno
                    )
            );


        if (encontrado) {

            return encontrado;

        }

    }


    /* -----------------------------------------------
       3 — PROCURAR PELO NÚMERO
    ------------------------------------------------ */

    if (
        aluno.numero
    ) {

        const encontrado =
            lista.find(
                item =>
                    textoSeguro(
                        item.numero
                    ) ===
                    textoSeguro(
                        aluno.numero
                    )
            );


        if (encontrado) {

            return encontrado;

        }

    }


    /* -----------------------------------------------
       4 — PROCURAR PELO NOME
    ------------------------------------------------ */

    if (
        aluno.nome
    ) {

        const nomeProcurado =
            normalizarNome(
                aluno.nome
            );


        const encontrado =
            lista.find(
                item =>
                    normalizarNome(
                        item.nome
                    ) ===
                    nomeProcurado
            );


        if (encontrado) {

            return encontrado;

        }

    }


    return null;

}


/* =====================================================
   ORGANIZAR NOTAS DO ALUNO
===================================================== */

function organizarNotasAluno(
    documentos,
    aluno
) {

    const resultado = {};


    for (
        const documento
        of documentos
    ) {

        const dadosNota =
            documento.data();


        /* -----------------------------------------------
           VERIFICAR TURMA
        ------------------------------------------------ */

        const turmaNota =
            textoSeguro(
                dadosNota.turmaId
            );


        if (
            turmaNota &&
            turmaNota !==
            textoSeguro(
                aluno.turmaId
            )
        ) {

            continue;

        }


        /* -----------------------------------------------
           DISCIPLINA
        ------------------------------------------------ */

        const disciplina =
            textoSeguro(
                dadosNota.disciplina
            );


        if (
            !disciplina
        ) {

            continue;

        }


        /* -----------------------------------------------
           TRIMESTRE
        ------------------------------------------------ */

        const trimestre =
            textoSeguro(
                dadosNota.trimestre
            );


        if (
            !trimestre
        ) {

            continue;

        }


        /* -----------------------------------------------
           LISTA DE ALUNOS
        ------------------------------------------------ */

        const lista =
            Array.isArray(
                dadosNota.alunos
            )
            ? dadosNota.alunos
            : [];


        const registro =
            encontrarAlunoNaLista(
                lista,
                aluno
            );


        if (
            !registro
        ) {

            continue;

        }


        /* -----------------------------------------------
           CRIAR DISCIPLINA
        ------------------------------------------------ */

        if (
            !resultado[
                disciplina
            ]
        ) {

            resultado[
                disciplina
            ] = {};

        }


        /* -----------------------------------------------
           GUARDAR NOTAS
        ------------------------------------------------ */

        resultado[
            disciplina
        ][
            trimestre
        ] = {

            MAC:
                registro.MAC ??
                "",

            NPT:
                registro.NPT ??
                "",

            MF:
                registro.MF ??
                "",

            classificacao:
                registro.classificacao ||
                obterClassificacao(
                    registro.MF
                )

        };

    }


    return resultado;

}


/* =====================================================
   BUSCAR NOTAS NO FIRESTORE
===================================================== */

async function buscarNotasAluno() {

    console.log(
        "📊 Buscando notas do aluno..."
    );


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "notas"
                )
            );


        console.log(
            "📚 Documentos encontrados:",
            snapshot.size
        );


        if (
            snapshot.empty
        ) {

            return {};

        }


        const notas =
            organizarNotasAluno(
                snapshot.docs,
                alunoAtual
            );


        console.log(
            "✅ NOTAS ORGANIZADAS:",
            notas
        );


        return notas;

    }
    catch (erro) {

        console.error(
            "❌ ERRO AO BUSCAR NOTAS:",
            erro
        );

        throw erro;

    }

}


/* =====================================================
   MÉDIA GERAL DAS DISCIPLINAS
===================================================== */

function calcularMediaGeral(
    notasAluno
) {

    const medias = [];


    Object.values(
        notasAluno
    )
    .forEach(
        notasDisciplina => {

            const media =
                calcularMediaAnual(
                    notasDisciplina
                );


            if (
                media !== null
            ) {

                medias.push(
                    media
                );

            }

        }
    );


    if (
        medias.length === 0
    ) {

        return null;

    }


    const soma =
        medias.reduce(
            (
                total,
                valor
            ) =>
                total + valor,
            0
        );


    return (
        soma /
        medias.length
    );

}


/* =====================================================
   FUNÇÃO GLOBAL — VER NOTAS
===================================================== */

window.verNotas =
    async function () {

        console.log(
            "📊 Botão MINHAS NOTAS pressionado."
        );


        try {

            const notasAluno =
                await buscarNotasAluno();


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


            window.abrirJanelaNotas(
                notasAluno
            );

        }
        catch (erro) {

            console.error(
                "Erro em verNotas:",
                erro
            );


            alert(
                "Não foi possível carregar as notas.\n\n" +
                erro.message
            );

        }

    };


/* =====================================================
   CONFIRMAÇÃO DO BLOCO
===================================================== */

console.log(
    "✅ BLOCO 2/6 FINALIZADO"
);

console.log(
    "📊 Sistema de notas preparado."
);

/* =====================================================
   SGE ANGOLA
   STUDENT AREA — V2
   BLOCO 3/6
   INTERFACE — MINHAS NOTAS
===================================================== */


/* =====================================================
   ESCAPAR TEXTO PARA HTML
===================================================== */

function escaparHTML(valor) {

    return String(valor ?? "")
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


/* =====================================================
   ABRIR JANELA DE NOTAS
===================================================== */

window.abrirJanelaNotas =
    function (notasAluno) {

        /* ---------------------------------------------
           REMOVER JANELA ANTERIOR
        --------------------------------------------- */

        const antiga =
            document.getElementById(
                "janelaNotasSGE"
            );


        if (antiga) {

            antiga.remove();

        }


        /* ---------------------------------------------
           DISCIPLINAS
        --------------------------------------------- */

        const disciplinas =
            Object.keys(
                notasAluno
            );


        /* ---------------------------------------------
           MÉDIA GERAL
        --------------------------------------------- */

        const mediaGeral =
            calcularMediaGeral(
                notasAluno
            );


        let html = `

        <div
            id="janelaNotasSGE"
            style="
                position:fixed;
                inset:0;
                z-index:999999;
                background:#f1f5f9;
                overflow-y:auto;
                font-family:Arial,sans-serif;
            "
        >

            <div
                style="
                    width:94%;
                    max-width:950px;
                    margin:auto;
                    padding:15px 0 40px;
                "
            >

                <!-- CABEÇALHO -->

                <div
                    style="
                        background:#1e3a8a;
                        color:white;
                        border-radius:18px;
                        padding:24px 18px;
                        text-align:center;
                        box-shadow:
                            0 5px 15px
                            rgba(0,0,0,.15);
                    "
                >

                    <div
                        style="
                            font-size:42px;
                            margin-bottom:5px;
                        "
                    >
                        📊
                    </div>

                    <h2
                        style="
                            margin:5px 0;
                        "
                    >
                        Minhas Notas
                    </h2>

                    <div
                        style="
                            font-size:17px;
                            font-weight:bold;
                        "
                    >
                        ${
                            escaparHTML(
                                alunoAtual.nome
                            )
                        }
                    </div>

                    <div
                        style="
                            margin-top:5px;
                            opacity:.9;
                        "
                    >
                        Turma:
                        ${
                            escaparHTML(
                                alunoAtual.turmaNome
                            )
                        }
                    </div>

                </div>


                <!-- RESUMO -->

                <div
                    style="
                        background:white;
                        margin-top:15px;
                        padding:18px;
                        border-radius:15px;
                        box-shadow:
                            0 3px 10px
                            rgba(0,0,0,.08);
                        text-align:center;
                    "
                >

                    <div
                        style="
                            color:#64748b;
                            font-size:14px;
                        "
                    >
                        MÉDIA GERAL
                    </div>

                    <div
                        style="
                            color:#1e3a8a;
                            font-size:34px;
                            font-weight:bold;
                            margin-top:5px;
                        "
                    >
                        ${
                            mediaGeral === null
                            ? "—"
                            : mediaGeral.toFixed(1)
                        }
                    </div>

                    <div
                        style="
                            color:#64748b;
                            margin-top:4px;
                        "
                    >
                        ${
                            disciplinas.length
                        }
                        disciplina(s)
                    </div>

                </div>

        `;


        /* =================================================
           DISCIPLINAS
        ================================================= */

        disciplinas.forEach(
            disciplina => {

                const notas =
                    notasAluno[
                        disciplina
                    ];


                const mediaDisciplina =
                    calcularMediaAnual(
                        notas
                    );


                html += `

                <div
                    style="
                        background:white;
                        margin-top:18px;
                        border-radius:16px;
                        overflow:hidden;
                        box-shadow:
                            0 3px 10px
                            rgba(0,0,0,.08);
                    "
                >

                    <!-- NOME DA DISCIPLINA -->

                    <div
                        style="
                            background:#e0f2fe;
                            padding:15px;
                            color:#1e3a8a;
                            font-weight:bold;
                            font-size:18px;
                        "
                    >

                        📚
                        ${
                            escaparHTML(
                                disciplina
                            )
                        }

                    </div>


                    <!-- TRIMESTRES -->

                    <div
                        style="
                            padding:15px;
                        "
                    >

                `;


                const trimestres =
                    Object.keys(
                        notas
                    )
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            obterTrimestre(a)
                            -
                            obterTrimestre(b)
                    );


                trimestres.forEach(
                    trimestre => {

                        const nota =
                            notas[
                                trimestre
                            ];


                        const numero =
                            obterTrimestre(
                                trimestre
                            );


                        const classificacao =
                            nota.classificacao ||
                            obterClassificacao(
                                nota.MF
                            );


                        html += `

                        <div
                            style="
                                border:
                                    1px solid #e2e8f0;
                                border-radius:12px;
                                margin-bottom:12px;
                                overflow:hidden;
                            "
                        >

                            <div
                                style="
                                    background:#f8fafc;
                                    padding:11px 12px;
                                    font-weight:bold;
                                    color:#334155;
                                "
                            >

                                📝
                                ${
                                    formatarTrimestre(
                                        numero
                                    )
                                }

                            </div>


                            <div
                                style="
                                    display:grid;
                                    grid-template-columns:
                                        repeat(4,minmax(0,1fr));
                                    gap:5px;
                                    padding:12px;
                                    text-align:center;
                                "
                            >

                                <!-- MAC -->

                                <div>

                                    <div
                                        style="
                                            color:#64748b;
                                            font-size:12px;
                                        "
                                    >
                                        MAC
                                    </div>

                                    <strong
                                        style="
                                            display:block;
                                            margin-top:4px;
                                            font-size:19px;
                                            color:#0f172a;
                                        "
                                    >
                                        ${
                                            formatarNota(
                                                nota.MAC
                                            )
                                        }
                                    </strong>

                                </div>


                                <!-- NPT -->

                                <div>

                                    <div
                                        style="
                                            color:#64748b;
                                            font-size:12px;
                                        "
                                    >
                                        NPT
                                    </div>

                                    <strong
                                        style="
                                            display:block;
                                            margin-top:4px;
                                            font-size:19px;
                                            color:#0f172a;
                                        "
                                    >
                                        ${
                                            formatarNota(
                                                nota.NPT
                                            )
                                        }
                                    </strong>

                                </div>


                                <!-- MF -->

                                <div>

                                    <div
                                        style="
                                            color:#64748b;
                                            font-size:12px;
                                        "
                                    >
                                        MF
                                    </div>

                                    <strong
                                        style="
                                            display:block;
                                            margin-top:4px;
                                            font-size:19px;
                                            color:#1e3a8a;
                                        "
                                    >
                                        ${
                                            formatarNota(
                                                nota.MF
                                            )
                                        }
                                    </strong>

                                </div>


                                <!-- CLASSIFICAÇÃO -->

                                <div>

                                    <div
                                        style="
                                            color:#64748b;
                                            font-size:12px;
                                        "
                                    >
                                        Classificação
                                    </div>

                                    <strong
                                        style="
                                            display:block;
                                            margin-top:4px;
                                            font-size:13px;
                                            color:#334155;
                                        "
                                    >
                                        ${
                                            escaparHTML(
                                                classificacao
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>

                        `;

                    }
                );


                /* -----------------------------------------
                   MÉDIA DA DISCIPLINA
                ----------------------------------------- */

                html += `

                        <div
                            style="
                                background:#f0f9ff;
                                border-radius:10px;
                                padding:12px;
                                text-align:center;
                                margin-top:5px;
                            "
                        >

                            <span
                                style="
                                    color:#475569;
                                "
                            >
                                Média da disciplina:
                            </span>

                            <strong
                                style="
                                    color:#1e3a8a;
                                    font-size:18px;
                                    margin-left:5px;
                                "
                            >
                                ${
                                    mediaDisciplina === null
                                    ? "—"
                                    : mediaDisciplina.toFixed(1)
                                }
                            </strong>

                        </div>

                    </div>

                </div>

                `;

            }
        );


        /* =================================================
           BOTÃO VOLTAR
        ================================================= */

        html += `

                <button
                    id="fecharNotasSGE"
                    type="button"
                    style="
                        width:100%;
                        border:none;
                        margin-top:20px;
                        padding:16px;
                        border-radius:12px;
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


        /* =================================================
           INSERIR NA PÁGINA
        ================================================= */

        document.body.insertAdjacentHTML(
            "beforeend",
            html
        );


        /* =================================================
           BOTÃO FECHAR
        ================================================= */

        const botaoFechar =
            document.getElementById(
                "fecharNotasSGE"
            );


        if (botaoFechar) {

            botaoFechar.onclick =
                function () {

                    const janela =
                        document.getElementById(
                            "janelaNotasSGE"
                        );


                    if (janela) {

                        janela.remove();

                    }

                };

        }


        /* =================================================
           VOLTAR AO TOPO
        ================================================= */

        window.scrollTo(
            {
                top:0,
                behavior:"smooth"
            }
        );

    };


/* =====================================================
   CONFIRMAÇÃO DO BLOCO
===================================================== */

console.log(
    "✅ BLOCO 3/6 FINALIZADO"
);

console.log (​​
    "📊 Interface de Minhas Notas pronta."
) ;

/* =====================================================
   SGE ANGOLA
   STUDENT AREA — V2
   BLOCO 4/6
   BOLETIM DO ALUNO
===================================================== */


/* =====================================================
   BUSCAR DADOS PARA O BOLETIM
===================================================== */

async function buscarDadosBoletim() {

    console.log(
        "📄 Buscando dados do boletim..."
    );


    try {

        const notasSnapshot =
            await getDocs(
                collection(
                    db,
                    "notas"
                )
            );


        if (
            notasSnapshot.empty
        ) {

            return {};

        }


        const notas =
            organizarNotasAluno(
                notasSnapshot.docs,
                alunoAtual
            );


        return notas;

    }
    catch (erro) {

        console.error(
            "❌ Erro ao buscar boletim:",
            erro
        );


        throw erro;

    }

}


/* =====================================================
   CALCULAR SITUAÇÃO DO ALUNO
===================================================== */

function calcularSituacaoAluno(
    notasAluno
) {

    const medias = [];


    Object.values(
        notasAluno
    )
    .forEach(
        notasDisciplina => {

            const media =
                calcularMediaAnual(
                    notasDisciplina
                );


            if (
                media !== null
            ) {

                medias.push(
                    media
                );

            }

        }
    );


    if (
        medias.length === 0
    ) {

        return "Sem classificação";

    }


    const negativas =
        medias.filter(
            media =>
                media < 10
        );


    if (
        negativas.length === 0
    ) {

        return "Aprovado";

    }


    return "Em avaliação";

}


/* =====================================================
   ABRIR BOLETIM
===================================================== */

window.verBoletim =
    async function () {

        console.log(
            "📄 Botão BOLETIM pressionado."
        );


        try {

            const notas =
                await buscarDadosBoletim();


            const disciplinas =
                Object.keys(
                    notas
                );


            if (
                disciplinas.length === 0
            ) {

                alert(
                    "Ainda não existem dados suficientes para gerar o boletim."
                );

                return;

            }


            window.abrirBoletimAluno(
                notas
            );

        }
        catch (erro) {

            console.error(
                "❌ ERRO AO ABRIR BOLETIM:",
                erro
            );


            alert(
                "Não foi possível carregar o boletim.\n\n" +
                erro.message
            );

        }

    };


/* =====================================================
   INTERFACE DO BOLETIM
===================================================== */

window.abrirBoletimAluno =
    function (notasAluno) {

        const antiga =
            document.getElementById(
                "janelaBoletimSGE"
            );


        if (antiga) {

            antiga.remove();

        }


        const disciplinas =
            Object.keys(
                notasAluno
            );


        const mediaGeral =
            calcularMediaGeral(
                notasAluno
            );


        const situacao =
            calcularSituacaoAluno(
                notasAluno
            );


        let html = `

        <div
            id="janelaBoletimSGE"
            style="
                position:fixed;
                inset:0;
                z-index:999999;
                background:#f1f5f9;
                overflow-y:auto;
                font-family:Arial,sans-serif;
            "
        >

            <div
                style="
                    width:96%;
                    max-width:1000px;
                    margin:auto;
                    padding:15px 0 40px;
                "
            >

                <!-- CABEÇALHO -->

                <div
                    style="
                        background:white;
                        border-radius:16px;
                        padding:20px;
                        box-shadow:
                            0 3px 10px
                            rgba(0,0,0,.08);
                        text-align:center;
                    "
                >

                    <div
                        style="
                            font-size:38px;
                        "
                    >
                        🏫
                    </div>

                    <h2
                        style="
                            margin:5px 0;
                            color:#1e3a8a;
                        "
                    >
                        BOLETIM ESCOLAR
                    </h2>

                    <div
                        style="
                            color:#64748b;
                            margin-top:5px;
                        "
                    >
                        Ano Letivo
                    </div>

                </div>


                <!-- DADOS DO ALUNO -->

                <div
                    style="
                        background:white;
                        margin-top:15px;
                        padding:18px;
                        border-radius:15px;
                        box-shadow:
                            0 3px 10px
                            rgba(0,0,0,.08);
                    "
                >

                    <h3
                        style="
                            color:#1e3a8a;
                            margin-top:0;
                        "
                    >
                        👨‍🎓 Dados do Aluno
                    </h3>


                    <div
                        style="
                            display:grid;
                            grid-template-columns:
                                repeat(
                                    auto-fit,
                                    minmax(
                                        180px,
                                        1fr
                                    )
                                );
                            gap:12px;
                        "
                    >

                        <div>

                            <small>
                                Nome
                            </small>

                            <strong
                                style="
                                    display:block;
                                    margin-top:4px;
                                "
                            >
                                ${
                                    escaparHTML(
                                        alunoAtual.nome
                                    )
                                }
                            </strong>

                        </div>


                        <div>

                            <small>
                                Código
                            </small>

                            <strong
                                style="
                                    display:block;
                                    margin-top:4px;
                                "
                            >
                                ${
                                    escaparHTML(
                                        alunoAtual.codigoAluno ||
                                        alunoAtual.id ||
                                        "—"
                                    )
                                }
                            </strong>

                        </div>


                        <div>

                            <small>
                                Número
                            </small>

                            <strong
                                style="
                                    display:block;
                                    margin-top:4px;
                                "
                            >
                                ${
                                    escaparHTML(
                                        alunoAtual.numero ||
                                        "—"
                                    )
                                }
                            </strong>

                        </div>


                        <div>

                            <small>
                                Turma
                            </small>

                            <strong
                                style="
                                    display:block;
                                    margin-top:4px;
                                "
                            >
                                ${
                                    escaparHTML(
                                        alunoAtual.turmaNome ||
                                        "—"
                                    )
                                }
                            </strong>

                        </div>

                    </div>

                </div>


                <!-- RESUMO -->

                <div
                    style="
                        background:#1e3a8a;
                        color:white;
                        margin-top:15px;
                        padding:18px;
                        border-radius:15px;
                        text-align:center;
                    "
                >

                    <div
                        style="
                            font-size:13px;
                            opacity:.9;
                        "
                    >
                        MÉDIA GERAL
                    </div>

                    <div
                        style="
                            font-size:34px;
                            font-weight:bold;
                            margin:5px 0;
                        "
                    >
                        ${
                            mediaGeral === null
                            ? "—"
                            : mediaGeral.toFixed(1)
                        }
                    </div>

                    <div
                        style="
                            font-weight:bold;
                        "
                    >
                        ${
                            situacao
                        }
                    </div>

                </div>


                <!-- TABELA -->

                <div
                    style="
                        background:white;
                        margin-top:15px;
                        border-radius:15px;
                        padding:12px;
                        overflow-x:auto;
                        box-shadow:
                            0 3px 10px
                            rgba(0,0,0,.08);
                    "
                >

                    <h3
                        style="
                            color:#1e3a8a;
                            padding:5px;
                        "
                    >
                        📊 Resultado Escolar
                    </h3>


                    <table
                        style="
                            width:100%;
                            border-collapse:collapse;
                            min-width:650px;
                        "
                    >

                        <thead>

                            <tr
                                style="
                                    background:#e0f2fe;
                                    color:#1e3a8a;
                                "
                            >

                                <th
                                    style="
                                        padding:10px;
                                        border:1px solid #cbd5e1;
                                    "
                                >
                                    Disciplina
                                </th>

                                <th
                                    style="
                                        padding:10px;
                                        border:1px solid #cbd5e1;
                                    "
                                >
                                    1.º Trim.
                                </th>

                                <th
                                    style="
                                        padding:10px;
                                        border:1px solid #cbd5e1;
                                    "
                                >
                                    2.º Trim.
                                </th>

                                <th
                                    style="
                                        padding:10px;
                                        border:1px solid #cbd5e1;
                                    "
                                >
                                    3.º Trim.
                                </th>

                                <th
                                    style="
                                        padding:10px;
                                        border:1px solid #cbd5e1;
                                    "
                                >
                                    Média
                                </th>

                            </tr>

                        </thead>

                        <tbody>

        `;


        /* =================================================
           LINHAS DAS DISCIPLINAS
        ================================================= */

        disciplinas.forEach(
            disciplina => {

                const notas =
                    notasAluno[
                        disciplina
                    ];


                const media =
                    calcularMediaAnual(
                        notas
                    );


                function obterMF(
                    numero
                ) {

                    const chave =
                        Object.keys(
                            notas
                        )
                        .find(
                            chave =>
                                obterTrimestre(
                                    chave
                                ) === numero
                        );


                    if (
                        !chave
                    ) {

                        return "—";

                    }


                    return formatarNota(
                        notas[
                            chave
                        ].MF
                    );

                }


                html += `

                            <tr>

                                <td
                                    style="
                                        padding:10px;
                                        border:1px solid #cbd5e1;
                                        font-weight:bold;
                                    "
                                >
                                    ${
                                        escaparHTML(
                                            disciplina
                                        )
                                    }
                                </td>


                                <td
                                    style="
                                        padding:10px;
                                        text-align:center;
                                        border:1px solid #cbd5e1;
                                    "
                                >
                                    ${
                                        obterMF(1)
                                    }
                                </td>


                                <td
                                    style="
                                        padding:10px;
                                        text-align:center;
                                        border:1px solid #cbd5e1;
                                    "
                                >
                                    ${
                                        obterMF(2)
                                    }
                                </td>


                                <td
                                    style="
                                        padding:10px;
                                        text-align:center;
                                        border:1px solid #cbd5e1;
                                    "
                                >
                                    ${
                                        obterMF(3)
                                    }
                                </td>


                                <td
                                    style="
                                        padding:10px;
                                        text-align:center;
                                        border:1px solid #cbd5e1;
                                        font-weight:bold;
                                    "
                                >
                                    ${
                                        media === null
                                        ? "—"
                                        : media.toFixed(1)
                                    }
                                </td>

                            </tr>

                `;

            }
        );


        html += `

                        </tbody>

                    </table>

                </div>


                <!-- INFORMAÇÃO -->

                <div
                    style="
                        background:#fffbeb;
                        border:1px solid #fde68a;
                        margin-top:15px;
                        padding:14px;
                        border-radius:12px;
                        color:#92400e;
                        font-size:14px;
                    "
                >

                    ℹ️ As informações apresentadas
                    correspondem aos dados disponíveis
                    no sistema escolar.

                </div>


                <!-- BOTÕES -->

                <div
                    style="
                        display:grid;
                        grid-template-columns:
                            repeat(
                                auto-fit,
                                minmax(
                                    150px,
                                    1fr
                                )
                            );
                        gap:10px;
                        margin-top:18px;
                    "
                >

                    <button
                        id="imprimirBoletimSGE"
                        type="button"
                        style="
                            border:none;
                            padding:15px;
                            border-radius:12px;
                            background:#1e3a8a;
                            color:white;
                            font-weight:bold;
                            cursor:pointer;
                        "
                    >
                        🖨️ Imprimir
                    </button>


                    <button

id="fecharBoletimSGE"
                        type="button"
                        style="
                            border:none;
                            padding:15px;
                            border-radius:12px;
                            background:#dc2626;
                            color:white;
                            font-weight:bold;
                            cursor:pointer;
                        "
                    >
                        ← Voltar
                    </button>

                </div>


            </div>

        </div>

        `;


        /* =================================================
           INSERIR
        ================================================= */

        document.body.insertAdjacentHTML(
            "beforeend",
            html
        );


        /* =================================================
           FECHAR
        ================================================= */

        const fechar =
            document.getElementById(
                "fecharBoletimSGE"
            );


        if (fechar) {

            fechar.onclick =
                function () {

                    const janela =
                        document.getElementById(
                            "janelaBoletimSGE"
                        );


                    if (janela) {

                        janela.remove();

                    }

                };

        }


        /* =================================================
           IMPRIMIR
        ================================================= */

        const imprimir =
            document.getElementById(
                "imprimirBoletimSGE"
            );


        if (imprimir) {

            imprimir.onclick =
                function () {

                    window.print();

                };

        }


        window.scrollTo(
            {
                top:0,
                behavior:"smooth"
            }
        );

    };


/* =====================================================
   CONFIRMAÇÃO
===================================================== */

console.log(
    "✅ BLOCO 4/6 FINALIZADO"
);

console.log(
    "📄 Sistema de boletim preparado."
);

 /* =====================================================
   SGE ANGOLA
   STUDENT AREA — V2
   BLOCO 5/6
   FINANCEIRO + PERFIL + AÇÕES
===================================================== */


/* =====================================================
   CARREGAR DADOS FINANCEIROS
===================================================== */

async function obterFinanceiroAluno() {

    try {

        const alunoId =
            String(
                alunoAtual.id || ""
            ).trim();


        if (!alunoId) {

            console.warn(
                "⚠️ ID do aluno não encontrado."
            );

            return null;

        }


        const referencia =
            doc(
                db,
                "financeiro",
                alunoId
            );


        const resultado =
            await getDoc(
                referencia
            );


        if (
            !resultado.exists()
        ) {

            console.log(
                "ℹ️ Nenhum registro financeiro."
            );

            return null;

        }


        return resultado.data();

    }
    catch (erro) {

        console.error(
            "❌ Erro financeiro:",
            erro
        );

        return null;

    }

}


/* =====================================================
   FORMATAR VALOR MONETÁRIO
===================================================== */

function formatarKz(valor) {

    const numero =
        Number(valor);


    if (
        !Number.isFinite(numero)
    ) {

        return "0,00 Kz";

    }


    return numero.toLocaleString(
        "pt-AO",
        {
            minimumFractionDigits:2,
            maximumFractionDigits:2
        }
    ) + " Kz";

}


/* =====================================================
   ABRIR FINANCEIRO
===================================================== */

window.verFinanceiro =
    async function () {

        console.log(
            "💰 Abrindo financeiro..."
        );


        const financeiro =
            await obterFinanceiroAluno();


        if (!financeiro) {

            alert(
                "Ainda não existem informações financeiras disponíveis para este aluno."
            );

            return;

        }


        const mensalidade =
            Number(
                financeiro.mensalidade || 0
            );


        const totalPago =
            Number(
                financeiro.totalPago ||
                financeiro.valorPago ||
                0
            );


        const divida =
            Number(
                financeiro.divida ||
                financeiro.valorPendente ||
                0
            );


        let estadoPagamento =
            financeiro.estado ||
            financeiro.status ||
            "";


        if (!estadoPagamento) {

            if (divida <= 0) {

                estadoPagamento =
                    "Regularizado";

            }
            else {

                estadoPagamento =
                    "Pendente";

            }

        }


        const antiga =
            document.getElementById(
                "janelaFinanceiroSGE"
            );


        if (antiga) {

            antiga.remove();

        }


        const html = `

        <div
            id="janelaFinanceiroSGE"
            style="
                position:fixed;
                inset:0;
                z-index:999999;
                background:#f1f5f9;
                overflow-y:auto;
                font-family:Arial,sans-serif;
            "
        >

            <div
                style="
                    width:94%;
                    max-width:800px;
                    margin:auto;
                    padding:18px 0 40px;
                "
            >

                <div
                    style="
                        background:#1e3a8a;
                        color:white;
                        padding:25px 18px;
                        border-radius:18px;
                        text-align:center;
                    "
                >

                    <div
                        style="
                            font-size:42px;
                        "
                    >
                        💰
                    </div>

                    <h2>
                        Situação Financeira
                    </h2>

                    <div>
                        ${
                            escaparHTML(
                                alunoAtual.nome
                            )
                        }
                    </div>

                </div>


                <div
                    style="
                        background:white;
                        margin-top:15px;
                        padding:20px;
                        border-radius:16px;
                        box-shadow:
                            0 3px 10px
                            rgba(0,0,0,.08);
                    "
                >

                    <div
                        style="
                            padding:15px 0;
                            border-bottom:
                                1px solid #e2e8f0;
                        "
                    >

                        <small>
                            Mensalidade
                        </small>

                        <strong
                            style="
                                display:block;
                                font-size:20px;
                                color:#1e3a8a;
                                margin-top:4px;
                            "
                        >
                            ${
                                formatarKz(
                                    mensalidade
                                )
                            }
                        </strong>

                    </div>


                    <div
                        style="
                            padding:15px 0;
                            border-bottom:
                                1px solid #e2e8f0;
                        "
                    >

                        <small>
                            Total pago
                        </small>

                        <strong
                            style="
                                display:block;
                                font-size:20px;
                                color:#16a34a;
                                margin-top:4px;
                            "
                        >
                            ${
                                formatarKz(
                                    totalPago
                                )
                            }
                        </strong>

                    </div>


                    <div
                        style="
                            padding:15px 0;
                        "
                    >

                        <small>
                            Valor pendente
                        </small>

                        <strong
                            style="
                                display:block;
                                font-size:20px;
                                color:#dc2626;
                                margin-top:4px;
                            "
                        >
                            ${
                                formatarKz(
                                    divida
                                )
                            }
                        </strong>

                    </div>


                    <div
                        style="
                            margin-top:10px;
                            padding:14px;
                            border-radius:10px;
                            background:
                                ${
                                    divida <= 0
                                    ? "#dcfce7"
                                    : "#fee2e2"
                                };
                            color:
                                ${
                                    divida <= 0
                                    ? "#166534"
                                    : "#991b1b"
                                };
                            text-align:center;
                            font-weight:bold;
                        "
                    >

                        ${
                            escaparHTML(
                                estadoPagamento
                            )
                        }

                    </div>

                </div>


                <button
                    id="fecharFinanceiroSGE"
                    type="button"
                    style="
                        width:100%;
                        margin-top:18px;
                        padding:16px;
                        border:none;
                        border-radius:12px;
                        background:#dc2626;
                        color:white;
                        font-size:16px;
                        font-weight:bold;
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
                "fecharFinanceiroSGE"
            );


        if (fechar) {

            fechar.onclick =
                function () {

                    const janela =
                        document.getElementById(
                            "janelaFinanceiroSGE"
                        );


                    if (janela) {

                        janela.remove();

                    }

                };

        }

    };


/* =====================================================
   PERFIL DO ALUNO
===================================================== */

window.verPerfil =
    function () {

        const antiga =
            document.getElementById(
                "janelaPerfilSGE"
            );


        if (antiga) {

            antiga.remove();

        }


        const html = `

        <div
            id="janelaPerfilSGE"
            style="
                position:fixed;
                inset:0;
                z-index:999999;
                background:#f1f5f9;
                overflow-y:auto;
                font-family:Arial,sans-serif;
            "
        >

            <div
                style="
                    width:94%;
                    max-width:700px;
                    margin:auto;
                    padding:20px 0 40px;
                "
            >

                <div
                    style="
                        background:#1e3a8a;
                        color:white;
                        border-radius:18px;
                        padding:28px 18px;
                        text-align:center;
                    "
                >

                    <div
                        style="
                            width:80px;
                            height:80px;
                            margin:auto;
                            border-radius:50%;
                            background:white;
                            color:#1e3a8a;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:40px;
                        "
                    >
                        👨‍🎓
                    </div>

                    <h2>
                        Meu Perfil
                    </h2>

                    <div>
                        ${
                            escaparHTML(
                                alunoAtual.nome
                            )
                        }
                    </div>

                </div>


                <div
                    style="
                        background:white;
                        margin-top:15px;
                        border-radius:16px;
                        padding:20px;
                        box-shadow:
                            0 3px 10px
                            rgba(0,0,0,.08);
                    "
                >

                    <div
                        style="
                            margin-bottom:18px;
                        "
                    >

                        <small>
                            Nome completo
                        </small>

                        <strong
                            style="
                                display:block;
                                margin-top:5px;
                            "
                        >
                            ${
                                escaparHTML(
                                    alunoAtual.nome ||
                                    "—"
                                )
                            }
                        </strong>

                    </div>


                    <div
                        style="
                            margin-bottom:18px;
                        "
                    >

                        <small>
                            Código do aluno
                        </small>

                        <strong
                            style="
                                display:block;
                                margin-top:5px;
                            "
                        >
                            ${
                                escaparHTML(
                                    alunoAtual.codigoAluno ||
                                    "—"
                                )
                            }
                        </strong>

                    </div>


                    <div
                        style="
                            margin-bottom:18px;
                        "
                    >

                        <small>
                            Número
                        </small>

                        <strong
                            style="
                                display:block;
                                margin-top:5px;
                            "
                        >
                            ${
                                escaparHTML(
                                    alunoAtual.numero ||
                                    "—"
                                )
                            }
                        </strong>

                    </div>


                    <div
                        style="
                            margin-bottom:18px;
                        "
                    >

                        <small>
                            Turma
                        </small>

                        <strong
                            style="
                                display:block;
                                margin-top:5px;
                            "
                        >
                            ${
                                escaparHTML(
                                    alunoAtual.turmaNome ||
                                    "—"
                                )
                            }
                        </strong>

                    </div>


                    <div>

                        <small>
                            Estado
                        </small>

                        <strong
                            style="
                                display:block;
                                margin-top:5px;
                                color:#16a34a;
                            "
                        >
                            ${
                                escaparHTML(
                                    alunoAtual.estado ||
                                    "Ativo"
                                )
                            }
                        </strong>

                    </div>

                </div>


                <button
                    id="fecharPerfilSGE"
                    type="button"
                    style="
                        width:100%;
                        margin-top:18px;
                        padding:16px;
                        border:none;
                        border-radius:12px;
                        background:#dc2626;
                        color:white;
                        font-size:16px;
                        font-weight:bold;
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
                "fecharPerfilSGE"
            );


        if (fechar) {

            fechar.onclick =
                function () {

                    const janela =
                        document.getElementById(
                            "janelaPerfilSGE"
                        );


                    if (janela) {

                        janela.remove();

                    }

                };

        }

    };


/* =====================================================
   ATUALIZAR INFORMAÇÕES DO CABEÇALHO
===================================================== */

function atualizarCabecalhoAluno() {

    const nome =
        document.getElementById(
            "nomeAluno"
        );


    const codigo =
        document.getElementById(
            "codigo"
        );


    const turma =
        document.getElementById(
            "turma"
        );


    const estado =
        document.getElementById(
            "estado"
        );


    if (nome) {

        nome.textContent =
            alunoAtual.nome ||
            "Aluno";

    }


    if (codigo) {

        codigo.textContent =
            "Código: " +
            (
                alunoAtual.codigoAluno ||
                "—"
            );

    }


    if (turma) {

        turma.textContent =
            "Turma: " +
            (
                alunoAtual.turmaNome ||
                "—"
            );

    }


    if (estado) {

        estado.textContent =
            "Estado: " +
            (
                alunoAtual.estado ||
                "Ativo"
            );

    }

}


/* =====================================================
   SAIR DA ÁREA DO ALUNO
===================================================== */

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


/* =====================================================
   PROTEÇÃO DA SESSÃO
===================================================== */

function verificarSessaoAluno() {

    const sessao =
        localStorage.getItem(
            "alunoLogado"
        );


    if (!sessao) {

        console.warn(
            "⚠️ Sessão do aluno encerrada."
        );


        window.location.href =
            "student-login.html";

        return false;

    }


    return true;

}


/* =====================================================
   EVENTOS DOS BOTÕES
===================================================== */

function configurarBotoesAluno() {

    console.log(
        "🔘 Configurando botões da Área do Aluno..."
    );


    const botoes =
        document.querySelectorAll(
            "[data-aluno-acao]"
        );


    botoes.forEach(
        botao => {

            const acao =
                botao.dataset.alunoAcao;


            if (
                !acao
            ) {

                return;

            }


            botao.addEventListener(
                "click",
                function () {

                    if (
                        acao === "notas"
                    ) {

                        if (
                            typeof window.verNotas ===
                            "function"
                        ) {

                            window.verNotas();

                        }

                    }


                    else if (
                        acao === "boletim"
                    ) {

                        if (
                            typeof window.verBoletim ===
                            "function"
                        ) {

                            window.verBoletim();

                        }

                    }


                    else if (
                        acao === "financeiro"
                    ) {

                        if (
                            typeof window.verFinanceiro ===
                            "function"
                        ) {

                            window.verFinanceiro();

                        }

                    }


                    else if (
                        acao === "perfil"
                    ) {

                        if (
                            typeof window.verPerfil ===
                            "function"
                        ) {

                            window.verPerfil();

                        }

                    }


                    else if (
                        acao === "sair"
                    ) {

                        if (
                            typeof window.sairAluno ===
                            "function"
                        ) {

                            window.sairAluno();

                        }

                    }

                }
            );

        }
    );

}


/* =====================================================
   INICIALIZAÇÃO FINAL DESTA PARTE
===================================================== */

atualizarCabecalhoAluno();

configurarBotoesAluno();


console.log(
    "✅ BLOCO 5/6 FINALIZADO"
);

console.log(
    "💰 Financeiro, perfil e ações preparados."
);

/* =====================================================
   FINALIZAÇÃO DA ÁREA DO ALUNO
===================================================== */

/* =====================================================
   INFORMAÇÕES DA SESSÃO
===================================================== */

window.verPerfil = function () {

    const html = `

        <div
            id="janelaPerfil"
            style="
                position:fixed;
                inset:0;
                z-index:99999;
                background:#f1f5f9;
                overflow-y:auto;
            "
        >

            <div
                style="
                    width:94%;
                    max-width:600px;
                    margin:30px auto;
                "
            >

                <div
                    style="
                        background:white;
                        border-radius:18px;
                        overflow:hidden;
                        box-shadow:0 5px 20px rgba(0,0,0,.12);
                    "
                >

                    <div
                        style="
                            background:#1e3a8a;
                            color:white;
                            padding:30px 20px;
                            text-align:center;
                        "
                    >

                        <div
                            style="
                                width:80px;
                                height:80px;
                                margin:auto;
                                border-radius:50%;
                                background:white;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                font-size:40px;
                            "
                        >
                            👨‍🎓
                        </div>

                        <h2>
                            Perfil do Aluno
                        </h2>

                    </div>


                    <div
                        style="
                            padding:22px;
                        "
                    >

                        <div
                            style="
                                padding:14px;
                                border-bottom:1px solid #e2e8f0;
                            "
                        >

                            <small>
                                Nome
                            </small>

                            <strong
                                style="
                                    display:block;
                                    margin-top:5px;
                                "
                            >
                                ${aluno.nome || "—"}
                            </strong>

                        </div>


                        <div
                            style="
                                padding:14px;
                                border-bottom:1px solid #e2e8f0;
                            "
                        >

                            <small>
                                Código do aluno
                            </small>

                            <strong
                                style="
                                    display:block;
                                    margin-top:5px;
                                "
                            >
                                ${aluno.codigoAluno || "—"}
                            </strong>

                        </div>


                        <div
                            style="
                                padding:14px;
                                border-bottom:1px solid #e2e8f0;
                            "
                        >

                            <small>
                                Turma
                            </small>

                            <strong
                                style="
                                    display:block;
                                    margin-top:5px;
                                "
                            >
                                ${aluno.turmaNome || "—"}
                            </strong>

                        </div>


                        <div
                            style="
                                padding:14px;
                            "
                        >

                            <small>
                                Estado
                            </small>

                            <strong
                                style="
                                    display:block;
                                    margin-top:5px;
                                "
                            >
                                ${aluno.estado || "ativo"}
                            </strong>

                        </div>


                        <button
                            id="fecharPerfil"
                            style="
                                width:100%;
                                margin-top:15px;
                                padding:14px;
                                border:none;
                                border-radius:10px;
                                background:#dc2626;
                                color:white;
                                font-weight:bold;
                                font-size:16px;
                            "
                        >
                            ← Voltar
                        </button>

                    </div>

                </div>

            </div>

        </div>

    `;


    document.body.insertAdjacentHTML(
        "beforeend",
        html
    );


    const botao =
        document.getElementById(
            "fecharPerfil"
        );


    if (botao) {

        botao.onclick = function () {

            const janela =
                document.getElementById(
                    "janelaPerfil"
                );


            if (janela) {

                janela.remove();

            }

        };

    }

};


/* =====================================================
   TERMINAR SESSÃO
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


    window.location.href =
        "student-login.html";

};


/* =====================================================
   VERIFICAR SESSÃO
===================================================== */

function verificarSessaoAluno() {

    const sessao =
        localStorage.getItem(
            "alunoLogado"
        );


    if (!sessao) {

        console.warn(
            "Sessão do aluno não encontrada."
        );

        return false;

    }


    try {

        const alunoSessao =
            JSON.parse(
                sessao
            );


        if (
            !alunoSessao ||
            typeof alunoSessao !== "object"
        ) {

            throw new Error(
                "Sessão inválida."
            );

        }


        return true;

    }

    catch (error) {

        console.error(
            "Sessão inválida:",
            error
        );


        localStorage.removeItem(
            "alunoLogado"
        );


        window.location.href =
            "student-login.html";


        return false;

    }

}


/* =====================================================
   INICIALIZAÇÃO FINAL
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "===================================="
        );

        console.log(
            "🎓 ÁREA DO ALUNO"
        );

        console.log(
            "Sistema iniciado com sucesso."
        );

        console.log(
            "Aluno:",
            aluno.nome || "—"
        );

        console.log(
            "Turma:",
            aluno.turmaNome || "—"
        );

        console.log(
            "Código:",
            aluno.codigoAluno || "—"
        );

        console.log(
            "===================================="
        );

        verificarSessaoAluno();

    }
);


/* =====================================================
   TESTE FINAL
===================================================== */

console.log(
    "✅ student-area.js NOVA VERSÃO CARREGADA"
);

alert(
    "🎓 ÁREA DO ALUNO PRONTA"
);
