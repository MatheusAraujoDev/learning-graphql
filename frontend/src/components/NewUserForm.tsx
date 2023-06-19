/* eslint-disable no-useless-return */
import { useMutation } from '@apollo/client'
import { FormEvent, useState } from 'react'
import { client } from '../lib/apollo'
import { CREATE_USER, GET_USERS } from '../services'

export function NewUserForm() {
  const [name, setName] = useState('')
  const [createUser] = useMutation(CREATE_USER)

  async function handleCreateUser(event: FormEvent) {
    event.preventDefault()

    if (!name) {
      return
    }

    await createUser({
      variables: {
        name,
      },
      update: (cache, { data: { createUser } }) => {
        const { users } = client.readQuery({ query: GET_USERS })

        cache.writeQuery({
          query: GET_USERS,
          data: {
            users: {
              ...users,
              createUser,
            },
          },
        })
      },
    })

    setName('')
  }

  return (
    <form onSubmit={handleCreateUser}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Adicione um Usuário"
      />

      <button type="submit">Enviar</button>
    </form>
  )
}
