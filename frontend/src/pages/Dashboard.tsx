import React from "react";
import { Calendar, MapPin, Users, Video } from "lucide-react";
import { useDataStore } from "../stores/dataStore";
import Card from "../components/UI/Card";
import Badge from "../components/UI/Badge";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { conferences, locations, technicians } = useDataStore();

  // Filter upcoming conferences (those with dates in the future)
  const upcomingConferences = conferences
    .filter((conf) => new Date(conf.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Conferences today
  const today = new Date().toISOString().split("T")[0];
  const conferencesToday = conferences.filter((conf) => conf.date === today);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "scheduled":
        return "info";
      case "in-progress":
        return "warning";
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel Principal</h1>
        <p className="text-gray-600">Bienvenido</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white bg-opacity-20 p-3">
              <Video className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-100">Conferencias</p>
              <p className="text-2xl font-semibold">{conferences.length}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white bg-opacity-20 p-3">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-100">
                Conferencias Hoy
              </p>
              <p className="text-2xl font-semibold">
                {conferencesToday.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white bg-opacity-20 p-3">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-teal-100">Lugares</p>
              <p className="text-2xl font-semibold">{locations.length}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white bg-opacity-20 p-3">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-amber-100">Técnicos</p>
              <p className="text-2xl font-semibold">{technicians.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Conferences */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Conferencias Próximas</h2>
          <Link
            to="/conferences"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Ver Todas
          </Link>
        </div>

        {upcomingConferences.length > 0 ? (
          <div className="space-y-3">
            {upcomingConferences.map((conference) => {
              const location = locations.find(
                (loc) => loc.id === conference.locationId
              );

              return (
                <div
                  key={conference.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{conference.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {location?.name}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(conference.status)}>
                      {conference.status}
                    </Badge>
                  </div>
                  <div className="flex mt-2 text-sm text-gray-600">
                    <div className="flex items-center mr-4">
                      <Calendar size={14} className="mr-1" />
                      {conference.date}
                    </div>
                    <div>
                      {conference.startTime} - {conference.endTime}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No hay conferencias próximas</p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
