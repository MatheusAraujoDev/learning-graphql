import crypto from 'crypto'
import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { User } from '../models/User'

// Query: buscar dados
// Mutation: criar, atualizar ou deletar dados

@Resolver()
export class UserResolver {
  private data: User[] = []

  @Query(() => [User])
  async users() {
    return this.data
  }

  @Mutation(() => User)
  async createUser(@Arg('name') name: string) {
    const user = { id: crypto.randomUUID(), name }

    this.data.push(user)
    return user
  }

  @Mutation(() => User)
  async editUser(@Arg('id') id: string, @Arg('name') name: string) {
    const userIndex = this.data.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado')
    }

    const updatedUser = { ...this.data[userIndex], name }
    this.data[userIndex] = updatedUser
    return updatedUser
  }

  @Mutation(() => User)
  async deleteUser(@Arg('id') id: string) {
    const userIndex = this.data.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado')
    }

    const deletedUser = this.data.splice(userIndex, 1)[0]
    return deletedUser || null
  }
}
