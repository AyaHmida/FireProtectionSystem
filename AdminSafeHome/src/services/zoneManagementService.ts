import { apiClient } from './api';
import { Zone, CreateZoneDto, UpdateZoneDto, Occupant } from '../types';

class ZoneManagementService {


  // zoneManagementService.ts — changer l'URL
getOccupants() {
  return apiClient.get<Occupant[]>('/admin/users/by-role?role=Occupant'); // ← corrigé
}

  // ── Toutes les zones (sans filtre) ─────────────────────────────
  getAllZones() {
    return apiClient.get<Zone[]>('/zones');
  }

  // ── Zones filtrées par occupant ← NOUVEAU ──────────────────────
  getZonesByOccupant(occupantId: number) {
    return apiClient.get<Zone[]>(`/zones?userId=${occupantId}`);
  }

  // ── Zone par id ────────────────────────────────────────────────
  getZoneById(zoneId: number) {
    return apiClient.get<Zone>(`/zones/${zoneId}`);
  }

  // ── Créer (occupantUserId obligatoire) ─────────────────────────
  createZone(dto: CreateZoneDto) {
    return apiClient.post<Zone>('/zones', dto);
  }

  // ── Modifier (occupantUserId obligatoire) ──────────────────────
  updateZone(zoneId: number, dto: UpdateZoneDto) {
    return apiClient.put<Zone>(`/zones/${zoneId}`, dto);
  }

  // ── Supprimer ──────────────────────────────────────────────────
  deleteZone(zoneId: number) {
    return apiClient.delete<void>(`/zones/${zoneId}`);
  }

  // ── Nombre de capteurs ─────────────────────────────────────────
  getSensorCount(zoneId: number) {
    return apiClient.get<{ zoneId: number; sensorCount: number }>(
      `/zones/${zoneId}/sensor-count`
    );
  }
}

export default new ZoneManagementService();