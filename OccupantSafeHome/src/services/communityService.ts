import apiClient from './apiClient'
import { Contact, FamilyMember, AddContactRequest, InviteMemberRequest } from '../types'

class CommunityService {
  // Contacts
  async getContacts(): Promise<Contact[]> {
    return apiClient.get<Contact[]>('/contacts')
  }

  async getContact(id: number): Promise<Contact> {
    return apiClient.get<Contact>(`/contacts/${id}`)
  }

  async addContact(data: AddContactRequest): Promise<Contact> {
    return apiClient.post<Contact>('/contacts', data as unknown as Record<string, unknown>)
  }

  async updateContact(id: number, data: Partial<AddContactRequest>): Promise<Contact> {
    return apiClient.put<Contact>(`/contacts/${id}`, data)
  }

  async deleteContact(id: number): Promise<{ message: string }> {
    return apiClient.delete(`/contacts/${id}`)
  }

  async testContact(id: number): Promise<{ message: string }> {
    return apiClient.post(`/contacts/${id}/test`, {})
  }

  // Family Members
  async getFamilyMembers(): Promise<FamilyMember[]> {
    return apiClient.get<FamilyMember[]>('/family/members')
  }

  async getFamilyMember(id: number): Promise<FamilyMember> {
    return apiClient.get<FamilyMember>(`/family/members/${id}`)
  }

  async inviteFamilyMember(data: InviteMemberRequest): Promise<FamilyMember> {
    return apiClient.post<FamilyMember>('/family/invite', data as unknown as Record<string, unknown>)
  }

  async removeFamilyMember(id: number): Promise<{ message: string }> {
    return apiClient.delete(`/family/members/${id}`)
  }

  async updateMemberRole(id: number, accessLevel: 'owner' | 'member' | 'observer'): Promise<FamilyMember> {
    return apiClient.put<FamilyMember>(`/family/members/${id}`, { accessLevel })
  }

  async acceptInvitation(inviteToken: string): Promise<{ message: string }> {
    return apiClient.post('/family/accept-invite', { inviteToken })
  }
}

export default new CommunityService()
