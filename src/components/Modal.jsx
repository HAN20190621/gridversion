import { createPortal } from 'react-dom';

//https://codesandbox.io/s/zealous-waterfall-s76w2?file=/src/TooltipPopover.js
//blog.logRocket.com/learn-react-portals-by-example/
//https://stackoverflow.com/questions/41676054/how-to-add-fonts-to-create-react-app-based-projects
//Most form elements (input, select, textarea, button)
//don't inherit font properties in CSS by default,
//you have to specify it. http://jsfiddle.net/pEedc/184/

//https://reactgo.com/react-modal-tutorial/

export default function Modal({ show, id, children }) {
  //const target = usePortal(id);
  return createPortal(show ? children : null, document.getElementById(id));
}
