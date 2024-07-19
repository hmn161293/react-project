import axios from 'axios';

interface FileUploadProps {
  file: File | null;
}

const FileUpload = async ({ file }: FileUploadProps) => {
  console.log('phase 1');
  console.log(file);

  if (!file) {
    return null;
  }

  try {
    const formData = {
      files: file
      }
    
    const response = await axios.post(
      'https://seashell-app-5i2xd.ondigitalocean.app/api/upload', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      }
    );

    console.log('phase 3');
    console.log('File uploaded successfully:', response.data);
    return response.data; // or handle the response as needed
  } catch (error) {
    console.error('Error uploading file:', error);
    return null; // or handle the error as needed
  }
};

export default FileUpload;
