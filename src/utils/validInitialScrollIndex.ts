const validInitialScrollIndex = (list: any[], index: number) => {
    return list.length > index ? index : 0;
  };
  
  export default validInitialScrollIndex;
  