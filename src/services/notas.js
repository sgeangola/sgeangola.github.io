import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


alert("🔥 NOTAS.JS CARREGOUT!");

alert("🔥 FIREBASE E FIRESTORE IMPORTADOS!");

// =====================================================
// ESCOLA
// =====================================================

const escolaId =
    sessionStorage.getItem("escolaId") ||
    localStorage.getItem("escolaId");

alert(
    "🔥 ESCOLA: " +
    (escolaId || "NÃO ENCONTRADA")
);


// =====================================================
// ELEMENTOS
// =====================================================

const filtroProfessor =
    document.getElementById("filtroProfessor");

const filtroClasse =
    document.getElementById("filtroClasse");

const filtroTurma =
    document.getElementById("filtroTurma");

const filtroDisciplina =
    document.getElementById("filtroDisciplina");

const filtroTrimestre =
    document.getElementById("filtroTrimestre");

const notasLista =
    document.getElementById("notasLista");

const mensagem =
    document.getElementById("mensagem");

const estadoSistema =
    document.getElementById("estadoSistema");

const botaoSistema =
    document.getElementById("botaoSistema");


alert("🔥 ELEMENTOS DA PÁGINA CARREGADOS!");

// =====================================================
// DADOS
// =====================================================

let professores = [];
let turmas = [];

let professorSelecionado = null;
let lancamentoSelecionado = null;


alert("🔥 DADOS INICIALIZADOS!");

// =====================================================
// CARREGAR PROFESSORES
// =====================================================

async function carregarProfessores() {

    alert("🔥 1 — ENTROU EM carregarProfessores()");

    professores = [];

    const resultado =
        await getDocs(
            query(
                collection(db, "professores"),
                where("escolaId", "==", escolaId)
            )
        );

    alert(
        "🔥 2 — PROFESSORES ENCONTRADOS: " +
        resultado.size
    );

    resultado.forEach(documento => {

        professores.push({
            id: documento.id,
            ...documento.data()
        });

    });

    console.log(
        "👨‍🏫 PROFESSORES:",
        professores
    );

    alert(
        "🔥 3 — PROFESSORES CARREGADOS!"
    );
}

// =====================================================
// CARREGAR TURMAS
// =====================================================

async function carregarTurmas() {

    alert("🔥 4 — ENTROU EM carregarTurmas()");

    turmas = [];

    const resultado =
        await getDocs(
            query(
                collection(db, "turmas"),
                where("escolaId", "==", escolaId)
            )
        );

    alert(
        "🔥 5 — TURMAS ENCONTRADAS: " +
        resultado.size
    );

    resultado.forEach(documento => {

        turmas.push({
            id: documento.id,
            ...documento.data()
        });

    });

    console.log(
        "🏫 TURMAS:",
        turmas
    );

    alert(
        "🔥 6 — TURMAS CARREGADAS!"
    );
}

// =====================================================
// PREENCHER PROFESSORES
// =====================================================

function preencherProfessores() {

    alert("🔥 9 — ENTROU EM preencherProfessores()");

    if (!filtroProfessor) {

        alert(
            "❌ filtroProfessor NÃO FOI ENCONTRADO!"
        );

        return;
    }

    filtroProfessor.innerHTML = `
        <option value="">
            Selecionar professor
        </option>
    `;

    professores.forEach(professor => {

        const option =
            document.createElement("option");

        option.value =
            professor.id;

        option.textContent =
            professor.codigoProfessor
                ? `${professor.codigoProfessor} — ${professor.nome}`
                : (
                    professor.nome ||
                    "Professor sem nome"
                );

        filtroProfessor.appendChild(option);

    });

    alert(
        "🔥 10 — PROFESSORES COLOCADOS NO SELECT: " +
        professores.length
    );
}

// =====================================================
// PROFESSOR → CLASSES
// =====================================================

function carregarClassesDoProfessor(professorId) {

    alert("🔥 12 — CARREGAR CLASSES DO PROFESSOR");

    if (!filtroClasse) {

        alert(
            "❌ filtroClasse NÃO FOI ENCONTRADO!"
        );

        return;
    }

    filtroClasse.innerHTML = `
        <option value="">
            Selecionar classe
        </option>
    `;

    filtroClasse.disabled = true;

    professorSelecionado =
        professores.find(
            professor =>
                professor.id === professorId
        ) || null;

    if (!professorSelecionado) {

        alert(
            "⚠️ PROFESSOR NÃO ENCONTRADO!"
        );

        return;
    }

    const atribuicoes =
        Array.isArray(
            professorSelecionado.atribuicoes
        )
            ? professorSelecionado.atribuicoes
            : [];

    alert(
        "🔥 13 — ATRIBUIÇÕES ENCONTRADAS: " +
        atribuicoes.length
    );

    const classes = new Map();

    atribuicoes.forEach(atribuicao => {

        const classe =
            String(
                atribuicao.classe || ""
            ).trim();

        if (!classe) return;

        const chave =
            classe.toLowerCase();

        if (!classes.has(chave)) {

            classes.set(
                chave,
                classe
            );

        }

    });

    classes.forEach(classe => {

        const option =
            document.createElement("option");

        option.value = classe;
        option.textContent = classe;

        filtroClasse.appendChild(option);

    });

    filtroClasse.disabled =
        classes.size === 0;

    alert(
        "🔥 14 — CLASSES COLOCADAS: " +
        classes.size
    );

    console.log(
        "📚 CLASSES:",
        [...classes.values()]
    );
}

// =====================================================
// EVENTO — PROFESSOR
// =====================================================

filtroProfessor?.addEventListener(
    "change",
    function () {

        alert(
            "🔥 15 — PROFESSOR SELECIONADO: " +
            this.value
        );

        carregarClassesDoProfessor(
            this.value
        );

        if (filtroTurma) {

            filtroTurma.innerHTML = `
                <option value="">
                    Selecione primeiro a classe
                </option>
            `;

            filtroTurma.disabled = true;
        }

        if (filtroDisciplina) {

            filtroDisciplina.innerHTML = `
                <option value="">
                    Selecione primeiro a turma
                </option>
            `;

            filtroDisciplina.disabled = true;
        }

        lancamentoSelecionado = null;
    }
);

// =====================================================
// CLASSE → TURMAS
// =====================================================

function carregarTurmasDaClasse(classe) {

    alert(
        "🔥 16 — CLASSE SELECIONADA: " +
        classe
    );

    if (!filtroTurma) {

        alert(
            "❌ filtroTurma NÃO FOI ENCONTRADO!"
        );

        return;
    }

    filtroTurma.innerHTML = `
        <option value="">
            Selecionar turma
        </option>
    `;

    filtroTurma.disabled = true;

    if (!professorSelecionado) {

        alert(
            "❌ NENHUM PROFESSOR SELECIONADO!"
        );

        return;
    }

    if (!classe) {

        alert(
            "⚠️ NENHUMA CLASSE SELECIONADA!"
        );

        return;
    }

    const atribuicoes =
        Array.isArray(
            professorSelecionado.atribuicoes
        )
            ? professorSelecionado.atribuicoes
            : [];

    alert(
        "🔥 17 — ATRIBUIÇÕES DO PROFESSOR: " +
        atribuicoes.length
    );

    const idsTurmas = [
        ...new Set(

            atribuicoes

                .filter(atribuicao => {

                    return String(
                        atribuicao.classe || ""
                    ).trim() ===
                    String(classe).trim();

                })

                .map(
                    atribuicao =>
                        atribuicao.turmaId
                )

                .filter(Boolean)

        )
    ];

    alert(
        "🔥 18 — IDs DAS TURMAS ENCONTRADOS: " +
        idsTurmas.length
    );

    console.log(
        "🏫 IDs DAS TURMAS:",
        idsTurmas
    );

    const turmasEncontradas =
        idsTurmas

            .map(id =>

                turmas.find(
                    turma =>
                        turma.id === id
                )

            )

            .filter(Boolean);

    console.log(
        "🏫 TURMAS ENCONTRADAS:",
        turmasEncontradas
    );

    turmasEncontradas.forEach(turma => {

        const option =
            document.createElement("option");

        option.value =
            turma.id;

        option.textContent =
            turma.nome ||
            turma.turma ||
            turma.designacao ||
            "Turma";

        filtroTurma.appendChild(
            option
        );

    });

    filtroTurma.disabled =
        turmasEncontradas.length === 0;

    alert(
        "🔥 19 — TURMAS COLOCADAS NO SELECT: " +
        turmasEncontradas.length
    );
}


// =====================================================
// EVENTO — CLASSE
// =====================================================

filtroClasse?.addEventListener(
    "change",
    function () {

        alert(
            "🔥 20 — EVENTO DA CLASSE FUNCIONOU!"
        );

        carregarTurmasDaClasse(
            this.value
        );

        if (filtroDisciplina) {

            filtroDisciplina.innerHTML = `
                <option value="">
                    Selecione primeiro a turma
                </option>
            `;

            filtroDisciplina.disabled = true;
        }

        lancamentoSelecionado = null;
    }
);

// =====================================================
// TURMA → DISCIPLINAS
// =====================================================

function carregarDisciplinasDaTurma(turmaId) {

    alert(
        "🔥 21 — TURMA SELECIONADA: " +
        turmaId
    );

    if (!filtroDisciplina) {

        alert(
            "❌ filtroDisciplina NÃO FOI ENCONTRADO!"
        );

        return;
    }

    filtroDisciplina.innerHTML = `
        <option value="">
            Selecionar disciplina
        </option>
    `;

    filtroDisciplina.disabled = true;

    if (!professorSelecionado) {

        alert(
            "❌ NENHUM PROFESSOR SELECIONADO!"
        );

        return;
    }

    if (!turmaId) {

        alert(
            "⚠️ NENHUMA TURMA SELECIONADA!"
        );

        return;
    }

    const atribuicoes =
        Array.isArray(
            professorSelecionado.atribuicoes
        )
            ? professorSelecionado.atribuicoes
            : [];

    alert(
        "🔥 22 — ATRIBUIÇÕES DO PROFESSOR: " +
        atribuicoes.length
    );

    const disciplinas = new Set();

    atribuicoes.forEach(atribuicao => {

        const atribuicaoTurmaId =
            String(
                atribuicao.turmaId || ""
            ).trim();

        if (
            atribuicaoTurmaId !==
            String(turmaId).trim()
        ) {
            return;
        }

        const disciplina =
            String(
                atribuicao.disciplina || ""
            ).trim();

        if (disciplina) {

            disciplinas.add(
                disciplina
            );
        }

    });

    alert(
        "🔥 23 — DISCIPLINAS ENCONTRADAS: " +
        disciplinas.size
    );

    console.log(
        "📚 DISCIPLINAS:",
        [...disciplinas]
    );

    disciplinas.forEach(disciplina => {

        const option =
            document.createElement("option");

        option.value =
            disciplina;

        option.textContent =
            disciplina;

        filtroDisciplina.appendChild(
            option
        );

    });

    filtroDisciplina.disabled =
        disciplinas.size === 0;

    alert(
        "🔥 24 — DISCIPLINAS COLOCADAS NO SELECT: " +
        disciplinas.size
    );
}


// =====================================================
// EVENTO — TURMA
// =====================================================

filtroTurma?.addEventListener(
    "change",
    function () {

        alert(
            "🔥 25 — EVENTO DA TURMA FUNCIONOU!"
        );

        carregarDisciplinasDaTurma(
            this.value
        );

        lancamentoSelecionado = null;
    }
);

// =====================================================
// DISCIPLINA → TRIMESTRE
// =====================================================

filtroDisciplina?.addEventListener(
    "change",
    async function () {

        alert(
            "🔥 26 — DISCIPLINA SELECIONADA: " +
            this.value
        );

        if (!this.value) {

            alert(
                "⚠️ NENHUMA DISCIPLINA SELECIONADA!"
            );

            return;
        }

        if (!filtroTrimestre) {

            alert(
                "❌ filtroTrimestre NÃO FOI ENCONTRADO!"
            );

            return;
        }

        filtroTrimestre.innerHTML = `

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

        `;

        filtroTrimestre.disabled = false;

        alert(
            "🔥 27 — TRIMESTRES COLOCADOS!"
        );
    }
);

// =====================================================
// CRIAR ID DO LANÇAMENTO
// =====================================================

function criarIdLancamento(
    turmaId,
    disciplina,
    trimestre
) {

    const turma =
        String(turmaId || "")
            .trim();

    const materia =
        String(disciplina || "")
            .trim()
            .replace(/\//g, "-")
            .replace(/\s+/g, "_");

    const tri =
        String(trimestre || "")
            .replace("º", "")
            .replace("°", "")
            .replace("ª", "")
            .replace("Trimestre", "")
            .replace(/\s+/g, "")
            .trim();

    return `${turma}_${materia}_${tri}`;
}


// =====================================================
// LER LANÇAMENTO EXISTENTE
// =====================================================

async function lerLancamentoExistente() {

    alert(
        "🔥 28 — ENTROU EM lerLancamentoExistente()"
    );

    const turmaId =
        filtroTurma?.value;

    const disciplina =
        filtroDisciplina?.value;

    const trimestre =
        filtroTrimestre?.value;

    if (
        !turmaId ||
        !disciplina ||
        !trimestre
    ) {

        alert(
            "⚠️ FALTAM DADOS PARA BUSCAR O LANÇAMENTO."
        );

        return;
    }

    const id =
        criarIdLancamento(
            turmaId,
            disciplina,
            trimestre
        );

    alert(
        "🔥 29 — ID DO LANÇAMENTO:\n\n" +
        id
    );

    try {

        const referencia =
            doc(
                db,
                "notas",
                id
            );

        const snapshot =
            await getDoc(
                referencia
            );

        alert(
            "🔥 30 — DOCUMENTO CONSULTADO!"
        );

        if (!snapshot.exists()) {

            alert(
                "⚠️ 31 — ESTE LANÇAMENTO NÃO EXISTE."
            );

            console.log(
                "❌ Documento não encontrado:",
                id
            );

            return;
        }

        const dados =
            snapshot.data();

        console.log(
            "📦 DADOS COMPLETOS DO LANÇAMENTO:",
            dados
        );

        alert(
            "🔥 31 — LANÇAMENTO ENCONTRADO!\n\n" +
            "Alunos guardados: " +
            (
                Array.isArray(dados.alunos)
                    ? dados.alunos.length
                    : 0
            )
        );

        console.log(
            "👨‍🎓 ALUNOS GUARDADOS:",
            dados.alunos
        );

        console.log(
            "📝 PRIMEIRO ALUNO:",
            Array.isArray(dados.alunos)
                ? dados.alunos[0]
                : null
        );

    }
    catch (erro) {

        console.error(
            "❌ ERRO AO LER LANÇAMENTO:",
            erro
        );

        alert(
            "❌ ERRO AO LER LANÇAMENTO:\n\n" +
            erro.message
        );
    }
}


// =====================================================
// EVENTO — TRIMESTRE
// =====================================================

filtroTrimestre?.addEventListener(
    "change",
    async function () {

        alert(
            "🔥 32 — TRIMESTRE SELECIONADO: " +
            this.value
        );

        if (!this.value) {

            return;
        }

       await lerLancamentoExistente();

await mostrarNotasDoLancamento();
    }
);

// =====================================================
// MOSTRAR NOTAS DO LANÇAMENTO
// =====================================================

async function mostrarNotasDoLancamento() {

    alert("🔥 33 — VOU MOSTRAR AS NOTAS!");

    const turmaId =
        filtroTurma?.value;

    const disciplina =
        filtroDisciplina?.value;

    const trimestre =
        filtroTrimestre?.value;

    if (
        !turmaId ||
        !disciplina ||
        !trimestre
    ) {
        return;
    }

    const id =
        criarIdLancamento(
            turmaId,
            disciplina,
            trimestre
        );

    const referencia =
        doc(
            db,
            "notas",
            id
        );

    const snapshot =
        await getDoc(
            referencia
        );

    if (!snapshot.exists()) {

        alert(
            "⚠️ LANÇAMENTO NÃO ENCONTRADO."
        );

        return;
    }

    const dados =
        snapshot.data();

    const notasLancadas =
        Array.isArray(dados.alunos)
            ? dados.alunos
            : [];

    alert(
        "🔥 34 — NOTAS RECEBIDAS: " +
        notasLancadas.length
    );

    if (!notasLista) {

        alert(
            "❌ notasLista NÃO FOI ENCONTRADO!"
        );

        return;
    }

    notasLista.innerHTML = "";

    notasLancadas.forEach(
        (aluno, indice) => {

            const matricula =
                aluno.matricula ||
                aluno.codigoAluno ||
                aluno.numeroMatricula ||
                "";

            const nome =
                aluno.nome ||
                aluno.nomeAluno ||
                "—";

            const sexo =
                aluno.sexo ||
                aluno.Sexo ||
                "—";

            const mac =
                aluno.MAC ??
                aluno.mac ??
                "";

            const npt =
                aluno.NPT ??
                aluno.npt ??
                "";

            const mf =
                aluno.MF ??
                aluno.mf ??
                "";

            const classificacao =
                aluno.classificacao ||
                "";

            const numero =
                aluno.numero ??
                aluno.n ??
                (indice + 1);

            const tr =
                document.createElement("tr");

            tr.innerHTML = `

                <td>
                    ${numero}
                </td>

                <td>
                    ${nome}
                </td>

                <td>
                    ${sexo}
                </td>

                <td>
                    ${matricula}
                </td>

                <td>
                    ${mac}
                </td>

                <td>
                    ${npt}
                </td>

                <td>
                    ${mf}
                </td>

                <td>
                    ${classificacao}
                </td>

            `;

            notasLista.appendChild(tr);

        }
    );

    alert(
        "🔥 35 — TABELA PREENCHIDA!"
    );
}

// =====================================================
// DISCIPLINA → TRIMESTRE
// =====================================================

function prepararTrimestre() {

    if (!filtroTrimestre) return;

    filtroTrimestre.innerHTML = `

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

    `;

    filtroTrimestre.disabled = false;
}


// =====================================================
// TURMA → DISCIPLINAS
// =====================================================

function carregarDisciplinasDaTurma(turmaId) {

    alert(
        "🔥 16 — CARREGAR DISCIPLINAS DA TURMA"
    );

    if (!filtroDisciplina) {

        alert(
            "❌ filtroDisciplina NÃO FOI ENCONTRADO!"
        );

        return;
    }

    filtroDisciplina.innerHTML = `
        <option value="">
            Selecionar disciplina
        </option>
    `;

    filtroDisciplina.disabled = true;

    if (
        !professorSelecionado ||
        !turmaId
    ) {

        return;
    }

    const atribuicoes =
        Array.isArray(
            professorSelecionado.atribuicoes
        )
            ? professorSelecionado.atribuicoes
            : [];

    const disciplinas =
        new Set();

    atribuicoes.forEach(
        atribuicao => {

            const idTurma =
                String(
                    atribuicao.turmaId || ""
                ).trim();

            if (
                idTurma !==
                String(turmaId).trim()
            ) {
                return;
            }

            const disciplina =
                String(
                    atribuicao.disciplina || ""
                ).trim();

            if (disciplina) {

                disciplinas.add(
                    disciplina
                );

            }

        }
    );

    disciplinas.forEach(
        disciplina => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                disciplina;

            option.textContent =
                disciplina;

            filtroDisciplina.appendChild(
                option
            );

        }
    );

    filtroDisciplina.disabled =
        disciplinas.size === 0;

    alert(
        "🔥 17 — DISCIPLINAS COLOCADAS: " +
        disciplinas.size
    );

    console.log(
        "📚 DISCIPLINAS:",
        [...disciplinas]
    );
}


// =====================================================
// CLASSE → TURMA
// =====================================================

filtroClasse?.addEventListener(
    "change",
    function () {

        alert(
            "🔥 18 — CLASSE SELECIONADA: " +
            this.value
        );

        const classe =
            this.value;

        if (!filtroTurma) return;

        filtroTurma.innerHTML = `
            <option value="">
                Selecionar turma
            </option>
        `;

        filtroTurma.disabled = true;

        if (
            !professorSelecionado ||
            !classe
        ) {

            return;
        }

        const atribuicoes =
            Array.isArray(
                professorSelecionado.atribuicoes
            )
                ? professorSelecionado.atribuicoes
                : [];

        const idsTurmas = [
            ...new Set(
                atribuicoes
                    .filter(
                        atribuicao =>
                            String(
                                atribuicao.classe || ""
                            ).trim() ===
                            String(classe).trim()
                    )
                    .map(
                        atribuicao =>
                            atribuicao.turmaId
                    )
                    .filter(Boolean)
            )
        ];

        const encontradas =
            idsTurmas
                .map(
                    id =>
                        turmas.find(
                            turma =>
                                turma.id === id
                        )
                )
                .filter(Boolean);

        encontradas.forEach(
            turma => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    turma.id;

                option.textContent =
                    turma.nome ||
                    turma.turma ||
                    turma.designacao ||
                    "Turma";

                filtroTurma.appendChild(
                    option
                );

            }
        );

        filtroTurma.disabled =
            encontradas.length === 0;

        alert(
            "🔥 19 — TURMAS COLOCADAS: " +
            encontradas.length
        );

    }
);


// =====================================================
// TURMA → DISCIPLINA
// =====================================================

filtroTurma?.addEventListener(
    "change",
    function () {

        alert(
            "🔥 20 — TURMA SELECIONADA: " +
            this.value
        );

        carregarDisciplinasDaTurma(
            this.value
        );

    }
);


// =====================================================
// DISCIPLINA → TRIMESTRE
// =====================================================

filtroDisciplina?.addEventListener(
    "change",
    function () {

        alert(
            "🔥 21 — DISCIPLINA SELECIONADA: " +
            this.value
        );

        if (!this.value) {

            if (filtroTrimestre) {

                filtroTrimestre.innerHTML = `
                    <option value="">
                        Selecionar trimestre
                    </option>
                `;

                filtroTrimestre.disabled =
                    true;
            }

            return;
        }

        prepararTrimestre();

    }
);


// =====================================================
// CRIAR ID DO LANÇAMENTO
// =====================================================

function criarIdLancamento(
    turmaId,
    disciplina,
    trimestre
) {

    const turma =
        String(turmaId || "")
            .trim();

    const materia =
        String(disciplina || "")
            .trim()
            .replace(/\//g, "-")
            .replace(/\s+/g, "_");

    const tri =
        String(trimestre || "")
            .replace("º", "")
            .replace("°", "")
            .replace("ª", "")
            .replace("Trimestre", "")
            .replace(/\s+/g, "")
            .trim();

    return `${turma}_${materia}_${tri}`;
}


// =====================================================
// LER LANÇAMENTO
// =====================================================

async function carregarLancamento() {

    alert(
        "🔥 22 — A PROCURAR LANÇAMENTO"
    );

    const professorId =
        filtroProfessor?.value;

    const classe =
        filtroClasse?.value;

    const turmaId =
        filtroTurma?.value;

    const disciplina =
        filtroDisciplina?.value;

    const trimestre =
        filtroTrimestre?.value;

    if (
        !professorId ||
        !classe ||
        !turmaId ||
        !disciplina ||
        !trimestre
    ) {

        alert(
            "⚠️ FALTAM FILTROS!"
        );

        return;
    }

    const id =
        criarIdLancamento(
            turmaId,
            disciplina,
            trimestre
        );

    alert(
        "🔥 23 — ID:\n\n" +
        id
    );

    try {

        const referencia =
            doc(
                db,
                "notas",
                id
            );

        const snapshot =
            await getDoc(
                referencia
            );

        if (!snapshot.exists()) {

            alert(
                "⚠️ LANÇAMENTO AINDA NÃO EXISTE."
            );

            mostrarTabelaLancamento(
                null
            );

            return;
        }

        const dados =
            snapshot.data();

        alert(
            "🔥 24 — LANÇAMENTO ENCONTRADO!"
        );

        console.log(
            "📦 LANÇAMENTO:",
            dados
        );

        mostrarTabelaLancamento(
            dados
        );

    }
    catch (erro) {

        console.error(
            "❌ ERRO:",
            erro
        );

        alert(
            "❌ ERRO AO LER LANÇAMENTO:\n\n" +
            erro.message
        );
    }
}


// =====================================================
// MOSTRAR TABELA PRINCIPAL
// =====================================================

function mostrarTabelaLancamento(
    dados
) {

    if (!notasLista) return;

    const professor =
        professorSelecionado?.nome ||
        "—";

    const classe =
        filtroClasse?.value ||
        "—";

    const turma =
        turmas.find(
            item =>
                item.id ===
                filtroTurma?.value
        );

    const turmaNome =
        turma?.nome ||
        turma?.turma ||
        turma?.designacao ||
        "—";

    const disciplina =
        filtroDisciplina?.value ||
        "—";

    const trimestre =
        filtroTrimestre?.value ||
        "—";

    const aberto =
        dados?.abertoGeral === true;

    notasLista.innerHTML = `

        <tr>

            <td>
                ${professor}
            </td>

            <td>
                ${classe}
            </td>

            <td>
                ${turmaNome}
            </td>

            <td>
                ${disciplina}
            </td>

            <td>
                ${trimestre}.º
            </td>

            <td>
                ${
                    aberto
                        ? "🟢 Aberto"
                        : "🔒 Fechado"
                }
            </td>

            <td>

                <button
                    type="button"
                    onclick="verLancamento()"
                >
                    👁️ Ver
                </button>

                <button
                    type="button"
                    onclick="baixarLancamento()"
                >
                    ⬇️ Baixar
                </button>

                <button
                    type="button"
                    onclick="imprimirLancamento()"
                >
                    🖨️ Imprimir
                </button>

            </td>

        </tr>

    `;
}


// =====================================================
// EVENTO — TRIMESTRE
// =====================================================

filtroTrimestre?.addEventListener(
    "change",
    async function () {

        alert(
            "🔥 25 — TRIMESTRE SELECIONADO: " +
            this.value
        );

        if (!this.value) return;

        await carregarLancamento();

    }
);

// =====================================================
// INICIAR
// =====================================================

async function iniciarNotas() {

    alert("🔥 7 — ENTROU EM iniciarNotas()");

    try {

       await carregarProfessores();

await carregarTurmas();

preencherProfessores();

alert(
    "🔥 11 — PROFESSORES PREENCHIDOS NO SELECT!"
);

    }
    catch (erro) {

        console.error(
            "❌ ERRO:",
            erro
        );

        alert(
            "❌ ERRO AO CARREGAR:\n\n" +
            erro.message
        );
    }
}


// =====================================================
// INICIAR SISTEMA
// =====================================================

iniciarNotas();
