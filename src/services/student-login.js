// =====================================================
// LOGIN DO ALUNO - SGE
// NOVA VERSÃO
// Usa a coleção:
// acessosAlunos
// =====================================================

alert("STUDENT-LOGIN.JS CARREGADO ✅");


import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


// =====================================================
// FORMULÁRIO
// =====================================================

const form =
    document.getElementById(
        "loginAluno"
    );


if (!form) {

    alert(
        "Formulário loginAluno não encontrado."
    );

    throw new Error(
        "loginAluno não encontrado."
    );

}


// =====================================================
// LOGIN
// =====================================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const campoCodigo =
            document.getElementById(
                "codigoAluno"
            );


        const campoSenha =
            document.getElementById(
                "senhaAluno"
            );


        if (
            !campoCodigo ||
            !campoSenha
        ) {

            alert(
                "Campos de login não encontrados."
            );

            return;

        }


        const codigoAluno =
            campoCodigo.value.trim();


        const senha =
            campoSenha.value.trim();


        if (
            !codigoAluno ||
            !senha
        ) {

            alert(
                "Preencha o código e a senha."
            );

            return;

        }


        try {

            console.log(
                "================================="
            );

            console.log(
                "🎓 INICIANDO LOGIN DO ALUNO"
            );

            console.log(
                "Código:",
                codigoAluno
            );


            // =================================================
            // NORMALIZAR CÓDIGO
            // =================================================

            const codigoId =
                codigoAluno
                    .replace(/\s+/g, "")
                    .replace(/\//g, "-");


            console.log(
                "🔎 ID DE ACESSO:",
                codigoId
            );


            // =================================================
            // PROCURAR ACESSO
            // =================================================

            const acessoRef =
                doc(
                    db,
                    "acessosAlunos",
                    codigoId
                );


            const acessoSnap =
                await getDoc(
                    acessoRef
                );


            // =================================================
            // NÃO EXISTE
            // =================================================

            if (
                !acessoSnap.exists()
            ) {

                console.warn(
                    "❌ Acesso não encontrado."
                );

                alert(
                    "Código ou senha incorretos."
                );

                return;

            }


            const acesso =
                acessoSnap.data();


            console.log(
                "📦 ACESSO ENCONTRADO:",
                acesso
            );


            // =================================================
            // VERIFICAR ESTADO
            // =================================================

            if (
                String(
                    acesso.estado ||
                    "ativo"
                ).toLowerCase() !==
                "ativo"
            ) {

                alert(
                    "❌ Este acesso está inativo."
                );

                return;

            }


            // =================================================
            // VERIFICAR SENHA
            // =================================================

            const senhaFirebase =
                String(
                    acesso.senhaAcesso ||
                    ""
                ).trim();


            if (
                senhaFirebase !== senha
            ) {

                console.warn(
                    "❌ Senha incorreta."
                );

                alert(
                    "Código ou senha incorretos."
                );

                return;

            }


            // =================================================
            // CRIAR SESSÃO
            // =================================================

            const alunoLogado = {

                id:
                    acesso.alunoId || "",

                alunoId:
                    acesso.alunoId || "",

                codigoAluno:
                    acesso.codigoAluno ||
                    codigoAluno,

                nome:
                    acesso.nome || "",

                turmaId:
                    acesso.turmaId || "",

                turmaNome:
                    acesso.turmaNome || "",

                escolaId:
                    acesso.escolaId || "",

                estado:
                    acesso.estado ||
                    "ativo"

            };


            // =================================================
            // GUARDAR ESCOLA
            // =================================================

            if (
                alunoLogado.escolaId
            ) {

                sessionStorage.setItem(
                    "escolaId",
                    alunoLogado.escolaId
                );

                localStorage.setItem(
                    "escolaId",
                    alunoLogado.escolaId
                );

            }


            // =================================================
            // GUARDAR TURMA
            // =================================================

            if (
                alunoLogado.turmaId
            ) {

                localStorage.setItem(
                    "turmaId",
                    alunoLogado.turmaId
                );

            }


            localStorage.setItem(
                "turmaNome",
                alunoLogado.turmaNome
            );


            // =================================================
            // GUARDAR ALUNO LOGADO
            // =================================================

            localStorage.setItem(
                "alunoLogado",
                JSON.stringify(
                    alunoLogado
                )
            );


            console.log(
                "================================="
            );

            console.log(
                "✅ LOGIN DO ALUNO REALIZADO"
            );

            console.log(
                alunoLogado
            );

            console.log(
                "================================="
            );


            // =================================================
            // REDIRECIONAR
            // =================================================

            window.location.href =
                "../pages/student-area.html";

        }

        catch (erro) {

            console.error(
                "❌ ERRO NO LOGIN DO ALUNO:",
                erro
            );


            alert(
                "Erro no login:\n\n" +
                erro.message
            );

        }

    }
);
