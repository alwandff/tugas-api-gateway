const prisma = require("../database/prisma");

const findAllStudentByNIM = async () => {
    const students = prisma.student.findMany({
        select: {
          nim: true,
        },
    });
    return students;
}

const findAllStudent = async () => {
    const students = await prisma.student.findMany();
    return students;
}

const findStudentByNIM = async (nim) => {
    const student = await prisma.student.findUnique({
        where: {
            nim: nim
        }
    })
    return student;
}

const findStudentByEmail = async (email) => {
    const student = await prisma.student.findUnique({
        where: {
            email: email
        }
    })
    return student;
}

const findStudentByTelp = async (telp) => {
    const student = await prisma.student.findUnique({
        where: {
            telp: telp
        }
    })
    return student; 
}

const insertStudent = async (name, nim, email, telp) => {
    const student = await prisma.student.create({
        data: {
            name: name,
            nim: nim,
            email: email,
            telp: telp
        }
    })
    return student;
}

const findStudentByEmailExceptOwn = async (email, id) => {
    const student = await prisma.student.findMany({
        where: {
            email: email,
            NOT: {
                id: id
            }
        }
    });
    return student;
}

const findStudentByTelpExceptOwn = async (telp, id) => {
    const student = await prisma.student.findMany({
        where: {
            telp: telp,
            NOT: {
                id: id
            }
        }
    });
    return student;
}

const findStudentById = async (id) => {
    const student = await prisma.student.findUnique({
        where: {
            id: id
        }
    })
    return student;
}

const updateStudentById = async (id, email, telp) => {
    await prisma.student.update({
        where: {
            id: id
        },
        data: {
            email: email,
            telp: telp
        }
    })
}

const removeStudentById = async (id) => {
    await prisma.student.delete({
        where: {
            id: id
        }
    })
}

module.exports = { findAllStudentByNIM, findAllStudent, findStudentByNIM, findStudentByEmail, findStudentByTelp, insertStudent, findStudentByEmailExceptOwn, findStudentByTelpExceptOwn, findStudentById, updateStudentById, removeStudentById };