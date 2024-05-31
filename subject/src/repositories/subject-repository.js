const prisma = require("../database/prisma");

const findAllSubject = async () => {
    const subjects = await prisma.subject.findMany();
    return subjects;
}

const findStudentByNIM = async (nim) => {
    const student = await prisma.student.findUnique({
        where:{
            nim: nim
        }
    })
    return student;
}

const findSubjectByNameNIM = async (name, nim) => {
    const subject = await prisma.subject.findMany({
        where: {
            name: name,
            nim: nim
        }
    })
    return subject;
}

const insertSubject = async (name, credits, semester, nim) => {
    const subject = await prisma.subject.create({
        data: {
            name: name,
            credits: parseInt(credits),
            semester: parseInt(semester),
            nim: nim
        }
    });
    return subject;
}

const findSubjectById = async (id) => {
    const subject = await prisma.subject.findUnique({
        where: {
            id: id
        }
    })
    return subject;
}

const updateSubjectById = async (id, credits, semester) => {
    await prisma.subject.update({
        where: {
            id: id
        },
        data: {
            credits: parseInt(credits),
            semester: parseInt(semester)
        }
    })
}

const removeSubjectById = async (id) => {
    await prisma.subject.delete({
        where: {
            id: id
        }
    })
}
module.exports = { findAllSubject, findStudentByNIM, findSubjectByNameNIM, insertSubject, findSubjectById, updateSubjectById, removeSubjectById };