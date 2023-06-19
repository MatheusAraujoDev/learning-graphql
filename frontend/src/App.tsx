import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { AiFillEdit, AiOutlineDelete } from 'react-icons/ai'
import Swal from 'sweetalert2'
import { NewUserForm } from './components/NewUserForm'
import { DELETE_USER, EDIT_USER, GET_USERS } from './services'

type User = {
  id: string
  name: string
}

function App() {
  const [openInput, setOpenInput] = useState(false)
  const [userId, setUserId] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const { data, loading } = useQuery<{ users: User[] }>(GET_USERS)

  const [editUser] = useMutation(EDIT_USER)
  const [deleteUser] = useMutation(DELETE_USER)

  if (loading) {
    return <p>Carregando ...</p>
  }

  function showEditInput(userId: string, oldName: string) {
    setOpenInput(!openInput)
    setUserId(userId)
    setNewUserName(oldName)
  }

  async function handleEditUser() {
    if (!newUserName) {
      return alert('Esse campo não pode estar vazio!')
    }

    await editUser({
      variables: { id: userId, name: newUserName },
      refetchQueries: [GET_USERS],
    }).catch((error) =>
      console.log('Erro ao editar usuário: ', { userId, newUserName }, error),
    )

    setNewUserName('')
    setOpenInput(false)
  }

  async function handleDeleteUser(userID: string) {
    Swal.fire({
      title: 'Deseja realmente deletar esse usuário?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: `Cancelar`,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Usuário deletado com sucesso!',
          icon: 'success',
        })

        deleteUser({
          variables: { id: userID },
          refetchQueries: [GET_USERS],
        }).catch((error) => console.log('Erro ao deletar usuário: ', error))
      } else if (result.isDenied) {
        Swal.fire('As alterações não foram salvas!')
      }
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Listagem de Usuários</h1>

      {openInput && (
        <div style={{}}>
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Edite o usuário"
          />
          <button onClick={handleEditUser}>Editar</button>
          <button onClick={() => setOpenInput(false)}>Cancelar</button>
        </div>
      )}

      <ul>
        {data?.users.map((user) => (
          <li key={user.id}>
            {user.name}
            <AiFillEdit
              onClick={() => showEditInput(user.id, user.name)}
              style={{
                marginLeft: '5px',
              }}
              color={'#114bc9'}
            />
            <AiOutlineDelete
              style={{
                marginLeft: '5px',
              }}
              color={'#e00909'}
              onClick={() => handleDeleteUser(user.id)}
            />
          </li>
        ))}
      </ul>

      <NewUserForm />
    </div>
  )
}

export default App
