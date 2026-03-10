import { apiClient } from './api';
import { Sensor, CreateSensorDto, UpdateSensorDto } from '../types';

class SensorManagementService {
  // Récupérer tous les capteurs
  getAllSensors() {
    return apiClient.get<Sensor[]>('/sensors');
  }

  // Récupérer les capteurs d'une zone
  getSensorsByZone(zoneId: number) {
    return apiClient.get<Sensor[]>(`/zones/${zoneId}/sensors`);
  }

  // Récupérer un capteur spécifique
  getSensorById(sensorId: number) {
    return apiClient.get<Sensor>(`/sensors/${sensorId}`);
  }

  // Créer un nouveau capteur
  createSensor(dto: CreateSensorDto) {
    return apiClient.post<Sensor>('/sensors', dto);
  }

  // Mettre à jour un capteur
  updateSensor(sensorId: number, dto: UpdateSensorDto) {
    return apiClient.put<Sensor>(`/sensors/${sensorId}`, dto);
  }

  // Supprimer un capteur
  deleteSensor(sensorId: number) {
    return apiClient.delete<{ success: boolean; message: string }>(`/sensors/${sensorId}`);
  }

  // Récupérer les capteurs avec filtrage par statut
  getSensorsByStatus(status: string) {
    return apiClient.get<Sensor[]>(`/sensors?status=${status}`);
  }
}

export default new SensorManagementService();
