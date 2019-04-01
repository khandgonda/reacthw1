import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import axios from "axios";

// const API_BASE = "http://localhost:4000";
const API_BASE = "https://buggerrreporter.herokuapp.com/";

const UserList = props => {
  const userItems = props.users.map(user => {
    return (
      <UserListItem
        fname={user.fname}
        lname={user.lname}
        email={user.email}
        id={user.id}
        key={user.id}
        onDelete={props.onDelete}
        onEdit={props.onEdit}
      />
    );
  });
  return (
    <div className="author-list">
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="col-md-3"> First Name </th>
            <th className="col-md-3"> Last Name </th>
            <th className="col-md-3"> Email </th>
            <th className="col-md-3"> Actions </th>
          </tr>
        </thead>
        <tbody>{userItems}</tbody>
      </table>
    </div>
  );
};

const UserListItem = props => {
  return (
    <tr>
      <td className="col-md-3"> {props.fname} </td>
      <td className="col-md-3"> {props.lname} </td>
      <td className="col-md-3"> {props.email} </td>
      <td className="col-md-3 btn-toolbar">
        <button
          className="btn btn-success btn-sm"
          onClick={event => props.onEdit("edit", props)}
        >
          <i className="glyphicon glyphicon-pencil" /> Edit{" "}
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={event => props.onDelete(props.id)}
        >
          <i className="glyphicon glyphicon-remove"> </i> Delete{" "}
        </button>
      </td>
    </tr>
  );
};

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      formMode: "new",
      user: {
        lname: "",
        fname: "",
        email: "",
        id: "9999999"
      }
    };
    this.loadUsers = this.loadUsers.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.addUser = this.addUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.updateForm = this.updateForm.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }
  render() {
    return (
      <div className="users">
        <UserForm
          onSubmit={user => this.formSubmitted(user)}
          onCancel={(mode, user) => this.updateForm(mode, user)}
          formMode={this.state.formMode}
          user={this.state.user}
          key={this.state.user.id}
        />
        <UserList
          users={this.state.users}
          onDelete={id => this.removeUser(id)}
          onEdit={(mode, user) => this.updateForm(mode, user)}
        />
      </div>
    );
  }
  loadUsers() {
    axios
      .get(`${API_BASE}/users.json`)
      .then(res => {
        this.setState({
          users: res.data
        });
        console.log(`Data loaded! = ${this.state.users}`);
      })
      .catch(err => console.log(err));
  }
  addUser(newUser) {
    axios
      .post(`${API_BASE}/users.json`, newUser)
      .then(res => {
        res.data.key = res.data.id;
        this.setState({
          users: [...this.state.users, res.data]
        });
      })
      .catch(err => console.log(err));
  }
  updateUser(user) {
    axios
      .put(`${API_BASE}/users/${user.id}.json`, user)
      .then(res => {
        console.log("Successful update from API");
        this.loadUsers();
      })
      .catch(err => console.log(err));
  }
  removeUser(id) {
    let filteredArray = this.state.users.filter(item => item.id !== id);
    this.setState({
      users: filteredArray
    });
    axios
      .delete(`${API_BASE}/users/${id}.json`)
      .then(res => {
        console.log(`Record Deleted`);
        this.clearForm();
      })
      .catch(err => console.log(err));
  }

  updateForm(mode, userVals) {
    this.setState({
      user: Object.assign({}, userVals),
      formMode: mode
    });
  }

  clearForm() {
    console.log("clear form");
    this.updateForm("new", {
      fname: "",
      lname: "",
      email: "",
      id: "99999999"
    });
  }

  componentDidMount() {
    console.log("Users mounted!");
    this.loadUsers();
  }

  formSubmitted(user) {
    if (this.state.formMode === "new") {
      this.addUser(user);
    } else {
      this.updateUser(user);
    }
    this.clearForm();
  }
}

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: props.user.fname,
      lname: props.user.lname,
      email: props.user.email,
      id: props.user.id
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  renderButtons() {
    if (this.props.formMode === "new") {
      return (
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      );
    } else {
      return (
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button
            type="submit"
            className="btn btn-danger"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
        </div>
      );
    }
  }
  render() {
    return (
      <div className="user-form">
        <h1> Users </h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              autoComplete="given-name"
              name="fname"
              id="fname"
              placeholder="First Name"
              value={this.state.fname}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lname">Last Name</label>
            <input
              type="text"
              className="form-control"
              autoComplete="family-name"
              name="lname"
              id="lname"
              placeholder="Last Name"
              value={this.state.lname}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              className="form-control"
              autoComplete="email"
              name="email"
              id="email"
              placeholder="name@example.com"
              value={this.state.email}
              onChange={this.handleInputChange}
            />
          </div>
          {this.renderButtons()}
        </form>
      </div>
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    this.props.onSubmit({
      fname: this.state.fname,
      lname: this.state.lname,
      email: this.state.email,
      id: this.state.id
    });
    event.preventDefault();
  }

  handleCancel(event) {
    this.props.onCancel("new", { fname: "", lname: "", email: "" });
    event.preventDefault();
  }
}

ReactDOM.render(<Users />, document.getElementById("root"));
serviceWorker.unregister();
