import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userLoginFetch } from '../redux/authSlice';
import { UserAuthForm } from '../components/UserRelog';

class Profile extends Component {
  render() {
    return (
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              To continue, first verify that it's you
            </h1>
          </div>
          <UserAuthForm />
        </div>
      </div>
    );
  }
}

// Connect Login component to Redux store
export default connect(null, { userLoginFetch })(Profile);
