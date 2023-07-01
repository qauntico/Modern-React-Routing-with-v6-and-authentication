import AuthForm from '../components/AuthForm';
import { json, redirect } from 'react-router-dom';
function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({request}) {
  //for us to get access to the search params we will use the build in browser
  //method URL() then pass in the url from the request by passsing in the request.url it will return a object
  //then you access the params by using the .searchParams on it
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login';
  if (mode !== 'login' && mode !== 'signup') {
    throw json({message: "Unsuppoted mode "}, {status: 422})
  };
  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password')
  };
  console.log(mode)
  const response = await fetch('http://localhost:8080/'+mode, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(authData)
  });
  if (response.status === 422 || response.status === 401){
    return response
  }

  if(!response.ok){
    throw json({message: 'could not authenticate user'}, {status: 500})
  }
  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem('token', token);
  return redirect('/');
}