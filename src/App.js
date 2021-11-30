import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyB8xXzNDrlXR8-Y0TQbTpcWM5ZMkWXFV7U",
  authDomain: "chat-394fc.firebaseapp.com",
  projectId: "chat-394fc",
  storageBucket: "chat-394fc.appspot.com",
  messagingSenderId: "1062690409558",
  appId: "1:1062690409558:web:01011b3f6feaa82684fff7",
  measurementId: "G-Z3NBXVL72D"
})
const [user] = useAuthState(auth);

function App() {
  return (
    <div className="App">
      <header className="App-header">

        
      </header>
      <section>
        {user ? <Chatroom /> : <SignIn />}
      </section>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider(); 
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function Chatroom(){
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue,setFormValue] = useState('');
  const dummy = useRef()
  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid,photoURL } = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <>
      <main>
        {messages && messages.map(msg=><ChatMessage key={msg.id} />)}
        <div ref={dumy}></div>
      </main>
      <form>
        <input type={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </>
  )
}
function ChatMessage(props){
  const { text, uid } = props.message;
  const messageClass = uid === auth.currentUser.uid?'sent' : 'received';

  return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL} />  
        <p>{text}</p>
      </div>
    )
}
export default App;
