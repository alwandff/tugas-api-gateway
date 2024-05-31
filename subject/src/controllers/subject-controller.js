const express = require("express");
const prisma = require("../database/prisma");
const { getAllSubject, getStudentByNIM, getSubjectByNameNIM, addSubject, getSubjectById, editSubjectById, deleteSubjectById } = require("../services/subject-service");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const subjects = await getAllSubject();
        res.send(subjects);
    } catch (error) {
        console.log(error.message)
    } finally {
        await prisma.$disconnect();
    }
})
router.post("/", async (req, res) => {
    const { name, credits, semester, nim } = req.body;
    if (!name || !credits || !semester || !nim) {
        return res.status(400).send({
            error: true,
            message: "Ada data yang belum diisi"
        });
    }

    try {
        await getStudentByNIM(nim);

        await getSubjectByNameNIM(name, nim);

        const newSubject = await addSubject(name, credits, semester, nim);

        return res.status(201).send({
            error: false,
            message: "Mata kuliah berhasil ditambahkan",
            result: newSubject
        });
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        });
    } finally {
        prisma.$disconnect().catch(err => console.error('Failed to disconnect from database:', err));
    }
});

router.get("/:id", async (req, res) => {
    const subjectId = parseInt(req.params.id);
    try {
        const subject = await getSubjectById(subjectId);
        return res.status(200).send(subject);
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    } finally {
        await prisma.$disconnect();
    }
})

router.put("/:id", async (req, res) => {
    const subjectId = parseInt(req.params.id);
    const { credits, semester } = req.body;
    if (!credits || !semester) {
        return res.status(400).send({
          error: "true",
          message: "Ada field yang kosong",
        });
      }

    try {
        const subject = await getSubjectById(subjectId);


        await editSubjectById(subjectId, credits, semester);

        return res.status(200).send({
            error: false,
            message: "mata kuliah berhasil diubah"
        })
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    } finally {
        await prisma.$disconnect();
    }
})

router.delete("/:id", async (req, res) => {
    const subjectId = parseInt(req.params.id);
    try {
        const subject = await getSubjectById(subjectId);

        await deleteSubjectById(subjectId);

        return res.status(200).send({
            error: false,
            message: "Data Mata Kuliah berhasil dihapus" 
        });
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    } finally {
        await prisma.$disconnect();
    }
})

module.exports = router;