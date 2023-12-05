import FriendsList from "./components/FriendsList";
import Button from "./components/includes/Button";
import FormToAddFriend from "./components/FormToAddFriend";
import FormSplitBill from "./components/FormSplitBill";
import { useReducer } from "react";
import SideBar from "./components/SideBar";

const initialFriends = [
  {
    id: 118836,
    name: "Mouni",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Yoshi",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Sanju",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const ACTIONS = {
  SET_SHOW_ADD_FRIEND: "setShowAddFriend",
  SET_SELECTED_FRIEND: "setSelectedFriend",
  SET_FRIENDS: "setFriends",
  HANDLE_SPLIT_BILL: "handleSplitBill",
  DELETE_FRIEND: "deleteFriend",
};

const initialState = {
  showAddFriend: false,
  selectedFriend: null,
  friends: initialFriends,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SHOW_ADD_FRIEND:
      return { ...state, showAddFriend: !state.showAddFriend };
    case ACTIONS.SET_SELECTED_FRIEND:
      return {
        ...state,
        selectedFriend:
          state.selectedFriend?.id === action.payload.friend.id
            ? null
            : action.payload.friend,
      };
    case ACTIONS.SET_FRIENDS:
      return { ...state, friends: [...state.friends, action.payload] };
    case ACTIONS.HANDLE_SPLIT_BILL: {
      const { selectedFriend, value } = action.payload;
      if (!selectedFriend) {
        return state; // Return the current state if there's no selected friend
      }
      const updatedFriends = state.friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      );

      return {
        ...state,
        friends: updatedFriends,
        selectedFriend: null,
      };
    }
    case ACTIONS.DELETE_FRIEND: {
      const friendToDelete = action.payload.friend;
      const updatedFriends = state.friends.filter(
        (friend) => friend.id !== friendToDelete.id
      );

      return {
        ...state,
        friends: updatedFriends,
        selectedFriend: null,
      };
    }
    default:
      return state;
  }
}

const App = () => {
  const [
    { showAddFriend, selectedFriend, friends },
    dispatch,
  ] = useReducer(reducer, initialState);

  const handleShowAddFriend = function () {
    dispatch({
      type: ACTIONS.SET_SHOW_ADD_FRIEND,
    });
  };

  const handleSelection = (friend) => {
    dispatch({
      type: ACTIONS.SET_SELECTED_FRIEND,
      payload: { friend },
    });
  };

  const handleAddFriend = (friend) => {
    dispatch({
      type: ACTIONS.SET_FRIENDS,
      payload: friend,
    });
    handleShowAddFriend();
  };

  function handleSplitBill(value) {
    dispatch({
      type: ACTIONS.HANDLE_SPLIT_BILL,
      payload: { selectedFriend, value },
    });
  }

  const handleDeleteFriend = () => {
    if (selectedFriend) {
      dispatch({
        type: ACTIONS.DELETE_FRIEND,
        payload: { friend: selectedFriend },
      });
    }
  };

  return (
    <div className={"app"}>
      {/* New heading for the tagline */}
      <h1>BillBuddy</h1>
      {/* New tagline below the heading */}
      <p className="tagline">Where Friends and Finances Meet.</p>

      {/* Existing components */}
      <SideBar>
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
        {showAddFriend && <FormToAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {!showAddFriend ? "Add Friend" : "Close"}
        </Button>
      </SideBar>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}

      <Button onClick={handleDeleteFriend} disabled={!selectedFriend}>
        Delete Friend
      </Button>
    </div>
  );
};

export default App;
