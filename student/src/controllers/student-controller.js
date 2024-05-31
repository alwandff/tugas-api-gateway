const express = require("express");
const prisma = require("../database/prisma");
const { getAllStudentByNIM, getAllStudent, getStudentByNIM, getStudentByEmail, getStudentByTelp, addStudent, getStudentById, editStudentById, deleteStudentById } = require("../services/student-service");

const router = express.Router();

router.get('/nim', async (req, res) => {
    try {
      const students = await getAllStudentByNIM();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const students = await getAllStudent();
        return res.send(students);
    } catch (error) {
        return res.status(500).send({
            error: true,
            message: error.message
        })
    } finally {
        await prisma.$disconnect();
    }
})

router.post("/", async (req, res) => {
    const { name, nim, email, telp } = req.body;
    if(!name || !nim || !email || !telp){
        return res.status(400).send({
            error: true,
            message: "Ada data yang belum diisi"
        })
    }

    try {
        await getStudentByNIM(nim);

        // if(studentIsExist){
        //     return res.status(400).send({
        //         error: true,
        //         message: "Mahasiswa sudah pernah ditambahkan"
        //     })
        // }

        await getStudentByEmail(email);

        await getStudentByTelp(telp);

        // if(emailIsExist || telpIsExist){
        //     return res.status(400).send({
        //         error: true,
        //         message: "Email atau no telepon sudah digunakan"
        //     })
        // }

        const newStudent = await addStudent(name, nim, email, telp);

        return res.status(201).send({
            error: false,
            message: "Mahasiswa berhasil ditambahkan",
            result: newStudent
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

router.get("/:id", async (req, res) => {
    const studentId = parseInt(req.params.id);
    try {
        const student = await getStudentById(studentId);
        // if(!student){
        //     return res.status(404).send({
        //         error: true,
        //         message: "Mahasiswa tidak ditemukan"
        //     })
        // }
        return res.status(200).send(student);
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
    const studentId = parseInt(req.params.id);
    const { email, telp } = req.body;
    if (!email || !telp) {
        return res.status(400).send({
          error: "true",
          message: "Ada field yang kosong",
        });
      }

    try {
        await editStudentById(studentId, email, telp);

        return res.status(200).send({
            error: false,
            message: "Email/No telp berhasil diubah"
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
    const studentId = parseInt(req.params.id);
    try {
        await deleteStudentById(studentId);

        return res.status(200).send({
            error: false,
            message: "Data Mahasiswa berhasil dihapus" 
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