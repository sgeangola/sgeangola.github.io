// =====================================================
// REGISTER SCHOOL — SGE ANGOLA
// Cadastro da escola + conta do gestor
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

const btnCadastrar =
    document.getElementById("btnCadastrar");

const mensagem =
    document.getElementById("mensagem");

const logoInput =
    document.getElementById("logo");

const logoPreview =
    document.getElementById("logoPreview");

const resultadoCadastro =
    document.getElementById("resultadoCadastro");


// =====================================================
// PRÉ-VISUALIZAÇÃO DO LOGOTIPO
// =====================================================

if (logoInput) {

    logoInput.addEventListener("change", () => {

        const arquivo = logoInput.files[0];

        if (!arquivo) {

            logoPreview.textContent = "Logotipo";

            return;
        }


        // Verificar se é imagem

        if (!arquivo.type.startsWith("image/")) {

            logoInput.value = "";

            logoPreview.textContent =
                "Arquivo inválido";

            mostrarMensagem(
                "Selecione uma imagem PNG, JPG ou WEBP.",
                "erro"
            );

            return;
        }


        // Limite de 5 MB

        if (arquivo.size > 5 * 1024 * 1024) {

            logoInput.value = "";

            logoPreview.textContent =
                "Logotipo";

            mostrarMensagem(
                "O logotipo não pode ultrapassar 5 MB.",
                "erro"
            );

            return;
        }


        // Pré-visualização

        const leitor = new FileReader();

        leitor.onload = evento => {

            logoPreview.innerHTML = `
                <img
                    src="${evento.target.result}"
                    alt="Logotipo da escola"
                >
            `;

        };

        leitor.readAsDataURL(arquivo);

    });

}


// =====================================================
// MENSAGEM
// =====================================================

function mostrarMensagem(texto, tipo) {

    if (!mensagem) return;

    mensagem.textContent = texto;

    mensagem.className = tipo;
}


// =====================================================
// CADASTRO
// =====================================================

if (form) {

    form.addEventListener("submit", async evento => {

        evento.preventDefault();


        btnCadastrar.disabled = true;

        resultadoCadastro.style.display = "none";


        try {

            // =================================================
            // DADOS DA ESCOLA
            // =================================================

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


            // =================================================
            // DADOS DO GESTOR
            // =================================================

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


            // =================================================
            // VALIDAÇÕES
            // =================================================

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


            if (!nomeGestor) {

                throw new Error(
                    "Informe o nome completo do gestor."
                );

            }


            if (!emailGestor) {

                throw new Error(
                    "Informe o e-mail do gestor."
                );

            }


            if (senhaGestor.length < 6) {

                throw new Error(
                    "A senha deve ter pelo menos 6 caracteres."
                );

            }


            if (senhaGestor !== confirmarSenha) {

                throw new Error(
                    "As senhas não coincidem."
                );

            }


            // =================================================
            // CRIAR CONTA DO GESTOR
            // =================================================

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


            // =================================================
            // CADASTRAR ESCOLA NO FIRESTORE
            // =================================================

            mostrarMensagem(
                "A guardar os dados da escola...",
                "sucesso"
            );


            const escolaRef =
                await addDoc(
                    collection(db, "escolas"),
                    {

                        nome: nome,

                        provincia: provincia,

                        municipio: municipio,

                        telefone: telefone,

                        email: emailEscola,

                        anoLetivoAtual:
                            anoLetivo,

                        gestorUid:
                            uidGestor,

                        nomeGestor:
                            nomeGestor,

                        emailGestor:
                            emailGestor,

                        // O Storage ainda não está ativo.
                        // O logotipo será ligado posteriormente.

                        logoUrl: "",

                        ativo: true,

                        criadoEm:
                            serverTimestamp()

                    }
                );


            // =================================================
            // RESULTADO
            // =================================================

            mostrarMensagem(
                "Escola cadastrada com sucesso!",
                "sucesso"
            );


            document.getElementById(
                "resultadoEmail"
            ).textContent =
                emailGestor;


            document.getElementById(
                "resultadoEscola"
            ).textContent =
                nome;


            resultadoCadastro.style.display =
                "block";


            // =================================================
            // LIMPAR FORMULÁRIO
            // =================================================

            form.reset();


            logoPreview.textContent =
                "Logotipo";


            // =================================================
            // LOG
            // =================================================

            console.log(
                "ESCOLA CADASTRADA:",
                escolaRef.id
            );

            console.log(
                "GESTOR UID:",
                uidGestor
            );


        } catch (erro) {

            console.error(
                "ERRO NO CADASTRO:",
                erro
            );


            let mensagemErro =
                "Não foi possível concluir o cadastro.";


            // =================================================
            // ERROS FIREBASE AUTH
            // =================================================

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
                "auth/network-request-failed"
            ) {

                mensagemErro =
                    "Erro de conexão. Verifique a internet.";

            }


            else if (
                erro.code ===
                "permission-denied"
            ) {

                mensagemErro =
                    "Sem permissão para gravar no Firestore.";

            }


            else if (erro.message) {

                mensagemErro =
                    erro.message;

            }


            mostrarMensagem(
                mensagemErro,
                "erro"
            );


        } finally {

            btnCadastrar.disabled = false;

        }

    });

    }
