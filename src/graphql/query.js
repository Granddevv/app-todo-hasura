import { gql } from '@apollo/client';

export const GET_TASK = gql`
    query task {
        task {
            id
            user_id
        }
    }
`

export const QUERY_SIGNIN = gql`
    query signin($email: String, $password: String) {
        user_aggregate(
            where: {
                _and: [
                    {
                        email: {
                            _eq: $email
                        }
                    },
                    {
                        password: {
                            _eq: $password
                        }
                    }
                ]
            }
        ) {
            nodes {
                id
                email
                password
            }
        }
    }
`

export const QUERY_TASK = gql`
    query getTasks($id: uuid) {
        task_aggregate(
            where: {
                user_id: {
                    _eq: $id
                }
            }
        ) {
            nodes {
                id
                user_id
                description
                title
                created_at
                due_date
                completed
            }
        }
    }
`