import { useState } from "react";

function useToggle(defaultState = false) {
  const [state, setState] = useState(defaultState);

  const toggleState = () => {
    setState(!state);
  };

  return [state, setState, toggleState];
}

export default useToggle;
