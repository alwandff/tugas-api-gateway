const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const port = 3001;

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({extended: true}));    


app.get('/nim', async (req, res) => {
    try {
      const students = await prisma.student.findMany({
        select: {
          nim: true,
        },
      });
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get("/", async (req, res) => {
    try {
        const students = await prisma.student.findMany();
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

app.post("/", async (req, res) => {
    const { name, nim, email, telp } = req.body;
    if(!name || !nim || !email || !telp){
        return res.status(400).send({
            error: true,
            message: "Ada data yang belum diisi"
        })
    }

    try {
        const studentIsExist = await prisma.student.findUnique({
            where: {
                nim: nim
            }
        })

        if(studentIsExist){
            return res.status(400).send({
                error: true,
                message: "Mahasiswa sudah pernah ditambahkan"
            })
        }

        const emailIsExist = await prisma.student.findUnique({
            where: {
                email: email
            }
        })

        const telpIsExist = await prisma.student.findUnique({
            where: {
                telp: telp
            }
        })

        if(emailIsExist || telpIsExist){
            return res.status(400).send({
                error: true,
                message: "Email atau no telepon sudah digunakan"
            })
        }

        const newStudent = await prisma.student.create({
            data: {
                name: name,
                nim: nim,
                email: email,
                telp: telp
            }
        })
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

app.get("/:id", async (req, res) => {
    const studentId = parseInt(req.params.id);
    try {
        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        })
        if(!student){
            return res.status(404).send({
                error: true,
                message: "Mahasiswa tidak ditemukan"
            })
        }
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

app.put("/:id", async (req, res) => {
    const studentId = parseInt(req.params.id);
    const { email, telp } = req.body;
    if (!email || !telp) {
        return res.status(400).send({
          error: "true",
          message: "Ada field yang kosong",
        });
      }

    try {
        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        })
        if(!student){
            return res.status(404).send({
                error: true,
                message: "Mahasiswa tidak ditemukan"
            })
        }

        const emailIsExist = await prisma.student.findMany({
            where: {
                email: email,
                NOT: {
                    id: studentId 
                }
            }
        });

        const telpIsExist = await prisma.student.findMany({
            where: {
                telp: telp,
                NOT: {
                    id: studentId 
                }
            }
        });

        if(emailIsExist.length > 0 || telpIsExist.length > 0){
            return res.status(400).send({
                error: true,
                message: "Email atau no telepon sudah digunakan"
            })
        }

        await prisma.student.update({
            where: {
                id: studentId
            },
            data: {
                email: email,
                telp: telp
            }
        })
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

app.delete("/:id", async (req, res) => {
    const studentId = parseInt(req.params.id);
    try {
        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        })
        if(!student){
            return res.status(404).send({
                error: true,
                message: "Mahasiswa tidak ditemukan"
            })
        }

        await prisma.student.delete({
            where: {
                id: studentId
            }
        })

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



app.listen(port, () => {
    console.log(`Student service listening on port ${port}`);
});
