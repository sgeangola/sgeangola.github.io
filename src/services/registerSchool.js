// =====================================================
// REGISTER SCHOOL - SGE
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

const form =
    document.getElementById("formEscola");

const btnCadastrar =
    document.getElementById("btnCadastrar");

const mensagem =
    document.getElementById("mensagem");

const resultadoCadastro =
    document.getElementById("resultadoCadastro");


// =====================================================
// MENSAGEM
// =====================================================

function mostrarMensagem(
    texto,
    tipo
){

    mensagem.textContent =
        texto;

    mensagem.className =
        tipo;

}


// =====================================================
// TRADUZIR ENSINO
// =====================================================

function nomeEnsino(
    ensino
){

    if(
        ensino ===
        "ensinoPrimario"
    ){

        return "Ensino Primário";

    }


    if(
        ensino ===
        "primeiroCiclo"
    ){

        return "Primeiro Ciclo";

    }


    return ensino;

}


// =====================================================
// CADASTRO
// =====================================================

form.addEventListener(
    "submit",
    async evento => {

        evento.preventDefault();


        btnCadastrar.disabled =
            true;


        resultadoCadastro.style.display =
            "none";


        try {


            // =========================================
            // DADOS DA ESCOLA
            // =========================================

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


            // =========================================
            // TIPO
            // =========================================

            const tipoSelecionado =
                document.querySelector(
                    'input[name="tipoEscola"]:checked'
                );


            // =========================================
            // ENSINOS
            // =========================================

            const ensinosSelecionados =
                Array.from(
                    document.querySelectorAll(
                        'input[name="ensinos"]:checked'
                    )
                ).map(
                    checkbox =>
                        checkbox.value
                );


            // =========================================
            // GESTOR
            // =========================================

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


            // =========================================
            // VALIDAÇÕES
            // =========================================

            if(!nome){

                throw new Error(
                    "Informe o nome da escola."
                );

            }


            if(!provincia){

                throw new Error(
                    "Informe a província."
                );

            }


            if(!municipio){

                throw new Error(
                    "Informe o município."
                );

            }


            if(!anoLetivo){

                throw new Error(
                    "Informe o ano letivo."
                );

            }


            if(!tipoSelecionado){

                throw new Error(
                    "Selecione se a escola é pública ou privada."
                );

            }


            if(
                ensinosSelecionados.length === 0
            ){

                throw new Error(
                    "Selecione pelo menos um ensino."
                );

            }


            if(!nomeGestor){

                throw new Error(
                    "Informe o nome do gestor."
                );

            }


            if(!emailGestor){

                throw new Error(
                    "Informe o e-mail do gestor."
                );

            }


            if(
                senhaGestor.length < 6
            ){

                throw new Error(
                    "A senha deve ter pelo menos 6 caracteres."
                );

            }


            if(
                senhaGestor !==
                confirmarSenha
            ){

                throw new Error(
                    "As senhas não coincidem."
                );

            }


            // =========================================
            // INICIAR
            // =========================================

            mostrarMensagem(
                "A criar a conta do gestor...",
                "sucesso"
            );


            // =========================================
            // FIREBASE AUTH
            // =========================================

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


            // =========================================
            // DADOS
            // =========================================

            const dadosEscola = {

                nome:

                    nome,


                provincia:

                    provincia,


                municipio:

                    municipio,


                telefone:

                    telefone,


                email:

                    emailEscola,


                anoLetivoAtual:

                    anoLetivo,


                tipoEscola:

                    tipoSelecionado.value,


                ensinos:

                    ensinosSelecionados,


                gestorUid:

                    uidGestor,


                nomeGestor:

                    nomeGestor,


                emailGestor:

                    emailGestor,


                logoUrl:

                    "",


                ativo:

                    true,


                criadoEm:

                    serverTimestamp()

            };


            // =========================================
            // CRIAR ESCOLA
            // =========================================

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


            // =========================================
            // SUCESSO
            // =========================================

            mostrarMensagem(
                "Escola cadastrada com sucesso!",
                "sucesso"
            );


            document
                .getElementById(
                    "resultadoEscola"
                )
                .textContent =
                    nome;


            document
                .getElementById(
                    "resultadoGestor"
                )
                .textContent =
                    nomeGestor;


            document
                .getElementById(
                    "resultadoEmail"
                )
                .textContent =
                    emailGestor;


            document
                .getElementById(
                    "resultadoTipo"
                )
                .textContent =
                    tipoSelecionado.value ===
                    "publica"
                    ? "Pública"
                    : "Privada";


            document
                .getElementById(
                    "resultadoEnsinos"
                )
                .textContent =
                    ensinosSelecionados
                    .map(
                        nomeEnsino
                    )
                    .join(
                        " + "
                    );


            resultadoCadastro.style.display =
                "block";


            // =========================================
            // LIMPAR
            // =========================================

            form.reset();


            document
                .getElementById(
                    "classesPrimario"
                )
                .style.display =
                    "none";


            document
                .getElementById(
                    "etapasPrimario"
                )
                .style.display =
                    "none";


            document
                .getElementById(
                    "classesCiclo"
                )
                .style.display =
                    "none";


        }
        catch(erro){

            console.error(
                "ERRO NO CADASTRO:",
                erro
            );


            let mensagemErro =
                "Não foi possível concluir o cadastro.";


            if(
                erro.code ===
                "auth/email-already-in-use"
            ){

                mensagemErro =
                    "Este e-mail do gestor já está cadastrado.";

            }


            else if(
                erro.code ===
                "auth/invalid-email"
            ){

                mensagemErro =
                    "O e-mail informado é inválido.";

            }


            else if(
                erro.code ===
                "auth/weak-password"
            ){

                mensagemErro =
                    "A senha é muito fraca.";

            }


            else if(
                erro.code ===
                "permission-denied"
            ){

                mensagemErro =
                    "Sem permissão para gravar no Firestore.";

            }


            else if(
                erro.message
            ){

                mensagemErro =
                    erro.message;

            }


            mostrarMensagem(
                mensagemErro,
                "erro"
            );

        }


        finally{

            btnCadastrar.disabled =
                false;

        }

    }
);
