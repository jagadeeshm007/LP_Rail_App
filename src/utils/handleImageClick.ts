const handleImageClick = (setSelectedImageSet: (images: string[]) => void, setCurrentImageIndex: (index: number) => void, setIsViewerVisible: (visible: boolean) => void, imageSet: string[], index: number) => {
    setSelectedImageSet(imageSet);
    setCurrentImageIndex(index);
    setIsViewerVisible(true);
  };
  
  export default handleImageClick;
  