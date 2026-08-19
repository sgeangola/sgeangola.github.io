// =====================================================
// PAUTAS.JS — PAUTA GERAL
// SGE ANGOLA
// =====================================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


alert("PAUTAS.JS CARREGADO ✅");


// =====================================================
// ELEMENTOS
// =====================================================

const classeSelect =
    document.getElementById("classeSelect");

const turmaSelect =
    document.getElementById("turmaSelect");

const carregarPautaBtn =
    document.getElementById("carregarPauta");

const exportarExcel =
    document.getElementById("exportarExcel");

const exportarPDF =
    document.getElementById("exportarPDF");

const imprimirPauta =
    document.getElementById("imprimirPauta");

const pautaLista =
    document.getElementById("pautaLista");

const estadoPauta =
    document.getElementById("estadoPauta");

const nomeEscola =
    document.getElementById("nomeEscola");

const anoLetivo =
    document.getElementById("anoLetivo");

const classeInfo =
    document.getElementById("classeInfo");

const turmaInfo =
    document.getElementById("turmaInfo");

const tabelaPauta =
    document.getElementById("tabelaPauta");

const cabecalhoPauta =
    document.getElementById("cabecalhoPauta");


// =====================================================
// ESCOLA ATUAL
// =====================================================

const escolaId =
    sessionStorage.getItem("escolaId") ||
    localStorage.getItem("escolaId") ||
    "";

console.log(
    "🏫 ESCOLA ATUAL:",
    escolaId
);


// =====================================================
// VARIÁVEIS
// =====================================================

let todasTurmas = [];

let turmaAtual = null;

let escolaAtual = null;

let alunosAtuais = [];

let notasAtuais = [];


// =====================================================
// DISCIPLINAS
// =====================================================

const disciplinasPorCiclo = {

    ensinoPrimario: [

        "Língua Portuguesa",
        "Matemática",
        "Estudo do Meio",
        "Educação Física",
        "Educação Musical",
        "Educação Manual e Plástica",
        "Educação Moral e Cívica"

    ],

    primeiroCiclo: [

        "Língua Portuguesa",
        "Matemática",
        "História",
        "Geografia",
        "Biologia",
        "Física",
        "Química",
        "Língua Inglesa",
        "Educação Física",
        "Educação Moral e Cívica"

    ]

};


// =====================================================
// NORMALIZAR
// =====================================================

function normalizarTexto(texto) {

    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


// =====================================================
// IDENTIFICAR CICLO
// =====================================================

function identificarCiclo(classe) {

    const texto =
        normalizarTexto(classe);

    const numero =
        parseInt(
            texto.replace(/\D/g, ""),
            10
        );

    if (
        !Number.isNaN(numero) &&
        numero >= 1 &&
        numero <= 6
    ) {

        return "ensinoPrimario";

    }

    return "primeiroCiclo";

}


// =====================================================
// CARREGAR ESCOLA
// =====================================================

async function carregarEscola() {

    if (!escolaId) {

        throw new Error(
            "escolaId não encontrado. Entre novamente na escola."
        );

    }

    const referencia =
        doc(
            db,
            "escolas",
            escolaId
        );

    const resultado =
        await getDoc(
            referencia
        );

    if (!resultado.exists()) {

        throw new Error(
            "A escola atual não foi encontrada."
        );

    }

    escolaAtual =
        resultado.data();

    console.log(
        "🏫 ESCOLA CARREGADA:",
        escolaAtual
    );

    nomeEscola.textContent =
        escolaAtual.nome ||
        "Escola";

    anoLetivo.textContent =
        `Ano Lectivo: ${
            escolaAtual.anoLetivoAtual ||
            "—"
        }`;

}


// =====================================================
// CARREGAR TURMAS DA ESCOLA
// =====================================================

async function carregarTurmas() {

    try {

        estadoPauta.textContent =
            "A carregar turmas...";

        if (!escolaId) {

            throw new Error(
                "Escola não identificada."
            );

        }

        const consulta =
            query(

                collection(
                    db,
                    "turmas"
                ),

                where(
                    "escolaId",
                    "==",
                    escolaId
                )

            );

        const snapshot =
            await getDocs(
                consulta
            );

        todasTurmas =
            snapshot.docs.map(
                documento => ({

                    id:
                        documento.id,

                    ...documento.data()

                })
            );

        console.log(
            "🏫 TURMAS DA ESCOLA:",
            todasTurmas
        );

        preencherClasses();

        estadoPauta.textContent =
            "Selecione uma classe e uma turma.";

    }

    catch (erro) {

        console.error(
            "Erro ao carregar turmas:",
            erro
        );

        estadoPauta.textContent =
            "❌ Erro ao carregar turmas.";

    }

}


// =====================================================
// PREENCHER CLASSES
// =====================================================

function preencherClasses() {

    const classes = [];

    todasTurmas.forEach(
        turma => {

            const classe =
                turma.classe ||
                turma.classeNome ||
                "";

            if (
                classe &&
                !classes.includes(classe)
            ) {

                classes.push(classe);

            }

        }
    );

    classes.sort(
        (a, b) => {

            const numeroA =
                parseInt(
                    String(a)
                        .replace(/\D/g, ""),
                    10
                );

            const numeroB =
                parseInt(
                    String(b)
                        .replace(/\D/g, ""),
                    10
                );

            return numeroA - numeroB;

        }
    );

    classeSelect.innerHTML = `

        <option value="">
            Selecionar classe
        </option>

    `;

    classes.forEach(
        classe => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                classe;

            option.textContent =
                classe;

            classeSelect.appendChild(
                option
            );

        }
    );

}


// =====================================================
// MUDAR CLASSE
// =====================================================

classeSelect.addEventListener(
    "change",
    function() {

        const classe =
            this.value;

        turmaSelect.innerHTML = `

            <option value="">
                Selecionar turma
            </option>

        `;

        turmaAtual = null;

        if (!classe) {

            atualizarInformacoes();

            return;

        }

        const turmasDaClasse =
            todasTurmas.filter(
                turma => {

                    const classeTurma =
                        turma.classe ||
                        turma.classeNome ||
                        "";

                    return (
                        normalizarTexto(
                            classeTurma
                        ) ===
                        normalizarTexto(
                            classe
                        )
                    );

                }
            );

        turmasDaClasse.forEach(
            turma => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    turma.id;

                option.textContent =
                    turma.nome ||
                    turma.nomeTurma ||
                    turma.id;

                turmaSelect.appendChild(
                    option
                );

            }
        );

        atualizarInformacoes();

    }
);


// =====================================================
// MUDAR TURMA
// =====================================================

turmaSelect.addEventListener(
    "change",
    function() {

        const turmaId =
            this.value;

        if (!turmaId) {

            turmaAtual = null;

            atualizarInformacoes();

            return;

        }

        turmaAtual =
            todasTurmas.find(
                turma =>
                    String(turma.id) ===
                    String(turmaId)
            );

        console.log(
            "🎓 TURMA SELECIONADA:",
            turmaAtual
        );

        atualizarInformacoes();

    }
);


// =====================================================
// ATUALIZAR INFORMAÇÕES
// =====================================================

function atualizarInformacoes() {

    if (!turmaAtual) {

        classeInfo.textContent =
            "Classe: —";

        turmaInfo.textContent =
            "Turma: —";

        return;

    }

    classeInfo.textContent =
        `Classe: ${
            turmaAtual.classe ||
            turmaAtual.classeNome ||
            "—"
        }`;

    turmaInfo.textContent =
        `Turma: ${
            turmaAtual.nome ||
            turmaAtual.nomeTurma ||
            "—"
        }`;

}


// =====================================================
// BOTÃO CARREGAR PAUTA
// =====================================================

if (carregarPautaBtn) {

    carregarPautaBtn.addEventListener(
        "click",
        async function() {

            if (!turmaAtual) {

                alert(
                    "Selecione primeiro uma turma."
                );

                return;

            }

            await carregarPauta(
                turmaAtual.id
            );

        }
    );

}


// =====================================================
// CARREGAR PAUTA
// =====================================================

async function carregarPauta(turmaId) {

    try {

        estadoPauta.textContent =
            "⏳ A carregar pauta...";

        pautaLista.innerHTML = "";

        // =============================================
        // ALUNOS
        // =============================================

        const alunosSnapshot =
            await getDocs(

                collection(
                    db,
                    "turmas",
                    turmaId,
                    "alunos"
                )

            );

        alunosAtuais =
            alunosSnapshot.docs.map(
                documento => ({

                    id:
                        documento.id,

                    ...documento.data()

                })
            );

        // =============================================
        // ORDENAR ALUNOS
        // =============================================

        alunosAtuais.sort(
            (a, b) => {

                const numeroA =
                    parseInt(
                        a.numero,
                        10
                    );

                const numeroB =
                    parseInt(
                        b.numero,
                        10
                    );

                if (
                    Number.isNaN(numeroA) &&
                    Number.isNaN(numeroB)
                ) {

                    return String(
                        a.nome || ""
                    ).localeCompare(
                        String(
                            b.nome || ""
                        ),
                        "pt"
                    );

                }

                if (
                    Number.isNaN(numeroA)
                ) {

                    return 1;

                }

                if (
                    Number.isNaN(numeroB)
                ) {

                    return -1;

                }

                return numeroA - numeroB;

            }
        );

        // =============================================
        // NOTAS
        // =============================================

        notasAtuais = [];

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

                if (
                    String(
                        dados.turmaId
                    ) ===
                    String(
                        turmaId
                    )
                ) {

                    notasAtuais.push({

                        id:
                            documento.id,

                        ...dados

                    });

                }

            }
        );

        console.log(
            "📝 NOTAS DA TURMA:",
            notasAtuais
        );

        // =============================================
        // CABEÇALHO
        // =============================================

        construirCabecalho();

        // =============================================
        // LINHAS
        // =============================================

        construirLinhas();

        estadoPauta.textContent =
            `✅ ${
                alunosAtuais.length
            } aluno(s) carregado(s).`;

    }

    catch (erro) {

        console.error(
            "Erro ao carregar pauta:",
            erro
        );

        pautaLista.innerHTML = `

            <tr>

                <td
                    colspan="100"
                    class="estado-vazio"
                >

                    ❌ Erro ao carregar pauta.

                    <br><br>

                    ${erro.message}

                </td>

            </tr>

        `;

        estadoPauta.textContent =
            "❌ Erro ao carregar pauta.";

    }

}


// =====================================================
// NOTA DO ALUNO
// =====================================================

function obterNotaAluno(
    aluno,
    disciplina
) {

    const registros =
        notasAtuais.filter(
            nota => {

                return (
                    normalizarTexto(
                        nota.disciplina
                    ) ===
                    normalizarTexto(
                        disciplina
                    )
                );

            }
        );

    if (
        registros.length === 0
    ) {

        return {};

    }

    const resultado = {};

    registros.forEach(
        registro => {

            const encontrado =
                registro.alunos?.find(
                    item => {

                        if (
                            aluno.numero &&
                            item.numero
                        ) {

                            return (
                                String(
                                    item.numero
                                ) ===
                                String(
                                    aluno.numero
                                )
                            );

                        }

                        if (
                            aluno.id &&
                            item.id
                        ) {

                            return (
                                String(
                                    item.id
                                ) ===
                                String(
                                    aluno.id
                                )
                            );

                        }

                        if (
                            aluno.id &&
                            item.alunoId
                        ) {

                            return (
                                String(
                                    item.alunoId
                                ) ===
                                String(
                                    aluno.id
                                )
                            );

                        }

                        return (
                            normalizarTexto(
                                item.nome
                            ) ===
                            normalizarTexto(
                                aluno.nome
                            )
                        );

                    }
                );

            if (encontrado) {

                const trimestre =
                    String(
                        registro.trimestre
                    );

                resultado[
                    `trimestre${trimestre}`
                ] = encontrado;

            }

        }
    );

    return resultado;

}


// =====================================================
// VALOR DA NOTA
// =====================================================

function valorNota(valor) {

    if (
        valor === undefined ||
        valor === null ||
        valor === ""
    ) {

        return "";

    }

    const numero =
        Number(
            String(valor)
                .replace(",", ".")
        );

    if (
        Number.isNaN(numero)
    ) {

        return "";

    }

    return numero;

}


// =====================================================
// CALCULAR MDF
// =====================================================

function calcularMDF(
    mac,
    npt
) {

    if (
        mac === "" ||
        npt === ""
    ) {

        return "";

    }

    return Number(
        (
            (
                Number(mac) +
                Number(npt)
            ) / 2
        ).toFixed(1)
    );

}


// =====================================================
// CALCULAR MÉDIA FINAL DA DISCIPLINA
// =====================================================

function calcularMediaFinalDisciplina(
    notas
) {

    const valores = [];

    notas.forEach(
        nota => {

            if (
                nota !== "" &&
                nota !== null &&
                nota !== undefined
            ) {

                valores.push(
                    Number(nota)
                );

            }

        }
    );

    if (
        valores.length === 0
    ) {

        return "";

    }

    return Number(
        (
            valores.reduce(
                (
                    total,
                    valor
                ) =>
                    total + valor,
                0
            ) /
            valores.length
        ).toFixed(1)
    );

}


// =====================================================
// CLASSIFICAÇÃO
// =====================================================

function classificarNota(
    nota,
    ciclo
) {

    if (
        nota === "" ||
        nota === null ||
        nota === undefined
    ) {

        return "";

    }

    const valor =
        Number(nota);

    if (
        Number.isNaN(valor)
    ) {

        return "";

    }

    if (
        ciclo ===
        "ensinoPrimario"
    ) {

        if (valor <= 4)
            return "Mau";

        if (valor <= 9)
            return "Medíocre";

        if (valor <= 13)
            return "Suficiente";

        if (valor <= 16)
            return "Bom";

        return "Muito Bom";

    }

    if (valor <= 4)
        return "Mau";

    if (valor <= 9)
        return "Medíocre";

    if (valor <= 13)
        return "Suficiente";

    if (valor <= 16)
        return "Bom";

    return "Muito Bom";

}


// =====================================================
// DISCIPLINAS
// =====================================================

function obterDisciplinasDaTurma() {

    if (!turmaAtual) {

        return [];

    }

    const ciclo =
        identificarCiclo(
            turmaAtual.classe ||
            turmaAtual.classeNome
        );

    return [
        ...disciplinasPorCiclo[ciclo]
    ];

}


// =====================================================
// CABEÇALHO
// DISCIPLINA → MDF | MF
// =====================================================

function construirCabecalho() {

    const disciplinas =
        obterDisciplinasDaTurma();

    cabecalhoPauta.innerHTML = "";

    const linha1 =
        document.createElement(
            "tr"
        );

    linha1.innerHTML = `

        <th rowspan="2">
            Nº
        </th>

        <th rowspan="2">
            Nome Completo
        </th>

        <th rowspan="2">
            Sexo
        </th>

        <th rowspan="2">
            Idade
        </th>

    `;

    disciplinas.forEach(
        disciplina => {

            linha1.innerHTML += `

                <th
                    colspan="2"
                    class="disciplina"
                >
                    ${disciplina}
                </th>

            `;

        }
    );

    linha1.innerHTML += `

        <th rowspan="2">
            Média Final
        </th>

        <th rowspan="2">
            Classificação
        </th>

        <th rowspan="2">
            Observação
        </th>

    `;

    const linha2 =
        document.createElement(
            "tr"
        );

    disciplinas.forEach(
        () => {

            linha2.innerHTML += `

                <th class="subcoluna">
                    MDF
                </th>

                <th class="subcoluna">
                    MF
                </th>

            `;

        }
    );

    cabecalhoPauta.appendChild(
        linha1
    );

    cabecalhoPauta.appendChild(
        linha2
    );

}


// =====================================================
// CONSTRUIR LINHAS
// =====================================================

function construirLinhas() {

    pautaLista.innerHTML = "";

    const disciplinas =
        obterDisciplinasDaTurma();

    const ciclo =
        identificarCiclo(
            turmaAtual.classe ||
            turmaAtual.classeNome
        );

    alunosAtuais.forEach(
        (aluno, indice) => {

            const tr =
                document.createElement(
                    "tr"
                );

            const numero =
                aluno.numero ||
                indice + 1;

            const nome =
                aluno.nome ||
                "—";

            const sexo =
                aluno.sexo ||
                aluno.Sexo ||
                "—";

            const idade =
                aluno.idade ||
                aluno.Idade ||
                "—";

            let html = `

                <td>
                    ${numero}
                </td>

                <td class="nome-aluno">
                    ${nome}
                </td>

                <td>
                    ${sexo}
                </td>

                <td>
                    ${idade}
                </td>

            `;

            const mediasDisciplinas = [];

            disciplinas.forEach(
                disciplina => {

                    const notas =
                        obterNotaAluno(
                            aluno,
                            disciplina
                        );

                    const notasTrimestres = [];

                    // =================================
                    // 1.º TRIMESTRE
                    // =================================

                    const nota1 =
                        notas.trimestre1 ||
                        {};

                    const mac1 =
                        valorNota(
                            nota1.MAC
                        );

                    const npt1 =
                        valorNota(
                            nota1.NPT
                        );

                    const mdf1 =
                        nota1.MDF !==
                            undefined &&
                        nota1.MDF !== ""
                            ? valorNota(
                                nota1.MDF
                            )
                            : calcularMDF(
                                mac1,
                                npt1
                            );

                    if (
                        mdf1 !== ""
                    ) {

                        notasTrimestres.push(
                            Number(mdf1)
                        );

                    }

                    // =================================
                    // 2.º TRIMESTRE
                    // =================================

                    const nota2 =
                        notas.trimestre2 ||
                        {};

                    const mac2 =
                        valorNota(
                            nota2.MAC
                        );

                    const npt2 =
                        valorNota(
                            nota2.NPT
                        );

                    const mdf2 =
                        nota2.MDF !==
                            undefined &&
                        nota2.MDF !== ""
                            ? valorNota(
                                nota2.MDF
                            )
                            : calcularMDF(
                                mac2,
                                npt2
                            );

                    if (
                        mdf2 !== ""
                    ) {

                        notasTrimestres.push(
                            Number(mdf2)
                        );

                    }

                    // =================================
                    // 3.º TRIMESTRE
                    // =================================

                    const nota3 =
                        notas.trimestre3 ||
                        {};

                    const mac3 =
                        valorNota(
                            nota3.MAC
                        );

                    const npt3 =
                        valorNota(
                            nota3.NPT
                        );

                    const mdf3 =
                        nota3.MDF !==
                            undefined &&
                        nota3.MDF !== ""
                            ? valorNota(
                                nota3.MDF
                            )
                            : calcularMDF(
                                mac3,
                                npt3
                            );

                    if (
                        mdf3 !== ""
                    ) {

                        notasTrimestres.push(
                            Number(mdf3)
                        );

                    }

                    // =================================
                    // MDF GERAL DA DISCIPLINA
                    // =================================

                    const MDF =
                        calcularMediaFinalDisciplina(
                            notasTrimestres
                        );

                    // =================================
                    // MF DA DISCIPLINA
                    // =================================

                    let MF = "";

                    if (
                        MDF !== ""
                    ) {

                        MF =
                            Math.round(
                                Number(MDF)
                            );

                    }

                    if (
                        MDF !== ""
                    ) {

                        mediasDisciplinas.push(
                            Number(MDF)
                        );

                    }

                    // =================================
                    // COLUNAS
                    // =================================

                    html += `

                        <td>
                            ${
                                MDF === ""
                                    ? "—"
                                    : MDF
                            }
                        </td>

                        <td class="mf">
                            ${
                                MF === ""
                                    ? "—"
                                    : MF
                            }
                        </td>

                    `;

                }
            );

            // =========================================
            // MÉDIA FINAL GERAL
            // =========================================

            let mediaFinal = "";

            if (
                mediasDisciplinas.length > 0
            ) {

                mediaFinal =
                    Math.round(
                        mediasDisciplinas.reduce(
                            (
                                total,
                                valor
                            ) =>
                                total +
                                valor,
                            0
                        ) /
                        mediasDisciplinas.length
                    );

            }

            // =========================================
            // CLASSIFICAÇÃO
            // =========================================

            const classificacao =
                classificarNota(
                    mediaFinal,
                    ciclo
                );

            // =========================================
            // OBSERVAÇÃO
            // =========================================

            let observacao =
                "—";

            let classe =
                "";

            if (
                mediaFinal !== ""
            ) {

                if (
                    mediaFinal >= 10
                ) {

                    observacao =
                        "Aprovado";

                    classe =
                        "aprovado";

                }
                else {

                    observacao =
                        "Reprovado";

                    classe =
                        "reprovado";

                }

            }

            // =========================================
            // RESULTADO
            // =========================================

            html += `

                <td class="media-final">
                    ${
                        mediaFinal === ""
                            ? "—"
                            : mediaFinal
                    }
                </td>

                <td class="classificacao">
                    ${
                        classificacao ||
                        "—"
                    }
                </td>

                <td class="${classe}">
                    ${observacao}
                </td>

            `;

            tr.innerHTML =
                html;

            pautaLista.appendChild(
                tr
            );

        }
    );

}


// =====================================================
// EXPORTAR EXCEL
// =====================================================

if (exportarExcel) {

    exportarExcel.addEventListener(
        "click",
        function() {

            if (!turmaAtual) {

                alert(
                    "Selecione primeiro uma turma."
                );

                return;

            }

            if (
                typeof XLSX ===
                "undefined"
            ) {

                alert(
                    "Biblioteca Excel não carregada."
                );

                return;

            }

            const workbook =
                XLSX.utils.table_to_book(
                    tabelaPauta,
                    {
                        sheet: "Pauta"
                    }
                );

            const classe =
                turmaAtual.classe ||
                turmaAtual.classeNome ||
                "Classe";

            const turma =
                turmaAtual.nome ||
                turmaAtual.nomeTurma ||
                "Turma";

            const nome =
                escolaAtual?.nome ||
                "Escola";

            const arquivo =
                `Pauta_${nome}_${classe}_${turma}.xlsx`;

            XLSX.writeFile(
                workbook,
                arquivo
            );

        }
    );

}


// =====================================================
// EXPORTAR PDF
// =====================================================

if (exportarPDF) {

    exportarPDF.addEventListener(
        "click",
        function() {

            if (!turmaAtual) {

                alert(
                    "Selecione primeiro uma turma."
                );

                return;

            }

            if (
                typeof window.jspdf ===
                "undefined"
            ) {

                alert(
                    "Biblioteca PDF não carregada."
                );

                return;

            }

            const {
                jsPDF
            } =
                window.jspdf;

            const pdf =
                new jsPDF({

                    orientation:
                        "landscape",

                    unit:
                        "mm",

                    format:
                        "a3"

                });

            const escola =
                escolaAtual?.nome ||
                "Escola";

            const ano =
                escolaAtual?.anoLetivoAtual ||
                "—";

            const classe =
                turmaAtual.classe ||
                turmaAtual.classeNome ||
                "—";

            const turma =
                turmaAtual.nome ||
                turmaAtual.nomeTurma ||
                "—";

            pdf.setFontSize(16);

            pdf.text(
                escola,
                15,
                15
            );

            pdf.setFontSize(10);

            pdf.text(
                `Ano Lectivo: ${ano}`,
                15,
                22
            );

            pdf.text(
                `Classe: ${classe}    Turma: ${turma}`,
                15,
                28
            );

            pdf.setFontSize(14);

            pdf.text(
                "PAUTA GERAL",
                15,
                36
            );

            if (
                typeof pdf.autoTable !==
                "function"
            ) {

                alert(
                    "AutoTable não foi carregado."
                );

                return;

            }

            pdf.autoTable({

                html:
                    tabelaPauta,

                startY:
                    40,

                theme:
                    "grid",

                styles: {

                    fontSize:
                        6,

                    cellPadding:
                        1,

                    overflow:
                        "linebreak"

                },

                headStyles: {

                    fontSize:
                        6

                },

                margin: {

                    left:
                        5,

                    right:
                        5

                }

            });

            pdf.save(
                `Pauta_${classe}_${turma}.pdf`
            );

        }
    );

}


// =====================================================
// IMPRIMIR
// =====================================================

if (imprimirPauta) {

    imprimirPauta.addEventListener(
        "click",
        function() {

            if (!turmaAtual) {

                alert(
                    "Selecione primeiro uma turma."
                );

                return;

            }

            window.print();

        }
    );

}


// =====================================================
// INICIALIZAÇÃO
// =====================================================

async function iniciar() {

    try {

        await carregarEscola();

        await carregarTurmas();

    }

    catch (erro) {

        console.error(
            "Erro ao iniciar pauta:",
            erro
        );

        estadoPauta.textContent =
            "❌ " + erro.message;

    }

}


iniciar();


console.log(
    "✅ PAUTA GERAL SGE INICIADA"
);
