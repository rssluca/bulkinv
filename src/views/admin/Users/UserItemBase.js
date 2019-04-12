import React, { Component } from "react";

class UserItemBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
      resetSuccess: null,
      ...props.location.state
    };
  }

  componentDidMount() {
    if (this.state.user) {
      return;
    }

    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase
      .user(this.props.match.params.id)
      .onSnapshot(snapshot => {
        this.setState({
          user: snapshot.data(),
          loading: false
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(this.state.user.email);
    this.setState({ resetSuccess: "Email sent!" });
  };

  render() {
    const { user, loading, resetSuccess } = this.state;

    return (
      <div>
        <h2>User ({this.props.match.params.id})</h2>
        {loading && <div>Loading ...</div>}

        {user && (
          <div>
            <span>
              <strong>ID:</strong> {user.uid}
            </span>
            <span>
              <strong>E-Mail:</strong> {user.email}
            </span>
            <span>
              <strong>Username:</strong> {user.username}
            </span>
            <span>
              <button type="button" onClick={this.onSendPasswordResetEmail}>
                Send Password Reset
              </button>
            </span>
            {resetSuccess && <div>{resetSuccess}</div>}
          </div>
        )}
      </div>
    );
  }
}

export default UserItemBase;
