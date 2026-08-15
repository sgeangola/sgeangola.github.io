// =====================================================
// REGISTER SCHOOL - SGE ANGOLA
// Cadastro completo da escola
// =====================================================

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";


// =====================================================
// ELEMENTOS
// =====================================================

const form = document.getElementById("formEscola");
const btnCadastrar = document.getElementById("btnCadastrar");
const mensagem = document.getElementById("mensagem");
const resultadoCadastro = document.getElementById("resultadoCadastro");


// =====================================================
// ENSINOS
// =====================================================

const checkboxesEnsino =
    document.querySelectorAll(
        'input[name="ensino"]'
    );

const opcoesPrimario =
    document.getElementById(
        "opcoesPrimario"
    );

const opcoesPrimeiroCiclo =
    document.getElementById(
        "opcoesPrimeiroCiclo"
    );


// =====================================================
// MOSTRAR / ESCONDER ESTRUTURAS
// =====================================================

function atualizarEstruturaEnsino() {

    const primarioSelecionado =
        document.querySelector(
            'input[name="ensino"][value="ensinoPrimario"]:checked'
        );

    const cicloSelecionado =
        document.querySelector(
            'input[name="ensino"][value="primeiroCiclo"]:checked'
        );


    if (opcoesPrimario) {

        opcoesPrimario.style.display =
            primarioSelecionado
                ? "block"
                : "none";

    }


    if (opcoesPrimeiroCiclo) {

        opcoesPrimeiroCiclo.style.display =
            cicloSelecionado
                ? "block"
                : "none";

    }

}


// =====================================================
// EVENTO ENSINO
// =====================================================

checkboxesEnsino.forEach(
    checkbox => {

        checkbox.addEventListener(
            "change",
            atualizarEstruturaEnsino
        );

    }
);


// =====================================================
// MENSAGEM
// =====================================================

function mostrarMensagem(
    texto,
    tipo
) {

    if (!mensagem) return;

    mensagem.textContent = texto;

    mensagem.className = tipo;

}


// =====================================================
// NOME DO ENSINO
// =====================================================

function nomeEnsino(
    ensino
) {

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
// NOME DA ESTRUTURA
// =====================================================

function nomeEstrutura(
    valor
) {

    const nomes = {

        "1classe": "1ª classe",
        "2classe": "2ª classe",
        "3classe": "3ª classe",
        "4classe": "4ª classe",
        "5classe": "5ª classe",
        "6classe": "6ª classe",

        "1etapa": "1ª Etapa",
        "2etapa": "2ª Etapa",
        "3etapa": "3ª Etapa",

        "7classe": "7ª classe",
        "8classe": "8ª classe",
        "9classe": "9ª classe",

        "eja1": "EJA 1",
        "eja2": "EJA 2"

    };

    return nomes[valor] || valor;

}


// =====================================================
// CADASTRO
// =====================================================

if (form) {

    form.addEventListener(
        "submit",
        async evento => {

            evento.preventDefault();


            // =========================================
            // BLOQUEAR BOTÃO
            // =========================================

            if (btnCadastrar) {

                btnCadastrar.disabled = true;

                btnCadastrar.textContent =
                    "A cadastrar escola...";

            }


            if (resultadoCadastro) {

                resultadoCadastro.style.display =
                    "none";

            }


            try {

                // =====================================
                // DADOS DA ESCOLA
                // =====================================

                const nome =
                    document
                    .getElementById("nome")
                    .value
                    .trim();


                const provincia =
                    document
                    .getElementById("provincia")
                    .value
                    .trim();


                const municipio =
                    document
                    .getElementById("municipio")
                    .value
                    .trim();


                const telefone =
                    document
                    .getElementById("telefone")
                    .value
                    .trim();


                const emailEscola =
                    document
                    .getElementById("emailEscola")
                    .value
                    .trim();


                const anoLetivo =
                    document
                    .getElementById("anoLetivo")
                    .value
                    .trim();


                // =====================================
                // TIPO DA ESCOLA
                // =====================================

                const tipoEscola =
                    document
                    .getElementById("tipoEscola")
                    .value;


                // =====================================
                // ENSINOS
                // =====================================

                const ensinosSelecionados =
                    Array.from(
                        document.querySelectorAll(
                            'input[name="ensino"]:checked'
                        )
                    ).map(
                        checkbox =>
                            checkbox.value
                    );


                // =====================================
                // ESTRUTURA PRIMÁRIO
                // =====================================

                const estruturaPrimario =
                    Array.from(
                        document.querySelectorAll(
                            'input[name="estruturaPrimario"]:checked'
                        )
                    ).map(
                        checkbox =>
                            checkbox.value
                    );


                // =====================================
                // ESTRUTURA PRIMEIRO CICLO
                // =====================================

                const estruturaPrimeiroCiclo =
                    Array.from(
                        document.querySelectorAll(
                            'input[name="estruturaPrimeiroCiclo"]:checked'
                        )
                    ).map(
                        checkbox =>
                            checkbox.value
                    );


                // =====================================
                // GESTOR
                // =====================================

                const nomeGestor =
                    document
                    .getElementById("nomeGestor")
                    .value
                    .trim();


                const emailGestor =
                    document
                    .getElementById("emailGestor")
                    .value
                    .trim();


                const senhaGestor =
                    document
                    .getElementById("senhaGestor")
                    .value;


                const confirmarSenha =
                    document
                    .getElementById("confirmarSenha")
                    .value;


                // =====================================
                // VALIDAÇÕES
                // =====================================

                if (!nome) {

                    throw new Error(
                        "Informe o nome da escola."
                    );

                }


                if (!provincia) {

                    throw new Error(
                        "Informe a província."
                    );

                }


                if (!municipio) {

                    throw new Error(
                        "Informe o município."
                    );

                }


                if (!anoLetivo) {

                    throw new Error(
                        "Informe o ano letivo."
                    );

                }


                if (!tipoEscola) {

                    throw new Error(
                        "Selecione se a escola é pública ou privada."
                    );

                }


                // =====================================
                // PELO MENOS UM ENSINO
                // =====================================

                if (
                    ensinosSelecionados.length === 0
                ) {

                    throw new Error(
                        "Selecione pelo menos um ensino."
                    );

                }


                // =====================================
                // VALIDAR ESTRUTURA DO PRIMÁRIO
                // =====================================

                if (
                    ensinosSelecionados.includes(
                        "ensinoPrimario"
                    ) &&
                    estruturaPrimario.length === 0
                ) {

                    throw new Error(
                        "Selecione pelo menos uma classe ou etapa do Ensino Primário."
                    );

                }


                // =====================================
                // VALIDAR ESTRUTURA DO PRIMEIRO CICLO
                // =====================================

                if (
                    ensinosSelecionados.includes(
                        "primeiroCiclo"
                    ) &&
                    estruturaPrimeiroCiclo.length === 0
                ) {

                    throw new Error(
                        "Selecione pelo menos uma classe ou etapa do Primeiro Ciclo."
                    );

                }


                // =====================================
                // GESTOR
                // =====================================

                if (!nomeGestor) {

                    throw new Error(
                        "Informe o nome do gestor."
                    );

                }


                if (!emailGestor) {

                    throw new Error(
                        "Informe o e-mail do gestor."
                    );

                }


                if (
                    senhaGestor.length < 6
                ) {

                    throw new Error(
                        "A senha deve ter pelo menos 6 caracteres."
                    );

                }


                if (
                    senhaGestor !==
                    confirmarSenha
                ) {

                    throw new Error(
                        "As senhas não coincidem."
                    );

                }


                // =====================================
                // MENSAGEM
                // =====================================

                mostrarMensagem(
                    "A criar a conta do gestor...",
                    "sucesso"
                );


                // =====================================
                // CRIAR UTILIZADOR FIREBASE
                // =====================================

                const credencial =
                    await createUserWithEmailAndPassword(
                        auth,
                        emailGestor,
                        senhaGestor
                    );


                const uidGestor =
                    credencial.user.uid;


                console.log(
                    "GESTOR CRIADO:",
                    uidGestor
                );


                // =====================================
                // DADOS DA ESCOLA
                // =====================================

const dadosEscola = {

    nome: nome,

    provincia: provincia,

    municipio: municipio,

    telefone: telefone,

    email: emailEscola,

    anoLetivoAtual: anoLetivo,

    tipoEscola: tipoEscola,

    ensinos:
        ensinosSelecionados,

    estrutura: {

        ensinoPrimario:
            estruturaPrimario,

        primeiroCiclo:
            estruturaPrimeiroCiclo

    },

    gestorUid:
        uidGestor,

    nomeGestor:
        nomeGestor,

    emailGestor:
        emailGestor,

    logoUrl: "",

    // =====================================
    // APROVAÇÃO DA ESCOLA
    // =====================================

    estado: "pendente",

    ativo: false,

    criadoEm:
        serverTimestamp()

};


                // =====================================
                // GUARDAR ESCOLA
                // =====================================

                const escolaRef =
                    await addDoc(
                        collection(
                            db,
                            "escolas"
                        ),
                        dadosEscola
                    );


                console.log(
                    "ESCOLA CRIADA:",
                    escolaRef.id
                );


                // =====================================
                // SUCESSO
                // =====================================

                mostrarMensagem(
                    "Escola cadastrada com sucesso!",
                    "sucesso"
                );


                // =====================================
                // RESULTADO
                // =====================================

                const resultadoEscola =
                    document.getElementById(
                        "resultadoEscola"
                    );

                if (resultadoEscola) {

                    resultadoEscola.textContent =
                        nome;

                }


                const resultadoNomeGestor =
                    document.getElementById(
                        "resultadoNomeGestor"
                    );

                if (resultadoNomeGestor) {

                    resultadoNomeGestor.textContent =
                        nomeGestor;

                }


                const resultadoEmail =
                    document.getElementById(
                        "resultadoEmail"
                    );

                if (resultadoEmail) {

                    resultadoEmail.textContent =
                        emailGestor;

                }


                const resultadoTipo =
                    document.getElementById(
                        "resultadoTipo"
                    );

                if (resultadoTipo) {

                    resultadoTipo.textContent =
                        tipoEscola === "publica"
                            ? "Pública"
                            : "Privada";

                }


                const resultadoEnsinos =
                    document.getElementById(
                        "resultadoEnsinos"
                    );

                if (resultadoEnsinos) {

                    resultadoEnsinos.textContent =
                        ensinosSelecionados
                        .map(
                            nomeEnsino
                        )
                        .join(" + ");

                }


                if (resultadoCadastro) {

                    resultadoCadastro.style.display =
                        "block";

                }


                // =====================================
                // GUARDAR ESCOLA ATUAL
                // =====================================

                sessionStorage.setItem(
                    "escolaId",
                    escolaRef.id
                );

                localStorage.setItem(
    "escolaId",
    escolaRef.id
);
                
                sessionStorage.setItem(
                    "nomeEscola",
                    nome
                );

                sessionStorage.setItem(
                    "tipoEscola",
                    tipoEscola
                );

                sessionStorage.setItem(
                    "ensinos",
                    JSON.stringify(
                        ensinosSelecionados
                    )
                );


                sessionStorage.setItem(
                    "estruturaEscola",
                    JSON.stringify({

                        ensinoPrimario:
                            estruturaPrimario,

                        primeiroCiclo:
                            estruturaPrimeiroCiclo

                    })
                );


                // =====================================
                // LIMPAR FORMULÁRIO
                // =====================================

                form.reset();

                atualizarEstruturaEnsino();


            }
            catch (erro) {

                console.error(
                    "ERRO NO CADASTRO:",
                    erro
                );


                let mensagemErro =
                    "Não foi possível concluir o cadastro.";


                if (
                    erro.code ===
                    "auth/email-already-in-use"
                ) {

                    mensagemErro =
                        "Este e-mail do gestor já está cadastrado.";

                }

                else if (
                    erro.code ===
                    "auth/invalid-email"
                ) {

                    mensagemErro =
                        "O e-mail informado é inválido.";

                }

                else if (
                    erro.code ===
                    "auth/weak-password"
                ) {

                    mensagemErro =
                        "A senha deve ter pelo menos 6 caracteres.";

                }

                else if (
                    erro.code ===
                    "permission-denied"
                ) {

                    mensagemErro =
                        "Sem permissão para gravar no Firestore.";

                }

                else if (
                    erro.message
                ) {

                    mensagemErro =
                        erro.message;

                }


                mostrarMensagem(
                    mensagemErro,
                    "erro"
                );

            }


            finally {

                if (btnCadastrar) {

                    btnCadastrar.disabled =
                        false;

                    btnCadastrar.textContent =
                        "Cadastrar Escola";

                }

            }

        }
    );

    }
