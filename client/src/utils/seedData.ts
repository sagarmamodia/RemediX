import api from '../services/api';

const patients = [
  {
    name: 'Sahil',
    email: 'sahil@example.com',
    phone: '9876543220',
    password: 'password123',
    gender: 'Male',
    dob: '2001-01-01',
    role: 'Patient'
  },
  {
    name: 'Sagar',
    email: 'sagar@example.com',
    phone: '9876543221',
    password: 'password123',
    gender: 'Male',
    dob: '1995-01-01',
    role: 'Patient'
  }
];

const doctors = [
  {
    name: 'Dr. Ritik',
    email: 'ritik@example.com',
    phone: '9876543210',
    password: 'password123',
    gender: 'Male',
    dob: '1990-01-01',
    fee: 1000,
    specialty: 'Cardiologist',
    role: 'Doctor',
    available: true
  },
  {
    name: 'Dr. Anjali',
    email: 'anjali@example.com',
    phone: '9876543212',
    password: 'password123',
    gender: 'Female',
    dob: '1992-05-15',
    fee: 800,
    specialty: 'Dermatologist',
    role: 'Doctor',
    available: true
  }
];

export const seedUsers = async () => {
  try {
    console.log('Seeding patients...');
    for (const patient of patients) {
      const payload = {
        ...patient,
        profileUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`
      };
      try {
        await api.post('/auth/patient/register', payload);
        console.log(`Registered patient: ${patient.name}`);
      } catch (error: any) {
        console.error(`Failed to register patient ${patient.name}:`, error.response?.data?.message || error.message);
      }
    }

    console.log('Seeding doctors...');
    for (const doctor of doctors) {
      const payload = {
        ...doctor,
        profileUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`
      };
      try {
        await api.post('/auth/doctor/register', payload);
        console.log(`Registered doctor: ${doctor.name}`);
      } catch (error: any) {
        console.error(`Failed to register doctor ${doctor.name}:`, error.response?.data?.message || error.message);
      }
    }
    
    alert('Seeding completed! Check console for details.');
    return true;
  } catch (error) {
    console.error('Seeding failed:', error);
    alert('Seeding failed. Check console.');
    return false;
  }
};
