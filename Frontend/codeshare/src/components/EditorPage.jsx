import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react'; // The editor that we are using 
import { io } from 'socket.io-client';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';

// Navigate and UseNavigate do the same thing, just useNavigate is a hook, while Navigate is a component ( can be used like a tag )

const EditorPage = () => {

    const location = useLocation(); // useLocation gives you the data, when navigating through pages using navigate . Like we are able to access the data, that was sent from the home page to editor page through the use of Navigate  
    const { roomId } = useParams(); // It is being used, in order to get the room id from the url 
    const reactNavigator = useNavigate(); // useNavigate is used to navigate through pages in the routes 

    const [socket, setSocket] = useState(null); // s is being created in useEffect, so if we want to access that, therefore we have created a useState variable for that purpose only 
    const [clients, setClients] = useState([]); // List of uers in the room 
    const [code, setCode] = useState("// Write your code here"); // The code that you would write on the editor 

    useEffect(() => {

        const s = io('http://localhost:5000'); // connecting to the backend 
        setSocket(s); // stored state, so that other functions can also use it 

        s.emit('join', { // Sending the data from frontend to the backend, that a person with this room id, and this username wants to join 
            roomId,
            username: location.state?.username, // Location.state refers to the data sent from the previous page via useNavigate or navigate, and .username, is the username. the work of question mark is to prevent crashing , if the username is unll 
        });

        s.on('joined', ({ clients, socketId }) => { // Note : The clients in here , is the clients that we are getting from the backend, and we are storing that into the created hook variable by the name of "clinets" which itself is an array of information  
            setClients(clients); // and being stored in Clients array 

            // send current code
            s.emit('sync-code', { // Through this , we are sending the latest code to the person, who is just newly joined 
                code: code,
                socketId,
            });
        });
        // ------------ Basic things going on  ------------
        s.on('disconnected', ({ socketId }) => {
            setClients(prev =>
                prev.filter(c => c.socketId !== socketId)
            );
        });

        s.on('code-change', ({ code }) => { // we emit through the function ( handleEditorChange ), and the result is then being received in here 
            if (code !== null) setCode(code);
        });

        return () => {
            s.disconnect();
        };

    }, []);

    function copyRoomId() {
        navigator.clipboard.writeText(roomId);
        alert('Copied to clipboard');
    }

    function leaveRoom() {
        reactNavigator('/'); // Here this thing on pressing the leave room , would directly bring back the person to the home login page 
    }

    function handleEditorChange(value) { // This function is being called, whenever there is a change in the editor 
        setCode(value); // The code is being updated in the useState variable 

        if (socket) {
            socket.emit('code-change', {
                roomId,
                code: value,
            });
        }
    }

    if (!location.state) return <Navigate to="/" />;

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">

            <div className="w-64 bg-gray-800 flex flex-col p-4 border-r border-gray-700 shadow-md">

                <div className="pb-4 mb-4 border-b border-gray-700">
                    <span className="text-xl font-bold text-green-400">CodeShare</span>
                </div>

                <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-4 font-semibold">
                    Connected
                </h3>

                <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                    {clients.map((client) => (
                        <div key={client.socketId} className="flex items-center gap-3 bg-gray-900 p-2 rounded-lg border border-gray-700">

                            <div className="bg-green-400 text-gray-900 font-bold w-10 h-10 flex items-center justify-center rounded-md">
                                {client.username.slice(0, 2).toUpperCase()}
                            </div>

                            <span className="font-medium text-sm truncate">
                                {client.username}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                    <button
                        className="w-full bg-transparent hover:bg-gray-700 text-gray-200 border border-gray-600 p-2 rounded transition"
                        onClick={copyRoomId}
                    >
                        Copy ROOM ID
                    </button>

                    <button
                        className="w-full bg-transparent hover:bg-red-500/10 text-red-500 border border-red-500/30 p-2 rounded transition"
                        onClick={leaveRoom}
                    >
                        Leave
                    </button>
                </div>
            </div>

            <div className="flex-1">
                <Editor
                    height="100%"
                    width="100%"
                    theme="vs-dark"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 16
                    }}
                />
            </div>
        </div>
    );
};

export default EditorPage;
