import React, { useContext } from "react";
import { type User } from "firebase/auth";

// type of the value of props that will go into the context
export interface valueUser {
    currentUser: User | null;
    userLoggedIn: boolean;
    loading: boolean;
}

const tempUser: valueUser = {currentUser: null, userLoggedIn: false, loading: true};

// in React, "context" is a way to pass variables (like whether a user is logged in and who) while avoiding "props drilling"
// props drilling is when you have to manually pass info as props from one component down a long line of other components, which gets difficult to keep track of very quickly
// React lets you create your own context so that variables such as authentication can be easily used across comonents
// we will initialize context here, and then use a Provider at the end of this function to set the values that will be shared as context
export const AuthContext = React.createContext(tempUser);

// we're also exporting a custom hook, called useAuth
// in React, hooks are the logic-only counterparts to components - you build them in a file somewhere, and then you can import that function/logic into other components to use and re-use later
// some hooks, like useEffect, are built in, but you can also create your own hooks
// even though we're exporting another hook here, and we're not really "writing" our own logic, this is still technically a custom hook that we'll use to get our new context moved around
// so, we'll feed it the AuthContext we initialized above, and now we can export it and import it into other files
// react hooks are weird - feel free to ask Madeline if you need clarification
export function useAuth() {
    return useContext(AuthContext);
}