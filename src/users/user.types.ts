// src/users/user.types.ts
export interface UserWithoutPassword {
  id: any;
  _id?: string; // o mongoose.Types.ObjectId si prefieres
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
