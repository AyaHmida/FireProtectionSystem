import { apiClient } from './api';
import { Zone, CreateZoneDto, UpdateZoneDto } from '../types';

class ZoneManagementService {
  // Récupérer toutes les zones
  getAllZones() {
    return apiClient.get<Zone[]>('/zones');
  }

  // Récupérer une zone spécifique
  getZoneById(zoneId: number) {
    return apiClient.get<Zone>(`/zones/${zoneId}`);
  }

  // Créer une nouvelle zone
  createZone(dto: CreateZoneDto) {
    return apiClient.post<Zone>('/zones', dto);
  }

  // Mettre à jour une zone
  updateZone(zoneId: number, dto: UpdateZoneDto) {
    return apiClient.put<Zone>(`/zones/${zoneId}`, dto);
  }

  // Supprimer une zone
  deleteZone(zoneId: number) {
    return apiClient.delete<{ success: boolean; message: string }>(`/zones/${zoneId}`);
  }

  // Récupérer les zones avec leurs capteurs
  getZonesWithSensors() {
    return apiClient.get<Zone[]>('/zones?includeSensors=true');
  }

  // Récupérer le nombre de capteurs pour une zone donnée
  getSensorCount(zoneId: number) {
    return apiClient.get<{ zoneId: number; sensorCount: number }>(
      `/zones/${zoneId}/sensor-count`
    );
  }
}

export default new ZoneManagementService();
