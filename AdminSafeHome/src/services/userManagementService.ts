import { apiClient } from './api';
import { UserAdminDto, SuspendUserDto, AdminActionResponseDto } from '../types';

class UserManagementService {
  // Récupérer tous les utilisateurs
  getAllUsers() {
    return apiClient.get<UserAdminDto[]>('/admin/users');
  }
  getFamilyMembers(occupantId: number) {
  return apiClient.get<UserAdminDto[]>(`/admin/users/${occupantId}/family-members`);
}

  // Récupérer les utilisateurs en attente
  getPendingUsers() {
    return apiClient.get<UserAdminDto[]>('/admin/users/pending');
  }

  // Récupérer les utilisateurs suspendus
  getSuspendedUsers() {
    return apiClient.get<UserAdminDto[]>('/admin/users/suspended');
  }

  // Valider un utilisateur
  validateUser(userId: number) {
    return apiClient.patch<AdminActionResponseDto>(`/admin/users/${userId}/validate`);
  }

  // Suspendre un utilisateur
  suspendUser(userId: number, dto: SuspendUserDto) {
    return apiClient.patch<AdminActionResponseDto>(`/admin/users/${userId}/suspend`, dto);
  }

  // Réactiver un utilisateur suspendu
  reactivateUser(userId: number) {
    return apiClient.patch<AdminActionResponseDto>(`/admin/users/${userId}/reactivate`);
  }

  // Supprimer un utilisateur (soft delete)
  deleteUser(userId: number) {
    return apiClient.delete<AdminActionResponseDto>(`/admin/users/${userId}`);
  }
}

export default new UserManagementService();