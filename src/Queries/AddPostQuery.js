import gql from 'graphql-tag';

export default gql`
mutation AddPostMutation($id: ID!, $name: String!, $description: String!, $priority: String!) {
    addTodo(
        id: $id
        name: $name
        description: $description
        priority: $priority
    ) {
        id
        name
        description
        priority
    }
}`;