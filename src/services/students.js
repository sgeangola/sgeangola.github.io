// =====================================================
// STUDENT.JS — GESTÃO DE ALUNOS
// SGE ANGOLA
// =====================================================

alert("GESTÃO DE ALUNOS CARREGADO ✅");


// =====================================================
// FIREBASE
// =====================================================

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
    setDoc,
    serverTimestamp,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


const db =
    getFirestore(app);


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
    document.getElementById(
        "turmaSelect"
    );


const nomeAluno =
    document.getElementById(
        "nomeAluno"
    );


const numeroAluno =
    document.getElementById(
        "numeroAluno"
    );


const sexoAluno =
    document.getElementById(
        "sexoAluno"
    );


const dataAluno =
    document.getElementById(
        "dataAluno"
    );


const guardarAluno =
    document.getElementById(
        "guardarAluno"
    );


const listaImportar =
    document.getElementById(
        "listaImportar"
    );


const importarAlunos =
    document.getElementById(
        "importarAlunos"
    );


const arquivoPDF =
    document.getElementById(
        "arquivoPDF"
    );


const importarPDF =
    document.getElementById(
        "importarPDF"
    );


const listaAlunos =
    document.getElementById(
        "listaAlunos"
    );


const pesquisarAluno =
    document.getElementById(
        "pesquisarAluno"
    );


// =====================================================
// VARIÁVEIS
// =====================================================

let turmaSelecionada = "";

let todosAlunos = [];


// =====================================================
// VERIFICAR ELEMENTOS PRINCIPAIS
// =====================================================

if (!turmaSelect) {

    console.error(
        "❌ #turmaSelect não encontrado."
    );

}


if (!listaAlunos) {

    console.error(
        "❌ #listaAlunos não encontrado."
    );

}


console.log(
    "✅ BLOCO 1 DO STUDENT.JS CARREGADO."
);

// =====================================================
// BLOCO 2 — CARREGAR TURMAS
// =====================================================

async function carregarTurmas() {

    try {

        console.log(
            "📚 A carregar turmas da escola:",
            escolaId
        );


        if (!turmaSelect) {

            throw new Error(
                "Elemento turmaSelect não encontrado."
            );

        }


        turmaSelect.innerHTML =
            "<option value=''>A procurar turmas...</option>";


        const dados =
            await getDocs(

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
                )

            );


        if (dados.empty) {

            turmaSelect.innerHTML =
                "<option value=''>Nenhuma turma encontrada</option>";


            turmaSelecionada = "";


            if (listaAlunos) {

                listaAlunos.innerHTML =
                    "Nenhuma turma disponível.";

            }


            return;

        }


        turmaSelect.innerHTML =
            "";


        dados.forEach(
            turmaDoc => {

                const turma =
                    turmaDoc.data();


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    turmaDoc.id;


                option.textContent =
                    `${turma.nome || ""} - ${turma.classe || ""}`;


                turmaSelect.appendChild(
                    option
                );

            }
        );


        turmaSelecionada =
            turmaSelect.value;


        console.log(
            "✅ TURMA SELECIONADA:",
            turmaSelecionada
        );


        await carregarAlunos();

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO CARREGAR TURMAS:",
            erro
        );


        if (turmaSelect) {

            turmaSelect.innerHTML =
                "<option value=''>Erro ao carregar turmas</option>";

        }


        alert(
            "Erro ao carregar turmas:\n\n" +
            erro.message
        );

    }

}


// =====================================================
// ALTERAR TURMA
// =====================================================

if (turmaSelect) {

    turmaSelect.addEventListener(
        "change",
        async () => {

            turmaSelecionada =
                turmaSelect.value;


            console.log(
                "🔄 NOVA TURMA:",
                turmaSelecionada
            );


            await carregarAlunos();

        }
    );

}


// =====================================================
// GERAR CÓDIGO DO ALUNO
// =====================================================

function gerarCodigoAluno(numero) {

    if (!turmaSelect) {

        throw new Error(
            "turmaSelect não encontrado."
        );

    }


    const option =
        turmaSelect.options[
            turmaSelect.selectedIndex
        ];


    if (!option) {

        throw new Error(
            "Nenhuma turma selecionada."
        );

    }


    const turmaTexto =
        option.textContent || "";


    let codigoTurma =
        turmaTexto
            .split("-")[0]
            .trim()
            .replace(/ª/g, "")
            .replace(/\s+/g, "");


    if (!codigoTurma) {

        codigoTurma =
            "ALUNO";

    }


    const numeroNormalizado =
        String(numero)
            .trim()
            .padStart(3, "0");


    const codigo =
        codigoTurma +
        "-" +
        numeroNormalizado;


    console.log(
        "🔑 CÓDIGO GERADO:",
        codigo
    );


    return codigo;

}


// =====================================================
// GERAR SENHA AUTOMÁTICA
// =====================================================

function gerarSenha() {

    const caracteres =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


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
// TESTE
// =====================================================

console.log(
    "✅ BLOCO 2 DO STUDENT.JS CARREGADO."
);


// =====================================================
// INICIAR CARREGAMENTO
// =====================================================

carregarTurmas();

        // =====================================================
// BLOCO 3 — CRIAR ACESSO DO ALUNO
// =====================================================

async function criarAcessoAluno(aluno) {

    try {

        console.log(
            "🔐 A criar acesso do aluno..."
        );


        // =================================================
        // CÓDIGO DO ALUNO
        // =================================================

        const codigoOriginal =
            String(
                aluno.codigoAluno || ""
            ).trim();


        if (!codigoOriginal) {

            throw new Error(
                "O aluno não possui codigoAluno."
            );

        }


        // =================================================
        // SENHA DO ALUNO
        // =================================================

        const senha =
            String(
                aluno.senhaAcesso ||
                aluno.senha ||
                ""
            ).trim();


        if (!senha) {

            throw new Error(
                "O aluno não possui senhaAcesso."
            );

        }


        // =================================================
        // NORMALIZAR CÓDIGO PARA ID
        // =================================================

        const codigoId =
            codigoOriginal
                .replace(/\s+/g, "")
                .replace(/\//g, "-");


        // =================================================
        // REFERÊNCIA DO ACESSO
        // =================================================

        const acessoRef =
            doc(
                db,
                "acessosAlunos",
                codigoId
            );


        // =================================================
        // DADOS DO ACESSO
        // =================================================

        const dadosAcesso = {

            codigoAluno:
                codigoOriginal,

            senhaAcesso:
                senha,

            alunoId:
                aluno.alunoId ||
                aluno.id ||
                "",

            turmaId:
                aluno.turmaId ||
                turmaSelecionada ||
                "",

            turmaNome:
                aluno.turmaNome ||
                "",

            escolaId:
                aluno.escolaId ||
                escolaId ||
                "",

            nome:
                aluno.nome ||
                "",

            numero:
                aluno.numero ||
                "",

            sexo:
                aluno.sexo ||
                "",

            classe:
                aluno.classe ||
                "",

            ensino:
                aluno.ensino ||
                "",

            estado:
                aluno.estado ||
                "ativo",

            atualizadoEm:
                serverTimestamp()

        };


        // =================================================
        // GRAVAR ACESSO
        // =================================================

        await setDoc(
            acessoRef,
            dadosAcesso,
            {
                merge: true
            }
        );


        console.log(
            "===================================="
        );

        console.log(
            "✅ ACESSO DO ALUNO CRIADO"
        );

        console.log(
            "Código:",
            codigoOriginal
        );

        console.log(
            "Senha:",
            senha
        );

        console.log(
            "Escola:",
            dadosAcesso.escolaId
        );

        console.log(
            "Turma:",
            dadosAcesso.turmaId
        );

        console.log(
            "===================================="
        );


        return true;

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO CRIAR ACESSO DO ALUNO:",
            erro
        );

        throw erro;

    }

}

// =====================================================
// BLOCO 4 — GUARDAR ALUNO
// =====================================================

if (guardarAluno) {

    guardarAluno.addEventListener(
        "click",
        async () => {

            try {

                // =========================================
                // VERIFICAR TURMA
                // =========================================

                if (!turmaSelecionada) {

                    alert(
                        "❌ Selecione uma turma."
                    );

                    return;

                }


                // =========================================
                // VERIFICAR NOME
                // =========================================

                const nome =
                    nomeAluno
                        ?.value
                        ?.trim() || "";


                const numero =
                    numeroAluno
                        ?.value
                        ?.trim() || "";


                if (
                    !nome ||
                    !numero
                ) {

                    alert(
                        "❌ Preencha o nome e o número do aluno."
                    );

                    return;

                }


                // =========================================
                // VERIFICAR SE O NÚMERO JÁ EXISTE
                // =========================================

                const alunosExistentes =
                    await getDocs(

                        collection(
                            db,
                            "turmas",
                            turmaSelecionada,
                            "alunos"
                        )

                    );


                const numeroExiste =
                    alunosExistentes.docs.some(
                        alunoDoc => {

                            const dados =
                                alunoDoc.data();


                            return (
                                String(
                                    dados.numero || ""
                                ).trim() === numero
                            );

                        }
                    );


                if (numeroExiste) {

                    alert(
                        "⚠️ Já existe um aluno com este número nesta turma."
                    );

                    return;

                }


                // =========================================
                // DADOS DA TURMA
                // =========================================

                const turmaDoc =
                    await getDocs(

                        query(
                            collection(
                                db,
                                "turmas"
                            ),
                            where(
                                "__name__",
                                "==",
                                turmaSelecionada
                            )
                        )

                    );


                let turmaDados = {};


                if (
                    !turmaDoc.empty
                ) {

                    turmaDados =
                        turmaDoc.docs[0].data();

                }


                // =========================================
                // CÓDIGO
                // =========================================

                const codigoAluno =
                    gerarCodigoAluno(
                        numero
                    );


                // =========================================
                // SENHA
                // =========================================

                const senhaAcesso =
                    gerarSenha();


                // =========================================
                // NOME DA TURMA
                // =========================================

                const turmaNome =
                    turmaSelect
                        ?.options[
                            turmaSelect.selectedIndex
                        ]
                        ?.textContent
                        ?.trim() || "";


                // =========================================
                // DADOS DO ALUNO
                // =========================================

                const dadosAluno = {

                    nome:
                        nome,

                    numero:
                        numero,

                    sexo:
                        sexoAluno?.value || "",

                    dataNascimento:
                        dataAluno?.value?.trim() || "",

                    turmaId:
                        turmaSelecionada,

                    turmaNome:
                        turmaNome,

                    escolaId:
                        escolaId,

                    classe:
                        turmaDados.classe || "",

                    ensino:
                        turmaDados.ensino || "",

                    anoLetivo:
                        turmaDados.anoLetivo || "",

                    codigoAluno:
                        codigoAluno,

                    senhaAcesso:
                        senhaAcesso,

                    authUid:
                        "",

                    estado:
                        "ativo",

                    criadoEm:
                        serverTimestamp()

                };


                console.log(
                    "👨‍🎓 DADOS DO ALUNO:",
                    dadosAluno
                );


                // =========================================
                // CRIAR ALUNO NA TURMA
                // =========================================

                const alunoRef =
                    await addDoc(

                        collection(
                            db,
                            "turmas",
                            turmaSelecionada,
                            "alunos"
                        ),

                        dadosAluno

                    );


                console.log(
                    "✅ ALUNO CRIADO:",
                    alunoRef.id
                );


                // =========================================
                // CRIAR ACESSO DO ALUNO
                // =========================================

                await criarAcessoAluno({

                    ...dadosAluno,

                    id:
                        alunoRef.id

                });


                // =========================================
                // SUCESSO
                // =========================================

                alert(

                    "✅ ALUNO CADASTRADO COM SUCESSO!\n\n" +

                    "Nome: " +
                    nome +

                    "\nNúmero: " +
                    numero +

                    "\nCódigo: " +
                    codigoAluno +

                    "\nSenha: " +
                    senhaAcesso +

                    "\nTurma: " +
                    turmaNome

                );


                // =========================================
                // LIMPAR FORMULÁRIO
                // =========================================

                if (nomeAluno) {

                    nomeAluno.value = "";

                }


                if (numeroAluno) {

                    numeroAluno.value = "";

                }


                if (sexoAluno) {

                    sexoAluno.value = "";

                }


                if (dataAluno) {

                    dataAluno.value = "";

                }


                // =========================================
                // ATUALIZAR LISTA
                // =========================================

                await carregarAlunos();

            }

            catch (erro) {

                console.error(
                    "❌ ERRO AO GUARDAR ALUNO:",
                    erro
                );


                alert(

                    "❌ Erro ao guardar aluno:\n\n" +

                    erro.message

                );

            }

        }
    );

}


console.log(
    "✅ BLOCO 4 DO STUDENT.JS CARREGADO."
);

    // =====================================================
// BLOCO 5 — CARREGAR ALUNOS DA TURMA
// =====================================================

async function carregarAlunos() {

    if (!turmaSelecionada) {

        if (listaAlunos) {

            listaAlunos.innerHTML =
                "Selecione uma turma.";

        }

        return;

    }


    if (!listaAlunos) {

        console.error(
            "❌ #listaAlunos não encontrado."
        );

        return;

    }


    listaAlunos.innerHTML =
        "⏳ A carregar alunos...";


    try {

        console.log(
            "👨‍🎓 A carregar alunos da turma:",
            turmaSelecionada
        );


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

                alunos.push({

                    id:
                        alunoDoc.id,

                    ...alunoDoc.data()

                });

            }
        );


        // =========================================
        // ORDENAR PELO NÚMERO
        // =========================================

        alunos.sort(
            (a, b) => {

                const numeroA =
                    Number(
                        a.numero || 0
                    );


                const numeroB =
                    Number(
                        b.numero || 0
                    );


                return numeroA - numeroB;

            }
        );


        todosAlunos =
            alunos;


        console.log(
            "✅ ALUNOS ENCONTRADOS:",
            alunos.length
        );


        // =========================================
        // CONSTRUIR TABELA
        // =========================================

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


        mostrarAlunos(
            todosAlunos
        );

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO CARREGAR ALUNOS:",
            erro
        );


        listaAlunos.innerHTML =
            "❌ Erro ao carregar alunos.";


        alert(
            "Erro ao carregar alunos:\n\n" +
            erro.message
        );

    }

}


// =====================================================
// CALCULAR IDADE
// =====================================================

function calcularIdade(data) {

    if (!data) {

        return "";

    }


    const partes =
        String(data)
            .trim()
            .split("-");


    if (
        partes.length !== 3
    ) {

        return "";

    }


    let dia;
    let mes;
    let ano;


    // =========================================
    // FORMATO DD-MM-AAAA
    // =========================================

    if (
        partes[0].length <= 2 &&
        partes[2].length === 4
    ) {

        dia =
            Number(
                partes[0]
            );

        mes =
            Number(
                partes[1]
            ) - 1;

        ano =
            Number(
                partes[2]
            );

    }

    // =========================================
    // FORMATO AAAA-MM-DD
    // =========================================

    else {

        ano =
            Number(
                partes[0]
            );

        mes =
            Number(
                partes[1]
            ) - 1;

        dia =
            Number(
                partes[2]
            );

    }


    const nascimento =
        new Date(
            ano,
            mes,
            dia
        );


    if (
        isNaN(
            nascimento.getTime()
        )
    ) {

        return "";

    }


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


    corpoTabela.innerHTML =
        "";


    if (
        !lista ||
        lista.length === 0
    ) {

        corpoTabela.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="
                        text-align:center;
                        padding:20px;
                    "
                >

                    Nenhum aluno encontrado.

                </td>

            </tr>

        `;

        return;

    }


    lista.forEach(
        aluno => {

            const estado =
                aluno.estado ||
                "ativo";


            const estadoTexto =
                estado === "ativo"
                    ? "Ativo"
                    : estado;


            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

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
                    ${estadoTexto}
                </td>

                <td>

                    <button
                        onclick="
                            alterarEstado(
                                '${aluno.codigoAluno || ""}'
                            )
                        "
                    >
                        ⚙️ Estado
                    </button>


                    <button
                        onclick="
                            verAluno(
                                '${aluno.codigoAluno || ""}'
                            )
                        "
                    >
                        👁️
                    </button>


                    <button
                        onclick="
                            editarAluno(
                                '${aluno.codigoAluno || ""}'
                            )
                        "
                    >
                        ✏️
                    </button>


                    <button
                        onclick="
                            apagarAluno(
                                '${aluno.codigoAluno || ""}'
                            )
                        "
                    >
                        🗑️
                    </button>

                </td>

            `;


            corpoTabela.appendChild(
                linha
            );

        }
    );


    console.log(
        "✅ TABELA DE ALUNOS ATUALIZADA."
    );

}


// =====================================================
// BLOCO 5 FINALIZADO
// =====================================================

console.log(
    "✅ BLOCO 5 DO STUDENT.JS CARREGADO."
);

// =====================================================
// BLOCO 6 — IMPORTAR ALUNOS PELA LISTA
// =====================================================

if (importarAlunos) {

    importarAlunos.addEventListener(
        "click",
        async () => {

            try {

                // =========================================
                // VERIFICAR TURMA
                // =========================================

                if (!turmaSelecionada) {

                    alert(
                        "❌ Selecione uma turma."
                    );

                    return;

                }


                // =========================================
                // LER TEXTO
                // =========================================

                const texto =
                    listaImportar
                        ?.value
                        ?.trim() || "";


                if (!texto) {

                    alert(
                        "❌ Cole a lista de alunos."
                    );

                    return;

                }


                // =========================================
                // SEPARAR LINHAS
                // =========================================

                const linhas =
                    texto
                        .split(/\r?\n/)
                        .filter(
                            linha =>
                                linha.trim() !== ""
                        );


                let quantidadeImportada =
                    0;


                let quantidadeIgnorada =
                    0;


                // =========================================
                // IMPORTAR CADA ALUNO
                // =========================================

                for (
                    const linha of linhas
                ) {

                    const dados =
                        linha
                            .split(";")
                            .map(
                                valor =>
                                    valor.trim()
                            );


                    // =====================================
                    // FORMATO:
                    //
                    // Nº ; NOME ; SEXO ; DATA
                    // =====================================

                    if (
                        dados.length < 4
                    ) {

                        quantidadeIgnorada++;

                        continue;

                    }


                    const numero =
                        dados[0];


                    const nome =
                        dados[1];


                    const sexo =
                        dados[2];


                    const dataNascimento =
                        dados[3];


                    if (
                        !numero ||
                        !nome
                    ) {

                        quantidadeIgnorada++;

                        continue;

                    }


                    // =====================================
                    // VERIFICAR DUPLICADO
                    // =====================================

                    const alunosExistentes =
                        await getDocs(

                            collection(
                                db,
                                "turmas",
                                turmaSelecionada,
                                "alunos"
                            )

                        );


                    const jaExiste =
                        alunosExistentes.docs.some(
                            alunoDoc => {

                                const aluno =
                                    alunoDoc.data();


                                return (
                                    String(
                                        aluno.numero || ""
                                    ).trim() ===
                                    String(
                                        numero
                                    ).trim()
                                );

                            }
                        );


                    if (jaExiste) {

                        console.warn(
                            "⚠️ Aluno já existe:",
                            numero,
                            nome
                        );


                        quantidadeIgnorada++;

                        continue;

                    }


                    // =====================================
                    // CÓDIGO
                    // =====================================

                    const codigoAluno =
                        gerarCodigoAluno(
                            numero
                        );


                    // =====================================
                    // SENHA
                    // =====================================

                    const senhaAcesso =
                        gerarSenha();


                    // =====================================
                    // NOME DA TURMA
                    // =====================================

                    const turmaNome =
                        turmaSelect
                            ?.options[
                                turmaSelect.selectedIndex
                            ]
                            ?.textContent
                            ?.trim() || "";


                    // =====================================
                    // DADOS
                    // =====================================

                    const dadosAluno = {

                        numero:
                            numero,

                        nome:
                            nome,

                        sexo:
                            sexo,

                        dataNascimento:
                            dataNascimento,

                        turmaId:
                            turmaSelecionada,

                        escolaId:
                            escolaId,

                        turmaNome:
                            turmaNome,

                        codigoAluno:
                            codigoAluno,

                        senhaAcesso:
                            senhaAcesso,

                        authUid:
                            "",

                        estado:
                            "ativo",

                        criadoEm:
                            serverTimestamp()

                    };


                    // =====================================
                    // CRIAR ALUNO
                    // =====================================

                    const alunoRef =
                        await addDoc(

                            collection(
                                db,
                                "turmas",
                                turmaSelecionada,
                                "alunos"
                            ),

                            dadosAluno

                        );


                    // =====================================
                    // CRIAR ACESSO
                    // =====================================

                    await criarAcessoAluno({

                        ...dadosAluno,

                        id:
                            alunoRef.id

                    });


                    quantidadeImportada++;


                    console.log(
                        "✅ ALUNO IMPORTADO:",
                        nome,
                        codigoAluno
                    );

                }


                // =========================================
                // LIMPAR CAMPO
                // =========================================

                if (listaImportar) {

                    listaImportar.value =
                        "";

                }


                // =========================================
                // ATUALIZAR LISTA
                // =========================================

                await carregarAlunos();


                // =========================================
                // RESULTADO
                // =========================================

                alert(

                    "✅ IMPORTAÇÃO CONCLUÍDA!\n\n" +

                    "Alunos importados: " +
                    quantidadeImportada +

                    "\nAlunos ignorados: " +
                    quantidadeIgnorada +

                    "\n\n" +

                    "Cada aluno recebeu automaticamente " +
                    "um código e uma senha de acesso."

                );

            }

            catch (erro) {

                console.error(
                    "❌ ERRO NA IMPORTAÇÃO:",
                    erro
                );


                alert(

                    "❌ Erro ao importar alunos:\n\n" +

                    erro.message

                );

            }

        }
    );

}


console.log(
    "✅ BLOCO 6 DO STUDENT.JS CARREGADO."
);

// =====================================================
// BLOCO 7 — IMPORTAR ALUNOS PELO PDF
// =====================================================

if (importarPDF) {

    importarPDF.addEventListener(
        "click",
        async () => {

            try {

                // =========================================
                // VERIFICAR TURMA
                // =========================================

                if (!turmaSelecionada) {

                    alert(
                        "❌ Selecione uma turma."
                    );

                    return;

                }


                // =========================================
                // VERIFICAR FICHEIRO
                // =========================================

                const file =
                    arquivoPDF
                        ?.files?.[0];


                if (!file) {

                    alert(
                        "❌ Selecione um ficheiro PDF."
                    );

                    return;

                }


                // =========================================
                // LER PDF
                // =========================================

                alert(
                    "📄 A ler PDF..."
                );


                const resultado =
                    await lerPDF(file);


                if (
                    !resultado ||
                    !Array.isArray(
                        resultado.alunos
                    )
                ) {

                    throw new Error(
                        "Não foi possível obter os alunos do PDF."
                    );

                }


                console.log(
                    "📄 RESULTADO DO PDF:",
                    resultado
                );


                if (
                    resultado.alunos.length === 0
                ) {

                    alert(
                        "⚠️ Nenhum aluno foi encontrado no PDF."
                    );

                    return;

                }


                alert(

                    "👨‍🎓 Alunos encontrados: " +

                    resultado.alunos.length +

                    "\n\nA iniciar importação..."

                );


                let quantidadeImportada =
                    0;


                let quantidadeIgnorada =
                    0;


                // =========================================
                // PROCESSAR ALUNOS
                // =========================================

                for (
                    const aluno of resultado.alunos
                ) {

                    const numero =
                        String(
                            aluno.numero || ""
                        ).trim();


                    const nome =
                        String(
                            aluno.nome || ""
                        ).trim();


                    const sexo =
                        String(
                            aluno.sexo || ""
                        ).trim();


                    // =====================================
                    // VALIDAR
                    // =====================================

                    if (
                        !numero ||
                        !nome
                    ) {

                        console.warn(
                            "⚠️ Aluno ignorado:",
                            aluno
                        );


                        quantidadeIgnorada++;

                        continue;

                    }


                    // =====================================
                    // VERIFICAR DUPLICADO
                    // =====================================

                    const existentes =
                        await getDocs(

                            collection(
                                db,
                                "turmas",
                                turmaSelecionada,
                                "alunos"
                            )

                        );


                    const jaExiste =
                        existentes.docs.some(
                            alunoDoc => {

                                const dados =
                                    alunoDoc.data();


                                return (
                                    String(
                                        dados.numero || ""
                                    ).trim() === numero
                                );

                            }
                        );


                    if (jaExiste) {

                        console.warn(
                            "⚠️ Aluno já existe:",
                            numero,
                            nome
                        );


                        quantidadeIgnorada++;

                        continue;

                    }


                    // =====================================
                    // CÓDIGO
                    // =====================================

                    const codigoAluno =
                        gerarCodigoAluno(
                            numero
                        );


                    // =====================================
                    // SENHA
                    // =====================================

                    const senhaAcesso =
                        gerarSenha();


                    // =====================================
                    // NOME DA TURMA
                    // =====================================

                    const turmaNome =
                        turmaSelect
                            ?.options[
                                turmaSelect.selectedIndex
                            ]
                            ?.textContent
                            ?.trim() || "";


                    // =====================================
                    // DADOS DO ALUNO
                    // =====================================

                    const dadosAluno = {

                        numero:
                            numero,

                        nome:
                            nome,

                        sexo:
                            sexo,

                        dataNascimento:
                            aluno.dataNascimento ||
                            aluno.data ||
                            "",

                        turmaId:
                            turmaSelecionada,

                        turmaNome:
                            turmaNome,

                        escolaId:
                            escolaId,

                        classe:
                            aluno.classe ||
                            "",

                        ensino:
                            aluno.ensino ||
                            "",

                        anoLetivo:
                            aluno.anoLetivo ||
                            "",

                        codigoAluno:
                            codigoAluno,

                        senhaAcesso:
                            senhaAcesso,

                        authUid:
                            "",

                        estado:
                            "ativo",

                        criadoEm:
                            serverTimestamp()

                    };


                    // =====================================
                    // CRIAR ALUNO
                    // =====================================

                    const alunoRef =
                        await addDoc(

                            collection(
                                db,
                                "turmas",
                                turmaSelecionada,
                                "alunos"
                            ),

                            dadosAluno

                        );


                    // =====================================
                    // CRIAR ACESSO
                    // =====================================

                    await criarAcessoAluno({

                        ...dadosAluno,

                        id:
                            alunoRef.id

                    });


                    quantidadeImportada++;


                    console.log(
                        "✅ ALUNO DO PDF IMPORTADO:",
                        nome,
                        codigoAluno
                    );

                }


                // =========================================
                // ATUALIZAR LISTA
                // =========================================

                await carregarAlunos();


                // =========================================
                // LIMPAR INPUT
                // =========================================

                if (arquivoPDF) {

                    arquivoPDF.value =
                        "";

                }


                // =========================================
                // RESULTADO
                // =========================================

                alert(

                    "✅ IMPORTAÇÃO DO PDF CONCLUÍDA!\n\n" +

                    "Alunos importados: " +
                    quantidadeImportada +

                    "\nAlunos ignorados: " +
                    quantidadeIgnorada +

                    "\n\n" +

                    "Os acessos dos alunos foram criados automaticamente."

                );

            }

            catch (erro) {

                console.error(
                    "❌ ERRO AO IMPORTAR PDF:",
                    erro
                );


                alert(

                    "❌ Erro ao importar PDF:\n\n" +

                    erro.message

                );

            }

        }
    );

}


console.log(
    "✅ BLOCO 7 DO STUDENT.JS CARREGADO."
);

// =====================================================
// BLOCO 8 — PESQUISA DE ALUNOS
// =====================================================

if (pesquisarAluno) {

    pesquisarAluno.addEventListener(
        "input",
        () => {

            const texto =
                pesquisarAluno.value
                    .toLowerCase()
                    .trim();


            if (!texto) {

                mostrarAlunos(
                    todosAlunos
                );

                return;

            }


            const resultado =
                todosAlunos.filter(
                    aluno => {

                        const nome =
                            String(
                                aluno.nome || ""
                            ).toLowerCase();


                        const numero =
                            String(
                                aluno.numero || ""
                            ).toLowerCase();


                        const codigo =
                            String(
                                aluno.codigoAluno || ""
                            ).toLowerCase();


                        return (
                            nome.includes(texto) ||
                            numero.includes(texto) ||
                            codigo.includes(texto)
                        );

                    }
                );


            mostrarAlunos(
                resultado
            );

        }
    );

}


// =====================================================
// LOCALIZAR ALUNO PELO CÓDIGO
// =====================================================

function encontrarAlunoPorCodigo(codigo) {

    return todosAlunos.find(
        aluno =>
            String(
                aluno.codigoAluno || ""
            ).trim() ===
            String(
                codigo || ""
            ).trim()
    );

}


// =====================================================
// ALTERAR ESTADO
// =====================================================

window.alterarEstado =
    async function(codigo) {

        try {

            const aluno =
                encontrarAlunoPorCodigo(
                    codigo
                );


            if (!aluno) {

                alert(
                    "❌ Aluno não encontrado."
                );

                return;

            }


            const opcao =
                prompt(

                    "ALTERAR ESTADO DO ALUNO\n\n" +

                    "1 - ativo\n" +

                    "2 - transferido\n" +

                    "3 - desistente\n" +

                    "4 - concluído\n\n" +

                    "Estado atual: " +
                    (
                        aluno.estado ||
                        "ativo"
                    ) +

                    "\n\nDigite o número:"

                );


            if (!opcao) {

                return;

            }


            const estados = {

                "1":
                    "ativo",

                "2":
                    "transferido",

                "3":
                    "desistente",

                "4":
                    "concluido"

            };


            const novoEstado =
                estados[
                    opcao.trim()
                ];


            if (!novoEstado) {

                alert(
                    "❌ Opção inválida."
                );

                return;

            }


            // =========================================
            // ATUALIZAR ALUNO
            // =========================================

            await updateDoc(

                doc(
                    db,
                    "turmas",
                    turmaSelecionada,
                    "alunos",
                    aluno.id
                ),

                {

                    estado:
                        novoEstado,

                    atualizadoEm:
                        serverTimestamp()

                }

            );


            // =========================================
            // ATUALIZAR ACESSO
            // =========================================

            if (
                aluno.codigoAluno
            ) {

                const codigoId =
                    String(
                        aluno.codigoAluno
                    )
                    .replace(/\s+/g, "")
                    .replace(/\//g, "-");


                await updateDoc(

                    doc(
                        db,
                        "acessosAlunos",
                        codigoId
                    ),

                    {

                        estado:
                            novoEstado,

                        atualizadoEm:
                            serverTimestamp()

                    }

                )
                .catch(
                    erro => {

                        console.warn(
                            "⚠️ Acesso do aluno não encontrado:",
                            erro
                        );

                    }
                );

            }


            alert(
                "✅ Estado alterado para: " +
                novoEstado
            );


            await carregarAlunos();

        }

        catch (erro) {

            console.error(
                "❌ ERRO AO ALTERAR ESTADO:",
                erro
            );


            alert(
                "❌ Não foi possível alterar o estado:\n\n" +
                erro.message
            );

        }

    };


// =====================================================
// VISUALIZAR ALUNO
// =====================================================

window.verAluno =
    function(codigo) {

        const aluno =
            encontrarAlunoPorCodigo(
                codigo
            );


        if (!aluno) {

            alert(
                "❌ Aluno não encontrado."
            );

            return;

        }


        alert(

            "👨‍🎓 DADOS DO ALUNO\n\n" +

            "Nome: " +
            (
                aluno.nome ||
                ""
            ) +

            "\n\nCódigo: " +
            (
                aluno.codigoAluno ||
                ""
            ) +

            "\nNúmero: " +
            (
                aluno.numero ||
                ""
            ) +

            "\nSexo: " +
            (
                aluno.sexo ||
                ""
            ) +

            "\nData de nascimento: " +
            (
                aluno.dataNascimento ||
                "Não informado"
            ) +

            "\nIdade: " +
            (
                calcularIdade(
                    aluno.dataNascimento
                ) ||
                "Não disponível"
            ) +

            "\nTurma: " +
            (
                aluno.turmaNome ||
                ""
            ) +

            "\nEstado: " +
            (
                aluno.estado ||
                "ativo"
            ) +

            "\n\n🔐 Código de acesso: " +
            (
                aluno.codigoAluno ||
                ""
            ) +

            "\nSenha de acesso: " +
            (
                aluno.senhaAcesso ||
                "Não disponível"
            )

        );

    };


// =====================================================
// EDITAR ALUNO
// =====================================================

window.editarAluno =
    async function(codigo) {

        try {

            const aluno =
                encontrarAlunoPorCodigo(
                    codigo
                );


            if (!aluno) {

                alert(
                    "❌ Aluno não encontrado."
                );

                return;

            }


            const novoNome =
                prompt(
                    "Nome do aluno:",
                    aluno.nome || ""
                );


            if (
                novoNome === null
            ) {

                return;

            }


            const novoNumero =
                prompt(
                    "Número do aluno:",
                    aluno.numero || ""
                );


            if (
                novoNumero === null
            ) {

                return;

            }


            const novoSexo =
                prompt(
                    "Sexo:",
                    aluno.sexo || ""
                );


            if (
                novoSexo === null
            ) {

                return;

            }


            const novaData =
                prompt(
                    "Data de nascimento:",
                    aluno.dataNascimento || ""
                );


            if (
                novaData === null
            ) {

                return;

            }


            // =========================================
            // ATUALIZAR ALUNO
            // =========================================

            await updateDoc(

                doc(
                    db,
                    "turmas",
                    turmaSelecionada,
                    "alunos",
                    aluno.id
                ),

                {

                    nome:
                        novoNome.trim(),

                    numero:
                        novoNumero.trim(),

                    sexo:
                        novoSexo.trim(),

                    dataNascimento:
                        novaData.trim(),

                    atualizadoEm:
                        serverTimestamp()

                }

            );


            // =========================================
            // ATUALIZAR ACESSO
            // =========================================

            if (
                aluno.codigoAluno
            ) {

                const codigoId =
                    String(
                        aluno.codigoAluno
                    )
                    .replace(/\s+/g, "")
                    .replace(/\//g, "-");


                await updateDoc(

                    doc(
                        db,
                        "acessosAlunos",
                        codigoId
                    ),

                    {

                        nome:
                            novoNome.trim(),

                        numero:
                            novoNumero.trim(),

                        sexo:
                            novoSexo.trim(),

                        atualizadoEm:
                            serverTimestamp()

                    }

                )
                .catch(
                    erro => {

                        console.warn(
                            "⚠️ Acesso não encontrado:",
                            erro
                        );

                    }
                );

            }


            alert(
                "✅ Dados do aluno atualizados."
            );


            await carregarAlunos();

        }

        catch (erro) {

            console.error(
                "❌ ERRO AO EDITAR ALUNO:",
                erro
            );


            alert(
                "❌ Não foi possível editar o aluno:\n\n" +
                erro.message
            );

        }

    };


// =====================================================
// APAGAR ALUNO
// =====================================================

window.apagarAluno =
    async function(codigo) {

        try {

            const aluno =
                encontrarAlunoPorCodigo(
                    codigo
                );


            if (!aluno) {

                alert(
                    "❌ Aluno não encontrado."
                );

                return;

            }


            const confirmar =
                confirm(

                    "⚠️ ATENÇÃO!\n\n" +

                    "Deseja realmente apagar:\n\n" +

                    aluno.nome +

                    "\nCódigo: " +
                    aluno.codigoAluno +

                    "\n\nEsta operação não pode ser desfeita."

                );


            if (!confirmar) {

                return;

            }


            // =========================================
            // APAGAR ALUNO
            // =========================================

            await deleteDoc(

                doc(
                    db,
                    "turmas",
                    turmaSelecionada,
                    "alunos",
                    aluno.id
                )

            );


            // =========================================
            // APAGAR ACESSO
            // =========================================

            if (
                aluno.codigoAluno
            ) {

                const codigoId =
                    String(
                        aluno.codigoAluno
                    )
                    .replace(/\s+/g, "")
                    .replace(/\//g, "-");


                await deleteDoc(

                    doc(
                        db,
                        "acessosAlunos",
                        codigoId
                    )

                )
                .catch(
                    erro => {

                        console.warn(
                            "⚠️ Acesso do aluno não encontrado:",
                            erro
                        );

                    }
                );

            }


            alert(
                "✅ Aluno apagado com sucesso."
            );


            await carregarAlunos();

        }

        catch (erro) {

            console.error(
                "❌ ERRO AO APAGAR ALUNO:",
                erro
            );


            alert(
                "❌ Não foi possível apagar o aluno:\n\n" +
                erro.message
            );

        }

    };


// =====================================================
// BLOCO 8 FINALIZADO
// =====================================================

console.log(
    "===================================="
);

alert("FIM");

console.log(
    "✅ BLOCO 8 DO STUDENT.JS CARREGADO"
);

console.log(
    "===================================="
);
