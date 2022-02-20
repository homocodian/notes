import { DependencyList, EffectCallback, useEffect, useRef } from "react";

function useUpdate(callback: EffectCallback, dependencyList: DependencyList) {
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    // eslint-disable-next-line
    return callback();
    // eslint-disable-next-line
  }, dependencyList);
}

export default useUpdate;
