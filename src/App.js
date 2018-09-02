import React, { Component } from 'react';
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import { graphql, ApolloProvider, compose } from 'react-apollo';
import * as AWS from 'aws-sdk';
import AppSync from './AppSync.js';
import AllPostsQuery from './Queries/AllPostsQuery';
import AllPosts from './Components/AllPosts';
import AddPost from './Components/AddPost'
import AddPostQuery from './Queries/AddPostQuery';
import SubscribeToNewTodo from './Queries/SubscribeToNewTodo'

const client = new AWSAppSyncClient({
    url: AppSync.graphqlEndpoint,
    region: AppSync.region,
    auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey: AppSync.apiKey,

        // type: AUTH_TYPE.AWS_IAM,
        // Note - Testing purposes only
        /*credentials: new AWS.Credentials({
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY
        })*/

        // Amazon Cognito Federated Identities using AWS Amplify
        //credentials: () => Auth.currentCredentials(),

        // Amazon Cognito user pools using AWS Amplify
        // type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
        // jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
});




class App extends Component {

    componentWillMount(){
        this.props.SubscribeToNewTodoA();
    }
    render() {
        return (
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
                To get started, edit <code>src/App.js</code> and save to reload.
            </p>
            <NewPostWithData />
            <AllPostsWithData />
        </div>
        );
    }
}

const AllPostsWithData = compose(
    graphql(AllPostsQuery, {
        options: {
            fetchPolicy: 'cache-and-network'
        },
        props: (props) => ({
            posts: props.data,
            SubscribeToNewTodoA: params => {
                props.data.subscribeToMore({
                    document: SubscribeToNewTodo,
                    updateQuery: (prev, { subscriptionData: { data : { newTodo } } }) => ({
                        ...prev,
                        posts: { posts: [newTodo, ...prev.data] }
                    })
                });
            }
        })
    })
    )(AllPosts);

    const NewPostWithData = graphql(AddPostQuery, {
        props: (props) => ({
            onAdd: post => props.mutate({
                variables: post,
                optimisticResponse: () => ({ addTodo: { ...post, __typename: 'Todo', version: 1 } }),
            })
        }),
        options: {
            refetchQueries: [{ query: AllPostsQuery }],
            update: (dataProxy, { data: { addTodo } }) => {
                const query = AllPostsQuery;
                const data = dataProxy.readQuery({ query });
                console.log("dada", data)
    
                data.getTodos.push(addTodo);
    
                dataProxy.writeQuery({ query, data });
            }
        }
    })(AddPost);

    const WithProvider = () => (
        <ApolloProvider client={client}>
          <Rehydrated>
            <App />
          </Rehydrated>
        </ApolloProvider>
      );

    

export default WithProvider;