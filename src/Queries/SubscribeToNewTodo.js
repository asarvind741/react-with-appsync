import gql from 'graphql-tag';

export default gql`
subscription SubscribeToNewTodo {
    addTodo(
        id
        name
        description
        priority
    )
}`;