# CodeShare Core Documentation

This guide breaks down the four most critical files powering the application. 

### 1. `Backend/index.js`
**What is imported?**
- `Server` from `socket.io`: The core WebSocket backend engine facilitating real-time TCP connections.

**What to pay mind to:**
- **`userSocketMap`**: A crucial in-memory object linking random internal Socket IDs directly to human-readable usernames. 
- **Namespaces (Rooms)**: Socket.io natively supports "Rooms." When someone triggers `socket.join(roomId)`, they enter a sealed boundary. Any subsequent `code-change` events broadcast explicitly only to humans sharing that exact string ID. 
- **The Event Pipeline**: Master these three explicit listeners: `join` (setting up the room context), `code-change` (receiving keystrokes string), and `sync-code` (serving exact text states to newcomers actively).

---

### 2. `Frontend/src/App.jsx`
**What is imported?**
- `BrowserRouter`, `Routes`, `Route` from `react-router-dom`: Standard elements handling strict URL navigations smoothly.
- `Home` and `EditorPage` components: For rendering the actual visual content.

**What to pay mind to:**
- **Pure Routing**: This entire file strictly plays the role of a traffic dispatcher. Natively, if a user lands on `/`, they retrieve `<Home />`. If they land on `/editor/123`, they are immediately fed the `<EditorPage />` interface.

---

### 3. `Frontend/src/components/Home.jsx`
**What is imported?**
- `useState`: React hook to store values typed identically into the interactive textboxes.
- `v4` from `uuid`: Algorithm dynamically creating mathematically completely random secure Room IDs essentially safe from overlaps.
- `useNavigate` from `react-router-dom`: Enables firing explicit URL redirection functions.

**What to pay mind to:**
- **Invisible State Transportation**: Pay explicit attention to the `navigate(...)` invocation explicitly inside `joinRoom()`. When mapping toward `/editor`, it uniquely passes the user's mapped `username` silently inside a hidden background parameter (`{ state: { username } }`). It powerfully avoids polluting your visual URL bar tightly!

---

### 4. `Frontend/src/components/EditorPage.jsx`
**What is imported?**
- `useState`, `useRef`, `useEffect`: Vital React hooks executing states natively precisely decoupled from rendering loops.
- `Editor` from `@monaco-editor/react`: The authentic VS-Code text engine generating the UI block natively!
- `initSocket`: Our helper effectively invoking exactly `io('http://localhost:5000')`.

**What to pay mind to:**
- **The Magic of `useRef`**: Note `socketRef.current`. We firmly use Ref rather than State to house our WebSocket. Why? Because whenever React states dynamically update, the page deeply "re-renders". Using `useRef` stores the connection safely in memory silently without constantly forcefully restarting your TCP socket connections!
- **Zero-Latency Bi-Directional Pipeline**: Thoroughly observe `handleEditorChange()`. Natively typing sets local variables explicitly *and* aggressively shoots exactly that string squarely into backend `emit('code-change')`. Conversely, the background `socket.on('code-change')` listener catches external strokes from the backend natively explicitly injecting it directly back overriding the local Monaco Editor perfectly!
