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
    const { name, credits, semester, nim } = req.body;
    if (!name || !credits || !semester || !nim) {
        return res.status(400).send({
            error: true,
            message: "Ada data yang belum diisi"
        });
    }

    try {
        const studentIsExist = await prisma.student.findUnique({
            where:{
                nim: nim
            }
        })

        if(!studentIsExist){
            return res.status(404).send({
                error: true,
                message: "Mahasiswa tidak ditemukan"
            })
        }

        const subjectIsExist = await prisma.subject.findMany({
            where: {
                name: name,
                nim: nim
            }
        })

        if(subjectIsExist.length > 0){
            return res.status(400).send({
                error: true,
                message: "Mata kuliah sudah ditambahkan, silahkan masukkan mata kuliah lain."
            });
        }

        const newSubject = await prisma.subject.create({
            data: {
                name: name,
                credits: parseInt(credits),
                semester: parseInt(semester),
                nim: nim
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
    const subjectId = parseInt(req.params.id);
    try {
        const subject = await prisma.subject.findUnique({
            where: {
                id: subjectId
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
    const subjectId = parseInt(req.params.id);
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
                id: subjectId
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
                id: subjectId
            },
            data: {
                credits: parseInt(credits),
                semester: parseInt(semester)
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
    const subjectId = parseInt(req.params.id);
    try {
        const subject = await prisma.subject.findUnique({
            where: {
                id: subjectId
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
                id: subjectId
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