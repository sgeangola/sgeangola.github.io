// =====================================================
// TEACHERS.JS — GESTÃO DE PROFESSORES
// SGE ANGOLA
// =====================================================

alert("GESTÃO DE PROFESSORES CARREGADO");

import {
    db,
    auth
} from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


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
// VERIFICAR ESCOLA
// =====================================================

if (!escolaId) {

    alert(
        "❌ Escola atual não identificada. Entre novamente na escola."
    );

    throw new Error(
        "escolaId não encontrado."
    );

    }

// =====================================================
// ELEMENTOS
// =====================================================

const nomeProfessor =
    document.getElementById("nomeProfessor");

const emailProfessor =
    document.getElementById("emailProfessor");

const nivelEnsino =
    document.getElementById("nivelEnsino");

const listaTurmas =
    document.getElementById("listaTurmas");

const listaAtribuicoes =
    document.getElementById("listaAtribuicoes");

const guardarProfessor =
    document.getElementById("guardarProfessor");

const tabelaProfessores =
    document.getElementById("tabelaProfessores");


// =====================================================
// VARIÁVEIS
// =====================================================

let turmas = [];

let atribuicoes = [];

let ensinosDaEscola = [];


// =====================================================
// NOMES DOS ENSINOS
// =====================================================

function nomeEnsino(ensino) {

    if (
        ensino ===
        "ensinoPrimario"
    ) {

        return "Ensino Primário";

    }


    if (
        ensino ===
        "primeiroCiclo"
    ) {

        return "Primeiro Ciclo";

    }


    return ensino;

}


// =====================================================
// GERAR CÓDIGO PROFESSOR
// =====================================================

function gerarCodigoProfessor(numero) {

    return "PROF-" +
        String(numero).padStart(3, "0");

}


// =====================================================
// GERAR SENHA
// =====================================================

function gerarSenha() {

    const caracteres =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let senha = "";

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        senha +=
            caracteres.charAt(
                Math.floor(
                    Math.random() *
                    caracteres.length
                )
            );

    }

    return senha;

}


// =====================================================
// CARREGAR ENSINOS DA ESCOLA
// =====================================================

async function carregarEnsinosDaEscola() {

    try {

        if (!nivelEnsino) {
            return;
        }


        nivelEnsino.innerHTML = `

            <option value="">
                A carregar ensinos...
            </option>

        `;


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

            nivelEnsino.innerHTML = `

                <option value="">
                    Escola não encontrada
                </option>

            `;

            return;

        }


        const dados =
            resultado.data();


        ensinosDaEscola =
            Array.isArray(
                dados.ensinos
            )
                ? dados.ensinos
                : [];


        console.log(
            "ENSINOS DA ESCOLA:",
            ensinosDaEscola
        );


        // =============================================
        // NENHUM ENSINO
        // =============================================

        if (
            ensinosDaEscola.length === 0
        ) {

            nivelEnsino.innerHTML = `

                <option value="">
                    Nenhum ensino configurado
                </option>

            `;

            return;

        }


        // =============================================
        // PREENCHER SELECT
        // =============================================

        nivelEnsino.innerHTML = `

            <option value="">
                Selecionar ensino
            </option>

        `;


        ensinosDaEscola.forEach(
            ensino => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    ensino;


                option.textContent =
                    nomeEnsino(
                        ensino
                    );


                nivelEnsino.appendChild(
                    option
                );

            }
        );


    }

    catch (erro) {

        console.error(
            "Erro ao carregar ensinos:",
            erro
        );


        nivelEnsino.innerHTML = `

            <option value="">
                Erro ao carregar ensino
            </option>

        `;

    }

}


// =====================================================
// ALTERAR ENSINO
// =====================================================

if (nivelEnsino) {

    nivelEnsino.addEventListener(
        "change",
        async () => {

            atribuicoes = [];

            if (listaAtribuicoes) {

                listaAtribuicoes.innerHTML =
                    "Selecione uma turma.";

            }


            await carregarTurmas();

        }
    );

}


// =====================================================
// CARREGAR TURMAS
// =====================================================

async function carregarTurmas() {

    if (!listaTurmas) {
        return;
    }

    const ensinoSelecionado =
        String(nivelEnsino.value || "").trim();

    listaTurmas.innerHTML =
        "A carregar turmas...";

    turmas = [];
    atribuicoes = [];

    if (!ensinoSelecionado) {

        listaTurmas.innerHTML =
            "Selecione o nível de ensino.";

        return;
    }

    try {

        console.log(
            "🏫 ESCOLA:",
            escolaId
        );

        console.log(
            "📚 ENSINO SELECIONADO:",
            ensinoSelecionado
        );

        // =================================================
        // BUSCAR TODAS AS TURMAS DA ESCOLA
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

        const snapshot =
            await getDocs(
                consulta
            );

        console.log(
            "📦 TOTAL DE TURMAS DA ESCOLA:",
            snapshot.size
        );

        // =================================================
        // FILTRAR O ENSINO
        // =================================================

        snapshot.forEach(
            turmaDoc => {

                const dados =
                    turmaDoc.data();

                const ensinoTurma =
                    String(
                        dados.ensino ||
                        ""
                    ).trim();

                console.log(
                    "TURMA:",
                    dados.nome,
                    "| ENSINO:",
                    ensinoTurma
                );

                // Aceitar somente o ensino selecionado
                if (
                    ensinoTurma ===
                    ensinoSelecionado
                ) {

                    turmas.push({

                        id:
                            turmaDoc.id,

                        ...dados

                    });

                }

            }
        );

        console.log(
            "✅ TURMAS DO ENSINO:",
            turmas
        );

        listaTurmas.innerHTML = "";

        // =================================================
        // NENHUMA TURMA
        // =================================================

        if (
            turmas.length === 0
        ) {

            listaTurmas.innerHTML = `

                <div
                    style="
                        padding:10px;
                        color:#64748b;
                    "
                >
                    Nenhuma turma encontrada
                    para ${nomeEnsino(ensinoSelecionado)}.
                </div>

            `;

            return;
        }

        // =================================================
        // MOSTRAR TURMAS
        // =================================================

        turmas.forEach(
            turma => {

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "checkBox";

                const label =
                    document.createElement(
                        "label"
                    );

                const checkbox =
                    document.createElement(
                        "input"
                    );

                checkbox.type =
                    "checkbox";

                checkbox.className =
                    "turmaCheck";

                checkbox.value =
                    turma.id;

                const texto =
                    document.createElement(
                        "span"
                    );

                texto.innerHTML =
                    `<b>${turma.nome || ""}</b>` +
                    (
                        turma.classe
                            ? ` (${turma.classe})`
                            : ""
                    );

                label.appendChild(
                    checkbox
                );

                label.appendChild(
                    texto
                );

                div.appendChild(
                    label
                );

                listaTurmas.appendChild(
                    div
                );

                checkbox.addEventListener(
                    "change",
                    carregarAtribuicoes
                );

            }
        );

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO CARREGAR TURMAS:",
            erro
        );

        listaTurmas.innerHTML = `

            <div
                style="
                    color:#dc2626;
                    padding:10px;
                "
            >
                Erro ao carregar turmas.
            </div>

        `;

    }

}


// =====================================================
// CARREGAR ATRIBUIÇÕES
// =====================================================

async function carregarAtribuicoes() {

    if (!listaAtribuicoes) {
        return;
    }


    listaAtribuicoes.innerHTML =
        "A carregar disciplinas...";


    atribuicoes = [];


    const selecionadas =
        document.querySelectorAll(
            ".turmaCheck:checked"
        );


    if (
        selecionadas.length === 0
    ) {

        listaAtribuicoes.innerHTML =
            "Selecione uma turma.";

        return;

    }


    listaAtribuicoes.innerHTML = "";


    for (
        const check
        of selecionadas
    ) {

        const turmaId =
            check.value;


        const turma =
            turmas.find(
                item =>
                    item.id ===
                    turmaId
            );


        if (!turma) {
            continue;
        }


        // =============================================
        // SEGURANÇA
        // =============================================

        if (
            turma.escolaId !==
            escolaId
        ) {

            continue;

        }


        if (
            turma.ensino !==
            nivelEnsino.value
        ) {

            continue;

        }


        const disciplinas =
            Array.isArray(
                turma.disciplinas
            )
                ? turma.disciplinas
                : [];


        listaAtribuicoes.innerHTML += `

            <div
                class="section"
                style="
                    margin-bottom:15px;
                    padding:12px;
                    border:1px solid #e2e8f0;
                    border-radius:8px;
                "
            >

                <h3>
                    ${turma.nome || ""}
                </h3>

        `;


        // =============================================
        // SEM DISCIPLINAS
        // =============================================

        if (
            disciplinas.length === 0
        ) {

            listaAtribuicoes.innerHTML += `

                <p>
                    Nenhuma disciplina configurada
                    nesta turma.
                </p>

            `;

        }


        // =============================================
        // DISCIPLINAS
        // =============================================

        disciplinas.forEach(
            disciplina => {

                listaAtribuicoes.innerHTML += `

                    <label>

                        <input
                            type="checkbox"
                            class="disciplinaCheck"

                            data-turma="${turma.id}"

                            data-turmanome="${turma.nome || ""}"

                            data-classe="${turma.classe || ""}"

                            value="${disciplina}"
                        >

                        ${disciplina}

                    </label>

                    <br>

                `;

            }
        );


        listaAtribuicoes.innerHTML += `

            </div>

        `;

    }


    // =============================================
    // EVENTOS DAS DISCIPLINAS
    // =============================================

    document
        .querySelectorAll(
            ".disciplinaCheck"
        )
        .forEach(
            checkbox => {

                checkbox.addEventListener(
                    "change",
                    atualizarAtribuicoes
                );

            }
        );


    atualizarAtribuicoes();

}


// =====================================================
// ATUALIZAR ATRIBUIÇÕES
// =====================================================

function atualizarAtribuicoes() {

    atribuicoes = [];


    document
        .querySelectorAll(
            ".disciplinaCheck:checked"
        )
        .forEach(
            checkbox => {

                atribuicoes.push({

                    turmaId:
                        checkbox.dataset.turma,

                    turmaNome:
                        checkbox.dataset.turmanome,

                    classe:
                        checkbox.dataset.classe,

                    disciplina:
                        checkbox.value

                });

            }
        );

}


// =====================================================
// GUARDAR PROFESSOR
// =====================================================

if (guardarProfessor) {

    guardarProfessor.addEventListener(
        "click",
        async () => {

            const nome =
                nomeProfessor.value.trim();


            const email =
                emailProfessor
                    ? emailProfessor.value.trim()
                    : "";


            const ensino =
                nivelEnsino.value;


            // =============================================
            // VALIDAÇÕES
            // =============================================

            if (!nome) {

                alert(
                    "Informe o nome do professor."
                );

                return;

            }


            if (!ensino) {

                alert(
                    "Selecione o ensino."
                );

                return;

            }


            // =============================================
            // GARANTIR QUE O ENSINO PERTENCE À ESCOLA
            // =============================================

            if (
                !ensinosDaEscola.includes(
                    ensino
                )
            ) {

                alert(
                    "O ensino selecionado não pertence a esta escola."
                );

                return;

            }


            atualizarAtribuicoes();


            if (
                atribuicoes.length === 0
            ) {

                alert(
                    "Selecione pelo menos uma disciplina."
                );

                return;

            }


            try {

                guardarProfessor.disabled =
                    true;


                guardarProfessor.textContent =
                    "A guardar...";


                // =============================================
                // PROFESSORES DA ESCOLA
                // =============================================

                const consulta =
                    query(

                        collection(
                            db,
                            "professores"
                        ),

                        where(
                            "escolaId",
                            "==",
                            escolaId
                        )

                    );


                const professores =
                    await getDocs(
                        consulta
                    );


                const numero =
                    professores.size + 1;


                const codigo =
                    gerarCodigoProfessor(
                        numero
                    );


                const senha =
                    gerarSenha();


                // =============================================
                // DADOS
                // =============================================

                const dadosProfessor = {

                    escolaId:
                        escolaId,

                    codigoProfessor:
                        codigo,

                    senhaAcesso:
                        senha,

                    nome:
                        nome,

                    email:
                        email,

                    ensino:
                        ensino,

                    atribuicoes:
                        atribuicoes,

                    ativo:
                        true,

                    estado:
                        "ativo",

                    criadoEm:
                        serverTimestamp()

                };


                // =============================================
                // GRAVAR
                // =============================================

                await addDoc(

                    collection(
                        db,
                        "professores"
                    ),

                    dadosProfessor

                );


                alert(
                    `Professor cadastrado com sucesso!

Código:
${codigo}

Senha:
${senha}`
                );


                limparFormulario();


                await carregarProfessores();

            }

            catch (erro) {

                console.error(
                    "Erro ao guardar professor:",
                    erro
                );


                alert(
                    "Erro ao guardar professor:\n\n" +
                    erro.message
                );

            }

            finally {

                guardarProfessor.disabled =
                    false;

                guardarProfessor.textContent =
                    "Guardar Professor";

            }

        }
    );

}


// =====================================================
// LIMPAR FORMULÁRIO
// =====================================================

function limparFormulario() {

    if (nomeProfessor) {

        nomeProfessor.value = "";

    }


    if (emailProfessor) {

        emailProfessor.value = "";

    }


    if (nivelEnsino) {

        nivelEnsino.value = "";

    }


    if (listaTurmas) {

        listaTurmas.innerHTML =
            "Selecione o ensino.";

    }


    if (listaAtribuicoes) {

        listaAtribuicoes.innerHTML =
            "Selecione uma turma.";

    }


    atribuicoes = [];

}


// =====================================================
// LISTAR PROFESSORES
// =====================================================

async function carregarProfessores() {

    if (!tabelaProfessores) {
        return;
    }


    tabelaProfessores.innerHTML = `

        <tr>

            <td colspan="7">

                A carregar professores...

            </td>

        </tr>

    `;


    try {

        const consulta =
            query(

                collection(
                    db,
                    "professores"
                ),

                where(
                    "escolaId",
                    "==",
                    escolaId
                )

            );


        const dados =
            await getDocs(
                consulta
            );


        tabelaProfessores.innerHTML = "";


        if (
            dados.empty
        ) {

            tabelaProfessores.innerHTML = `

                <tr>

                    <td colspan="7">

                        Nenhum professor cadastrado.

                    </td>

                </tr>

            `;

            return;

        }


        dados.forEach(
            item => {

                const professor =
                    item.data();


                let lista =
                    "";


                if (
                    Array.isArray(
                        professor.atribuicoes
                    )
                ) {

                    professor
                        .atribuicoes
                        .forEach(
                            a => {

                                lista +=
                                    `${a.turmaNome || ""} - ${a.disciplina || ""}<br>`;

                            }
                        );

                }


                tabelaProfessores.innerHTML += `

                    <tr>

                        <td>
                            ${professor.codigoProfessor || ""}
                        </td>

                        <td>
                            ${professor.nome || ""}
                        </td>

                        <td>
                            ${professor.email || ""}
                        </td>

                        <td>
                            ${nomeEnsino(
                                professor.ensino
                            )}
                        </td>

                        <td>
                            ${lista}
                        </td>

                        <td>
                            ${professor.senhaAcesso || ""}
                        </td>

                        <td>

                            <button
                                onclick="verProfessor('${item.id}')"
                            >
                                👁️
                            </button>

                            <button
                                onclick="editarProfessor('${item.id}')"
                            >
                                ✏️
                            </button>

                            <button
                                onclick="apagarProfessor('${item.id}')"
                            >
                                🗑️
                            </button>

                        </td>

                    </tr>

                `;

            }
        );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar professores:",
            erro
        );


        tabelaProfessores.innerHTML = `

            <tr>

                <td colspan="7">

                    ❌ Erro ao carregar professores:

                    ${erro.message}

                </td>

            </tr>

        `;

    }

}


// =====================================================
// VER PROFESSOR
// =====================================================

window.verProfessor =
    async function(id) {

        try {

            const referencia =
                doc(
                    db,
                    "professores",
                    id
                );


            const resultado =
                await getDoc(
                    referencia
                );


            if (!resultado.exists()) {

                alert(
                    "Professor não encontrado."
                );

                return;

            }


            const professor =
                resultado.data();


            if (
                professor.escolaId !==
                escolaId
            ) {

                alert(
                    "Este professor não pertence a esta escola."
                );

                return;

            }


            let texto =

`Código:
${professor.codigoProfessor || ""}

Nome:
${professor.nome || ""}

Email:
${professor.email || ""}

Ensino:
${nomeEnsino(
    professor.ensino
)}

Estado:
${professor.estado || "ativo"}

Senha:
${professor.senhaAcesso || ""}

Atribuições:
`;


            if (
                Array.isArray(
                    professor.atribuicoes
                )
            ) {

                professor
                    .atribuicoes
                    .forEach(
                        a => {

                            texto +=
                                `\n${a.turmaNome || ""} - ${a.disciplina || ""}`;

                        }
                    );

            }


            alert(texto);

        }

        catch (erro) {

            console.error(
                erro
            );


            alert(
                "Erro ao visualizar professor:\n\n" +
                erro.message
            );

        }

    };


// =====================================================
// APAGAR PROFESSOR
// =====================================================

window.apagarProfessor =
    async function(id) {

        const confirmar =
            confirm(
                "Tem certeza que deseja apagar este professor?"
            );


        if (!confirmar) {
            return;
        }


        try {

            const referencia =
                doc(
                    db,
                    "professores",
                    id
                );


            const resultado =
                await getDoc(
                    referencia
                );


            if (!resultado.exists()) {

                alert(
                    "Professor não encontrado."
                );

                return;

            }


            const professor =
                resultado.data();


            if (
                professor.escolaId !==
                escolaId
            ) {

                alert(
                    "Este professor não pertence a esta escola."
                );

                return;

            }


            await deleteDoc(
                referencia
            );


            alert(
                "Professor apagado com sucesso."
            );


            await carregarProfessores();

        }

        catch (erro) {

            console.error(
                "Erro ao apagar professor:",
                erro
            );


            alert(
                "Erro ao apagar professor:\n\n" +
                erro.message
            );

        }

    };


// =====================================================
// EDITAR PROFESSOR
// =====================================================

window.editarProfessor =
    async function(id) {

        try {

            const referencia =
                doc(
                    db,
                    "professores",
                    id
                );


            const resultado =
                await getDoc(
                    referencia
                );


            if (!resultado.exists()) {

                alert(
                    "Professor não encontrado."
                );

                return;

            }


            const professor =
                resultado.data();


            if (
                professor.escolaId !==
                escolaId
            ) {

                alert(
                    "Este professor não pertence a esta escola."
                );

                return;

            }


            const novoNome =
                prompt(
                    "Novo nome:",
                    professor.nome || ""
                );


            if (!novoNome) {
                return;
            }


            const novoEmail =
                prompt(
                    "Novo e-mail:",
                    professor.email || ""
                );


            await updateDoc(

                referencia,

                {

                    nome:
                        novoNome.trim(),

                    email:
                        novoEmail
                            ? novoEmail.trim()
                            : ""

                }

            );


            alert(
                "Professor atualizado com sucesso."
            );


            await carregarProfessores();

        }

        catch (erro) {

            console.error(
                "Erro ao editar professor:",
                erro
            );


            alert(
                "Erro ao editar professor:\n\n" +
                erro.message
            );

        }

    };


// =====================================================
// INICIAR
// =====================================================

