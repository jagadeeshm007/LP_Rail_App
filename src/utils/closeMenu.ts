const closeMenu = (isMenuVisible: boolean, setMenuVisible: (visible: boolean) => void) => {
    if (isMenuVisible) setMenuVisible(false);
  };
  
  export default closeMenu;
  