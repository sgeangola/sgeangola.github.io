// =====================================================
// STUDENT-LOGIN.JS
// SGE ANGOLA
// LOGIN DO ALUNO
// =====================================================

console.log(
    "STUDENT-LOGIN.JS CARREGADO ✅"
);


// =====================================================
// FIREBASE
// =====================================================

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

    console.error(
        "❌ Formulário #loginAluno não encontrado."
    );

    throw new Error(
        "Formulário loginAluno não encontrado."
    );

}


// =====================================================
// SUBMIT
// =====================================================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        try {

            // =============================================
            // CAMPOS
            // =============================================

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

                throw new Error(
                    "Campos de login não encontrados."
                );

            }


            const codigoAluno =
                campoCodigo
                    .value
                    .trim();


            const senha =
                campoSenha
                    .value
                    .trim();


            // =============================================
            // VALIDAR
            // =============================================

            if (
                !codigoAluno ||
                !senha
            ) {

                alert(
                    "⚠️ Preencha o código e a senha."
                );

                return;

            }


            console.log(
                "===================================="
            );

            console.log(
                "🎓 LOGIN DO ALUNO"
            );

            console.log(
                "Código:",
                codigoAluno
            );

            console.log(
                "===================================="
            );


            // =============================================
            // NORMALIZAR ID
            // =============================================

            const codigoId =
                codigoAluno
                    .replace(/\s+/g, "")
                    .replace(/\//g, "-");


            // =============================================
            // PROCURAR ACESSO
            // =============================================

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


            // =============================================
            // NÃO EXISTE
            // =============================================

            if (
                !acessoSnap.exists()
            ) {

                console.warn(
                    "⚠️ Acesso não encontrado:",
                    codigoId
                );


                alert(
                    "❌ Código ou senha incorretos."
                );

                return;

            }


            const aluno =
                acessoSnap.data();


            console.log(
                "👨‍🎓 ACESSO ENCONTRADO:",
                aluno
            );


            // =============================================
            // VERIFICAR SENHA
            // =============================================

            const senhaCorreta =
                String(
                    aluno.senhaAcesso ||
                    aluno.senha ||
                    ""
                ).trim();


            if (
                senhaCorreta !== senha
            ) {

                console.warn(
                    "⚠️ Senha incorreta."
                );


                alert(
                    "❌ Código ou senha incorretos."
                );

                return;

            }


            // =============================================
            // VERIFICAR ESTADO
            // =============================================

            const estado =
                String(
                    aluno.estado ||
                    "ativo"
                )
                .trim()
                .toLowerCase();


            if (
                estado === "transferido" ||
                estado === "desistente"
            ) {

                alert(

                    "⚠️ O acesso deste aluno está " +
                    estado +
                    ".\n\n" +
                    "O acesso à área do aluno está bloqueado."

                );

                return;

            }


            // =============================================
            // DADOS DA SESSÃO
            // =============================================

            const alunoLogado = {

                id:
                    aluno.alunoId ||
                    aluno.id ||
                    "",

                alunoId:
                    aluno.alunoId ||
                    aluno.id ||
                    "",

                codigoAluno:
                    aluno.codigoAluno ||
                    codigoAluno,

                nome:
                    aluno.nome ||
                    "",

                numero:
                    aluno.numero ||
                    "",

                sexo:
                    aluno.sexo ||
                    "",

                turmaId:
                    aluno.turmaId ||
                    "",

                turmaNome:
                    aluno.turmaNome ||
                    "",

                escolaId:
                    aluno.escolaId ||
                    "",

                estado:
                    estado,

                classe:
                    aluno.classe ||
                    "",

                ensino:
                    aluno.ensino ||
                    "",

                anoLetivo:
                    aluno.anoLetivo ||
                    ""

            };


            // =============================================
            // GUARDAR ESCOLA
            // =============================================

            if (
                alunoLogado.escolaId
            ) {

                sessionStorage.setItem(
                    "escolaId",
                    alunoLogado.escolaId
                );

            }


            // =============================================
            // GUARDAR TURMA
            // =============================================

            if (
                alunoLogado.turmaId
            ) {

                sessionStorage.setItem(
                    "turmaId",
                    alunoLogado.turmaId
                );

            }


            // =============================================
            // GUARDAR ALUNO
            // =============================================

            localStorage.setItem(
                "alunoLogado",
                JSON.stringify(
                    alunoLogado
                )
            );


            // =============================================
            // LOG
            // =============================================

            console.log(
                "===================================="
            );

            console.log(
                "✅ LOGIN REALIZADO"
            );

            console.log(
                "Aluno:",
                alunoLogado.nome
            );

            console.log(
                "Código:",
                alunoLogado.codigoAluno
            );

            console.log(
                "Turma:",
                alunoLogado.turmaNome
            );

            console.log(
                "Escola:",
                alunoLogado.escolaId
            );

            console.log(
                "===================================="
            );


            // =============================================
            // REDIRECIONAR
            // =============================================

            window.location.href =
                "../pages/student-area.html";

        }

        catch (erro) {

            console.error(
                "❌ ERRO NO LOGIN DO ALUNO:",
                erro
            );


            alert(

                "❌ Não foi possível realizar o login.\n\n" +

                erro.message

            );

        }

    }
);


console.log(
    "✅ LOGIN DO ALUNO PRONTO."
);
