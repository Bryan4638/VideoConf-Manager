import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Por favor ingresa usuario y contraseña");
      return;
    }

    const success = await login(username, password);

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Usuario o contraseña inválidos");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-purple-700 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Video className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mt-4">
            Gestor de Videoconferencias
          </h1>
          <p className="text-gray-600 mt-1">Inicia sesión para acceder</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Usuario"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              placeholder="Ingresa tu usuario"
              autoComplete="username"
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
            />

            <div className="pt-2">
              <Button type="submit" fullWidth size="lg" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Usuario: admin / Contraseña: password123</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
