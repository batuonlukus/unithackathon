import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Image,
  useToast
} from '@chakra-ui/react';

const CreateNFT = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectDetails: ''
  });
  const toast = useToast();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // NFT oluşturma mantığı buraya gelecek
    toast({
      title: "NFT Oluşturuldu!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="xl" mx="auto" p={6}>
      <VStack spacing={6}>
        <FormControl>
          <FormLabel>NFT Görseliniz</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {image && (
            <Image
              src={image}
              alt="Preview"
              mt={4}
              maxH="200px"
              borderRadius="md"
            />
          )}
        </FormControl>

        <FormControl>
          <FormLabel>İsim</FormLabel>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Kendinizi Tanıtın</FormLabel>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Proje Detayları</FormLabel>
          <Textarea
            value={formData.projectDetails}
            onChange={(e) => setFormData({...formData, projectDetails: e.target.value})}
          />
        </FormControl>

        <Button
          colorScheme="purple"
          size="lg"
          width="100%"
          onClick={handleSubmit}
        >
          NFT Oluştur
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateNFT; 