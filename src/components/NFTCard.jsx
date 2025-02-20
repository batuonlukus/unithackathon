import React from 'react';
import { Box, Image, Text, Button, VStack, HStack, Badge, Avatar } from '@chakra-ui/react';
import { ethers } from 'ethers';

const NFTCard = ({ nft }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      boxShadow="xl"
      p={4}
      maxW="sm"
    >
      <Image
        src={nft.image}
        alt={nft.name}
        borderRadius="md"
        objectFit="cover"
        h="200px"
        w="100%"
      />
      
      <VStack align="start" mt={4} spacing={3}>
        <HStack justify="space-between" w="100%">
          <Text fontSize="xl" fontWeight="bold">{nft.name}</Text>
          <Badge colorScheme={nft.hasDonation ? "green" : "yellow"}>
            {nft.hasDonation ? "Bağış Aldı" : "Bağış Bekliyor"}
          </Badge>
        </HStack>

        <Text noOfLines={3}>{nft.description}</Text>

        {nft.hasDonation && (
          <HStack spacing={3}>
            <Avatar size="sm" src={nft.donator.logo} />
            <Text fontSize="sm">{nft.donator.name}</Text>
          </HStack>
        )}

        <Button
          colorScheme="purple"
          width="100%"
          onClick={() => {/* Bağış fonksiyonu */}}
        >
          ETH ile Bağış Yap
        </Button>
      </VStack>
    </Box>
  );
};

export default NFTCard; 