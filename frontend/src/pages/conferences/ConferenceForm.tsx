import React, { useState, useEffect } from "react";
import { useDataStore } from "../../stores/dataStore";
import Modal from "../../components/UI/Modal";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import Button from "../../components/UI/Button";
import MultiSelect from "../../components/UI/MultiSelect";
import { VideoConference } from "../../types";
import { usuarios } from "../../mockData";

interface ConferenceFormProps {
  onClose: () => void;
  editId: string | null;
}

const ConferenceForm: React.FC<ConferenceFormProps> = ({ onClose, editId }) => {
  const {
    conferences,
    locations,
    technicians,
    addConference,
    updateConference,
  } = useDataStore();

  const initialFormState = {
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    locationId: locations.length > 0 ? locations[0].id : "",
    technicianIds: [],
    participantIds: [],
    participantCount: 10,
    status: "scheduled" as const,
  };

  const [formData, setFormData] =
    useState<Omit<VideoConference, "id">>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If editing, populate the form with existing data
  useEffect(() => {
    if (editId) {
      const conferenceToEdit = conferences.find((conf) => conf.id === editId);
      if (conferenceToEdit) {
        setFormData(conferenceToEdit);
      }
    }
  }, [editId, conferences]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // For numeric inputs, convert to number
    if (name === "participantCount") {
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

  const handleTechnicianChange = (selectedIds: string[]) => {
    setFormData({
      ...formData,
      technicianIds: selectedIds,
    });

    // Clear error
    if (errors.technicianIds) {
      setErrors({
        ...errors,
        technicianIds: "",
      });
    }
  };

  const handleParticipantChange = (selectedIds: string[]) => {
    setFormData({
      ...formData,
      participantIds: selectedIds,
    });

    // Clear error
    if (errors.participantIds) {
      setErrors({
        ...errors,
        participantIds: "",
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }

    if (!formData.date) {
      newErrors.date = "La fecha es requerida";
    }

    if (!formData.startTime) {
      newErrors.startTime = "La hora de inicio es requerida";
    }

    if (!formData.endTime) {
      newErrors.endTime = "La hora de fin es requerida";
    }

    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = "La hora de fin debe ser posterior a la de inicio";
    }

    if (!formData.locationId) {
      newErrors.locationId = "La ubicación es requerida";
    }

    if (formData.technicianIds.length === 0) {
      newErrors.technicianIds = "Se requiere al menos un técnico";
    }

    if (formData.participantCount <= 0) {
      newErrors.participantCount =
        "El número de participantes debe ser mayor a 0";
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
      updateConference(editId, formData);
    } else {
      addConference(formData);
    }

    onClose();
  };

  const locationOptions = locations.map((loc) => ({
    value: loc.id,
    label: loc.name,
  }));

  const technicianOptions = technicians.map((tech) => ({
    value: tech.id,
    label: tech.name,
  }));

  const participantOptions = usuarios.map((user) => ({
    value: user.id.toString(),
    label: user.nombre,
  }));

  const statusOptions = [
    { value: "scheduled", label: "Programada" },
    { value: "in-progress", label: "En Progreso" },
    { value: "completed", label: "Completada" },
    { value: "cancelled", label: "Cancelada" },
  ];

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={editId ? "Editar Videoconferencia" : "Nueva Videoconferencia"}
      size="lg"
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
          label="Título"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          fullWidth
        />

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            fullWidth
          />

          <Select
            label="Estado"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
            fullWidth
          />

          <Input
            label="Hora de Inicio"
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleChange}
            error={errors.startTime}
            fullWidth
          />

          <Input
            label="Hora de Fin"
            name="endTime"
            type="time"
            value={formData.endTime}
            onChange={handleChange}
            error={errors.endTime}
            fullWidth
          />

          <Select
            label="Ubicación"
            name="locationId"
            value={formData.locationId}
            onChange={handleChange}
            options={locationOptions}
            error={errors.locationId}
            fullWidth
          />
        </div>
        <div>
          <MultiSelect
            label="Participantes"
            options={participantOptions || []}
            selectedValues={formData.participantIds || []}
            onChange={handleParticipantChange}
            error={errors.participantIds}
          />
        </div>

        <div>
          <MultiSelect
            label="Técnicos"
            options={technicianOptions}
            selectedValues={formData.technicianIds}
            onChange={handleTechnicianChange}
            error={errors.technicianIds}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ConferenceForm;
