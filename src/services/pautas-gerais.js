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


alert("PAUTAS-GERAIS.JS1 CARREGADO ✅");


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

// =====================================================
// PAUTA-GERAL.JS — BLOCO 3.6
// CONSTRUIR LINHAS DOS ALUNOS
// MDF | MF | SITUAÇÃO | EXAMES
// =====================================================

function construirLinhas() {

    if (!corpoPauta) {
        console.error(
            "❌ corpoPauta não encontrado."
        );
        return;
    }

    corpoPauta.innerHTML = "";

    if (!turmaAtual) {
        return;
    }

    const disciplinas =
        Array.isArray(
            turmaAtual.disciplinas
        )
            ? turmaAtual.disciplinas
            : [];

    const classe =
        normalizarTexto(
            turmaAtual.classe
        );

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
    // VERIFICAR ALUNOS
    // =================================================

    if (
        !alunosAtuais ||
        alunosAtuais.length === 0
    ) {

        corpoPauta.innerHTML = `
            <tr>
                <td
                    colspan="100"
                    class="erro"
                >
                    📋 Nenhum aluno encontrado.
                </td>
            </tr>
        `;

        return;
    }

    // =================================================
    // FUNÇÃO — OBTER NOTA
    // =================================================

    function obterNota(
        aluno,
        disciplina,
        trimestre
    ) {

        const registro =
            notasAtuais.find(
                nota => {

                    if (
                        normalizarTexto(
                            nota.disciplina
                        ) !==
                        normalizarTexto(
                            disciplina
                        )
                    ) {
                        return false;
                    }

                    if (
                        String(
                            nota.trimestre
                        ) !==
                        String(
                            trimestre
                        )
                    ) {
                        return false;
                    }

                    return (
                        nota.turmaId ===
                        turmaAtual.id
                    );

                }
            );

        if (!registro) {
            return {};
        }

        const alunoNota =
            registro.alunos?.find(
                item => {

                    if (
                        item.id &&
                        String(item.id) ===
                        String(aluno.id)
                    ) {
                        return true;
                    }

                    if (
                        item.alunoId &&
                        String(item.alunoId) ===
                        String(aluno.id)
                    ) {
                        return true;
                    }

                    if (
                        item.numero &&
                        aluno.numero &&
                        String(item.numero) ===
                        String(aluno.numero)
                    ) {
                        return true;
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

        return alunoNota || {};
    }

    // =================================================
    // CONVERTER VALOR
    // =================================================

    function numero(valor) {

        if (
            valor === undefined ||
            valor === null ||
            valor === ""
        ) {
            return null;
        }

        const n =
            Number(
                String(valor)
                    .replace(",", ".")
            );

        return Number.isNaN(n)
            ? null
            : n;
    }

    // =================================================
    // CALCULAR MDF
    // =================================================

    function calcularMDF(
        mac,
        npt
    ) {

        const MAC =
            numero(mac);

        const NPT =
            numero(npt);

        if (
            MAC === null ||
            NPT === null
        ) {
            return null;
        }

        return (
            MAC + NPT
        ) / 2;

    }

    // =================================================
    // MF ARREDONDADA
    // =================================================

    function calcularMF(
        valor
    ) {

        if (
            valor === null ||
            valor === undefined
        ) {
            return null;
        }

        return Math.round(
            valor
        );

    }

    // =================================================
    // FORMATAR MDF
    // EX.: 12,5
    // =================================================

    function formatarMDF(
        valor
    ) {

        if (
            valor === null ||
            valor === undefined
        ) {
            return "—";
        }

        return Number(
            valor
        ).toFixed(1)
            .replace(".", ",");

    }

    // =================================================
    // FORMATAR MF
    // =================================================

    function formatarMF(
        valor
    ) {

        if (
            valor === null ||
            valor === undefined
        ) {
            return "—";
        }

        return String(
            Math.round(valor)
        );

    }

    // =================================================
    // CALCULAR SITUAÇÃO
    // =================================================

    function calcularSituacao(
        media,
        exameEscrito,
        exameOral
    ) {

        if (
            media === null ||
            media === undefined
        ) {

            return "—";

        }

        const valor =
            Number(media);

        // =============================================
        // CLASSES COM EXAME
        // =============================================

        if (temExame) {

    exameEscrito =
        numero(
            obterExamePauta(
                aluno,
                disciplina,
                "exameEscrito"
            )
        );

    exameOral =
        numero(
            obterExamePauta(
                aluno,
                disciplina,
                "exameOral"
            )
        );

            if (
                escrito !== null &&
                oral !== null
            ) {

                const exameFinal =
                    (
                        escrito +
                        oral
                    ) / 2;

                const resultado =
                    (
                        valor +
                        exameFinal
                    ) / 2;

                if (
                    resultado >= 10
                ) {

                    return "Apto";

                }

                return "Não Apto";

            }

        }

        // =============================================
        // SITUAÇÃO NORMAL
        // =============================================

        if (
            valor >= 10
        ) {

            return "Apto";

        }

        if (
            valor >= 7
        ) {

            return "Apto com Suficiência";

        }

        if (
            valor >= 5
        ) {

            return "Recurso";

        }

        return "Não Apto";

    }

    // =================================================
    // CONSTRUIR CADA ALUNO
    // =================================================

    alunosAtuais.forEach(
        (aluno, indice) => {

            const tr =
                document.createElement(
                    "tr"
                );

            // =========================================
            // DADOS DO ALUNO
            // =========================================

            const numeroAluno =
                aluno.numero ||
                indice + 1;

            const nome =
                aluno.nome ||
                "—";

            const sexo =
                aluno.sexo ||
                aluno.Sexo ||
                "—";

            let html = `

                <td>
                    ${numeroAluno}
                </td>

                <td class="nome">
                    ${nome}
                </td>

                <td>
                    ${sexo}
                </td>

            `;

            // =========================================
            // MÉDIAS DE TODAS AS DISCIPLINAS
            // =========================================

            const mediasFinais = [];

            // =========================================
            // DISCIPLINAS
            // =========================================

            disciplinas.forEach(
                disciplina => {

                    let medias = [];

                    // =================================
                    // 1.º TRIMESTRE
                    // =================================

                    const nota1 =
                        obterNota(
                            aluno,
                            disciplina,
                            1
                        );

                    const mdf1 =
                        calcularMDF(
                            nota1.MAC,
                            nota1.NPT
                        );

                    const mf1 =
                        calcularMF(
                            mdf1
                        );

                    // =================================
                    // 2.º TRIMESTRE
                    // =================================

                    const nota2 =
                        obterNota(
                            aluno,
                            disciplina,
                            2
                        );

                    const mdf2 =
                        calcularMDF(
                            nota2.MAC,
                            nota2.NPT
                        );

                    const mf2 =
                        calcularMF(
                            mdf2
                        );

                    // =================================
                    // 3.º TRIMESTRE
                    // =================================

                    const nota3 =
                        obterNota(
                            aluno,
                            disciplina,
                            3
                        );

                    const mdf3 =
                        calcularMDF(
                            nota3.MAC,
                            nota3.NPT
                        );

                    const mf3 =
                        calcularMF(
                            mdf3
                        );

                    // =================================
                    // GUARDAR MÉDIAS
                    // =================================

                    [
                        mdf1,
                        mdf2,
                        mdf3
                    ].forEach(
                        valor => {

                            if (
                                valor !== null
                            ) {

                                medias.push(
                                    valor
                                );

                            }

                        }
                    );

                    // =================================
                    // MÉDIA FINAL DA DISCIPLINA
                    // =================================

                    let mfDisciplina =
                        null;

                    if (
                        medias.length > 0
                    ) {

                        mfDisciplina =
                            medias.reduce(
                                (
                                    soma,
                                    valor
                                ) =>
                                    soma +
                                    valor,
                                0
                            ) /
                            medias.length;

                        mediasFinais.push(
                            mfDisciplina
                        );

                    }

                    // =================================
                    // COLUNAS
                    // =================================

                    html += `

                        <td>
                            ${formatarMDF(mdf1)}
                        </td>

                        <td class="mf">
                            ${formatarMF(mf1)}
                        </td>

                        <td>
                            ${formatarMDF(mdf2)}
                        </td>

                        <td class="mf">
                            ${formatarMF(mf2)}
                        </td>

                        <td>
                            ${formatarMDF(mdf3)}
                        </td>

                        <td class="mf">
                            ${formatarMF(mf3)}
                        </td>

                    `;

                }
            );

            // =========================================
            // MÉDIA FINAL GERAL
            // =========================================

            let mediaFinal =
                null;

            if (
                mediasFinais.length > 0
            ) {

                mediaFinal =
                    mediasFinais.reduce(
                        (
                            soma,
                            valor
                        ) =>
                            soma +
                            valor,
                        0
                    ) /
                    mediasFinais.length;

                mediaFinal =
                    Math.round(
                        mediaFinal
                    );

            }

            // =========================================
            // EXAMES
            // =========================================

            let exameEscrito = null;
            let exameOral = null;

            if (temExame) {

                exameEscrito =
                    numero(
                        aluno.exameEscrito
                    );

                exameOral =
                    numero(
                        aluno.exameOral
                    );

                html += `

                   <td>
    ${
        criarCampoExame(
            exameEscrito,
            "exameEscrito",
            aluno.id,
            disciplina
        )
    }
</td>

<td>
    ${
        criarCampoExame(
            exameOral,
            "exameOral",
            aluno.id,
            disciplina
        )
    }
</td>

                `;

            }

            // =========================================
            // SITUAÇÃO
            // =========================================

            const situacao =
                calcularSituacao(
                    mediaFinal,
                    exameEscrito,
                    exameOral
                );

            // =========================================
            // RESULTADO FINAL
            // =========================================

            html += `

                <td class="mf-final">
                    ${
                        mediaFinal === null
                            ? "—"
                            : mediaFinal
                    }
                </td>

                <td class="situacao">
                    ${situacao}
                </td>

            `;

            tr.innerHTML =
                html;

            corpoPauta.appendChild(
                tr
            );

        }
    );

}


// =====================================================
// PAUTA-GERAL.JS — BLOCO 3.7
// FINALIZAR CONSTRUÇÃO DA PAUTA
// =====================================================

function atualizarEstadoPauta() {

    if (!estado) {
        return;
    }

    if (!turmaAtual) {

        estado.textContent =
            "Selecione uma turma.";

        return;
    }

    if (
        !alunosAtuais ||
        alunosAtuais.length === 0
    ) {

        estado.textContent =
            "Nenhum aluno encontrado.";

        return;
    }

    estado.textContent =
        `${alunosAtuais.length} aluno(s) carregado(s).`;

}


// =====================================================
// ATUALIZAR CABEÇALHO
// =====================================================

function atualizarCabecalhoPauta() {

    if (!cabecalhoPauta) {
        return;
    }

    cabecalhoPauta.innerHTML = "";

    if (!turmaAtual) {
        return;
    }

    const disciplinas =
        Array.isArray(
            turmaAtual.disciplinas
        )
            ? turmaAtual.disciplinas
            : [];


    const classe =
        normalizarTexto(
            turmaAtual.classe
        );


    const classesExame = [
        "6ª classe",
        "9ª classe",
        "3ª etapa",
        "eja 2"
    ];


    const temExame =
        classesExame.some(
            item =>
                normalizarTexto(item) ===
                classe
        );


    // =================================================
    // LINHA 1
    // =================================================

    const linha1 =
        document.createElement("tr");


    linha1.innerHTML = `

        <th rowspan="3">
            Nº
        </th>

        <th rowspan="3"
            class="nome">
            Nome do Aluno
        </th>

        <th rowspan="3">
            Sexo
        </th>

    `;


    disciplinas.forEach(
        disciplina => {

            linha1.innerHTML += `

                <th
                    colspan="6"
                    class="disciplina"
                >
                    ${disciplina}
                </th>

            `;

        }
    );


    if (temExame) {

        linha1.innerHTML += `

            <th
                rowspan="3"
                class="exame"
            >
                Exame<br>Escrito
            </th>

            <th
                rowspan="3"
                class="exame"
            >
                Exame<br>Oral
            </th>

        `;

    }


    linha1.innerHTML += `

        <th rowspan="3">
            MF
        </th>

        <th rowspan="3">
            Situação
        </th>

    `;


    // =================================================
    // LINHA 2
    // =================================================

    const linha2 =
        document.createElement("tr");


    disciplinas.forEach(
        () => {

            linha2.innerHTML += `

                <th colspan="2">
                    1.º Trim.
                </th>

                <th colspan="2">
                    2.º Trim.
                </th>

                <th colspan="2">
                    3.º Trim.
                </th>

            `;

        }
    );


    // =================================================
    // LINHA 3
    // =================================================

    const linha3 =
        document.createElement("tr");


    disciplinas.forEach(
        () => {

            linha3.innerHTML += `

                <th>
                    MDF
                </th>

                <th>
                    MF
                </th>

                <th>
                    MDF
                </th>

                <th>
                    MF
                </th>

                <th>
                    MDF
                </th>

                <th>
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

    cabecalhoPauta.appendChild(
        linha3
    );

}


// =====================================================
// ATUALIZAR PAUTA COMPLETA
// =====================================================

function atualizarPautaCompleta() {

    atualizarCabecalhoPauta();

    construirLinhas();

    atualizarEstadoPauta();

}


// =====================================================
// FIM DO BLOCO 3.7
// =====================================================

BLOCO 3.8 — CAMPOS DE EXAME EDITÁVEIS NA PAUTA

// =====================================================
// PAUTA-GERAL.JS — BLOCO 3.8
// EXAMES EDITÁVEIS DIRETAMENTE NA PAUTA
// =====================================================

function criarCampoExame(
    valor,
    tipo,
    alunoId,
    disciplina
) {

    const valorAtual =
        valor === null ||
        valor === undefined
            ? ""
            : valor;


    return `

        <input
            type="number"
            class="campo-exame"
            data-tipo="${tipo}"
            data-aluno-id="${alunoId}"
            data-disciplina="${disciplina}"
            value="${valorAtual}"
            min="0"
            max="20"
            step="0.1"
            style="
                width:55px;
                text-align:center;
                border:1px solid #2563eb;
                border-radius:5px;
                padding:5px;
            "
        >

    `;

}


// =====================================================
// OBTER EXAME DO ALUNO
// =====================================================

function obterExameAluno(
    aluno,
    disciplina,
    tipo
) {

    const registro =
        notasAtuais.find(
            nota => {

                if (
                    String(nota.turmaId) !==
                    String(turmaAtual.id)
                ) {
                    return false;
                }

                if (
                    normalizarTexto(
                        nota.disciplina
                    ) !==
                    normalizarTexto(
                        disciplina
                    )
                ) {
                    return false;
                }

                if (
                    nota.escolaId &&
                    String(nota.escolaId) !==
                    String(escolaId)
                ) {
                    return false;
                }

                return true;

            }
        );


    if (!registro) {
        return null;
    }


    const alunoNota =
        registro.alunos?.find(
            item => {

                if (
                    item.id &&
                    String(item.id) ===
                    String(aluno.id)
                ) {
                    return true;
                }

                if (
                    item.alunoId &&
                    String(item.alunoId) ===
                    String(aluno.id)
                ) {
                    return true;
                }

                if (
                    item.numero &&
                    aluno.numero &&
                    String(item.numero) ===
                    String(aluno.numero)
                ) {
                    return true;
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


    if (!alunoNota) {
        return null;
    }


    return (
        alunoNota[tipo] ??
        null
    );

}


// =====================================================
// INICIALIZAR CAMPOS DE EXAME
// =====================================================

function prepararCamposExame() {

    if (!corpoPauta) {
        return;
    }


    const campos =
        corpoPauta.querySelectorAll(
            ".campo-exame"
        );


    campos.forEach(
        campo => {

            campo.addEventListener(
                "input",
                function () {

                    let valor =
                        this.value;

                    if (
                        valor === ""
                    ) {
                        return;
                    }


                    const numero =
                        Number(valor);


                    if (
                        numero < 0
                    ) {
                        this.value = 0;
                    }


                    if (
                        numero > 20
                    ) {
                        this.value = 20;
                    }

                }
            );

        }
    );

}


// =====================================================
// FIM DO BLOCO 3.8
// =====================================================

BLOCO 3.9 — GUARDAR EXAMES NO FIRESTORE

// =====================================================
// PAUTA-GERAL.JS — BLOCO 3.9
// GUARDAR EXAMES
// =====================================================

// =====================================================
// CRIAR BOTÃO GUARDAR EXAMES
// =====================================================

function criarBotaoGuardarExames() {

    let botao =
        document.getElementById(
            "guardarExames"
        );


    if (botao) {
        return botao;
    }


    botao =
        document.createElement(
            "button"
        );


    botao.id =
        "guardarExames";


    botao.type =
        "button";


    botao.textContent =
        "💾 Guardar Exames";


    botao.style.cssText = `
        background:#2563eb;
        color:white;
        border:none;
        padding:10px 18px;
        border-radius:6px;
        cursor:pointer;
        font-weight:bold;
        margin:10px 5px;
    `;


    const tabela =
        document.getElementById(
            "tabelaPauta"
        );


    if (
        tabela &&
        tabela.parentElement
    ) {

        tabela.parentElement
            .insertBefore(
                botao,
                tabela
            );

    }


    botao.addEventListener(
        "click",
        guardarExames
    );


    return botao;

}


// =====================================================
// GUARDAR EXAMES
// =====================================================

async function guardarExames() {

    try {

        if (!turmaAtual) {

            alert(
                "❌ Selecione primeiro uma turma."
            );

            return;

        }


        if (!escolaId) {

            alert(
                "❌ Escola não identificada."
            );

            return;

        }


        const classe =
            normalizarTexto(
                turmaAtual.classe
            );


        const classesExame = [
            "6ª classe",
            "9ª classe",
            "3ª etapa",
            "eja 2"
        ];


        const temExame =
            classesExame.some(
                item =>
                    normalizarTexto(item) ===
                    classe
            );


        if (!temExame) {

            alert(
                "Esta classe não possui exames."
            );

            return;

        }


        const campos =
            corpoPauta.querySelectorAll(
                ".campo-exame"
            );


        if (!campos.length) {

            alert(
                "❌ Nenhum campo de exame encontrado."
            );

            return;

        }


        // =================================================
        // AGRUPAR ALTERAÇÕES
        // =================================================

        const alteracoes = {};


        campos.forEach(
            campo => {

                const alunoId =
                    campo.dataset.alunoId;


                const disciplina =
                    campo.dataset.disciplina;


                const tipo =
                    campo.dataset.tipo;


                if (
                    !alunoId ||
                    !disciplina ||
                    !tipo
                ) {

                    return;

                }


                if (
                    !alteracoes[disciplina]
                ) {

                    alteracoes[disciplina] = {};

                }


                if (
                    !alteracoes[
                        disciplina
                    ][alunoId]
                ) {

                    alteracoes[
                        disciplina
                    ][alunoId] = {};

                }


                alteracoes[
                    disciplina
                ][alunoId][tipo] =
                    campo.value === ""
                        ? null
                        : Number(
                            campo.value
                        );

            }
        );


        // =================================================
        // GUARDAR DISCIPLINA POR DISCIPLINA
        // =================================================

        for (
            const disciplina
            of Object.keys(alteracoes)
        ) {

            const idDisciplina =
                String(
                    disciplina
                )
                    .replace(/\//g, "-")
                    .replace(/\s+/g, "_")
                    .trim();


            const idDocumento =
                `${turmaAtual.id}_${idDisciplina}_exames`;


            const referencia =
                doc(
                    db,
                    "notas",
                    idDocumento
                );


            const existente =
                await getDoc(
                    referencia
                );


            let dadosExistentes =
                existente.exists()
                    ? existente.data()
                    : {};


            // =================================================
            // SEGURANÇA DA ESCOLA
            // =================================================

            if (
                dadosExistentes.escolaId &&
                String(
                    dadosExistentes.escolaId
                ) !==
                String(escolaId)
            ) {

                throw new Error(
                    `O documento da disciplina ${disciplina} pertence a outra escola.`
                );

            }


            const alunosExames =
                Array.isArray(
                    dadosExistentes.alunos
                )
                    ? [
                        ...dadosExistentes.alunos
                    ]
                    : [];


            // =================================================
            // ATUALIZAR ALUNOS
            // =================================================

            Object.entries(
                alteracoes[disciplina]
            ).forEach(
                (
                    [
                        alunoId,
                        exames
                    ]
                ) => {

                    const aluno =
                        alunosAtuais.find(
                            item =>
                                String(
                                    item.id
                                ) ===
                                String(
                                    alunoId
                                )
                        );


                    if (!aluno) {
                        return;
                    }


                    const indice =
                        alunosExames.findIndex(
                            item =>
                                String(
                                    item.id
                                ) ===
                                String(
                                    alunoId
                                )
                        );


                    const dadosAluno = {

                        id:
                            aluno.id,

                        numero:
                            aluno.numero ??
                            null,

                        nome:
                            aluno.nome ||
                            "",

                        sexo:
                            aluno.sexo ||
                            "",

                        exameEscrito:
                            exames.exameEscrito ??
                            (
                                indice >= 0
                                    ? alunosExames[
                                        indice
                                    ].exameEscrito ??
                                    null
                                    : null
                            ),

                        exameOral:
                            exames.exameOral ??
                            (
                                indice >= 0
                                    ? alunosExames[
                                        indice
                                    ].exameOral ??
                                    null
                                    : null
                            )

                    };


                    if (
                        indice >= 0
                    ) {

                        alunosExames[
                            indice
                        ] =
                            dadosAluno;

                    }
                    else {

                        alunosExames.push(
                            dadosAluno
                        );

                    }

                }
            );


            // =================================================
            // GUARDAR
            // =================================================

            await setDoc(
                referencia,
                {

                    escolaId:
                        escolaId,

                    turmaId:
                        turmaAtual.id,

                    turmaNome:
                        turmaAtual.nome ||
                        "",

                    classe:
                        turmaAtual.classe ||
                        "",

                    disciplina:
                        disciplina,

                    tipo:
                        "exames",

                    alunos:
                        alunosExames,

                    atualizadoEm:
                        serverTimestamp()

                },

                {
                    merge:true
                }
            );

        }


        alert(
            "✅ Exames guardados com sucesso!"
        );


        // =================================================
        // RECARREGAR PAUTA
        // =================================================

        if (
            typeof carregarPauta ===
            "function"
        ) {

            await carregarPauta(
                turmaAtual.id
            );

        }


    }

    catch (erro) {

        console.error(
            "❌ ERRO AO GUARDAR EXAMES:",
            erro
        );


        alert(
            "❌ Erro ao guardar exames:\n\n" +
            erro.message
        );

    }

}


// =====================================================
// INICIAR BOTÃO
// =====================================================

criarBotaoGuardarExames();


// =====================================================
// FIM DO BLOCO 3.9
// =====================================================

BLOCO 3.10 — CARREGAR EXAMES NA PAUTA

// =====================================================
// PAUTA-GERAL.JS — BLOCO 3.10
// CARREGAR EXAMES GUARDADOS
// =====================================================

async function carregarExamesPauta() {

    if (!turmaAtual) {
        return;
    }


    try {

        // =================================================
        // LIMPAR EXAMES ANTERIORES
        // =================================================

        const examesPorDisciplina = {};


        // =================================================
        // DISCIPLINAS DA TURMA
        // =================================================

        const disciplinas =
            Array.isArray(
                turmaAtual.disciplinas
            )
                ? turmaAtual.disciplinas
                : [];


        // =================================================
        // PROCURAR EXAMES
        // =================================================

        for (
            const disciplina
            of disciplinas
        ) {

            const idDisciplina =
                String(
                    disciplina
                )
                    .replace(/\//g, "-")
                    .replace(/\s+/g, "_")
                    .trim();


            const idDocumento =
                `${turmaAtual.id}_${idDisciplina}_exames`;


            const referencia =
                doc(
                    db,
                    "notas",
                    idDocumento
                );


            const snapshot =
                await getDoc(
                    referencia
                );


            if (
                !snapshot.exists()
            ) {

                continue;

            }


            const dados =
                snapshot.data();


            // =================================================
            // SEGURANÇA DA ESCOLA
            // =================================================

            if (
                dados.escolaId &&
                String(
                    dados.escolaId
                ) !==
                String(escolaId)
            ) {

                continue;

            }


            examesPorDisciplina[
                disciplina
            ] =
                Array.isArray(
                    dados.alunos
                )
                    ? dados.alunos
                    : [];

        }


        // =================================================
        // GUARDAR PARA USO DA PAUTA
        // =================================================

        window.examesPauta =
            examesPorDisciplina;


        console.log(
            "📝 EXAMES CARREGADOS:",
            window.examesPauta
        );


    }

    catch (erro) {

        console.error(
            "❌ ERRO AO CARREGAR EXAMES:",
            erro
        );


        window.examesPauta = {};

    }

}


// =====================================================
// OBTER EXAME DE UM ALUNO
// =====================================================

function obterExamePauta(
    aluno,
    disciplina,
    tipo
) {

    const lista =
        window.examesPauta?.[
            disciplina
        ] || [];


    const registro =
        lista.find(
            item => {

                if (
                    item.id &&
                    String(item.id) ===
                    String(aluno.id)
                ) {

                    return true;

                }


                if (
                    item.numero &&
                    aluno.numero &&
                    String(item.numero) ===
                    String(aluno.numero)
                ) {

                    return true;

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


    if (!registro) {

        return null;

    }


    return (
        registro[tipo] ??
        null
    );

}


// =====================================================
// SUBSTITUIR FUNÇÃO DE CAMPO DE EXAME
// =====================================================

function campoExamePauta(
    aluno,
    disciplina,
    tipo
) {

    const valor =
        obterExamePauta(
            aluno,
            disciplina,
            tipo
        );


    return criarCampoExame(
        valor,
        tipo,
        aluno.id,
        disciplina
    );

}


// =====================================================
// RECARREGAR EXAMES + PAUTA
// =====================================================

async function atualizarPautaComExames() {

    await carregarExamesPauta();

    atualizarCabecalhoPauta();

    construirLinhas();

    prepararCamposExame();

    atualizarEstadoPauta();

}


// =====================================================
// EXPOR PARA OUTROS BLOCOS
// =====================================================

window.carregarExamesPauta =
    carregarExamesPauta;

window.obterExamePauta =
    obterExamePauta;

window.atualizarPautaComExames =
    atualizarPautaComExames;


// =====================================================
// FIM DO BLOCO 3.10
// =====================================================

BLOCO 3.11 — EXAME ORAL POR DISCIPLINA

// =====================================================
// PAUTA-GERAL.JS — BLOCO 3.11
// CONTROLO DO EXAME ORAL
// =====================================================

function disciplinaTemExameOral(
    disciplina
) {

    const nome =
        normalizarTexto(
            disciplina
        );


    return (
        nome === "lingua portuguesa" ||
        nome === "lingua inglesa"
    );

}


// =====================================================
// VERIFICAR SE A DISCIPLINA TEM EXAME
// =====================================================

function disciplinaTemExame(
    disciplina
) {

    const classe =
        normalizarTexto(
            turmaAtual?.classe
        );


    const classesExame = [
        "6ª classe",
        "9ª classe",
        "3ª etapa",
        "eja 2"
    ];


    const temExame =
        classesExame.some(
            item =>
                normalizarTexto(item) ===
                classe
        );


    if (!temExame) {

        return false;

    }


    return true;

}


// =====================================================
// MOSTRAR CAMPOS DE EXAME
// =====================================================

function construirCamposExame(
    aluno,
    disciplina
) {

    if (
        !disciplinaTemExame(
            disciplina
        )
    ) {

        return "";

    }


    const exameEscrito =
        obterExamePauta(
            aluno,
            disciplina,
            "exameEscrito"
        );


    let html = `

        <td class="campo-exame-escrito">

            ${

                criarCampoExame(
                    exameEscrito,
                    "exameEscrito",
                    aluno.id,
                    disciplina
                )

            }

        </td>

    `;


    // =================================================
    // EXAME ORAL
    // SOMENTE PORTUGUÊS E INGLÊS
    // =================================================

    if (
        disciplinaTemExameOral(
            disciplina
        )
    ) {

        const exameOral =
            obterExamePauta(
                aluno,
                disciplina,
                "exameOral"
            );


        html += `

            <td class="campo-exame-oral">

                ${

                    criarCampoExame(
                        exameOral,
                        "exameOral",
                        aluno.id,
                        disciplina
                    )

                }

            </td>

        `;

    }


    return html;

}


// =====================================================
// FIM DO BLOCO 3.11
// =====================================================

BLOCO 3.12 — CABEÇALHO DOS EXAMES

// =====================================================
// PAUTA-GERAL.JS — BLOCO 3.12
// CABEÇALHO — EXAMES
// =====================================================

function construirCabecalhoExames() {

    const cabecalho =
        document.getElementById(
            "cabecalhoPauta"
        );


    if (!cabecalho) {

        console.error(
            "❌ cabecalhoPauta não encontrado."
        );

        return;

    }


    if (!turmaAtual) {
        return;
    }


    const disciplinas =
        Array.isArray(
            turmaAtual.disciplinas
        )
            ? turmaAtual.disciplinas
            : [];


    const classe =
        normalizarTexto(
            turmaAtual.classe
        );


    const classesExame = [
        "6ª classe",
        "9ª classe",
        "3ª etapa",
        "eja 2"
    ];


    const temExame =
        classesExame.some(
            item =>
                normalizarTexto(item) ===
                classe
        );


    // =================================================
    // PRIMEIRA LINHA
    // =================================================

    let linha1 = `

        <tr>

            <th rowspan="2">
                Nº
            </th>

            <th rowspan="2"
                class="nome">
                Nome do Aluno
            </th>

            <th rowspan="2">
                Sexo
            </th>

    `;


    // =================================================
    // DISCIPLINAS
    // =================================================

    disciplinas.forEach(
        disciplina => {

            let quantidadeColunas =
                6;


            if (
                temExame
            ) {

                quantidadeColunas =
                    disciplinaTemExameOral(
                        disciplina
                    )
                        ? 8
                        : 7;

            }


            linha1 += `

                <th
                    colspan="${quantidadeColunas}"
                    class="disciplina-header"
                >
                    ${disciplina}
                </th>

            `;

        }
    );


    // =================================================
    // MÉDIA FINAL GERAL
    // =================================================

    linha1 += `

            <th rowspan="2">
                MF Geral
            </th>

            <th rowspan="2">
                Situação
            </th>

        </tr>

    `;


    // =================================================
    // SEGUNDA LINHA
    // =================================================

    let linha2 = `<tr>`;


    disciplinas.forEach(
        disciplina => {

            linha2 += `

                <th colspan="2">
                    1.º Trimestre
                </th>

                <th colspan="2">
                    2.º Trimestre
                </th>

                <th colspan="2">
                    3.º Trimestre
                </th>

            `;


            // =========================================
            // EXAMES
            // =========================================

            if (
                temExame
            ) {

                linha2 += `

                    <th>
                        Exame Escrito
                    </th>

                `;


                if (
                    disciplinaTemExameOral(
                        disciplina
                    )
                ) {

                    linha2 += `

                        <th>
                            Exame Oral
                        </th>

                    `;

                }

            }

        }
    );


    linha2 += `</tr>`;


    // =================================================
    // INSERIR CABEÇALHO
    // =================================================

    cabecalho.innerHTML =
        linha1 +
        linha2;


    console.log(
        "✅ Cabeçalho dos exames construído."
    );

}


// =====================================================
// DISPONIBILIZAR GLOBALMENTE
// =====================================================

window.construirCabecalhoExames =
    construirCabecalhoExames;


// =====================================================
// FIM DO BLOCO 3.12
// =====================================================

BLOCO 3.13 — LIGAÇÃO DOS EXAMES ÀS LINHAS

// =====================================================
// PAUTA-GERAL.JS — BLOCO 3.13
// LIGAÇÃO DOS CAMPOS DE EXAME ÀS LINHAS
// =====================================================

function prepararCamposExame() {

    if (!corpoPauta) {
        return;
    }


    const campos =
        corpoPauta.querySelectorAll(
            ".campo-exame"
        );


    campos.forEach(
        campo => {

            // =============================================
            // GARANTIR VALOR NUMÉRICO
            // =============================================

            if (
                campo.value !== ""
            ) {

                const valor =
                    Number(
                        String(
                            campo.value
                        ).replace(
                            ",",
                            "."
                        )
                    );


                if (
                    !Number.isNaN(valor)
                ) {

                    campo.value =
                        valor;

                }

            }


            // =============================================
            // LIMITES
            // =============================================

            campo.min = "0";
            campo.max = "20";
            campo.step = "0.1";


            // =============================================
            // IDENTIFICAÇÃO
            // =============================================

            campo.dataset.preparado =
                "true";

        }
    );


    console.log(
        "✅ Campos de exame preparados:",
        campos.length
    );

}


// =====================================================
// ATUALIZAR CABEÇALHO + LINHAS
// =====================================================

async function construirPautaCompleta() {

    if (!turmaAtual) {

        console.warn(
            "⚠️ Nenhuma turma selecionada."
        );

        return;

    }


    // =============================================
    // PRIMEIRO CARREGAR EXAMES
    // =============================================

    await carregarExamesPauta();


    // =============================================
    // CABEÇALHO
    // =============================================

    construirCabecalhoExames();


    // =============================================
    // LINHAS
    // =============================================

    construirLinhas();


    // =============================================
    // PREPARAR CAMPOS
    // =============================================

    prepararCamposExame();


    console.log(
        "✅ PAUTA COMPLETA CONSTRUÍDA."
    );

}


// =====================================================
// DISPONIBILIZAR GLOBALMENTE
// =====================================================

window.prepararCamposExame =
    prepararCamposExame;

window.construirPautaCompleta =
    construirPautaCompleta;


// =====================================================
// FIM DO BLOCO 3.13
// =====================================================

BLOCO 3.14 — LIGAR CARREGAMENTO DA PAUTA

// =====================================================
// PAUTA-GERAL.JS — BLOCO 3.14
// LIGAÇÃO DO CARREGAMENTO DA PAUTA
// =====================================================

async function atualizarPautaCompleta() {

    try {

        if (!turmaAtual) {

            console.warn(
                "⚠️ Nenhuma turma selecionada."
            );

            return;

        }


        console.log(
            "🚀 A atualizar Pauta Geral..."
        );


        // =================================================
        // 1. CARREGAR NOTAS
        // =================================================

        if (
            typeof carregarNotas ===
            "function"
        ) {

            await carregarNotas();

        }


        // =================================================
        // 2. CARREGAR EXAMES
        // =================================================

        await carregarExamesPauta();


        // =================================================
        // 3. CONSTRUIR CABEÇALHO
        // =================================================

        construirCabecalhoExames();


        // =================================================
        // 4. CONSTRUIR ALUNOS
        // =================================================

        construirLinhas();


        // =================================================
        // 5. PREPARAR CAMPOS
        // =================================================

        prepararCamposExame();


        console.log(
            "✅ Pauta atualizada com sucesso."
        );


    }

    catch (erro) {

        console.error(
            "❌ ERRO AO ATUALIZAR PAUTA:",
            erro
        );


        if (corpoPauta) {

            corpoPauta.innerHTML = `

                <tr>

                    <td
                        colspan="100"
                        class="erro"
                    >

                        ❌ Erro ao carregar a pauta.

                        <br><br>

                        ${erro.message}

                    </td>

                </tr>

            `;

        }

    }

}


// =====================================================
// FUNÇÃO PARA SELEÇÃO DA TURMA
// =====================================================

async function carregarPautaSelecionada() {

    try {

        const select =
            document.getElementById(
                "turmaSelect"
            );


        if (!select) {

            console.error(
                "❌ turmaSelect não encontrado."
            );

            return;

        }


        const turmaIdSelecionada =
            select.value;


        if (!turmaIdSelecionada) {

            alert(
                "⚠️ Selecione uma turma."
            );

            return;

        }


        console.log(
            "🏫 Turma selecionada:",
            turmaIdSelecionada
        );


        // =================================================
        // PROCURAR TURMA
        // =================================================

        const turmaEncontrada =
            (
                typeof turmasAtuais !==
                "undefined"
            )
                ? turmasAtuais.find(
                    turma =>
                        String(
                            turma.id
                        ) ===
                        String(
                            turmaIdSelecionada
                        )
                )
                : null;


        if (!turmaEncontrada) {

            alert(
                "❌ Não foi possível encontrar os dados desta turma."
            );

            return;

        }


        // =================================================
        // DEFINIR TURMA ATUAL
        // =================================================

        turmaAtual =
            turmaEncontrada;


        console.log(
            "📚 TURMA ATUAL:",
            turmaAtual
        );


        // =================================================
        // CARREGAR PAUTA
        // =================================================

        await atualizarPautaCompleta();


    }

    catch (erro) {

        console.error(
            "❌ ERRO AO CARREGAR PAUTA:",
            erro
        );


        alert(
            "❌ Erro ao carregar pauta:\n\n" +
            erro.message
        );

    }

}


// =====================================================
// BOTÃO CARREGAR PAUTA
// =====================================================

const botaoCarregarPauta =
    document.getElementById(
        "carregarPauta"
    );


if (
    botaoCarregarPauta
) {

    botaoCarregarPauta.addEventListener(
        "click",
        carregarPautaSelecionada
    );

}


// =====================================================
// DISPONIBILIZAR GLOBALMENTE
// =====================================================

window.atualizarPautaCompleta =
    atualizarPautaCompleta;

window.carregarPautaSelecionada =
    carregarPautaSelecionada;


// =====================================================
// FIM DO BLOCO 3.14
// =====================================================

BLOCO 3.15 — BOTÃO CARREGAR PAUTA

BLOCO 3.15 — CARREGAR TURMA PELO ID E ESCOLA

// =====================================================
// PAUTA-GERAL.JS — BLOCO 3.15
// CARREGAR TURMA DIRETAMENTE DO FIRESTORE
// =====================================================

async function carregarPautaSelecionada() {

    try {

        const select =
            document.getElementById(
                "turmaSelect"
            );


        if (!select) {

            alert(
                "❌ Campo turmaSelect não encontrado."
            );

            return;

        }


        const turmaIdSelecionada =
            String(
                select.value || ""
            ).trim();


        if (!turmaIdSelecionada) {

            alert(
                "⚠️ Selecione uma turma."
            );

            return;

        }


        if (!escolaId) {

            alert(
                "❌ Escola não identificada."
            );

            return;

        }


        console.log(
            "🏫 Escola:",
            escolaId
        );

        console.log(
            "📚 Turma:",
            turmaIdSelecionada
        );


        // =================================================
        // BUSCAR TURMA PELO ID
        // =================================================

        const turmaRef =
            doc(
                db,
                "turmas",
                turmaIdSelecionada
            );


        const turmaSnap =
            await getDoc(
                turmaRef
            );


        if (!turmaSnap.exists()) {

            alert(
                "❌ Esta turma não existe no Firestore."
            );

            return;

        }


        const dadosTurma =
            turmaSnap.data();


        // =================================================
        // SEGURANÇA DA ESCOLA
        // =================================================

        if (
            dadosTurma.escolaId &&
            String(
                dadosTurma.escolaId
            ).trim() !==
            String(
                escolaId
            ).trim()
        ) {

            alert(
                "❌ Esta turma pertence a outra escola."
            );

            console.error(
                "Escola da turma:",
                dadosTurma.escolaId
            );

            console.error(
                "Escola atual:",
                escolaId
            );

            return;

        }


        // =================================================
        // DEFINIR TURMA ATUAL
        // =================================================

        turmaAtual = {

            id:
                turmaSnap.id,

            ...dadosTurma

        };


        console.log(
            "✅ TURMA ENCONTRADA:",
            turmaAtual
        );


        // =================================================
        // BUSCAR ALUNOS DA TURMA
        // =================================================

        const alunosRef =
            collection(
                db,
                "turmas",
                turmaSnap.id,
                "alunos"
            );


        const alunosSnap =
            await getDocs(
                alunosRef
            );


        alunosAtuais = [];


        alunosSnap.forEach(
            documento => {

                alunosAtuais.push({

                    id:
                        documento.id,

                    ...documento.data()

                });

            }
        );


        console.log(
            "👨‍🎓 ALUNOS:",
            alunosAtuais.length
        );


        // =================================================
        // CONSTRUIR PAUTA
        // =================================================

        await atualizarPautaCompleta();


    }

    catch (erro) {

        console.error(
            "❌ ERRO AO CARREGAR TURMA:",
            erro
        );


        alert(
            "❌ Erro ao carregar turma:\n\n" +
            erro.message
        );

    }

}


// =====================================================
// BOTÃO
// =====================================================

const botaoCarregarPauta =
    document.getElementById(
        "carregarPauta"
    );


if (
    botaoCarregarPauta
) {

    botaoCarregarPauta.onclick =
        carregarPautaSelecionada;

}


// =====================================================
// FIM DO BLOCO 3.15
// =====================================================
