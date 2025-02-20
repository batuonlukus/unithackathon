import React from 'react';
import { ChakraProvider, Container, Grid, Heading, VStack } from '@chakra-ui/react';
import NFTCard from './components/NFTCard';
import CreateNFT from './components/CreateNFT';

// Örnek veri
const sampleNFTs = [
  {
    id: 1,
    name: "Yenilikçi Eğitim Projesi",
    image: "https://example.com/image1.jpg",
    description: "Gençler için yenilikçi eğitim platformu projesi",
    hasDonation: true,
    donator: {
      name: "Tech Corp",
      logo: "https://example.com/tech-corp-logo.jpg"
    }
  },
  {
    id: 2,
    name: "Sürdürülebilir Enerji",
    image: "https://example.com/image2.jpg",
    description: "Yenilenebilir enerji çözümleri projesi",
    hasDonation: false
  }
];

function App() {
  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Heading>Genç NFT Platformu</Heading>
          
          <CreateNFT />

          <Grid
            templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
            gap={6}
            w="100%"
          >
            {sampleNFTs.map(nft => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </Grid>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App; 