const prisma = require("../database/prisma");
const { findAllSubject, findStudentByNIM, findSubjectByNameNIM, insertSubject, findSubjectById, updateSubjectById, removeSubjectById } = require("../repositories/subject-repository");

const getAllSubject = async () => {
    const subjects = await findAllSubject();
    return subjects;
}

const getStudentByNIM = async (nim) => {
    const student = await findStudentByNIM(nim);
    if(!student){
        throw Error("Mahasiswa tidak ditemukan");
    }
}

const getSubjectByNameNIM = async (name, nim) => {
    const subject = await findSubjectByNameNIM(name, nim);
    if(subject.length > 0){
        throw Error("Mata kuliah sudah ditambahkan, silahkan masukkan mata kuliah lain.")
    }
}

const addSubject = async(name, credits, semester, nim) => {
    const subject = await insertSubject(name, credits, semester, nim);
    return subject;
}

const getSubjectById = async (id) => {
    const subject = await findSubjectById(id);
    if(!subject){
        throw Error("Mata Kuliah tidak ditemukan");
    }
    return subject;
}

const editSubjectById = async(id, credits, semester) => {
    await updateSubjectById(id, credits, semester);
}

const deleteSubjectById = async (id) => {
    await removeSubjectById(id);
}

module.exports = { getAllSubject, getStudentByNIM, getSubjectByNameNIM, addSubject, getSubjectById, editSubjectById, deleteSubjectById };