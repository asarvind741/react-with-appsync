import React, { Component } from "react";

export default class AddPost extends Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    static defaultProps = {
        onAdd: () => null
    }

    getInitialState = () => ({
        id: '',
        name: '',
        description: '',
        priority: ''
    });

    handleChange = (field, event) => {
        const { target: { value } } = event;

        this.setState({
            [field]: value
        });
    }

    handleAdd = () => {
        const { id, name, description, priority } = this.state;

        this.setState(this.getInitialState(), () => {
            this.props.onAdd({ id, name, description, priority });
        });
    }

    handleCancel = () => {
        this.setState(this.getInitialState());
    }

    render() {
        return (
            <fieldset >
                <legend>Add new Post</legend>
                <div>
                    <label>ID<input type="text" placeholder="ID" value={this.state.id} onChange={this.handleChange.bind(this, 'id')} /></label>
                </div>
                <div>
                    <label>Title<input type="text" placeholder="Title" value={this.state.name} onChange={this.handleChange.bind(this, 'name')} /></label>
                </div>
                <div>
                    <label>Author<input type="text" placeholder="Author" value={this.state.description} onChange={this.handleChange.bind(this, 'description')} /></label>
                </div>
                <div>
                    <label>Author<input type="text" placeholder="Author" value={this.state.priority} onChange={this.handleChange.bind(this, 'priority')} /></label>
                </div>
                <div>
                    <button onClick={this.handleAdd}>Add new post</button>
                    <button onClick={this.handleCancel}>Cancel</button>
                </div>
            </fieldset>
        );
    }
}