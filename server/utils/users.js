
class Users{
    constructor(){
        this.users = [];
    }

    addUser(id,name,room){
        let user = {id,name,room};
        this.users.push(user);
        return user;
    }

    removeUser(id){
        //to remove a user first filter the array and check if a user with that specific id exists
        //if it exists than filter the array again but now the condition is for every user that does not match that id
        //return user that was removed
        let user = this.users.filter((user) => {
            return user.id === id;
        })[0];
        if(user){
            this.users = this.users.filter((user) =>{
                return user.id !== id;
            });
        }
        return user;
    }

    getUser(id){
        //returns the user
        let user = this.users.filter((user) => {
            return user.id === id;
        })[0];
        return user;
    }

    getUserList(room){
        let users = this.users.filter((user) =>{
            return user.room === room;
        });
        let namesArray = users.map((user) => {
            return user.name;
        });
        return namesArray;
    }

    //get the list of all rooms
    getAllRooms(){
        let roomList = this.users.map((user)=> {
            return user.room;
        });

        let uniqueRoomList = roomList.filter((elem, pos)=> {
            return roomList.indexOf(elem) == pos;
        });

       return uniqueRoomList;
    }

    //check if username exists for a room
    checkUsername(username,room){
        username = username.toLowerCase();
        
        let nameList = [];
        this.users.forEach(function(user) {
            if(user.room === room){
                nameList.push(user.name.toLowerCase());
            }
        })
        
        let found = false;
        for (let name of nameList) {
           if(name === username){
               found = true;
           }
        }
        console.log(username,nameList);
        return found;
    }



}

module.exports = {Users};