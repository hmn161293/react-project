import React, { Component } from 'react';
import { UserAuthForm } from '../components/editpass';

class EditPass extends Component {
  render() {
    console.log('ssss')
    return (
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Edit Pasword
            </h1>
          </div>
          <UserAuthForm />
        </div>
      </div>
    );
  }
}

// Connect Login component to Redux store
export default EditPass;
