const prisma = require("../database/prisma");
const { findAllStudentByNIM, findAllStudent, findStudentByNIM, findStudentByEmail, findStudentByTelp, insertStudent, findStudentByEmailExceptOwn, findStudentByTelpExceptOwn, findStudentById, updateStudentById, removeStudentById } = require("../repositories/student-repository");

const getAllStudentByNIM = async () => {
    const students = await findAllStudentByNIM();
    return students;
}

const getAllStudent = async () => {
    const students = await findAllStudent();
    return students;
}

const getStudentByNIM = async (nim) => {
    const student = await findStudentByNIM(nim);
    if(student) {
        throw Error("Mahasiswa sudah pernah ditambahkan");
    }
    // return student;
}

const getStudentByEmail = async (email) => {
    const student = await findStudentByEmail(email);
    if(student){
        throw Error("Email atau no telepon sudah digunakan");
    }
    // return student;
}

const getStudentByTelp = async (telp) => {
    const student = await findStudentByTelp(telp);
    if(student){
        throw Error("Email atau no telepon sudah digunakan");
    }
    // return student;
}

const addStudent = async (name, nim, email, telp) => {
    const student = await insertStudent(name, nim, email, telp);
    return student;
}

const getStudentByEmailExceptOwn = async (email, id) => {
    const student = await findStudentByEmailExceptOwn(email, id);
    if(student.length > 0){
        throw Error("Email atau no telepon sudah digunakan");
    }
}
const getStudentByTelpExceptOwn = async(telp, id) => {
    const student = await findStudentByTelpExceptOwn(telp, id)
    if(student.length > 0){
        throw Error("Email atau no telepon sudah digunakan");
    }
}

const getStudentById = async (id) => {
    const student = await findStudentById(id);
    if(!student){
        throw Error("Mahasiswa tidak ditemukan");
    }
    return student;
}

const editStudentById = async(id, email, telp) => {
    await getStudentById(id);
    await getStudentByEmailExceptOwn(email, id);
    await getStudentByTelpExceptOwn(telp, id);

    await updateStudentById(id, email, telp);
}

const deleteStudentById = async (id) => {
    await getStudentById(id);

    await removeStudentById(id);
}

module.exports = { getAllStudentByNIM, getAllStudent, getStudentByNIM, getStudentByEmail, getStudentByTelp, addStudent, getStudentById, editStudentById, deleteStudentById };