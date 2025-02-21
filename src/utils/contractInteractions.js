import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0xA6D5E82190aE15823F227B8415a6F721dA7261d3";

// UnitZero Testnet yapılandırması
const UNITZERO_CONFIG = {
	chainId: '88817', 
	chainName: 'UnitZero Testnet',
	nativeCurrency: {
		name: 'UNIT',
		symbol: 'UNIT',
		decimals: 18
	},
	rpcUrls: ['https://rpc-testnet.unit0.dev'],
	blockExplorerUrls: ['https://explorer-testnet.unit0.dev']
};

const ProjectFundingNFT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "initialOwner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_githubUrl",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_certifications",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_tokenName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_tokenSymbol",
				"type": "string"
			}
		],
		"name": "createProject",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "investor",
				"type": "address"
			}
		],
		"name": "getInvestments",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "ethInvested",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			}
		],
		"name": "investWithETH",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "projectCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "projectNFT",
		"outputs": [
			{
				"internalType": "contract ProjectNFT",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "projects",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "projectOwner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "nftAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "totalFundsRaisedETH",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "fundingClosed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export const connectWallet = async (setWalletAddress, setIsConnected) => {
	if (typeof window.ethereum !== "undefined") {
		try {
			// Sadece mevcut ağa bağlan
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			await provider.send("eth_requestAccounts", []);
			
			const signer = provider.getSigner();
			const address = await signer.getAddress();
			
			setWalletAddress(address);
			setIsConnected(true);
			
			console.log("Bağlı Cüzdan Adresi:", address);
			return { provider, signer, address };
		} catch (error) {
			console.error("Cüzdan bağlanırken hata oluştu:", error);
			setIsConnected(false);
			setWalletAddress(null);
		}
	} else {
		console.log("MetaMask yüklü değil.");
		setIsConnected(false);
		setWalletAddress(null);
	}
}

const ERC20_ABI = [
	"function approve(address spender, uint256 amount) external returns (bool)",
	"function balanceOf(address account) external view returns (uint256)"
];

export const getContracts = async () => {
	if (!window.ethereum) throw new Error("Please install MetaMask!");
	
	try {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		
		// Network kontrolü
		const network = await provider.getNetwork();
		console.log("Connected to network:", network);

		// Kontrat kodu kontrolü
		const code = await provider.getCode(CONTRACT_ADDRESS);
		if (code === '0x') {
			throw new Error("No contract found at the specified address");
		}

		const nftContract = new ethers.Contract(CONTRACT_ADDRESS, ProjectFundingNFT_ABI, signer);
		
		return { nftContract, signer };
	} catch (error) {
		console.error("Contract initialization error:", error);
		throw new Error("Failed to initialize contract. Please check your network connection and contract address.");
	}
};

export const createNFT = async (projectName, description, githubLink) => {
	// Input validation
	if (!projectName || projectName.trim() === "") {
		throw new Error("Project name is required");
	}
	if (!description || description.trim() === "") {
		throw new Error("Description is required");
	}
	if (!githubLink || githubLink.trim() === "") {
		throw new Error("GitHub link is required");
	}

	const { nftContract, signer } = await getContracts();
	
	try {
		// Network kontrolü
		const network = await signer.provider.getNetwork();
		console.log("Current network:", network);

		// Kontrat owner kontrolü
		const contractOwner = await nftContract.owner();
		const signerAddress = await signer.getAddress();
		
		console.log("Contract owner:", contractOwner);
		console.log("Signer address:", signerAddress);

		// Gas price kontrolü
		const gasPrice = await nftContract.provider.getGasPrice();
		console.log("Current gas price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");

		// Balance kontrolü
		const balance = await signer.getBalance();
		console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

		// Transaction options
		const options = {
			gasLimit: 500000,  // Gas limiti düşürdük
			gasPrice: gasPrice // Normal gas fiyatı
		};

		console.log("Sending transaction with options:", options);

		// Kontrat çağrısı
		const tx = await nftContract.createProject(
			projectName.trim(),
			description.trim(),
			githubLink.trim(),
			"", // certifications
			projectName.trim() + " Token", // token name
			projectName.trim().substring(0, 4).toUpperCase(), // token symbol
			options
		);

		console.log("Transaction sent:", tx.hash);
		const receipt = await tx.wait();
		console.log("Transaction confirmed:", receipt);

		return tx;
	} catch (error) {
		console.error("Detailed error:", error);

		// Kontrat çağrısı öncesi kontrol
		try {
			const code = await signer.provider.getCode(CONTRACT_ADDRESS);
			if (code === '0x') {
				throw new Error("Contract not found at the specified address");
			}
		} catch (e) {
			console.error("Contract verification error:", e);
		}

		if (error.message.includes("execution reverted")) {
			throw new Error("Transaction failed: Contract execution reverted. Please check your inputs.");
		} else if (error.message.includes("insufficient funds")) {
			throw new Error("Transaction failed: Insufficient funds for transaction");
		} else if (error.code === 'CALL_EXCEPTION') {
			throw new Error("Transaction failed: Please make sure you are connected to UnitZero Testnet and have the correct permissions");
		}

		throw error;
	}
};

export const fundProject = async (projectId, amount) => {
	const { nftContract } = await getContracts();
	
	// Fund the project with ETH
	const tx = await nftContract.investWithETH(projectId, {
		value: ethers.utils.parseEther(amount.toString())
	});
	await tx.wait();
	return tx;
};

export const getProjectDetails = async (projectId) => {
	const { nftContract } = await getContracts();
	const project = await nftContract.projects(projectId);
	return { project };
};