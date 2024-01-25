import './style.css';

const UserList = ({ users, searchValue }) => {
  const filteredUsers = users.filter(user => user.pseudo.startsWith(searchValue));
    console.log(searchValue)
  return (
   <div className="user-list">
  {(filteredUsers.length > 0 || searchValue === "@All") ? (
    (searchValue === "@All" ? users : filteredUsers).map((user, index) => (
      <div key={index} className="user-box">
        <p>{user.pseudo}</p>
      </div>
    ))
  ) : (
    <p>Aucun utilisateur ne correspond à ce pseudo</p>
  )}
</div>
  );
};
export default UserList;