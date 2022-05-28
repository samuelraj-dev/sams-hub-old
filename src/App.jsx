import { useState, useEffect } from 'react'
import axios from 'axios'

import './App.css'

const BACKEND = process.env.BACKEND || 'https://sams-hub.herokuapp.com/friend'

const App = () => {

    const [name, setName] = useState()
    const [age, setAge] = useState(0)
    const [friendList, setFriendList] = useState([])

    const addFriend = () => {
        axios.post(`${BACKEND}`, {
            name: name,
            age: age,
        })
            .then((res) => {
                setFriendList([...friendList, {_id: res.data._id, name: name, age: age,}])
            })
            .catch((err) => console.log(err))
    }

    const updateFriend = (id) => {
        const newAge = prompt('Enter new age: ')

        axios.put(`${BACKEND}`, { id: id, newAge: newAge})
            .then(() => {
                setFriendList(friendList.map((data) => {
                    if (data._id === id) {
                        return {_id: id, name: data.name, age: newAge}
                    }
                    else {
                        return data
                    }
                }))
            })
    }

    const deleteFriend = (id) => {
        axios.delete(`${BACKEND}${id}`)
            .then(() => {
                setFriendList(friendList.filter((data) => {
                    return data._id !== id
                }))
            })
    }

    useEffect(() => {
        axios(`${BACKEND}`)
            .then((data) => {
                setFriendList(data.data)
            })
            .catch((err) => console.log(err))
    }, [])

    return (
        <div className="App">
            <input type="text" placeholder='Friend name' onChange={(e) => {setName(e.target.value)}} />
            <input type="number" placeholder='Friend age' onChange={(e) => {setAge(e.target.value)}} />
            <input type="button" value="Add Friend" onClick={addFriend} />
            <div>
                {
                    friendList.map((data) => {
                        return (
                            <>
                                <div>{data.name} {data.age}</div>
                                <button onClick={() => updateFriend(data._id)}>Update</button>
                                <button onClick={() => deleteFriend(data._id)}>Delete</button>
                            </>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default App