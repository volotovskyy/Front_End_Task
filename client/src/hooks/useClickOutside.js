// import { useRef, useEffect } from "react";
//
// export const useOutsideClick = (callback) => {
//   const ref = useRef();
//
//   useEffect(() => {
//     const handleClick = (event) => {
//       if (ref.current && !ref.current.contains(event.target)) {
//         callback();
//       }
//     };
//
//     document.addEventListener("click", handleClick);
//
//     return () => {
//       document.removeEventListener("click", handleClick);
//     };
//   }, [ref]);
//
//   return ref;
// };
//
import { useRef, useEffect } from "react";

export const useOutsideClick = (callback) => {
  const ref = useRef();
  const ignoreFirstClick = useRef(false);

  useEffect(() => {
    const handleClick = (event) => {
      if (ignoreFirstClick.current) {
        ignoreFirstClick.current = false;
        return;
      }

      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [callback]);

  return [
    ref,
    () => {
      ignoreFirstClick.current = true;
    },
  ];
};
