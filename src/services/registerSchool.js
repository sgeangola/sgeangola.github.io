// =====================================================
// REGISTER SCHOOL - SGE ANGOLA
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

const logoInput =
    document.getElementById("logo");

const logoPreview =
    document.getElementById("logoPreview");

const tipoEscola =
    document.getElementById("tipoEscola");

const opcoesPrimario =
    document.getElementById("opcoesPrimario");

const opcoesPrimeiroCiclo =
    document.getElementById("opcoesPrimeiroCiclo");

const resultadoCadastro =
    document.getElementById("resultadoCadastro");


// =====================================================
// PRÉ-VISUALIZAÇÃO DO LOGOTIPO
// =====================================================

logoInput.addEventListener(
    "change",
    () => {

        const arquivo =
            logoInput.files[0];

        if (!arquivo) {

            logoPreview.textContent =
                "Logotipo";

            return;
        }

        if (
            !arquivo.type.startsWith("image/")
        ) {

            logoInput.value = "";

            logoPreview.textContent =
                "Arquivo inválido";

            return;
        }

        const leitor =
            new FileReader();

        leitor.onload =
            evento => {

                logoPreview.innerHTML = `

                    <img
                        src="${evento.target.result}"
                        alt="Logotipo"
                    >

                `;
            };

        leitor.readAsDataURL(
            arquivo
        );

    }
);


// =====================================================
// MOSTRAR / ESCONDER ESTRUTURAS
// =====================================================

document
    .querySelectorAll(
        'input[name="ensino"]'
    )
    .forEach(
        checkbox => {

            checkbox.addEventListener(
                "change",
                atualizarEnsinos
            );

        }
    );


function atualizarEnsinos() {

    const primario =
        document.querySelector(
            'input[name="ensino"][value="ensinoPrimario"]'
        ).checked;

    const primeiroCiclo =
        document.querySelector(
            'input[name="ensino"][value="primeiroCiclo"]'
        ).checked;


    opcoesPrimario.style.display =
        primario
        ? "block"
        : "none";


    opcoesPrimeiroCiclo.style.display =
        primeiroCiclo
        ? "block"
        : "none";


    if (!primario) {

        document
            .querySelectorAll(
                'input[name="estruturaPrimario"]'
            )
            .forEach(
                input => input.checked = false
            );

    }


    if (!primeiroCiclo) {

        document
            .querySelectorAll(
                'input[name="estruturaPrimeiroCiclo"]'
            )
            .forEach(
                input => input.checked = false
            );

    }

}


// =====================================================
// MENSAGEM
// =====================================================

function mostrarMensagem(
    texto,
    tipo
) {

    mensagem.textContent =
        texto;

    mensagem.className =
        tipo;

}


// =====================================================
// CONVERTER LOGOTIPO
// =====================================================
//
// Como o Storage deste projeto está pedindo
// upgrade, o logotipo será convertido para
// uma imagem pequena e guardado no Firestore.
// =====================================================

async function prepararLogo(
    arquivo
) {

    if (!arquivo) {

        return "";

    }


    if (
        !arquivo.type.startsWith("image/")
    ) {

        throw new Error(
            "O logotipo precisa ser uma imagem."
        );

    }


    return new Promise(
        (resolve, reject) => {

            const leitor =
                new FileReader();


            leitor.onload =
                evento => {

                    const imagem =
                        new Image();


                    imagem.onload =
                        () => {

                            const tamanhoMaximo =
                                500;


                            let largura =
                                imagem.width;

                            let altura =
                                imagem.height;


                            if (
                                largura >
                                tamanhoMaximo ||
                                altura >
                                tamanhoMaximo
                            ) {

                                if (
                                    largura >
                                    altura
                                ) {

                                    altura =
                                        Math.round(
                                            altura *
                                            tamanhoMaximo /
                                            largura
                                        );

                                    largura =
                                        tamanhoMaximo;

                                }
                                else {

                                    largura =
                                        Math.round(
                                            largura *
                                            tamanhoMaximo /
                                            altura
                                        );

                                    altura =
                                        tamanhoMaximo;

                                }

                            }


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                largura;

                            canvas.height =
                                altura;


                            const contexto =
                                canvas.getContext(
                                    "2d"
                                );


                            contexto.drawImage(
                                imagem,
                                0,
                                0,
                                largura,
                                altura
                            );


                            const dataUrl =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.75
                                );


                            resolve(
                                dataUrl
                            );

                        };


                    imagem.onerror =
                        () => {

                            reject(
                                new Error(
                                    "Não foi possível processar o logotipo."
                                )
                            );

                        };


                    imagem.src =
                        evento.target.result;

                };


            leitor.onerror =
                () => {

                    reject(
                        new Error(
                            "Não foi possível ler o logotipo."
                        )
                    );

                };


            leitor.readAsDataURL(
                arquivo
            );

        }
    );

}


// =====================================================
// OBTER CHECKBOXES
// =====================================================

function obterValores(
    nome
) {

    return Array.from(
        document.querySelectorAll(
            `input[name="${nome}"]:checked`
        )
    ).map(
        input => input.value
    );

}


// =====================================================
// NOMES DAS CLASSES
// =====================================================

const nomesEstrutura = {

    "1classe":
        "1ª classe",

    "2classe":
        "2ª classe",

    "3classe":
        "3ª classe",

    "4classe":
        "4ª classe",

    "5classe":
        "5ª classe",

    "6classe":
        "6ª classe",

    "1etapa":
        "1ª Etapa",

    "2etapa":
        "2ª Etapa",

    "3etapa":
        "3ª Etapa",

    "7classe":
        "7ª classe",

    "8classe":
        "8ª classe",

    "9classe":
        "9ª classe",

    "eja1":
        "EJA 1",

    "eja2":
        "EJA 2"

};


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
            // ESCOLA
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


            const tipo =
                tipoEscola.value;


            // =========================================
            // ENSINOS
            // =========================================

            const ensinos =
                obterValores("ensino");


            const estruturaPrimario =
                obterValores(
                    "estruturaPrimario"
                );


            const estruturaPrimeiroCiclo =
                obterValores(
                    "estruturaPrimeiroCiclo"
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


            if (!tipo) {

                throw new Error(
                    "Selecione se a escola é pública ou privada."
                );

            }


            if (
                ensinos.length === 0
            ) {

                throw new Error(
                    "Selecione pelo menos um ensino."
                );

            }


            if (
                ensinos.includes(
                    "ensinoPrimario"
                ) &&
                estruturaPrimario.length === 0
            ) {

                throw new Error(
                    "Selecione pelo menos uma classe ou etapa do Ensino Primário."
                );

            }


            if (
                ensinos.includes(
                    "primeiroCiclo"
                ) &&
                estruturaPrimeiroCiclo.length === 0
            ) {

                throw new Error(
                    "Selecione pelo menos uma classe ou EJA do Primeiro Ciclo."
                );

            }


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


            // =========================================
            // LOGOTIPO
            // =========================================

            mostrarMensagem(
                "A preparar o cadastro...",
                "sucesso"
            );


            const arquivoLogo =
                logoInput.files[0];


            const logoUrl =
                await prepararLogo(
                    arquivoLogo
                );


            // =========================================
            // CRIAR GESTOR
            // =========================================

            mostrarMensagem(
                "A criar a conta do gestor...",
                "sucesso"
            );


            const credencial =
                await createUserWithEmailAndPassword(
                    auth,
                    emailGestor,
                    senhaGestor
                );


            const uidGestor =
                credencial.user.uid;


            // =========================================
            // DADOS DE ESTRUTURA
            // =========================================

            const estrutura = {

                ensinoPrimario:
                    estruturaPrimario,

                primeiroCiclo:
                    estruturaPrimeiroCiclo

            };


            // =========================================
            // CRIAR ESCOLA
            // =========================================

            mostrarMensagem(
                "A guardar os dados da escola...",
                "sucesso"
            );


            const escolaRef =
                await addDoc(
                    collection(
                        db,
                        "escolas"
                    ),
                    {

                        nome,

                        provincia,

                        municipio,

                        telefone,

                        email:
                            emailEscola,

                        anoLetivoAtual:
                            anoLetivo,

                        tipoEscola:
                            tipo,

                        financeiroAtivo:
                            tipo ===
                            "privada",

                        ensinos,

                        estrutura,

                        gestorUid:
                            uidGestor,

                        nomeGestor,

                        emailGestor,

                        logoUrl,

                        ativo:
                            true,

                        criadoEm:
                            serverTimestamp()

                    }
                );


            // =========================================
            // GUARDAR DADOS DA ESCOLA
            // =========================================

            sessionStorage.setItem(
                "escolaId",
                escolaRef.id
            );


            sessionStorage.setItem(
                "nomeEscola",
                nome
            );


            sessionStorage.setItem(
                "logoEscola",
                logoUrl
            );


            sessionStorage.setItem(
                "tipoEscola",
                tipo
            );


            sessionStorage.setItem(
                "financeiroAtivo",
                tipo ===
                "privada"
                    ? "true"
                    : "false"
            );


            sessionStorage.setItem(
                "ensinos",
                JSON.stringify(
                    ensinos
                )
            );


            sessionStorage.setItem(
                "estruturaEscola",
                JSON.stringify(
                    estrutura
                )
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
                    "resultadoNomeGestor"
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
                tipo === "privada"
                    ? "Privada"
                    : "Pública";


            const nomesEnsinos =
                [];


            if (
                ensinos.includes(
                    "ensinoPrimario"
                )
            ) {

                nomesEnsinos.push(
                    "Ensino Primário"
                );

            }


            if (
                ensinos.includes(
                    "primeiroCiclo"
                )
            ) {

                nomesEnsinos.push(
                    "Primeiro Ciclo"
                );

            }


            document
                .getElementById(
                    "resultadoEnsinos"
                )
                .textContent =
                nomesEnsinos.join(
                    " + "
                );


            resultadoCadastro.style.display =
                "block";


            form.reset();


            logoPreview.textContent =
                "Logotipo";


            opcoesPrimario.style.display =
                "none";


            opcoesPrimeiroCiclo.style.display =
                "none";


            console.log(
                "ESCOLA CRIADA:",
                escolaRef.id
            );


            console.log(
                "GESTOR UID:",
                uidGestor
            );


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
                    "O e-mail do gestor é inválido.";

            }

            else if (
                erro.code ===
                "auth/weak-password"
            ) {

                mensagemErro =
                    "A senha é muito fraca.";

            }

            else if (
                erro.code ===
                "permission-denied"
            ) {

                mensagemErro =
                    "O Firebase recusou a gravação. Verifique as regras do Firestore.";

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

            btnCadastrar.disabled =
                false;

        }

    }
);
