import React, { useState, useEffect } from 'react';
import './Subject.css';
import { axiosInstance } from "../lib/axios";

const Subject = () => {
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({ id: '', name: '', credits: '', semester: '', nim: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [nims, setNims] = useState([]);
  
    const fetchSubjects = async () => {
      try {
        const subjectsResponse = await axiosInstance.get("/subjects");
        setSubjects(subjectsResponse.data);
      } catch (error) {
      console.log(error);
      }
    };

    const fetchNims = async () => {
      try {
        const response = await axiosInstance.get('/students/nim');
        setNims(response.data);
      } catch (error) {
        console.error('Error fetching NIMs:', error);
      }
    }
  
    useEffect(() => {
        fetchSubjects();
        fetchNims();
    }, [])
  
    const renderSubjects = () => {
      return subjects.map((subject) => {
        return (
          <tr key={subject.id}>
            <td>{subject.id}</td>
            <td>{subject.name}</td>
            <td>{subject.credits}</td>
            <td>{subject.semester}</td>
            <td>{subject.nim}</td>
            <td>  
              <button className="button button-edit" onClick={() => handleEditClick(subject)}>Edit</button>
              <button className="button button-delete" onClick={() => handleDeleteClick(subject.id)}>Delete</button>
            </td>
          </tr>
        )
      })
    }
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage(''); // Clear previous error messages
      if (formData.id) {
        // Penanganan untuk update data
        try {
          const response = await axiosInstance.put(`/subjects/${formData.id}`, {
            credits: formData.credits,
            semester: formData.semester
          });
          const { message } = response.data;
          fetchSubjects();
          alert(message);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            setErrorMessage(error.response.data.message);
            setIsVisible(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            console.error('Error updating subject:', error);
          }
        }
      } else {
        // Penanganan untuk tambah data baru
        try {
          const response = await axiosInstance.post('/subjects', formData);
          const { message, result } = response.data;
          setSubjects((prevSubjects) => [...prevSubjects, result]);
          // Tampilkan pesan dari backend
          alert(message);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          console.log(error)
          if (error.response && error.response.data && error.response.data.message) {
            setErrorMessage(error.response.data.message);
            setIsVisible(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            console.error('Error adding subject:', error);
          }
        }
      }
      setFormData({ id: '', name: '', credits: '', semester: '', nim: '' });
    };
  
    const handleEditClick = (subject) => {
      setFormData(subject);
    };
  
    const handleDeleteClick = async (id) => {
      try {
        const response = await axiosInstance.delete(`/subjects/${id}`);
        const { message } = response.data;
        setSubjects((prevSubjects) => prevSubjects.filter((subject) => subject.id !== id));
        // Tampilkan notifikasi atau pesan yang sesuai dengan respons dari backend
        alert(message);
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    };
  
    const handleClose = () => {
      setIsVisible(false);
    };
  
    return (


      <div>
        <div className="columns mt-5 is-centered">
          <div className="column is-half">
          {errorMessage && isVisible && (
          <div className="notification is-danger">
            <button className="delete" onClick={handleClose}></button>
            {errorMessage}
          </div>
        )}
            <table className="table is-striped is-fullwidth">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Credits</th>
                  <th>Semester</th>
                  <th>NIM</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {renderSubjects()}
              </tbody>
            </table>
          </div>
        </div>
  
        <div className="columns mt-5 is-centered">
          <div className="column is-half">
            <form className="form-container" onSubmit={handleFormSubmit}>
              <input type="hidden" name="id" value={formData.id} />
              <div>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!!formData.id}
                />
              </div>
              <div>
                <label>Credits</label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Semester</label>
                <input
                  type="number"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                />
              </div>
              <div className='margin-top margin-bot'>
                <label className='select-label'>NIM</label>
                <select
                  name="nim"
                  value={formData.nim}
                  onChange={handleInputChange}
                  disabled={!!formData.id}
                  className='select-nim'
                >
                  <option value="">Select NIM</option>
                  {nims.map((student) => (
                    <option key={student.nim} value={student.nim}>
                      {student.nim}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">{formData.id ? 'Update' : 'Add'}</button>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default Subject;