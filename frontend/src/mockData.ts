export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    facultadDepartamento?: string;
  }
export const usuarios: Usuario[] = [
  { id: 1, nombre: 'Dr. Juan Pérez', correo: 'juan.perez@universidad.edu', facultadDepartamento: 'Ingeniería' },
  { id: 2, nombre: 'Prof. Roberto Silva', correo: 'roberto.silva@universidad.edu', facultadDepartamento: 'Derecho' },
  { id: 3, nombre: 'Dra. Elena Torres', correo: 'elena.torres@universidad.edu', facultadDepartamento: 'Psicología' },
  { id: 4, nombre: 'Ing. Miguel Herrera', correo: 'miguel.herrera@universidad.edu', facultadDepartamento: 'Ingeniería' }
];
