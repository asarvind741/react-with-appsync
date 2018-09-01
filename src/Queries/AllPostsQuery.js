import gql from 'graphql-tag';

export default gql`
query list {
    getTodos {
        id
        name
    }
}`;