import React, { useState, useEffect } from "react";
import { useDataStore } from "../../stores/dataStore";
import Modal from "../../components/UI/Modal";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { Technician } from "../../types";

interface TechnicianFormProps {
  onClose: () => void;
  editId: string | null;
}

const TechnicianForm: React.FC<TechnicianFormProps> = ({ onClose, editId }) => {
  const { technicians, addTechnician, updateTechnician } = useDataStore();

  const initialFormState: Omit<Technician, "id"> = {
    name: "",
    email: "",
    phone: "",
    specialization: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If editing, populate the form with existing data
  useEffect(() => {
    if (editId) {
      const technicianToEdit = technicians.find((tech) => tech.id === editId);
      if (technicianToEdit) {
        setFormData(technicianToEdit);
      }
    }
  }, [editId, technicians]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = "La especialidad es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editId) {
      updateTechnician(editId, formData);
    } else {
      addTechnician(formData);
    }

    onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={editId ? "Editar Técnico" : "Nuevo Técnico"}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {editId ? "Actualizar" : "Crear"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          fullWidth
          placeholder="Ej: Juan Pérez"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          fullWidth
          placeholder="Ej: juan.perez@ejemplo.com"
        />

        <Input
          label="Teléfono"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          fullWidth
          placeholder="Ej: 555-123-4567"
        />

        <Input
          label="Especialización"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          error={errors.specialization}
          fullWidth
          placeholder="Ej: Sistemas de Video"
        />
      </form>
    </Modal>
  );
};

export default TechnicianForm;
