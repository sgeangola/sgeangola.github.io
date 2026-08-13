import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import {
    collection,
    addDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

import {
    auth,
    db,
    storage
} from "./firebase.js";


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

logoInput.addEventListener("change", () => {

    const arquivo = logoInput.files[0];

    if (!arquivo) {

        logoPreview.textContent = "Logotipo";

        return;
    }

    if (!arquivo.type.startsWith("image/")) {

        logoInput.value = "";

        logoPreview.textContent =
            "Arquivo inválido";

        return;
    }

    const leitor = new FileReader();

    leitor.onload = evento => {

        logoPreview.innerHTML = `
            <img
                src="${evento.target.result}"
                alt="Logotipo"
            >
        `;
    };

    leitor.readAsDataURL(arquivo);
});


// =====================================================
// MENSAGEM
// =====================================================

function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;

    mensagem.className = tipo;
}


// =====================================================
// CADASTRO
// =====================================================

form.addEventListener("submit", async evento => {

    evento.preventDefault();

    btnCadastrar.disabled = true;

    resultadoCadastro.style.display = "none";

    try {

        // =================================================
        // DADOS DA ESCOLA
        // =================================================

        const nome =
            document.getElementById("nome").value.trim();

        const provincia =
            document.getElementById("provincia").value.trim();

        const municipio =
            document.getElementById("municipio").value.trim();

        const telefone =
            document.getElementById("telefone").value.trim();

        const emailEscola =
            document.getElementById("emailEscola").value.trim();

        const anoLetivo =
            document.getElementById("anoLetivo").value.trim();


        // =================================================
        // DADOS DO GESTOR
        // =================================================

        const nomeGestor =
            document.getElementById("nomeGestor").value.trim();

        const emailGestor =
            document.getElementById("emailGestor")
            .value
            .trim();

        const senhaGestor =
            document.getElementById("senhaGestor")
            .value;

        const confirmarSenha =
            document.getElementById("confirmarSenha")
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
                "Informe o nome do gestor."
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


        mostrarMensagem(
            "A criar a conta do gestor...",
            "sucesso"
        );


        // =================================================
        // CRIAR CONTA FIREBASE AUTH
        // =================================================

        const credencial =
            await createUserWithEmailAndPassword(
                auth,
                emailGestor,
                senhaGestor
            );


        const uidGestor =
            credencial.user.uid;


        // =================================================
        // CRIAR ESCOLA
        // =================================================

        const escolaRef =
            await addDoc(
                collection(db, "escolas"),
                {

                    nome,

                    provincia,

                    municipio,

                    telefone,

                    email:
                        emailEscola,

                    anoLetivoAtual:
                        anoLetivo,

                    gestorUid:
                        uidGestor,

                    nomeGestor,

                    emailGestor,

                    logoUrl:
                        "",

                    ativo:
                        true,

                    criadoEm:
                        serverTimestamp()
                }
            );


        // =================================================
        // LOGOTIPO
        // =================================================

        const arquivoLogo =
            logoInput.files[0];


        if (arquivoLogo) {

            if (
                !arquivoLogo.type
                    .startsWith("image/")
            ) {

                throw new Error(
                    "O logotipo precisa ser uma imagem."
                );
            }


            if (
                arquivoLogo.size >
                5 * 1024 * 1024
            ) {

                throw new Error(
                    "O logotipo não pode ultrapassar 5 MB."
                );
            }


            mostrarMensagem(
                "A enviar o logotipo...",
                "sucesso"
            );


            const caminho =
                `escolas/${escolaRef.id}/logo/${arquivoLogo.name}`;


            const logoRef =
                ref(storage, caminho);


            await uploadBytes(
                logoRef,
                arquivoLogo
            );


            const logoUrl =
                await getDownloadURL(logoRef);


            await updateDoc(
                escolaRef,
                {
                    logoUrl
                }
            );
        }


        // =================================================
        // SUCESSO
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


        form.reset();

        logoPreview.textContent =
            "Logotipo";


    } catch (erro) {

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
                "Este e-mail já está cadastrado.";

        } else if (
            erro.code ===
            "auth/invalid-email"
        ) {

            mensagemErro =
                "O e-mail informado é inválido.";

        } else if (
            erro.code ===
            "auth/weak-password"
        ) {

            mensagemErro =
                "A senha é muito fraca.";

        } else if (
            erro.code ===
            "permission-denied"
        ) {

            mensagemErro =
                "Sem permissão para gravar no Firebase.";

        } else if (erro.message) {

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
