import ChildPage from './ChildPage';
import LoginPage from './LoginPage';
import { useCookies } from 'react-cookie';
import 'antd/dist/antd.css';

function App() {
  const [cookies, setCookie] = useCookies(['keyCookie']);
  return (
    <div>
      { cookies.apiSecretKeyCookie && cookies.apiKeyCookie ? 
        <ChildPage containerId='TestID' /> :
        <LoginPage containerId='TestID' /> 
      }
    </div>
  );
}

export default App;
