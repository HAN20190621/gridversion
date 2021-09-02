import { useRef, useEffect } from "react";

function createRootElement(id) {
  const rootContainer = document.getElementById("div");
  rootContainer.setAttribute("id", id);
  return rootContainer;
}

function addRootElement(rootElement) {
  document.body.insertBefore(
    rootElement,
    document.body.lastElementChild.nextElementSibling
  );
}

const usePortal = (id) => {
  const rootElementRef = useRef(null);

  useEffect(() => {
    const existingParent = document.querySelector(`#${id}`);
    const parentElement = existingParent || createRootElement(id);
    if (!existingParent) {
      addRootElement(parentElement);
    }
    parentElement.appendChild(rootElementRef.current);
    return () => {
      rootElementRef.current.remove();
      if (!parentElement.childElementCount) {
        parentElement.remove();
      }
    };
  }, [id]);

  function getRootElement() {
    if (!rootElementRef.current) {
      rootElementRef.current = document.createElement("div");
    }
    return rootElementRef.current;
  }

  return getRootElement(); // return the div
};

export default usePortal;
