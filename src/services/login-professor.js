import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


// =====================================================
// CAMPOS
// =====================================================

const codigoInput =
    document.getElementById("codigo");

const senhaInput =
    document.getElementById("senha");

const botaoEntrar =
    document.getElementById("entrar");


// =====================================================
// VERIFICAR ELEMENTOS
// =====================================================

if (!codigoInput || !senhaInput || !botaoEntrar) {

    console.error(
        "❌ Elementos do login do professor não encontrados."
    );

    throw new Error(
        "Campos de login não encontrados."
    );

}


// =====================================================
// LOGIN
// =====================================================

botaoEntrar.addEventListener(
    "click",
    async () => {

        const codigo =
            codigoInput.value.trim();

        const senha =
            senhaInput.value.trim();


        // ---------------------------------------------
        // VALIDAR CAMPOS
        // ---------------------------------------------

        if (!codigo || !senha) {

            alert(
                "Preencha o código e a senha."
            );

            return;

        }


        try {

            // -----------------------------------------
            // COLEÇÃO PROFESSORES
            // -----------------------------------------

            const professoresRef =
                collection(
                    db,
                    "professores"
                );


            // -----------------------------------------
            // PROCURAR PROFESSOR
            // -----------------------------------------

            const q =
                query(

                    professoresRef,

                    where(
                        "codigoProfessor",
                        "==",
                        codigo
                    ),

                    where(
                        "senhaAcesso",
                        "==",
                        senha
                    )

                );


            const resultado =
                await getDocs(q);


            // -----------------------------------------
            // NÃO ENCONTRADO
            // -----------------------------------------

            if (
                resultado.empty
            ) {

                alert(
                    "Código ou senha incorretos."
                );

                return;

            }


            // -----------------------------------------
            // DADOS DO PROFESSOR
            // -----------------------------------------

            let professor = null;


            resultado.forEach(
                documento => {

                    professor = {

                        id:
                            documento.id,

                        ...documento.data()

                    };

                }
            );


            // -----------------------------------------
            // IDENTIFICAR ESCOLA
            // -----------------------------------------
            //
            // Primeiro tenta escolaId.
            //
            // Se o documento usar schoolId,
            // também funciona.
            //

            const escolaId =
                professor.escolaId ||
                professor.schoolId ||
                "";


            console.log(
                "👨‍🏫 Professor:",
                professor
            );


            console.log(
                "🏫 Escola identificada:",
                escolaId
            );


            // -----------------------------------------
            // VERIFICAR ESCOLA
            // -----------------------------------------

            if (!escolaId) {

                alert(
                    "❌ Este professor não possui uma escola associada."
                );

                console.error(
                    "Professor sem escolaId/schoolId:",
                    professor
                );

                return;

            }


            // =================================================
            // GUARDAR PROFESSOR
            // =================================================

            localStorage.setItem(
                "professorLogado",
                JSON.stringify(
                    professor
                )
            );


            // =================================================
            // GUARDAR ESCOLA
            // =================================================
            //
            // sessionStorage:
            // usado pela Mini-Pauta.
            //
            // localStorage:
            // serve como segurança caso a sessão seja perdida.
            //

            sessionStorage.setItem(
                "escolaId",
                escolaId
            );


            localStorage.setItem(
                "escolaId",
                escolaId
            );


            // =================================================
            // DEBUG
            // =================================================

            console.log(
                "✅ Login realizado."
            );

            console.log(
                "👨‍🏫 professorLogado:",
                localStorage.getItem(
                    "professorLogado"
                )
            );

            console.log(
                "🏫 sessionStorage escolaId:",
                sessionStorage.getItem(
                    "escolaId"
                )
            );

            console.log(
                "🏫 localStorage escolaId:",
                localStorage.getItem(
                    "escolaId"
                )
            );


            // =================================================
            // IR PARA PAINEL
            // =================================================

            window.location.href =
                "painel-professor.html";


        }
        catch (erro) {

            console.error(
                "❌ ERRO NO LOGIN:",
                erro
            );

            alert(
                "Erro ao entrar."
            );

        }

    }
);
