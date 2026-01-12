import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });
  console.log("✅ Admin user created:", admin.username);

  // Create technicians
  const technician1 = await prisma.technician.upsert({
    where: { email: "juan.perez@example.com" },
    update: {},
    create: {
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      phone: "555-123-4567",
      specialization: "Sistemas de Video",
    },
  });

  const technician2 = await prisma.technician.upsert({
    where: { email: "maria.garcia@example.com" },
    update: {},
    create: {
      name: "María García",
      email: "maria.garcia@example.com",
      phone: "555-987-6543",
      specialization: "Ingeniería de Audio",
    },
  });

  const technician3 = await prisma.technician.upsert({
    where: { email: "carlos.lopez@example.com" },
    update: {},
    create: {
      name: "Carlos López",
      email: "carlos.lopez@example.com",
      phone: "555-456-7890",
      specialization: "Redes y Conectividad",
    },
  });
  console.log("✅ Technicians created");

  // Create locations
  const location1 = await prisma.location.upsert({
    where: { id: "sala-principal" },
    update: {},
    create: {
      id: "sala-principal",
      name: "Sala de Conferencias Principal",
      address: "Edificio Central, Piso 5",
      capacity: 50,
      hasVideoEquipment: true,
    },
  });

  const location2 = await prisma.location.upsert({
    where: { id: "sala-ejecutiva" },
    update: {},
    create: {
      id: "sala-ejecutiva",
      name: "Sala Ejecutiva",
      address: "Edificio Central, Piso 10",
      capacity: 15,
      hasVideoEquipment: true,
    },
  });

  const location3 = await prisma.location.upsert({
    where: { id: "auditorio" },
    update: {},
    create: {
      id: "auditorio",
      name: "Auditorio",
      address: "Edificio Norte, Planta Baja",
      capacity: 200,
      hasVideoEquipment: true,
    },
  });
  console.log("✅ Locations created");

  // Create conferences
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const conf1 = await prisma.videoConference.create({
    data: {
      title: "Reunión de Planificación Q1",
      description: "Revisión de objetivos y planificación del primer trimestre",
      date: formatDate(tomorrow),
      startTime: "10:00",
      endTime: "12:00",
      participantCount: 25,
      status: "scheduled",
      locationId: location1.id,
      technicians: {
        create: [
          { technicianId: technician1.id },
          { technicianId: technician2.id },
        ],
      },
    },
  });

  const conf2 = await prisma.videoConference.create({
    data: {
      title: "Presentación a Clientes",
      description: "Demo del nuevo producto para clientes potenciales",
      date: formatDate(nextWeek),
      startTime: "14:00",
      endTime: "16:00",
      participantCount: 12,
      status: "scheduled",
      locationId: location2.id,
      technicians: {
        create: [{ technicianId: technician1.id }],
      },
    },
  });

  const conf3 = await prisma.videoConference.create({
    data: {
      title: "Capacitación General",
      description: "Capacitación sobre nuevas herramientas de colaboración",
      date: formatDate(nextWeek),
      startTime: "09:00",
      endTime: "11:00",
      participantCount: 100,
      status: "scheduled",
      locationId: location3.id,
      technicians: {
        create: [
          { technicianId: technician2.id },
          { technicianId: technician3.id },
        ],
      },
    },
  });
  console.log("✅ Conferences created");

  console.log("🎉 Seed completed successfully!");
  console.log("\n📝 Login credentials:");
  console.log("   Username: admin");
  console.log("   Password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
