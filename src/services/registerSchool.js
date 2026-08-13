import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

import {
    db,
    storage
} from "./firebase.js";


const form = document.getElementById("formEscola");
const btnCadastrar = document.getElementById("btnCadastrar");
const mensagem = document.getElementById("mensagem");

const logoInput = document.getElementById("logo");
const logoPreview = document.getElementById("logoPreview");


// =====================================================
// PRÉ-VISUALIZAÇÃO DO LOGOTIPO
// =====================================================

logoInput.addEventListener("change", () => {

    const arquivo = logoInput.files[0];

    if (!arquivo) {
        logoPreview.innerHTML = "Logotipo";
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        logoPreview.innerHTML = "Arquivo inválido";
        logoInput.value = "";
        return;
    }

    const leitor = new FileReader();

    leitor.onload = (evento) => {

        logoPreview.innerHTML = `
            <img
                src="${evento.target.result}"
                alt="Pré-visualização do logotipo"
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
// CADASTRAR ESCOLA
// =====================================================

form.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    btnCadastrar.disabled = true;

    mostrarMensagem(
        "A cadastrar escola, aguarde...",
        "sucesso"
    );

    try {

        const nome =
            document.getElementById("nome").value.trim();

        const provincia =
            document.getElementById("provincia").value.trim();

        const municipio =
            document.getElementById("municipio").value.trim();

        const telefone =
            document.getElementById("telefone").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const anoLetivo =
            document.getElementById("anoLetivo").value.trim();

        const logoArquivo =
            logoInput.files[0];


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


        // =================================================
        // CRIAR DOCUMENTO DA ESCOLA
        // =================================================

        const escolaRef = await addDoc(
            collection(db, "escolas"),
            {
                nome,
                provincia,
                municipio,
                telefone,
                email,
                anoLetivoAtual: anoLetivo,
                logoUrl: "",
                ativo: true,
                criadoEm: serverTimestamp()
            }
        );


        // =================================================
        // UPLOAD DO LOGOTIPO
        // =================================================

        let logoUrl = "";


        if (logoArquivo) {

            if (!logoArquivo.type.startsWith("image/")) {

                throw new Error(
                    "O logotipo precisa ser uma imagem."
                );
            }


            // Limite de 5 MB

            if (logoArquivo.size > 5 * 1024 * 1024) {

                throw new Error(
                    "O logotipo não pode ultrapassar 5 MB."
                );
            }


            const caminhoLogo =
                `escolas/${escolaRef.id}/logo/${logoArquivo.name}`;


            const logoRef =
                ref(storage, caminhoLogo);


            await uploadBytes(
                logoRef,
                logoArquivo
            );


            logoUrl =
                await getDownloadURL(logoRef);


            // =================================================
            // ATUALIZAR DOCUMENTO COM O LOGOTIPO
            // =================================================

            const { updateDoc } =
                await import(
                    "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js"
                );


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


        form.reset();

        logoPreview.innerHTML = "Logotipo";


        console.log(
            "Escola cadastrada:",
            escolaRef.id
        );


    } catch (erro) {

        console.error(
            "Erro ao cadastrar escola:",
            erro
        );


        mostrarMensagem(
            erro.message ||
            "Não foi possível cadastrar a escola.",
            "erro"
        );


    } finally {

        btnCadastrar.disabled = false;

    }

});
