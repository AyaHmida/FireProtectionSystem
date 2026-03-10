export interface RegisterRequestDto {
  lastName: string
  firstName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  role?: string
  parentUserId?: number
}
