// =====================================================
// STUDENT.JS — GESTÃO DE ALUNOS
// SGE ANGOLA
// =====================================================

alert("GESTÃO DE ALUNOS CARREGADO");

import { app } from "./firebase.js";

import { lerPDF } from "./pdf-reader.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
    serverTimestamp,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


const db = getFirestore(app);


// =====================================================
// ESCOLA ATUAL
// =====================================================

let escolaId =
    sessionStorage.getItem("escolaId");

if (!escolaId) {

    escolaId =
        localStorage.getItem("escolaId");

}

escolaId =
    escolaId
        ? String(escolaId).trim()
        : "";


// =====================================================
// VERIFICAR ESCOLA
// =====================================================

if (!escolaId) {

    alert(
        "❌ Escola não identificada."
    );

    throw new Error(
        "escolaId não encontrado."
    );

}

console.log(
    "🏫 ESCOLA ATUAL DOS ALUNOS:",
    escolaId
);


// =====================================================
// ELEMENTOS
// =====================================================

const turmaSelect =
    document.getElementById("turmaSelect");

const nomeAluno =
    document.getElementById("nomeAluno");

const numeroAluno =
    document.getElementById("numeroAluno");

const sexoAluno =
    document.getElementById("sexoAluno");

const dataAluno =
    document.getElementById("dataAluno");

const guardarAluno =
    document.getElementById("guardarAluno");

const listaImportar =
    document.getElementById("listaImportar");

const importarAlunos =
    document.getElementById("importarAlunos");

const arquivoPDF =
    document.getElementById("arquivoPDF");

const importarPDF =
    document.getElementById("importarPDF");

const listaAlunos =
    document.getElementById("listaAlunos");

const pesquisarAluno =
    document.getElementById("pesquisarAluno");


// =====================================================
// VARIÁVEIS
// =====================================================

let turmaSelecionada = "";

let todosAlunos = [];


// =====================================================
// CARREGAR TURMAS
// =====================================================

carregarTurmas();


async function carregarTurmas() {

    try {

        turmaSelect.innerHTML =
            "<option>A procurar turmas...</option>";


        const dados = await getDocs(

            query(
                collection(db, "turmas"),
                where(
                    "escolaId",
                    "==",
                    escolaId
                )
            )

        );


        if (dados.empty) {

            turmaSelect.innerHTML =
                "<option>Nenhuma turma encontrada</option>";

            turmaSelecionada = "";

            listaAlunos.innerHTML =
                "Nenhuma turma disponível.";

            return;

        }


        turmaSelect.innerHTML = "";


        dados.forEach(turmaDoc => {

            const turma =
                turmaDoc.data();


            turmaSelect.innerHTML += `

                <option value="${turmaDoc.id}">

                    ${turma.nome} - ${turma.classe}

                </option>

            `;

        });


        turmaSelecionada =
            turmaSelect.value;


        carregarAlunos();


    }

    catch (erro) {

        turmaSelect.innerHTML =
            "<option>Erro ao carregar turmas</option>";


        alert(
            "Erro ao carregar turmas: " +
            erro.message
        );

    }

}


// =====================================================
// ALTERAR TURMA
// =====================================================

turmaSelect.addEventListener(
    "change",
    () => {

        turmaSelecionada =
            turmaSelect.value;


        carregarAlunos();

    }
);


// =====================================================
// GERAR CÓDIGO DO ALUNO
// =====================================================

function gerarCodigoAluno(numero) {

    const turmaTexto =
        turmaSelect
        .options[
            turmaSelect.selectedIndex
        ]
        .text;


    let codigoTurma =
        turmaTexto
        .replace("ª", "")
        .replace(" ", "")
        .split("-")[0];


    return (
        codigoTurma +
        "-" +
        String(numero).padStart(3, "0")
    );

}


// =====================================================
// GERAR SENHA AUTOMÁTICA
// =====================================================

function gerarSenha() {

    const caracteres =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


    let senha = "";


    for (let i = 0; i < 6; i++) {

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
// GUARDAR ALUNO
// =====================================================

guardarAluno.addEventListener(
    "click",
    async () => {

        try {

            if (!turmaSelecionada) {

                alert(
                    "Selecione uma turma."
                );

                return;

            }


            if (
                nomeAluno.value.trim() === "" ||
                numeroAluno.value.trim() === ""
            ) {

                alert(
                    "Preencha o nome e o número do aluno."
                );

                return;

            }


            await addDoc(

                collection(
                    db,
                    "turmas",
                    turmaSelecionada,
                    "alunos"
                ),

                {

                    nome:
                        nomeAluno.value.trim(),

                    numero:
                        numeroAluno.value.trim(),

                    sexo:
                        sexoAluno.value,

                    dataNascimento:
                        dataAluno.value.trim(),

                    turmaId:
                        turmaSelecionada,

                    escolaId:
                        escolaId,

                    turmaNome:
                        turmaSelect
                        .options[
                            turmaSelect.selectedIndex
                        ]
                        .text,

                    codigoAluno:
                        gerarCodigoAluno(
                            numeroAluno.value.trim()
                        ),

                    senhaAcesso:
                        gerarSenha(),

                    estado:
                        "ativo",

                    criadoEm:
                        serverTimestamp()

                }

            );


            alert(
                "Aluno guardado com sucesso!"
            );


            nomeAluno.value = "";

            numeroAluno.value = "";

            sexoAluno.value = "";

            dataAluno.value = "";


            carregarAlunos();

        }

        catch (erro) {

            console.error(
                "Erro ao guardar aluno:",
                erro
            );


            alert(
                "Erro ao guardar aluno: " +
                erro.message
            );

        }

    }
);


// =====================================================
// CALCULAR IDADE
// =====================================================

function calcularIdade(data) {

    if (!data) {

        return "";

    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {

        return "";

    }


    const dia =
        Number(partes[0]);

    const mes =
        Number(partes[1]) - 1;

    const ano =
        Number(partes[2]);


    const nascimento =
        new Date(
            ano,
            mes,
            dia
        );


    const hoje =
        new Date();


    let idade =
        hoje.getFullYear() -
        nascimento.getFullYear();


    const diferencaMes =
        hoje.getMonth() -
        nascimento.getMonth();


    if (
        diferencaMes < 0 ||
        (
            diferencaMes === 0 &&
            hoje.getDate() <
            nascimento.getDate()
        )
    ) {

        idade--;

    }


    return idade;

}


// =====================================================
// CARREGAR ALUNOS
// =====================================================

async function carregarAlunos() {

    if (!turmaSelecionada) {

        return;

    }


    listaAlunos.innerHTML =
        "A carregar alunos...";


    try {

        const dados =
            await getDocs(

                collection(
                    db,
                    "turmas",
                    turmaSelecionada,
                    "alunos"
                )

            );


        let alunos = [];


        dados.forEach(
            alunoDoc => {

                alunos.push(
                    {
                        id: alunoDoc.id,
                        ...alunoDoc.data()
                    }
                );

            }
        );


        alunos.sort(
            (a, b) => {

                return (
                    Number(a.numero) -
                    Number(b.numero)
                );

            }
        );


        todosAlunos =
            alunos;


        listaAlunos.innerHTML = `

            <table>

                <thead>

                    <tr>

                        <th>Código</th>

                        <th>Nº</th>

                        <th>Nome</th>

                        <th>Sexo</th>

                        <th>Data Nascimento</th>

                        <th>Idade</th>

                        <th>Turma</th>

                        <th>Estado</th>

                        <th>Ações</th>

                    </tr>

                </thead>


                <tbody id="corpoTabela">

                </tbody>

            </table>

        `;


        mostrarAlunos(todosAlunos);

    }

    catch (erro) {

        console.error(
            "Erro ao carregar alunos:",
            erro
        );


        listaAlunos.innerHTML =
            "Erro ao carregar alunos.";

        alert(
            "Erro ao carregar alunos: " +
            erro.message
        );

    }

}


// =====================================================
// MOSTRAR ALUNOS
// =====================================================

function mostrarAlunos(lista) {

    const corpoTabela =
        document.getElementById(
            "corpoTabela"
        );


    if (!corpoTabela) {

        return;

    }


    corpoTabela.innerHTML = "";


    if (lista.length === 0) {

        corpoTabela.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="text-align:center;padding:20px;"
                >

                    Nenhum aluno encontrado.

                </td>

            </tr>

        `;

        return;

    }


    lista.forEach(aluno => {

        corpoTabela.innerHTML += `

            <tr>

                <td>
                    ${aluno.codigoAluno || ""}
                </td>

                <td>
                    ${aluno.numero || ""}
                </td>

                <td>
                    ${aluno.nome || ""}
                </td>

                <td>
                    ${aluno.sexo || ""}
                </td>

                <td>
                    ${aluno.dataNascimento || ""}
                </td>

                <td>
                    ${calcularIdade(
                        aluno.dataNascimento
                    )}
                </td>

                <td>
                    ${aluno.turmaNome || ""}
                </td>

                <td>
                    ${aluno.estado || "ativo"}
                </td>

                <td>

                    <button
                        onclick="alterarEstado('${aluno.codigoAluno}')"
                    >
                        ⚙️ Estado
                    </button>


                    <button
                        onclick="verAluno('${aluno.codigoAluno}')"
                    >
                        👁️
                    </button>


                    <button
                        onclick="editarAluno('${aluno.codigoAluno}')"
                    >
                        ✏️
                    </button>


                    <button
                        onclick="apagarAluno('${aluno.codigoAluno}')"
                    >
                        🗑️
                    </button>

                </td>

            </tr>

        `;

    });

}


// =====================================================
// IMPORTAR ALUNOS POR LISTA
// =====================================================

importarAlunos.addEventListener(
    "click",
    async () => {

        try {

            if (!turmaSelecionada) {

                alert(
                    "Selecione uma turma."
                );

                return;

            }


            const texto =
                listaImportar.value.trim();


            if (texto === "") {

                alert(
                    "Cole a lista de alunos."
                );

                return;

            }


            const linhas =
                texto.split("\n");


            let quantidadeImportada = 0;


            for (
                const linha of linhas
            ) {

                const dados =
                    linha.split(";");


                if (dados.length < 4) {

                    continue;

                }


                await addDoc(

                    collection(
                        db,
                        "turmas",
                        turmaSelecionada,
                        "alunos"
                    ),

                    {

                        numero:
                            dados[0].trim(),

                        nome:
                            dados[1].trim(),

                        sexo:
                            dados[2].trim(),

                        dataNascimento:
                            dados[3].trim(),

                        turmaId:
                            turmaSelecionada,

                        escolaId:
                            escolaId,

                        turmaNome:
                            turmaSelect
                            .options[
                                turmaSelect.selectedIndex
                            ]
                            .text,

                        codigoAluno:
                            gerarCodigoAluno(
                                dados[0].trim()
                            ),

                        senhaAcesso:
                            gerarSenha(),

                        estado:
                            "ativo",

                        criadoEm:
                            serverTimestamp()

                    }

                );


                quantidadeImportada++;

            }


            alert(
                quantidadeImportada +
                " aluno(s) importado(s) com sucesso!"
            );


            listaImportar.value = "";


            carregarAlunos();

        }

        catch (erro) {

            console.error(
                "Erro na importação:",
                erro
            );


            alert(
                "Erro ao importar alunos: " +
                erro.message
            );

        }

    }
);


// =====================================================
// IMPORTAR ALUNOS PELO PDF
// =====================================================

importarPDF.addEventListener(
    "click",
    async () => {

        if (!turmaSelecionada) {

            alert(
                "Selecione uma turma."
            );

            return;

        }


        const file =
            arquivoPDF.files[0];


        if (!file) {

            alert(
                "Selecione um PDF."
            );

            return;

        }


        try {

            alert(
                "A ler PDF..."
            );


            const resultado =
                await lerPDF(file);


            if (
                !resultado ||
                !resultado.alunos
            ) {

                throw new Error(
                    "Não foi possível obter os alunos do PDF."
                );

            }


            alert(
                "Alunos encontrados: " +
                resultado.quantidade
            );


            for (
                const aluno of resultado.alunos
            ) {

                await addDoc(

                    collection(
                        db,
                        "turmas",
                        turmaSelecionada,
                        "alunos"
                    ),

                    {

                        numero:
                            aluno.numero,

                        nome:
                            aluno.nome,

                        sexo:
                            aluno.sexo || "",

                        turmaId:
                            turmaSelecionada,

                        escolaId:
                            escolaId,

                        turmaNome:
                            turmaSelect
                            .options[
                                turmaSelect.selectedIndex
                            ]
                            .text,

                        codigoAluno:
                            gerarCodigoAluno(
                                aluno.numero
                            ),

                        senhaAcesso:
                            gerarSenha(),

                        estado:
                            "ativo",

                        criadoEm:
                            serverTimestamp()

                    }

                );

            }


            alert(
                "Importação concluída com sucesso!"
            );


            carregarAlunos();

        }

        catch (erro) {

            console.error(
                "Erro ao importar PDF:",
                erro
            );


            alert(
                "Erro ao importar PDF: " +
                erro.message
            );

        }

    }
);


// =====================================================
// PESQUISAR ALUNOS
// =====================================================

pesquisarAluno.addEventListener(
    "input",
    () => {

        const texto =
            pesquisarAluno.value
            .toLowerCase();


        const resultado =
            todosAlunos.filter(
                aluno =>

                    (
                        aluno.nome || ""
                    )
                    .toLowerCase()
                    .includes(texto)

                    ||

                    String(
                        aluno.numero
                    )
                    .includes(texto)

                    ||

                    (
                        aluno.codigoAluno || ""
                    )
                    .toLowerCase()
                    .includes(texto)

            );


        mostrarAlunos(resultado);

    }
);


// =====================================================
// ALTERAR ESTADO
// =====================================================

window.alterarEstado =
    async function(codigo) {

        const opcao =
            prompt(

                "Digite o novo estado:\n\n" +

                "1 - ativo\n" +

                "2 - transferido\n" +

                "3 - desistiu\n" +

                "4 - removido"

            );


        let novoEstado = "";


        if (opcao === "1") {

            novoEstado = "ativo";

        }

        else if (opcao === "2") {

            novoEstado = "transferido";

        }

        else if (opcao === "3") {

            novoEstado = "desistiu";

        }

        else if (opcao === "4") {

            novoEstado = "removido";

        }

        else {

            return;

        }


        const turmas =
            await getDocs(
                query(
                    collection(db, "turmas"),
                    where(
                        "escolaId",
                        "==",
                        escolaId
                    )
                )
            );


        for (
            const turma of turmas.docs
        ) {

            const alunos =
                await getDocs(

                    collection(
                        db,
                        "turmas",
                        turma.id,
                        "alunos"
                    )

                );


            for (
                const aluno of alunos.docs
            ) {

                if (
                    aluno.data()
                    .codigoAluno === codigo
                ) {

                    const motivo =
                        prompt(
                            "Digite o motivo da alteração:"
                        );


                    await updateDoc(

                        doc(
                            db,
                            "turmas",
                            turma.id,
                            "alunos",
                            aluno.id
                        ),

                        {

                            estado:
                                novoEstado,

                            motivoEstado:
                                motivo || "",

                            dataEstado:
                                serverTimestamp()

                        }

                    );


                    alert(
                        "Estado atualizado com sucesso."
                    );


                    carregarAlunos();


                    return;

                }

            }

        }

    };


// =====================================================
// VER DETALHES DO ALUNO
// =====================================================

window.verAluno =
    async function(codigo) {

        const turmas =
            await getDocs(

                query(
                    collection(db, "turmas"),
                    where(
                        "escolaId",
                        "==",
                        escolaId
                    )
                )

            );


        for (
            const turma of turmas.docs
        ) {

            const alunos =
                await getDocs(

                    collection(
                        db,
                        "turmas",
                        turma.id,
                        "alunos"
                    )

                );


            for (
                const aluno of alunos.docs
            ) {

                const dados =
                    aluno.data();


                if (
                    dados.codigoAluno === codigo
                ) {

                    alert(

`Código: ${dados.codigoAluno}

Nome: ${dados.nome}

Número: ${dados.numero}

Sexo: ${dados.sexo || ""}

Data nascimento: ${dados.dataNascimento || ""}

Turma: ${dados.turmaNome || ""}

Estado: ${dados.estado || "ativo"}

Senha: ${dados.senhaAcesso || ""}`

                    );


                    return;

                }

            }

        }

    };


// =====================================================
// EDITAR ALUNO
// =====================================================

window.editarAluno =
    async function(codigo) {

        const turmas =
            await getDocs(

                query(
                    collection(db, "turmas"),
                    where(
                        "escolaId",
                        "==",
                        escolaId
                    )
                )

            );


        for (
            const turma of turmas.docs
        ) {

            const alunos =
                await getDocs(

                    collection(
                        db,
                        "turmas",
                        turma.id,
                        "alunos"
                    )

                );


            for (
                const aluno of alunos.docs
            ) {

                const dados =
                    aluno.data();


                if (
                    dados.codigoAluno === codigo
                ) {

                    const novoNome =
                        prompt(
                            "Nome do aluno:",
                            dados.nome
                        );


                    if (novoNome === null) {

                        return;

                    }


                    const novoNumero =
                        prompt(
                            "Número do aluno:",
                            dados.numero
                        );


                    if (novoNumero === null) {

                        return;

                    }


                    const novoSexo =
                        prompt(
                            "Sexo:",
                            dados.sexo || ""
                        );


                    if (novoSexo === null) {

                        return;

                    }


                    const novaData =
                        prompt(
                            "Data de nascimento:",
                            dados.dataNascimento || ""
                        );


                    if (novaData === null) {

                        return;

                    }


                    await updateDoc(

                        doc(
                            db,
                            "turmas",
                            turma.id,
                            "alunos",
                            aluno.id
                        ),

                        {

                            nome:
                                novoNome,

                            numero:
                                novoNumero,

                            sexo:
                                novoSexo,

                            dataNascimento:
                                novaData

                        }

                    );


                    alert(
                        "Aluno atualizado com sucesso."
                    );


                    carregarAlunos();


                    return;

                }

            }

        }

    };


// =====================================================
// APAGAR ALUNO
// APENAS DUPLICADOS OU ERROS
// =====================================================

window.apagarAluno =
    async function(codigo) {

        const confirmar =
            confirm(

                "Tem certeza que deseja remover este aluno?\n\n" +

                "Use esta opção apenas para duplicados " +
                "ou erros de cadastro."

            );


        if (!confirmar) {

            return;

        }


        const turmas =
            await getDocs(

                query(
                    collection(db, "turmas"),
                    where(
                        "escolaId",
                        "==",
                        escolaId
                    )
                )

            );


        for (
            const turma of turmas.docs
        ) {

            const alunos =
                await getDocs(

                    collection(
                        db,
                        "turmas",
                        turma.id,
                        "alunos"
                    )

                );


            for (
                const aluno of alunos.docs
            ) {

                const dados =
                    aluno.data();


                if (
                    dados.codigoAluno === codigo
                ) {

                    await deleteDoc(

                        doc(
                            db,
                            "turmas",
                            turma.id,
                            "alunos",
                            aluno.id
                        )

                    );


                    alert(
                        "Aluno removido com sucesso."
                    );


                    carregarAlunos();


                    return;

                }

            }

        }

    };


// =====================================================
// INICIALIZAÇÃO
// =====================================================

carregarTurmas();
                       
