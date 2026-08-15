// =====================================================
// TEACHERS.JS — GESTÃO DE PROFESSORES
// SGE ANGOLA
// =====================================================

import { db } from "./firebase.js";

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
// ID DA ESCOLA ATUAL
// =====================================================

const escolaId =
    sessionStorage.getItem("escolaId") ||
    localStorage.getItem("escolaId") ||
    "YNY5XygXQqQfcPfIyK62";


// =====================================================
// CAMPOS
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
// VERIFICAR ELEMENTOS
// =====================================================

if (!nomeProfessor) {
    console.error("Campo nomeProfessor não encontrado.");
}

if (!nivelEnsino) {
    console.error("Campo nivelEnsino não encontrado.");
}

if (!listaTurmas) {
    console.error("Campo listaTurmas não encontrado.");
}

if (!listaAtribuicoes) {
    console.error("Campo listaAtribuicoes não encontrado.");
}

if (!guardarProfessor) {
    console.error("Botão guardarProfessor não encontrado.");
}

if (!tabelaProfessores) {
    console.error("Tabela tabelaProfessores não encontrada.");
}


// =====================================================
// VARIÁVEIS
// =====================================================

let turmas = [];

let atribuicoes = [];


// =====================================================
// GERAR CÓDIGO DO PROFESSOR
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

    for (let i = 0; i < 6; i++) {

        senha += caracteres.charAt(
            Math.floor(
                Math.random() *
                caracteres.length
            )
        );

    }

    return senha;

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
            "Selecione o nível";
    }

    if (listaAtribuicoes) {
        listaAtribuicoes.innerHTML =
            "Selecione uma turma";
    }

    atribuicoes = [];

}


// =====================================================
// CARREGAR TURMAS DO NÍVEL SELECIONADO
// =====================================================

if (nivelEnsino) {

    nivelEnsino.addEventListener(
        "change",
        async () => {

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

    listaTurmas.innerHTML =
        "A carregar turmas...";

    if (listaAtribuicoes) {

        listaAtribuicoes.innerHTML =
            "Selecione uma turma";

    }

    turmas = [];

    atribuicoes = [];


    try {

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


        listaTurmas.innerHTML = "";


        snapshot.forEach(
            docSnap => {

                const turma = {

                    id: docSnap.id,

                    ...docSnap.data()

                };


                if (
                    turma.ensino ===
                    nivelEnsino.value
                ) {

                    turmas.push(
                        turma
                    );

                }

            }
        );


        if (turmas.length === 0) {

            listaTurmas.innerHTML =
                "Nenhuma turma encontrada.";

            return;

        }


        turmas.forEach(
            turma => {

                listaTurmas.innerHTML += `

                    <div class="checkBox">

                        <label>

                            <input
                                type="checkbox"
                                class="turmaCheck"
                                value="${turma.id}"
                            >

                            <b>
                                ${turma.nome || ""}
                            </b>

                            (${turma.classe || ""})

                        </label>

                    </div>

                `;

            }
        );


        document
            .querySelectorAll(
                ".turmaCheck"
            )
            .forEach(
                check => {

                    check.addEventListener(
                        "change",
                        carregarAtribuicoes
                    );

                }
            );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar turmas:",
            erro
        );

        listaTurmas.innerHTML =
            "Erro ao carregar turmas.";

    }

}


// =====================================================
// CARREGAR ATRIBUIÇÕES
// =====================================================

async function carregarAtribuicoes() {

    if (!listaAtribuicoes) {
        return;
    }

    listaAtribuicoes.innerHTML = "";

    atribuicoes = [];


    const selecionadas =
        document.querySelectorAll(
            ".turmaCheck:checked"
        );


    if (selecionadas.length === 0) {

        listaAtribuicoes.innerHTML =
            "Selecione uma turma.";

        return;

    }


    for (
        const check
        of selecionadas
    ) {

        const turmaId =
            check.value;


        const turmaRef =
            doc(
                db,
                "turmas",
                turmaId
            );


        const turmaSnap =
            await getDoc(
                turmaRef
            );


        if (!turmaSnap.exists()) {
            continue;
        }


        const turma =
            turmaSnap.data();


        listaAtribuicoes.innerHTML += `

            <div class="section">

                <h3>
                    ${turma.nome || ""}
                </h3>

        `;


        const disciplinas =
            Array.isArray(
                turma.disciplinas
            )
                ? turma.disciplinas
                : [];


        if (disciplinas.length === 0) {

            listaAtribuicoes.innerHTML += `

                <p>
                    Nenhuma disciplina encontrada nesta turma.
                </p>

            `;

        }


        disciplinas.forEach(
            disciplina => {

                listaAtribuicoes.innerHTML += `

                    <label>

                        <input
                            type="checkbox"
                            class="disciplinaCheck"
                            data-turma="${turmaId}"
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


    document
        .querySelectorAll(
            ".disciplinaCheck"
        )
        .forEach(
            item => {

                item.addEventListener(
                    "change",
                    atualizarAtribuicoes
                );

            }
        );

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
            disciplina => {

                atribuicoes.push({

                    turmaId:
                        disciplina.dataset.turma || "",

                    turmaNome:
                        disciplina.dataset.turmanome || "",

                    classe:
                        disciplina.dataset.classe || "",

                    disciplina:
                        disciplina.value || ""

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


            // =========================================
            // VALIDAÇÃO
            // =========================================

            if (!nome) {

                alert(
                    "Informe o nome do professor."
                );

                return;

            }


            if (!ensino) {

                alert(
                    "Selecione o nível de ensino."
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


                // =====================================
                // BUSCAR PROFESSORES DA ESCOLA
                // =====================================

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


                // =====================================
                // DADOS DO PROFESSOR
                // =====================================

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


                // =====================================
                // GUARDAR
                // =====================================

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
// LISTAR PROFESSORES DA ESCOLA
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


        if (dados.empty) {

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
                            atribuicao => {

                                lista +=
                                    `${atribuicao.turmaNome || ""} - ${atribuicao.disciplina || ""}<br>`;

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
                            ${professor.ensino || ""}
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


            const p =
                resultado.data();


            // Segurança: professor pertence à escola atual

            if (
                p.escolaId !==
                escolaId
            ) {

                alert(
                    "Este professor não pertence a esta escola."
                );

                return;

            }


            let texto =

`Código:
${p.codigoProfessor || ""}

Nome:
${p.nome || ""}

Email:
${p.email || ""}

Ensino:
${p.ensino || ""}

Estado:
${p.estado || "ativo"}

Senha:
${p.senhaAcesso || ""}

Atribuições:
`;


            if (
                Array.isArray(
                    p.atribuicoes
                )
            ) {

                p.atribuicoes
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

carregarProfessores();
