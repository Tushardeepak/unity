import { useEffect, useState } from "react";
import "./App.css";
import appLogo from "./appLogo.png";
import Posts from "./Components/Posts";
import { auth, db } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { Button, Input, makeStyles } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPost] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPost(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signup = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signin = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="AppSignup">
            <center>
              <img src={appLogo} className="app-headerImage"></img>
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Input>
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button type="submit" onClick={signup}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="AppSignup">
            <center>
              <img src={appLogo} className="app-headerImage"></img>
            </center>
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button type="submit" onClick={signin}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app-header">
        <img src={appLogo} className="app-headerImage"></img>
        {user ? (
          <Button onClick={() => auth.signOut()}> LogOut</Button>
        ) : (
          <div className="LoginContainer">
            <Button onClick={() => setOpenSignIn(true)}> Sign In</Button>
            <Button onClick={() => setOpen(true)}> Sign Up</Button>
          </div>
        )}
      </div>

      <div className="MainSectionContainer">
        <div className="MainPostBox">
          {posts.map(({ id, post }) => (
            <Posts
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              key={id}
              postId={id}
              user={user}
            />
          ))}
        </div>
        <div className="MainCreatePostBox">
          {user ? (
            user.displayName ? (
              <ImageUpload username={user.displayName} />
            ) : (
              <h1 className="NotLoginMessage">Sorry Login Please</h1>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
