// =====================================================
// LOGIN DO ALUNO - SGE
// Procura primeiro em "alunos"
// Depois procura dentro de "turmas/{turmaId}/alunos"
// =====================================================

alert("STUDENT-LOGIN.JS CARREGOU ✅");


import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


// =====================================================
// FORMULÁRIO
// =====================================================

const form =
    document.getElementById("loginAluno");


if (!form) {

    alert(
        "Formulário loginAluno não encontrado."
    );

    throw new Error(
        "loginAluno não encontrado."
    );

}


// =====================================================
// SUBMIT
// =====================================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const codigoAluno =
            document
                .getElementById("codigoAluno")
                .value
                .trim();


        const senha =
            document
                .getElementById("senhaAluno")
                .value
                .trim();


        if (!codigoAluno || !senha) {

            alert(
                "Preencha o código e a senha."
            );

            return;

        }


        try {

            alert("Procurando aluno...");


            let alunoEncontrado = null;


            // =================================================
            // 1. PROCURAR NA COLEÇÃO PRINCIPAL "alunos"
            // =================================================

            const alunosSnapshot =
                await getDocs(
                    collection(
                        db,
                        "alunos"
                    )
                );


            for (
                const alunoDoc
                of alunosSnapshot.docs
            ) {

                const dados =
                    alunoDoc.data();


                const codigo =
                    String(
                        dados.codigoAluno || ""
                    ).trim();


                const senhaFirebase =
                    String(
                        dados.senha || ""
                    ).trim();


                if (
                    codigo === codigoAluno &&
                    senhaFirebase === senha
                ) {

                    alunoEncontrado = {

                        id:
                            alunoDoc.id,

                        // 🔥 ESCOLA
                        escolaId:
                            dados.escolaId || "",

                        nome:
                            dados.nome || "",

                        codigoAluno:
                            codigo,

                        numero:
                            dados.numero || "",

                        sexo:
                            dados.sexo || "",

                        estado:
                            String(
                                dados.estado ||
                                "ativo"
                            ).trim(),

                        classe:
                            dados.classe || "",

                        ensino:
                            dados.ensino || "",

                        anoLetivo:
                            dados.anoLetivo || "",

                        turmaId:
                            dados.turmaId || "",

                        turmaNome:
                            dados.turmaNome || "",

                        origem:
                            "alunos"

                    };


                    break;

                }

            }


            // =================================================
            // 2. PROCURAR NAS TURMAS
            // =================================================

            if (!alunoEncontrado) {

                console.log(
                    "Aluno não encontrado em alunos."
                );

                console.log(
                    "Procurando nas turmas..."
                );


                const turmasSnapshot =
                    await getDocs(
                        collection(
                            db,
                            "turmas"
                        )
                    );


                for (
                    const turmaDoc
                    of turmasSnapshot.docs
                ) {

                    const turmaDados =
                        turmaDoc.data();


                    console.log(
                        "🏫 Verificando turma:",
                        turmaDoc.id,
                        turmaDados
                    );


                    const alunosTurmaSnapshot =
                        await getDocs(

                            collection(
                                db,
                                "turmas",
                                turmaDoc.id,
                                "alunos"
                            )

                        );


                    for (
                        const alunoDoc
                        of alunosTurmaSnapshot.docs
                    ) {

                        const dados =
                            alunoDoc.data();


                        const codigo =
                            String(
                                dados.codigoAluno || ""
                            ).trim();


                        const senhaFirebase =
                            String(
                                dados.senhaAcesso ||
                                dados.senha ||
                                ""
                            ).trim();


                        if (
                            codigo === codigoAluno &&
                            senhaFirebase === senha
                        ) {

                            alunoEncontrado = {

                                id:
                                    alunoDoc.id,

                                // =================================
                                // 🔥 ESCOLA ID
                                // =================================

                                escolaId:
                                    dados.escolaId ||
                                    turmaDados.escolaId ||
                                    "",


                                turmaId:
                                    turmaDoc.id,


                                nome:
                                    dados.nome || "",


                                codigoAluno:
                                    codigo,


                                numero:
                                    dados.numero || "",


                                senhaAcesso:
                                    senhaFirebase,


                                sexo:
                                    dados.sexo || "",


                                estado:
                                    String(
                                        dados.estado ||
                                        "ativo"
                                    ).trim(),


                                classe:
                                    dados.classe ||
                                    turmaDados.classe ||
                                    "",


                                ensino:
                                    dados.ensino ||
                                    turmaDados.ensino ||
                                    "",


                                anoLetivo:
                                    dados.anoLetivo ||
                                    turmaDados.anoLetivo ||
                                    "",


                                turmaNome:
                                    dados.turmaNome ||
                                    turmaDados.nome ||
                                    "",


                                origem:
                                    "turma"

                            };


                            break;

                        }

                    }


                    if (alunoEncontrado) {

                        break;

                    }

                }

            }


            // =================================================
            // 3. NÃO ENCONTROU
            // =================================================

            if (!alunoEncontrado) {

                alert(
                    "Código ou senha incorretos."
                );

                return;

            }


            // =================================================
            // 4. VERIFICAR ESCOLA
            // =================================================

            console.log(
                "🏫 ESCOLA DO ALUNO:",
                alunoEncontrado.escolaId
            );


            if (
                !alunoEncontrado.escolaId
            ) {

                console.warn(
                    "⚠️ O aluno foi encontrado, mas a escola não está associada."
                );

                alert(
                    "⚠️ Aluno encontrado, mas a escola não está identificada."
                );

                // Não bloqueamos o login.
                // Apenas avisamos.
            }


            // =================================================
            // 5. GUARDAR ESCOLA TAMBÉM NA SESSÃO
            // =================================================

            if (
                alunoEncontrado.escolaId
            ) {

                sessionStorage.setItem(
                    "escolaId",
                    alunoEncontrado.escolaId
                );

            }


            // =================================================
            // 6. GUARDAR SESSÃO DO ALUNO
            // =================================================

            localStorage.setItem(
                "alunoLogado",
                JSON.stringify(
                    alunoEncontrado
                )
            );


            console.log(
                "================================="
            );

            console.log(
                "🎓 ALUNO ENCONTRADO"
            );

            console.log(
                alunoEncontrado
            );

            console.log(
                "🏫 escolaId:",
                alunoEncontrado.escolaId
            );

            console.log(
                "🏫 turmaId:",
                alunoEncontrado.turmaId
            );

            console.log(
                "👨‍🎓 alunoId:",
                alunoEncontrado.id
            );

            console.log(
                "================================="
            );


            // =================================================
            // 7. CONFIRMAÇÃO
            // =================================================

            alert(

                "LOGIN REALIZADO COM SUCESSO ✅\n\n" +

                "Nome: " +
                alunoEncontrado.nome +

                "\nCódigo: " +
                alunoEncontrado.codigoAluno +

                "\nNúmero: " +
                (
                    alunoEncontrado.numero ||
                    "não informado"
                ) +

                "\nTurma: " +
                (
                    alunoEncontrado.turmaNome ||
                    "não informada"
                ) +

                "\nEscola ID: " +
                (
                    alunoEncontrado.escolaId ||
                    "não identificada"
                )

            );


            // =================================================
            // 8. ÁREA DO ALUNO
            // =================================================

            window.location.href =
                "../pages/student-area.html";

        }

        catch (error) {

            console.error(
                "ERRO NO LOGIN:",
                error
            );


            alert(
                "Erro no login:\n\n" +
                error.message
            );

        }

    }

);
