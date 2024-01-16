import React from 'react'
import {useState, useEffect, useRef} from 'react'
import userDatabase from '../data/data';
import './style.css'

const Search = () => {
    const inputRef = useRef(null);
    const [input, setInput] = useState('');
    const [availableUsers, setAvailableUsers] = useState(userDatabase);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [highlightedChip, setHighlightedChip] = useState(null);
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
      setHighlightedChip(null);
    }, [selectedUsers]);
  
    const handleInputChange = (event) => {
      setInput(event.target.value);
      setHighlightedChip(null);
    };

    const handleInputFocus = () => {
      setIsInputFocused(true);
    };
  
    const handleKeyDown = (event) => {
      if (event.key === 'Backspace' && input === '') {
        if (highlightedChip) {
          removeChip(highlightedChip);
        } else if (selectedUsers.length > 0) {
          setHighlightedChip(selectedUsers[selectedUsers.length - 1]);
        }
      }
    };
  
    const selectItem = (user) => {
      setSelectedUsers([...selectedUsers, user]);
      setAvailableUsers(availableUsers.filter(i => i.id !== user.id));
      setInput('');
      if (inputRef.current) {
        inputRef.current.value = ''; 
      }
    };
  
    const removeChip = (chip) => {
      setSelectedUsers(selectedUsers.filter(user => user.id !== chip.id));
      setAvailableUsers([...availableUsers, chip]);
      setHighlightedChip(null);
    };
  
    const filteredUsers = input
    ? availableUsers.filter(user =>
        user.name.toLowerCase().includes(input.toLowerCase()) || user.email.toLowerCase().includes(input.toLowerCase()))
    : availableUsers;

  return (
    <div className='search-div'>
      <div className='input-container'>
            { selectedUsers && selectedUsers.length ? (selectedUsers.map(user => (
                <div key={user.id} className={`active-chip ${highlightedChip === user? 'highlighted' : ''}`}>
                    <img src={user.image} alt={user.name} className='user-image' />
                    <p className='user-name'>{user.name}</p>
                    <button onClick={() => removeChip(user)} className='close-button'>X</button>
                </div>
            ))) : null}
            
            <input ref={inputRef} value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={handleInputFocus} className='input-field' placeholder={selectedUsers.length === 0 ? 'Add new user...' : ''}/>
       </div>

       {isInputFocused && (
         <div className='suggestion-div'>
            { filteredUsers && filteredUsers.length > 0 ?
             filteredUsers.map(user => (
                <div key={user.id} onClick={() => selectItem(user)} className='chip'>
                    <img src={user.image} alt={user.name} className='user-image'/>
                    <p className='user-name'>{user.name}</p>
                    <p className='user-email'>{user.email}</p>
                </div>
            ))
            :
            <p className='no-users'> No Users to display</p>
            }
         </div>
        )}
    </div>
);

}


export default Search