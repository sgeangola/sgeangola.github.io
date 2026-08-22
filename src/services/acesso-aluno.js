// =====================================================
// ACESSO-ALUNO.JS
// SGE ANGOLA
// CRIAÇÃO AUTOMÁTICA DO ACESSO DO ALUNO
// =====================================================

import { db } from "../firebase.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


// =====================================================
// CRIAR ACESSO DO ALUNO
// =====================================================

export async function criarAcessoAluno(aluno) {

    try {

        const codigoOriginal =
            String(
                aluno.codigoAluno || ""
            ).trim();


        const senha =
            String(
                aluno.senhaAcesso ||
                aluno.senha ||
                ""
            ).trim();


        if (!codigoOriginal) {

            throw new Error(
                "O aluno não possui codigoAluno."
            );

        }


        if (!senha) {

            throw new Error(
                "O aluno não possui senhaAcesso."
            );

        }


        // =================================================
        // NORMALIZAR CÓDIGO
        // Exemplo:
        // "7A -001" → "7A-001"
        // =================================================

        const codigoId =
            codigoOriginal
                .replace(/\s+/g, "")
                .replace(/\//g, "-");


        // =================================================
        // REFERÊNCIA
        // =================================================

        const acessoRef =
            doc(
                db,
                "acessosAlunos",
                codigoId
            );


        // =================================================
        // DADOS
        // =================================================

        const dadosAcesso = {

            codigoAluno:
                codigoOriginal,

            senhaAcesso:
                senha,

            alunoId:
                aluno.alunoId ||
                aluno.id ||
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

            nome:
                aluno.nome ||
                "",

            estado:
                aluno.estado ||
                "ativo",

            atualizadoEm:
                serverTimestamp()

        };


        // =================================================
        // GRAVAR
        // =================================================

        await setDoc(
            acessoRef,
            dadosAcesso,
            {
                merge: true
            }
        );


        console.log(
            "✅ ACESSO DO ALUNO CRIADO:",
            codigoId
        );


        return true;

    }

    catch (erro) {

        console.error(
            "❌ ERRO AO CRIAR ACESSO DO ALUNO:",
            erro
        );

        throw erro;

    }

  }
