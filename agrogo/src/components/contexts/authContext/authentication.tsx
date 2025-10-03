import { useEffect, useState, type ReactNode } from "react";
import { auth } from "../../firebase/firebase"; // this allows our useEffect hook below to "listen" for when a user signs in or out
import { onAuthStateChanged, type User } from "firebase/auth";
import { type valueUser, AuthContext } from "../../../hooks/UseAuth";

// Type of the value of props that will go into the Auth provider
interface valueAuthProvider {
    children: ReactNode;
}

// *** this is an important React concept - data is passed between components from parents to children as "props", handed off as arguments in the component function
// we wrap our app in this component so that the whole app is a child, and can thus share this authentication state across all components
export function AuthProvider({ children }: valueAuthProvider) {
    // these are how we handle the state of whether a user is logged in, who the current user is, and whether the app is still loading this info
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // state usually needs to be changed in an React hook called useEffect, which runs after the component renders
    // this function will work with the event onAuthStateChanged() below to call the function initializeUser() with an "auth" object as a parameter
    // or, when the authentication state changes, initializeUser(auth) is called, where auth is an object given to us from our firebase.ts file
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    },[])

    // async functions are used when your function depends on something that will take a longer-than-usual time to complete, usually because you're getting info from somewhere outside of your app
    // they're common with the useEffect hook for this reason, because the useEffect hook tells React that it needs to render everything first, then whatever is inside useEffect will happen
    // in our case, we're telling React that we want to render the component, then we can start expecting whatever info that we're getting from our Firebase API that is passing the auth object
    async function initializeUser(user: User | null) {
        if(user) {
            // if we get a user, setting state with our current user
            // the "..." in js/ts is either the "rest parameter" or the "spread" operater; the spread operator "spreads" elements out so you can modify or combine them (more info here: https://www.geeksforgeeks.org/javascript/javascript-ellipsis/)
            // as a function parameter, it's the "rest operator", and it means that the function can take an array of however many number of that argument
            setCurrentUser({ ...user });
            setUserLoggedIn(true);
        } else {
            // if we don't get a user, set the state to indicate that the current user is null and there's no one logged in
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        // now that our user is saved in state, we're done loading, so set it equal to false
        setLoading(false);
    }

    // this is the actual data we'll be passing (notice, it's the values we created in our useState hooks) 
    // we'll feed this into our AuthContext.Provider in the return section so that any component wrapped inside this context has access to it
    const value = {
        currentUser, 
        userLoggedIn, 
        loading
    } as valueUser;

    // this is the actual "thing" this function is rendering/doing - sharing this context with all children props
    // the conditional statement {!loading && children} means this: if loading != true, and there are children passed into this component as props, render the children
    // when loading = true, we haven't received our logged in user, so don't render the children; when loading = false, we have our children, so render them
    return (
        <AuthContext.Provider value = {value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
