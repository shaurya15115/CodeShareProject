import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid'; // Used for automatically generating random id 
import { useNavigate } from 'react-router-dom'; // Used to navigate through pages in the routes

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => { // function, that would create random room id, and store that into roomid
        e.preventDefault();
        setRoomId(uuidV4());
    };

    const joinRoom = () => { // function through which we would be able to navigate on the click of the button
        if (!roomId || !username) {
            alert('ROOM ID & username is required');
            return;
        }
        navigate(`/editor/${roomId}`, { state: { username } }); // here state refers to the data that we are passing from one page to another, and it can eb both fixed, and variable, here username is variable, and fixed we would write like : website : codeshare 
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') joinRoom(); // Basic on key up function ( would enter the room on pressing the enter key )
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
                <div className="flex items-center justify-center mb-6">
                    <span className="text-2xl font-bold text-green-400">CodeShare</span>
                </div>
                <h4 className="text-center font-medium text-gray-300 mb-4">Paste invitation ROOM ID</h4>
                
                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:border-green-400 transition"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:border-green-400 transition"
                        placeholder="USERNAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button 
                        className="w-full bg-green-400 hover:bg-green-500 text-gray-900 font-semibold p-3 rounded-md transition mt-2"
                        onClick={joinRoom}
                    >
                        Join
                    </button>
                    <span className="text-sm text-gray-400 text-center mt-2">
                        If you don't have an invite then create &nbsp;
                        <a onClick={createNewRoom} href="#" className="text-green-400 font-semibold underline-offset-4 hover:underline">
                            new room
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Home;
