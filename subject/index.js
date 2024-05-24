const express = require("express");

const app = express();
const port = 3002;

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", async (req, res) => {
    try {
        const subjects = await prisma.subject.findMany()
        res.send(subjects);
    } catch (error) {
        console.log(error.message)
    } finally {
        await prisma.$disconnect();
    }
})
app.post("/", async (req, res) => {
    const { name, credits, semester, studentId } = req.body;
    if (!name || !credits || !semester || !studentId) {
        return res.status(400).send({
            error: true,
            message: "Ada data yang belum diisi"
        });
    }

    try {
        const newSubject = await prisma.subject.create({
            data: {
                name: name,
                credits: parseInt(credits, 10),
                semester: parseInt(semester, 10),
                studentId: parseInt(studentId, 10)
            }
        });
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

app.get("/:id", async (req, res) => {
    const studentId = parseInt(req.params.id);
    try {
        const subject = await prisma.subject.findUnique({
            where: {
                id: studentId
            }
        })
        if(!subject){
            return res.status(404).send({
                error: true,
                message: "Mata Kuliah tidak ditemukan"
            })
        }
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

app.put("/:id", async (req, res) => {
    const studentId = parseInt(req.params.id);
    const { credits, semester } = req.body;
    if (!credits || !semester) {
        return res.status(400).send({
          error: "true",
          message: "Ada field yang kosong",
        });
      }

    try {
        const subject = await prisma.subject.findUnique({
            where: {
                id: studentId
            }
        })
        if(!subject){
            return res.status(404).send({
                error: true,
                message: "Mata Kuliah tidak ditemukan"
            })
        }


        await prisma.subject.update({
            where: {
                id: studentId
            },
            data: {
                credits: credits,
                semester: semester
            }
        })
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

app.delete("/:id", async (req, res) => {
    const studentId = parseInt(req.params.id);
    try {
        const subject = await prisma.subject.findUnique({
            where: {
                id: studentId
            }
        })
        if(!subject){
            return res.status(404).send({
                error: true,
                message: "Mata kuliah tidak ditemukan"
            })
        }

        await prisma.subject.delete({
            where: {
                id: studentId
            }
        })

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

app.listen(port, () => {
    console.log(`Subject service listening on port ${port}`);
})