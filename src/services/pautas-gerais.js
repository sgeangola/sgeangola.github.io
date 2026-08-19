// =====================================================
// PAUTAS-GERAIS.JS — SGE ANGOLA
// BLOCO 3.1 — CONFIGURAÇÃO E ELEMENTOS
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


alert("PAUTAS-GERAIS.JS CARREGADO ✅");


// =====================================================
// ESCOLA ATUAL
// =====================================================

const escolaId =
    sessionStorage.getItem("escolaId") ||
    localStorage.getItem("escolaId") ||
    "";


console.log(
    "🏫 ESCOLA ID:",
    escolaId
);


if (!escolaId) {

    alert(
        "❌ Escola não identificada. Entre novamente na escola."
    );

    throw new Error(
        "escolaId não encontrado."
    );

}


// =====================================================
// ELEMENTOS DO HTML
// =====================================================

const logoEscola =
    document.getElementById("logoEscola");

const nomeEscola =
    document.getElementById("nomeEscola");

const enderecoEscola =
    document.getElementById("enderecoEscola");

const telefoneEscola =
    document.getElementById("telefoneEscola");

const anoLetivo =
    document.getElementById("anoLetivo");

const ensinoSelect =
    document.getElementById("ensinoSelect");

const classeSelect =
    document.getElementById("classeSelect");

const turmaSelect =
    document.getElementById("turmaSelect");

const carregarPauta =
    document.getElementById("carregarPauta");

const estado =
    document.getElementById("estado");

const classeInfo =
    document.getElementById("classeInfo");

const turmaInfo =
    document.getElementById("turmaInfo");

const quantidadeAlunos =
    document.getElementById("quantidadeAlunos");

const cabecalhoPauta =
    document.getElementById("cabecalhoPauta");

const corpoPauta =
    document.getElementById("corpoPauta");


// =====================================================
// DADOS
// =====================================================

let escolaAtual = null;

let todasTurmas = [];

let turmasFiltradas = [];

let turmaAtual = null;

let alunosAtuais = [];

let notasAtuais = [];


// =====================================================
// ENSINOS
// =====================================================

const ENSINOS = {

    ensinoPrimario:
        "Ensino Primário",

    primeiroCiclo:
        "Primeiro Ciclo"

};


// =====================================================
// CLASSES / ETAPAS
// =====================================================

const CLASSES = {

    ensinoPrimario: [

        "1ª classe",
        "2ª classe",
        "3ª classe",
        "4ª classe",
        "5ª classe",
        "6ª classe",

        "1ª Etapa",
        "2ª Etapa",
        "3ª Etapa"

    ],

    primeiroCiclo: [

        "7ª classe",
        "8ª classe",
        "9ª classe",

        "EJA 1",
        "EJA 2"

    ]

};


// =====================================================
// DISCIPLINAS
// =====================================================

const DISCIPLINAS = {

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
// CLASSES COM EXAMES
// =====================================================

const CLASSES_COM_EXAME = [

    "6ª classe",
    "9ª classe",
    "3ª Etapa",
    "EJA 2"

];


// =====================================================
// NORMALIZAR TEXTO
// =====================================================

function normalizarTexto(texto) {

    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

}


// =====================================================
// VERIFICAR CLASSE COM EXAME
// =====================================================

function temExame(classe) {

    const valor =
        normalizarTexto(classe);

    return CLASSES_COM_EXAME.some(
        item =>
            normalizarTexto(item) ===
            valor
    );

}


// =====================================================
// IDENTIFICAR ENSINO PELA CLASSE
// =====================================================

function identificarEnsino(classe) {

    const valor =
        normalizarTexto(classe);


    if (
        CLASSES.ensinoPrimario.some(
            item =>
                normalizarTexto(item) ===
                valor
        )
    ) {

        return "ensinoPrimario";

    }


    if (
        CLASSES.primeiroCiclo.some(
            item =>
                normalizarTexto(item) ===
                valor
        )
    ) {

        return "primeiroCiclo";

    }


    return "";

}


// =====================================================
// FIM DO BLOCO 3.1
// =====================================================

// =====================================================
// PAUTAS-GERAIS.JS
// BLOCO 3.2 — ESCOLA + ENSINOS + CLASSES
// =====================================================


// =====================================================
// CARREGAR ESCOLA ATUAL
// =====================================================

async function carregarEscolaAtual() {

    try {

        estado.textContent =
            "⏳ A carregar dados da escola...";


        const referenciaEscola =
            doc(
                db,
                "escolas",
                escolaId
            );


        const resultado =
            await getDoc(
                referenciaEscola
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


        // =================================================
        // NOME DA ESCOLA
        // =================================================

        const nome =
            escolaAtual.nome ||
            escolaAtual.nomeEscola ||
            "Escola";


        nomeEscola.textContent =
            nome;


        // =================================================
        // ENDEREÇO
        // =================================================

        enderecoEscola.textContent =
            escolaAtual.endereco ||
            escolaAtual.municipio ||
            escolaAtual.provincia ||
            "";


        // =================================================
        // TELEFONE
        // =================================================

        telefoneEscola.textContent =
            escolaAtual.telefone ||
            escolaAtual.contacto ||
            "";


        // =================================================
        // ANO LECTIVO
        // =================================================

        const ano =
            escolaAtual.anoLetivoAtual ||
            escolaAtual.anoLetivo ||
            escolaAtual.anoLectivo ||
            "2026";


        anoLetivo.textContent =
            `Ano Lectivo: ${ano}`;


        // =================================================
        // LOGO
        // =================================================

        const logo =
            escolaAtual.logo ||
            escolaAtual.logoUrl ||
            escolaAtual.logotipo ||
            "";


        if (
            logo &&
            logoEscola
        ) {

            logoEscola.src =
                logo;

        }


        // =================================================
        // RODAPÉ
        // =================================================

        const rodapeEscola =
            document.getElementById(
                "rodapeEscola"
            );


        if (rodapeEscola) {

            rodapeEscola.textContent =
                nome;

        }


        // =================================================
        // CARREGAR ENSINOS
        // =================================================

        carregarEnsinos();


    }

    catch (erro) {

        console.error(
            "Erro ao carregar escola:",
            erro
        );


        estado.textContent =
            "❌ Erro ao carregar escola.";

        alert(
            "Erro ao carregar a escola:\n\n" +
            erro.message
        );

    }

}


// =====================================================
// CARREGAR ENSINOS
// =====================================================

function carregarEnsinos() {

    ensinoSelect.innerHTML = `

        <option value="">
            Selecionar ensino
        </option>

    `;


    let ensinos =
        Array.isArray(
            escolaAtual?.ensinos
        )
            ? escolaAtual.ensinos
            : [];


    // =================================================
    // SE A ESCOLA NÃO TIVER ENSINOS GRAVADOS,
    // NÃO CRIAR DADOS DE OUTRA ESCOLA.
    // =================================================

    if (
        ensinos.length === 0
    ) {

        estado.textContent =
            "⚠️ Nenhum ensino configurado nesta escola.";

        return;

    }


    ensinos.forEach(
        ensino => {

            const chave =
                normalizarTexto(
                    ensino
                );


            let valor = "";


            if (
                chave ===
                "ensinoprimario"
            ) {

                valor =
                    "ensinoPrimario";

            }


            else if (
                chave ===
                "primeirociclo"
            ) {

                valor =
                    "primeiroCiclo";

            }


            else {

                valor =
                    ensino;

            }


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                valor;


            option.textContent =
                ENSINOS[valor] ||
                ensino;


            ensinoSelect.appendChild(
                option
            );

        }
    );

}


// =====================================================
// ALTERAR ENSINO
// =====================================================

ensinoSelect.addEventListener(
    "change",
    function() {

        const ensino =
            this.value;


        classeSelect.innerHTML = `

            <option value="">
                Selecionar classe
            </option>

        `;


        turmaSelect.innerHTML = `

            <option value="">
                Selecionar turma
            </option>

        `;


        turmaAtual = null;

        turmasFiltradas = [];


        atualizarInformacoes();


        if (!ensino) {

            return;

        }


        carregarClasses(
            ensino
        );

    }
);


// =====================================================
// CARREGAR CLASSES / ETAPAS
// =====================================================

function carregarClasses(ensino) {

    classeSelect.innerHTML = `

        <option value="">
            Selecionar classe
        </option>

    `;


    const classes =
        CLASSES[ensino] || [];


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
// ALTERAR CLASSE
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

        turmasFiltradas = [];


        atualizarInformacoes();


        if (!classe) {

            return;

        }


        carregarTurmas(
            classe
        );

    }
);


// =====================================================
// FIM DO BLOCO 3.2
// =====================================================

// =====================================================
// PAUTAS-GERAIS.JS
// BLOCO 3.3 — CARREGAR TURMAS
// =====================================================


// =====================================================
// CARREGAR TURMAS DA ESCOLA
// =====================================================

async function carregarTurmas(classe) {

    try {

        estado.textContent =
            "⏳ A carregar turmas...";


        turmaSelect.innerHTML = `

            <option value="">
                A carregar turmas...
            </option>

        `;


        // =================================================
        // BUSCAR SOMENTE TURMAS DA ESCOLA ATUAL
        // =================================================

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


        const resultado =
            await getDocs(
                consulta
            );


        todasTurmas = [];


        // =================================================
        // FILTRAR POR CLASSE
        // =================================================

        resultado.forEach(
            documento => {

                const dados =
                    documento.data();


                const turma = {

                    id:
                        documento.id,

                    ...dados

                };


                const classeTurma =
                    turma.classe ||
                    turma.classeNome ||
                    "";


                if (
                    normalizarTexto(
                        classeTurma
                    ) ===
                    normalizarTexto(
                        classe
                    )
                ) {

                    todasTurmas.push(
                        turma
                    );

                }

            }
        );


        // =================================================
        // ORDENAR TURMAS
        // =================================================

        todasTurmas.sort(
            (a, b) => {

                return String(
                    a.nome ||
                    ""
                ).localeCompare(

                    String(
                        b.nome ||
                        ""
                    ),

                    "pt",

                    {
                        numeric: true
                    }

                );

            }
        );


        turmasFiltradas =
            [...todasTurmas];


        // =================================================
        // NENHUMA TURMA
        // =================================================

        if (
            todasTurmas.length === 0
        ) {

            turmaSelect.innerHTML = `

                <option value="">
                    Nenhuma turma encontrada
                </option>

            `;


            estado.textContent =
                "⚠️ Não existem turmas para esta classe.";

            return;

        }


        // =================================================
        // PREENCHER SELECT
        // =================================================

        turmaSelect.innerHTML = `

            <option value="">
                Selecionar turma
            </option>

        `;


        todasTurmas.forEach(
            turma => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    turma.id;


                option.textContent =
                    turma.nome ||
                    turma.designacao ||
                    turma.id;


                turmaSelect.appendChild(
                    option
                );

            }
        );


        estado.textContent =
            `${todasTurmas.length} turma(s) encontrada(s).`;


        console.log(
            "🏫 Turmas da escola:",
            todasTurmas
        );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar turmas:",
            erro
        );


        turmaSelect.innerHTML = `

            <option value="">
                Erro ao carregar turmas
            </option>

        `;


        estado.textContent =
            "❌ Erro ao carregar turmas.";

    }

}


// =====================================================
// SELECIONAR TURMA
// =====================================================

turmaSelect.addEventListener(
    "change",
    function() {

        const turmaId =
            this.value;


        turmaAtual = null;


        if (!turmaId) {

            atualizarInformacoes();

            return;

        }


        turmaAtual =
            turmasFiltradas.find(
                turma =>
                    turma.id ===
                    turmaId
            );


        if (!turmaAtual) {

            console.error(
                "Turma não encontrada:",
                turmaId
            );

            return;

        }


        // =================================================
        // SEGURANÇA EXTRA
        // =================================================

        if (
            turmaAtual.escolaId !==
            escolaId
        ) {

            alert(
                "❌ Esta turma não pertence à escola atual."
            );

            turmaAtual = null;

            turmaSelect.value = "";

            atualizarInformacoes();

            return;

        }


        console.log(
            "📚 TURMA SELECIONADA:",
            turmaAtual
        );


        atualizarInformacoes();

    }
);


// =====================================================
// ATUALIZAR INFORMAÇÕES DA TURMA
// =====================================================

function atualizarInformacoes() {

    if (!turmaAtual) {

        classeInfo.textContent =
            "—";

        turmaInfo.textContent =
            "—";

        quantidadeAlunos.textContent =
            "—";

        return;

    }


    classeInfo.textContent =
        turmaAtual.classe ||
        turmaAtual.classeNome ||
        "—";


    turmaInfo.textContent =
        turmaAtual.nome ||
        turmaAtual.designacao ||
        "—";


    quantidadeAlunos.textContent =
        "—";

}


// =====================================================
// BOTÃO CARREGAR PAUTA
// =====================================================

if (carregarPauta) {

    carregarPauta.addEventListener(
        "click",
        async function() {

            if (!turmaAtual) {

                alert(
                    "Selecione primeiro uma turma."
                );

                return;

            }


            if (
                turmaAtual.escolaId !==
                escolaId
            ) {

                alert(
                    "❌ Esta turma não pertence à escola atual."
                );

                return;

            }


            await carregarDadosDaTurma();

        }
    );

}


// =====================================================
// INICIAR
// =====================================================

carregarEscolaAtual();


// =====================================================
// FIM DO BLOCO 3.3
// =====================================================

// =====================================================
// PAUTA-GERAL.JS — BLOCO 3.4
// CARREGAR ALUNOS + NOTAS DA TURMA
// SGE ANGOLA
// =====================================================

async function carregarDadosPauta(turmaId) {

    try {

        estado.textContent =
            "⏳ A carregar alunos e notas...";

        corpoPauta.innerHTML = `
            <tr>
                <td colspan="100">
                    ⏳ A carregar pauta...
                </td>
            </tr>
        `;

        // =================================================
        // VERIFICAR TURMA
        // =================================================

        const turmaRef =
            doc(db, "turmas", turmaId);

        const turmaSnap =
            await getDoc(turmaRef);

        if (!turmaSnap.exists()) {
            throw new Error(
                "Turma não encontrada."
            );
        }

        const turma =
            turmaSnap.data();

        // =================================================
        // SEGURANÇA — ESCOLA ATUAL
        // =================================================

        if (
            turma.escolaId !== escolaId
        ) {

            throw new Error(
                "Esta turma não pertence à escola atual."
            );

        }

        turmaAtual = {
            id: turmaId,
            ...turma
        };

        // =================================================
        // BUSCAR ALUNOS
        // =================================================

        const alunosSnap =
            await getDocs(
                collection(
                    db,
                    "turmas",
                    turmaId,
                    "alunos"
                )
            );

        const alunos =
            alunosSnap.docs.map(
                documento => ({
                    id: documento.id,
                    ...documento.data()
                })
            );

        // =================================================
        // ORDENAR ALUNOS
        // =================================================

        alunos.sort(
            (a, b) => {

                const numeroA =
                    Number(a.numero);

                const numeroB =
                    Number(b.numero);

                if (
                    !Number.isNaN(numeroA) &&
                    !Number.isNaN(numeroB)
                ) {

                    return numeroA - numeroB;

                }

                return String(
                    a.nome || ""
                ).localeCompare(
                    String(
                        b.nome || ""
                    ),
                    "pt"
                );

            }
        );

        // =================================================
        // BUSCAR NOTAS
        // =================================================

        const notasSnap =
            await getDocs(
                collection(
                    db,
                    "notas"
                )
            );

        const notas = [];

        notasSnap.forEach(
            documento => {

                const dados =
                    documento.data();

                // =========================================
                // SEGURANÇA
                // =========================================

                if (
                    dados.escolaId !== escolaId
                ) {

                    return;

                }

                if (
                    dados.turmaId !== turmaId
                ) {

                    return;

                }

                notas.push({
                    id: documento.id,
                    ...dados
                });

            }
        );

        // =================================================
        // GUARDAR DADOS
        // =================================================

        alunosAtuais =
            alunos;

        notasAtuais =
            notas;

        // =================================================
        // ATUALIZAR INFORMAÇÕES
        // =================================================

        if (classeInfo) {

            classeInfo.textContent =
                `Classe: ${
                    turma.classe || "—"
                }`;

        }

        if (turmaInfo) {

            turmaInfo.textContent =
                `Turma: ${
                    turma.nome || "—"
                }`;

        }

        if (nomeEscola) {

            nomeEscola.textContent =
                turma.nomeEscola ||
                turma.escolaNome ||
                "Escola";

        }

        if (anoLetivo) {

            anoLetivo.textContent =
                `Ano Lectivo: ${
                    turma.anoLetivo ||
                    "2026"
                }`;

        }

        // =================================================
        // CONSTRUIR PAUTA
        // =================================================

        construirCabecalho();

        construirLinhas();

        estado.textContent =
            `✅ ${alunos.length} aluno(s) carregado(s).`;

    }

    catch (erro) {

        console.error(
            "Erro ao carregar dados da pauta:",
            erro
        );

        corpoPauta.innerHTML = `
            <tr>
                <td
                    colspan="100"
                    class="erro"
                >
                    ❌ Erro ao carregar pauta:
                    <br><br>
                    ${erro.message}
                </td>
            </tr>
        `;

        estado.textContent =
            "❌ Erro ao carregar pauta.";

    }

}

// =====================================================
// PAUTA-GERAL.JS — BLOCO 3.5
// CABEÇALHO DA PAUTA
// =====================================================

function construirCabecalho() {

    if (!cabecalhoPauta) {
        console.error("❌ Cabeçalho da pauta não encontrado.");
        return;
    }

    if (!turmaAtual) {
        return;
    }

    const classe =
        normalizarTexto(
            turmaAtual.classe
        );

    // =================================================
    // DISCIPLINAS DA TURMA
    // =================================================

    const disciplinas =
        Array.isArray(turmaAtual.disciplinas)
            ? turmaAtual.disciplinas
            : [];

    // =================================================
    // CLASSES COM EXAME
    // =================================================

    const classesExame = [
        "6ª classe",
        "9ª classe",
        "3ª Etapa",
        "EJA 2"
    ];

    const temExame =
        classesExame.some(
            item =>
                normalizarTexto(item) === classe
        );

    // =================================================
    // LINHA 1
    // =================================================

    let linha1 = `
        <tr>

            <th rowspan="3">
                Nº
            </th>

            <th rowspan="3">
                Nome do Aluno
            </th>

            <th rowspan="3">
                Sexo
            </th>
    `;

    disciplinas.forEach(
        disciplina => {

            linha1 += `
                <th
                    colspan="6"
                    class="disciplina"
                >
                    ${disciplina}
                </th>
            `;

        }
    );

    // =================================================
    // COLUNAS FINAIS
    // =================================================

    linha1 += `
            <th rowspan="3">
                MF
            </th>
    `;

    if (temExame) {

        linha1 += `
            <th rowspan="3">
                Exame<br>Escrito
            </th>

            <th rowspan="3">
                Exame<br>Oral
            </th>
        `;

    }

    linha1 += `
            <th rowspan="3">
                Situação
            </th>

        </tr>
    `;

    // =================================================
    // LINHA 2
    // =================================================

    let linha2 = `<tr>`;

    disciplinas.forEach(
        () => {

            linha2 += `
                <th
                    colspan="2"
                    class="trimestre"
                >
                    1.º Trimestre
                </th>

                <th
                    colspan="2"
                    class="trimestre"
                >
                    2.º Trimestre
                </th>

                <th
                    colspan="2"
                    class="trimestre"
                >
                    3.º Trimestre
                </th>
            `;

        }
    );

    linha2 += `</tr>`;

    // =================================================
    // LINHA 3
    // =================================================

    let linha3 = `<tr>`;

    disciplinas.forEach(
        () => {

            linha3 += `
                <th class="subcoluna">
                    MDF
                </th>

                <th class="subcoluna">
                    MF
                </th>

                <th class="subcoluna">
                    MDF
                </th>

                <th class="subcoluna">
                    MF
                </th>

                <th class="subcoluna">
                    MDF
                </th>

                <th class="subcoluna">
                    MF
                </th>
            `;

        }
    );

    linha3 += `</tr>`;

    // =================================================
    // COLOCAR NO THEAD
    // =================================================

    cabecalhoPauta.innerHTML =
        linha1 +
        linha2 +
        linha3;

    // =================================================
    // LARGURA DA TABELA
    // =================================================

    const quantidadeDisciplinas =
        disciplinas.length;

    const largura =
        700 +
        (
            quantidadeDisciplinas *
            6 *
            55
        );

    const tabela =
        document.getElementById(
            "tabelaPauta"
        );

    if (tabela) {

        tabela.style.minWidth =
            `${largura}px`;

    }

}
