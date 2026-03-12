import { apiClient } from './api';
import { Device, CreateDeviceDto, AssignDeviceToZoneDto } from '../types/Devicetypes';

class DeviceManagementService {

  // ── Liste tous les devices ─────────────────────────────────────
getAllDevices() {
  return apiClient.get<Device[]>('/devices');
}

// Devices filtrés par occupant ← AJOUTER
getDevicesByOccupant(occupantId: number) {
  return apiClient.get<Device[]>(`/devices?userId=${occupantId}`);
}
  // ── Créer un device ────────────────────────────────────────────
  createDevice(dto: CreateDeviceDto) {
    return apiClient.post<Device>('/devices', dto);
  }

  // ── Modifier un device ─────────────────────────────────────────
  updateDevice(id: number, dto: CreateDeviceDto) {
    return apiClient.put<Device>(`/devices/${id}`, dto);
  }

  // ── Supprimer un device ────────────────────────────────────────
  deleteDevice(id: number) {
    return apiClient.delete<void>(`/devices/${id}`);
  }

  // ── Assigner à une zone (US-A3) ────────────────────────────────
  assignToZone(id: number, dto: AssignDeviceToZoneDto) {
    return apiClient.put<Device>(`/devices/${id}/assign-zone`, dto);
  }

  // ── Retirer d'une zone ─────────────────────────────────────────
  unassignFromZone(id: number) {
    return apiClient.put<Device>(`/devices/${id}/unassign-zone`, {});
  }
}

export default new DeviceManagementService();