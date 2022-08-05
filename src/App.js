import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { listPosts } from "./graphql/queries";
import { createPosts as createPostsMutation } from "./graphql/mutations";
import './App.css'
import {
  withAuthenticator,
  Authenticator
} from "@aws-amplify/ui-react";

const initialFormState = { title: "", description: "", author: "" }

function App({ signOut, user }) {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  async function fetchPosts() {
    const apiData = await API.graphql({ query: listPosts });
    setPosts(apiData.data.listPosts.items);
  }

  async function createPost() {
    if (!formData.title || !formData.description || !formData.author) return;
    await API.graphql({ query: createPostsMutation, variables: { input: formData } });
    setPosts([...posts, formData]);
    setFormData(initialFormState);
  }

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <Authenticator>
      <div className="App">
        <h1>Posts App</h1>
        <div>
          <input
            onChange={e => setFormData({ ...formData, 'title': e.target.value })}
            placeholder="Post title"
            value={formData.title}
            type="text"
          />
        </div>

        <div>
          <input
            onChange={e => setFormData({ ...formData, 'author': e.target.value })}
            placeholder="Post author"
            value={formData.author}
            type="text"
          />
        </div>

        <div>
          <textarea
            onChange={e => setFormData({ ...formData, 'description': e.target.value })}
            placeholder="Post description"
            value={formData.description}
          />
        </div>

        <button onClick={createPost}>Create Post</button>

        <div style={{ marginBottom: 30 }}>

          <h2> Welcome {user.username}. Here are your posts:</h2>
          {
            posts.map(post => (
              <div key={post.id || post.title}>
                <h2>Title: {post.title}</h2>
                <p> Author: {post.author}</p>
                <p>Message: {post.description}</p>
              </div>
            ))
          }
        </div>
        <button onClick={signOut}> Sign Out</button>
      </div>
    </Authenticator>
  );
}

export default withAuthenticator(App);