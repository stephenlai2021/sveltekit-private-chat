export const handleFileChange = (e) => {
  let file = null
  let fileError = null

  const types = ['image/png', 'image/jpg', 'image/jpeg']    
  
  let selectedFile = e.target.files[0]
  console.log(selectedFile)
  
  if (selectedFile && types.includes(selectedFile.type)) {
    file = selectedFile
    console.log(file)
    console.log(`${file.name} is selected`)
    fileError = null
  } else {
    file = null
    fileError = 'Please select an image file (png or jpg)'
  }

  return { 
    file, 
    fileError
  }
};