import React, { useState, useRef, useEffect,useContext} from 'react';
import { Send, Phone, Video, Search, Users, Plus, Settings, MessageCircle, UserPlus, Clock, CheckCircle, X, Smile, Paperclip, Mic, MoreVertical, Mail, RouteOff, Slice } from 'lucide-react';
import { WebSocketContext } from '../App';
import { type } from '@testing-library/user-event/dist/type';
import { AcceptFriendRequest, sendfriendrequest } from '../services/operation/authapi';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { getfriendrequest } from '../services/operation/authapi';
import { Link } from 'react-router-dom';
import { getfriend } from '../services/operation/authapi';
import FriendRequestCard from './FriendRequestcard';
import { useNavigate } from 'react-router-dom';
const AnimatedChatDashboard = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const[joinid,setjoinid] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [friendMessage, setFriendMessage] = useState('');
  const messagesEndRef = useRef(null);
    const [roomName, setRoomName] = useState("");
    const [currentRoom,setCurrentRoom] = useState(null);
    const[roomMsg,setroomMsg] = useState([]);
    const socketRef = useContext(WebSocketContext);
  const [roomDesc, setRoomDesc] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const[requestfriend,setrequestfriend] = useState([]);
  const[friend,setfriend] = useState([]);
   useEffect(() => {
    const fetchFriend = async () => {
      try {
        const res = await dispatch(getfriend());
        setfriend(res.friends
);
        console.log("res", res);
      } catch (error) {
        console.error("Error getting friend request:", error);
      }
    };

    fetchFriend();
  }, [dispatch]);
  
 useEffect(() => {
    const fetchFriendRequest = async () => {
      try {
        const res = await dispatch(getfriendrequest());
        setrequestfriend(res.senders
);
        console.log("res", res);
      } catch (error) {
        console.error("Error getting friend request:", error);
      }
    };

    fetchFriendRequest();
  }, [dispatch]);

   const handleSendFriendRequest = async() => {
      try {
        const res = await dispatch(sendfriendrequest(friendEmail));
        console.log("reso",res.success);

        if(res.success){
           toast.success("Friend Request Sent Succesfully")
          setShowAddFriend(!showAddFriend)
        }
        else{
           toast("Friend Request not Sent")
          navigate("/dashboard")
        }
        setFriendEmail('')
      } catch (error) {
      
      }


  };
  useEffect(()=>{
console.log(joinid)
  },[joinid])
   useEffect(()=>{
console.log(roomName)
  },[roomName])
useEffect(() => {
  if (!socketRef.current) return;

  const handleMessage = (e) => {
    const Msg = JSON.parse(e.data);
    console.log("Data", Msg);

    if (Msg.type === "room_created") {
      setCurrentRoom(Msg.roomId);  
      setroomMsg([]);
    }

    if (Msg.type === "room_message" && Msg.roomId === currentRoom) {
 setroomMsg((prev) => [...prev, {
  sender: Msg.data.sender,
  text: Msg.data.text,
  time: Msg.data.time,
  from: Msg.from,       
  timestamp: Msg.timestamp
}]);

}


    if (Msg.type === "room_joined") {
      console.log("User joined:", Msg.user);
    }
  };

  socketRef.current.addEventListener("message", handleMessage);
  return () => {
    socketRef.current.removeEventListener("message", handleMessage);
  };
}, [socketRef]);  


   const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedFriend]);
  const handleSendMessage = () => {


const handleCreateRoom = ()=>{
  if(!roomName.trim()){
     return alert("Room name required!");
  }

}
 

  const handleSendFriendRequest = () => {
    if (friendEmail.trim()) {
      alert(`Friend request sent to ${friendEmail}!`);
      setFriendEmail('');
      setFriendMessage('');
      setShowAddFriend(false);
    }
  };
    if (message.trim() && selectedFriend) {
      const newMessage = {
        id: Date.now(),
        sender: 'me',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => ({
        ...prev,
        [selectedFriend.id]: [...(prev[selectedFriend.id] || []), newMessage]
      }));

      setMessage('');
      
      setTimeout(() => setIsTyping(true), 1000);
      setTimeout(() => {
        setIsTyping(false);
        const friendResponse = {
          id: Date.now() + 1,
          sender: 'friend',
          text: 'That\'s interesting! Tell me more about it.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: selectedFriend.avatar
        };
        setMessages(prev => ({
          ...prev,
          [selectedFriend.id]: [...(prev[selectedFriend.id] || []), friendResponse]
        }));
      }, 2500);
    }
  }
 
  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>;
      case 'away': return <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>;
      default: return <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>;
    }
  };

  // const filteredFriends = requestfriend[activeTab]?.filter(requestfriend =>
  //   requestfriend.name.toLowerCase().includes(searchQuery.toLowerCase())
  // ) || [];

  const tabs = [
    { id: 'all', label: 'All', icon: Users },
    { id: 'active', label: 'Active', icon: CheckCircle },
    { id: 'requests', label: 'Requests', icon: UserPlus},
  ];
   function handlejoinbtn(){
     if(!joinid.trim()){
      return alert("JoinId is required");

     }

     const msg = {
      type:"join_room",
      roomId:joinid,
      data:{
        username:"Adnan"
      }
     };

     if(socketRef.current && socketRef.current.readyState === WebSocket.OPEN){
      socketRef.current.send(JSON.stringify(msg));
setShowCreateRoom(false); 
      setCurrentRoom(joinid);
      setroomMsg([]);

     }
  }
  function handleaccept(id){
        try {
          console.log("idd inside accept",id)
          const res = dispatch(AcceptFriendRequest(id));
          console.log("accept friend request",res);
              setrequestfriend((prev) => prev.filter((req) => req._id !== id));
        } catch (error) {
          
        }
  }
  function handlereject(id){

  }
  function  handleCreateRoom(){
 if(!roomName.trim()){
   return alert("Room name required!");
 }
   const msg = {
      type: "create_room",
      roomId: roomName,  
    };
       if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
      console.log(" Sent:", msg);
      setShowCreateRoom(false); 
      setCurrentRoom(roomName);
      setroomMsg([]);
    } else {
      console.error("WebSocket not connected");
    }
  };

//   {
// //   "type": "room_message",
// //   "roomId": "myRoom123",
// //   "data": { "text": "Hello everyone!" }
// // }

  const handleSendRoomMessage = () => {
  if (!message.trim() || !currentRoom) return;

  const msgData = {
    type: 'room_message',
    roomId: currentRoom,
    data: {
      sender: "me",       // ✅ add sender
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  };

  socketRef.current.send(JSON.stringify(msgData));

  // push entire message object, not just .data
  setroomMsg(prev => [...prev, msgData.data]); 

  setMessage('');
};


  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col relative z-10">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ChatHub
            </h1>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowAddFriend(true)}
              
        
                className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                title="Add Friend"
              >
                <UserPlus className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowCreateRoom(true)}
                className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                title="Create Room"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
            />
          </div>
        </div>

     <div className="flex space-x-4 border-b border-gray-700 w-5 px-6">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center space-x-2 py-3 px-2 transition rounded-t-lg ${
        activeTab === tab.id
          ? "text-purple-400 border-b-2 border-purple-400"
          : "text-gray-400 hover:text-white"
      }`}
    >
      <tab.icon size={18} />
      <span>{tab.label}</span>
    </button>
  ))}
</div>

 <div className="flex-1 overflow-y-auto px-6 space-y-2">
  {activeTab === "requests" && requestfriend.map((friend, index) => (
    <FriendRequestCard
      key={index}
      name={friend.username}
      time={friend.created_at}
      onAccept={() => handleaccept(friend._id)}
      onReject={() => handlereject(friend._id)}
    />
  ))}

  {activeTab === "all" && friend.map((friends, index) => (
    <div
      key={friends._id}
      onClick={() => setSelectedFriend(friends)}
      style={{ animationDelay: `${index * 100}ms` }}
      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up ${
        selectedFriend?.id === friends._id
          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-lg"
          : "bg-white/5 hover:bg-white/10 border border-transparent"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-xl font-semibold">
            {friends.avatar}
          </div>
          {/* <div className="absolute -bottom-1 -right-1">
            {getStatusIcon(friend.status)}
          </div> */}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white truncate">{friends.username}</h3>
            <span className="text-xs text-gray-400">
              {friend.created_at}
            </span>
          </div>
          {/* <p className="text-sm text-gray-400 truncate">{friend.lastMessage}</p>
          <p className="text-xs text-gray-500">{friend.lastSeen}</p> */}
        </div>
        {/* {friend.unread > 0 && (
          <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">{friend.unread}</span>
          </div>
        )} */}
      </div>
    </div>
  ))}

  {activeTab === "active" && (
    <p className="text-gray-400">Show only active friends here</p>
  )}

 
</div>


        {/* Room Actions */}
        <div className="p-6 border-t border-white/10 space-y-3">
          <button 
            onClick={() => setShowJoinRoom(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            Join Room
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {currentRoom ? (
          <>
            {/* Room Header */}
            <div className="p-6 border-b border-white/10 bg-black/20 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white">Room: {currentRoom}</h2>
            </div>

            {/* Room Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
     {roomMsg.map((msg, i) => (
  <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
    <div className={`px-4 py-3 rounded-2xl shadow-lg ${
      msg.sender === 'me' 
        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
        : 'bg-black/40 border border-white/10 text-white'
    }`}>
      {msg.sender !== 'me' && (
        <p className="text-xs font-semibold text-purple-300 mb-1">{msg.from}</p>
      )}
      <p className="text-sm">{msg.text}</p>
      <p className="text-xs mt-1 text-gray-400">{msg.time}</p>
    </div>
  </div>
))}

              <div ref={messagesEndRef} />
            </div>

            {/* Room Input */}
            <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl flex space-x-4">
              <input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendRoomMessage()} placeholder="Type a message..." className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button onClick={handleSendRoomMessage} className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Send</button>
            </div>
          </>
        ) : selectedFriend ? (
          <>
            {/* Friend Header */}
            <div className="p-6 border-b border-white/10 bg-black/20 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{selectedFriend.avatar}</div>
                <div>
                  <p className="font-bold">{selectedFriend.name}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    {getStatusIcon(selectedFriend.status)}
                    <span>{selectedFriend.status === 'offline' ? `Last seen: ${selectedFriend.lastSeen}` : 'Online'}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Phone className="w-5 h-5 cursor-pointer" />
                <Video className="w-5 h-5 cursor-pointer" />
                <MoreVertical className="w-5 h-5 cursor-pointer" />
              </div>
            </div>

            {/* Friend Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {(messages[selectedFriend.id] || []).map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl shadow-lg ${msg.sender === 'me' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-black/40 border border-white/10 text-white'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs mt-1 text-gray-400">{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Friend Input */}
            <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl flex space-x-4">
              <input type="text" value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button onClick={handleSendMessage} className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Send</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-xl">Select a friend or create/join a room to start chatting.</div>
        )}
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-96 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Add Friend</h3>
              </div>
              <button 
                onClick={() => setShowAddFriend(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Personal Message (Optional)</label>
                <textarea
                  value={friendMessage}
                  onChange={(e) => setFriendMessage(e.target.value)}
                  placeholder="Hi! I'd like to connect with you on ChatHub..."
                  rows="3"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 resize-none transition-all duration-300"
                ></textarea>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-200">
                    <p className="font-medium mb-1">How it works:</p>
                    <p className="text-green-300/80">We'll send an email invitation to your friend with a link to join ChatHub and connect with you.</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSendFriendRequest}
                disabled={!friendEmail.trim()}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>Send Friend Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-96 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Create Room</h3>
              <button 
                onClick={() => setShowCreateRoom(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
            <input 
        type="text"
        placeholder="Room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-purple-500 
                   placeholder-gray-400 text-white"
      />
      <p className="mt-2 text-sm text-gray-400">Current room: {roomName}</p>
              {/* <textarea
                placeholder="Room description"
                
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 resize-none"
              ></textarea> */}
              <button  onClick={handleCreateRoom} className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-medium transition-all duration-300 transform hover:scale-105">
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-96 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Join Room</h3>
              <button 
                onClick={() => setShowJoinRoom(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Room code or link"
                onChange={(e) => setjoinid(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              />
              <button onClick={handlejoinbtn} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-medium transition-all duration-300 transform hover:scale-105">
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-slide-in { animation: slide-in 0.4s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>

  );
};

export default AnimatedChatDashboard;