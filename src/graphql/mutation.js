import { gql } from '@apollo/client';

export const MUTATION_SIGNUP = gql`
    mutation signup($id: uuid, $email: String, $password: String) {
        insert_user(
                objects: {
                    id: $id
                    email: $email
                    password: $password
                }
            ) {
            returning {
                id
                email
                password
            }
        }
    }

`

export const MUTATION_TASK_CREATE = gql`
    mutation createTask($task: [task_insert_input!]!) {
        insert_task(objects: $task) {
            returning {
                id
            }
        }
    }
`

export const MUTATION_TASK_UPDATE = gql`
    mutation updateTask($task: task_set_input, $id: uuid!) {
        update_task_by_pk (_set: $task, pk_columns: {
            id: $id
        }) {
            title
        }
    }
`

export const MUTATION_TASK_DELETE = gql`
    mutation deleteTask($id: uuid!) {
        delete_task_by_pk(
            id: $id
        ) {
            id
        }
    }
`