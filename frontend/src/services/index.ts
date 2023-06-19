import { gql } from '@apollo/client'

export const GET_USERS = gql`
  query {
    users {
      id
      name
    }
  }
`

export const CREATE_USER = gql`
  mutation ($name: String!) {
    createUser(name: $name) {
      id
      name
    }
  }
`

export const EDIT_USER = gql`
  mutation editUser($id: String!, $name: String!) {
    editUser(id: $id, name: $name) {
      id
      name
    }
  }
`

export const DELETE_USER = gql`
  mutation deleteUser($id: String!) {
    deleteUser(id: $id) {
      id
    }
  }
`
