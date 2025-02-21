import React, { useState } from 'react';
import './App.css';
import { ethers } from 'ethers';
import { createNFT, fundProject, getProjectDetails, connectWallet } from './utils/contractInteractions';

const INITIAL_PROJECTS = [
  {
    id: 1,
    studentName: "Ahmet Yilmaz",
    projectName: "DeFi Lending Platform",
    description: "A decentralized lending platform with automated market maker",
    unitsAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    teamName: "DeFi Innovators",
    teamMembers: ["Ahmet Yilmaz", "Mehmet Demir", "Ayşe Kara"],
    githubLink: "https://github.com/ahmetyilmaz/defi-platform",
    certificates: ["Solidity Advanced Course", "Web3 Development"],
    supporters: [   
      {
        address: "0x1234...5678",
        unitsAmount: 500,
        percentage: 50.0  // 500/1000 * 100
      },
      {
        address: "0x8765...4321",
        unitsAmount: 300,
        percentage: 30.0  // 300/1000 * 100
      },
      {
        address: "0x9876...1234",
        unitsAmount: 200,
        percentage: 20.0  // 200/1000 * 100
      }
    ],
    totalUnits: 1000
  },
  {
    id: 2,
    studentName: "Zeynep Kaya",
    projectName: "NFT Marketplace",
    description: "A marketplace for educational NFTs with proof of learning",
    unitsAddress: "0x123d35Cc6634C0532925a3b844Bc454e4438f123",
    teamName: "NFT Pioneers",
    teamMembers: ["Zeynep Kaya", "Can Yıldız", "Elif Şen"],
    githubLink: "https://github.com/zeynepkaya/nft-marketplace",
    certificates: ["Blockchain Fundamentals"],
    supporters: [],
    totalUnits: 0
  }
];

function App() {
  const [projects, setProjects] = React.useState(INITIAL_PROJECTS);
  const [unitsAmount, setUnitsAmount] = React.useState(0);
  const [showCreateNFT, setShowCreateNFT] = React.useState(false);
  const [newNFT, setNewNFT] = React.useState({
    studentName: '',
    projectName: '',
    description: '',
    githubLink: '',
    certifications: '',
    tokenName: '',
    tokenSymbol: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Calculate percentage for each supporter
  const calculatePercentage = (amount, totalUnits) => {
    if (totalUnits === 0) return 0;
    return ((amount / totalUnits) * 100).toFixed(1);
  };

  const handleSupport = async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Supporting project ${projectId} with ${unitsAmount} UNITS`);
      
      const tx = await fundProject(projectId, unitsAmount);
      
      setProjects(projects.map(project => {
        if (project.id === projectId) {
          const newAmount = Number(unitsAmount);
          const newTotalUnits = project.totalUnits + newAmount;
          const newSupporter = {
            address: "0xYour...Address", // Will be replaced with actual address from MetaMask
            unitsAmount: newAmount,
            percentage: calculatePercentage(newAmount, newTotalUnits)
          };
          
          const updatedSupporters = [...project.supporters, newSupporter].map(supporter => ({
            ...supporter,
            percentage: calculatePercentage(supporter.unitsAmount, newTotalUnits)
          }));

          return {
            ...project,
            supporters: updatedSupporters,
            totalUnits: newTotalUnits
          };
        }
        return project;
      }));
      
      setUnitsAmount(0);
      console.log('Support transaction:', tx.hash);
    } catch (err) {
      setError(err.message);
      console.error('Error supporting project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNFT = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const tx = await createNFT(
        newNFT.projectName,
        newNFT.description,
        newNFT.githubLink
      );

      const newProject = {
        id: projects.length + 1,
        ...newNFT,
        teamName: `${newNFT.studentName}'s Team`,
        teamMembers: [newNFT.studentName],
        supporters: [],
        totalUnits: 0
      };

      setProjects([...projects, newProject]);
      setShowCreateNFT(false);
      setNewNFT({
        studentName: '',
        projectName: '',
        description: '',
        githubLink: '',
        certifications: '',
        tokenName: '',
        tokenSymbol: ''
      });

      console.log('NFT Created:', tx.hash);
    } catch (err) {
      setError(err.message);
      console.error('Error creating NFT:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    const result = await connectWallet(setWalletAddress, setIsConnected);
    if (result) {
      setIsConnected(true);
      setWalletAddress(result.address);
    }
  };

  return (
    <div className="App">
      <header className="App-header neon-text">
        <h1>IDO Platform</h1>
        <p>Tokenize Your Own Project and Attract Investment</p>
        {!isConnected ? (
          <button 
            className="neon-button connect-wallet-button"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <p className="wallet-address">Connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</p>
            <button 
              className="neon-button create-nft-button"
              onClick={() => setShowCreateNFT(true)}
            >
              Create NFT
            </button>
          </>
        )}
      </header>

      {showCreateNFT && (
        <div className="modal-overlay">
          <div className="modal-content neon-border">
            <h2 className="neon-text">Create Your Project NFT</h2>
            <form onSubmit={handleCreateNFT}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newNFT.studentName}
                  onChange={(e) => setNewNFT({...newNFT, studentName: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={newNFT.projectName}
                  onChange={(e) => setNewNFT({...newNFT, projectName: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  placeholder="Project Description"
                  value={newNFT.description}
                  onChange={(e) => setNewNFT({...newNFT, description: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="url"
                  placeholder="GitHub Project Link"
                  value={newNFT.githubLink}
                  onChange={(e) => setNewNFT({...newNFT, githubLink: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Certifications (comma separated)"
                  value={newNFT.certifications}
                  onChange={(e) => setNewNFT({...newNFT, certifications: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Token Name"
                  value={newNFT.tokenName}
                  onChange={(e) => setNewNFT({...newNFT, tokenName: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Token Symbol"
                  value={newNFT.tokenSymbol}
                  onChange={(e) => setNewNFT({...newNFT, tokenSymbol: e.target.value})}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="neon-button">
                  Create Project
                </button>
                <button 
                  type="button" 
                  className="neon-button cancel"
                  onClick={() => setShowCreateNFT(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="loading-spinner">
          Processing transaction...
        </div>
      )}

      <div className="projects-container">
        {projects.map((project) => (
          <div key={project.id} className="project-card neon-border">
            <h2>{project.projectName}</h2>
            <div className="student-info">
              <h3>Team: {project.teamName}</h3>
              <p className="team-members">Members: {project.teamMembers.join(", ")}</p>
            </div>
            
            <div className="project-details">
              <p>{project.description}</p>
              
              <div className="certificates">
                <h4>Certificates & Links:</h4>
                <ul>
                  {project.certificates.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                  {project.githubLink && (
                    <li className="github-link">
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                        GitHub Project
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              <div className="address-info">
                <p>UNITS Address: {project.unitsAddress}</p>
              </div>

              <div className="supporters">
                <h4>Supporters ({project.supporters.length})</h4>
                <ul>
                  {project.supporters.map((supporter, index) => (
                    <li key={index} className="supporter-item">
                      <div className="supporter-info">
                        <span className="supporter-address">
                          Address: {supporter.address}
                        </span>
                        <span className="supporter-amount">
                          {supporter.unitsAmount} UNITS
                        </span>
                      </div>
                      <span className="supporter-percentage">
                        {supporter.percentage}% Voting Power
                      </span>
                    </li>
                  ))}
                </ul>
                <p>Total UNITS: {project.totalUnits}</p>
              </div>

              <div className="support-section">
                <input
                  type="number"
                  placeholder="UNITS amount"
                  onChange={(e) => setUnitsAmount(e.target.value)}
                  className="units-input"
                />
                <button 
                  onClick={() => handleSupport(project.id)}
                  className="support-button neon-button"
                >
                  Send UNITS Tokens
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
