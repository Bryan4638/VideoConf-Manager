import React, { useState, useEffect } from "react";
import { useDataStore } from "../../stores/dataStore";
import Modal from "../../components/UI/Modal";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { Location } from "../../types";

interface LocationFormProps {
  onClose: () => void;
  editId: string | null;
}

const LocationForm: React.FC<LocationFormProps> = ({ onClose, editId }) => {
  const { locations, addLocation, updateLocation } = useDataStore();

  const initialFormState: Omit<Location, "id"> = {
    name: "",
    address: "",
    capacity: 20,
    hasVideoEquipment: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If editing, populate the form with existing data
  useEffect(() => {
    if (editId) {
      const locationToEdit = locations.find((loc) => loc.id === editId);
      if (locationToEdit) {
        setFormData(locationToEdit);
      }
    }
  }, [editId, locations]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

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

    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida";
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = "La capacidad debe ser mayor a 0";
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
      updateLocation(editId, formData);
    } else {
      addLocation(formData);
    }

    onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={editId ? "Editar Ubicación" : "Nueva Ubicación"}
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
          placeholder="Ej: Sala de Conferencias Principal"
        />

        <Input
          label="Dirección"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          fullWidth
          placeholder="Ej: Edificio Central, Piso 5"
        />

        <Input
          label="Capacidad"
          name="capacity"
          type="number"
          min="1"
          value={formData.capacity.toString()}
          onChange={handleChange}
          error={errors.capacity}
          fullWidth
        />

        <div className="flex items-center">
          <input
            id="hasVideoEquipment"
            name="hasVideoEquipment"
            type="checkbox"
            checked={formData.hasVideoEquipment}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="hasVideoEquipment"
            className="ml-2 block text-sm text-gray-900"
          >
            Tiene equipo de videoconferencia
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default LocationForm;
