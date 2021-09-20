import React, { useState,useEffect } from "react";

const ProfileContext = React.createContext([{}, () => {}]);

let initialState = {};

const ProfileProvider = props => {
  const [state,setState] = useState(initialState);

  return(
    <ProfileContext.Provider value={[state, setState]}>
      {props.children}
    </ProfileContext.Provider>
  )
}

export {ProfileContext, ProfileProvider};
