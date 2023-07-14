import "./App.css";
import { ethers } from "ethers";
import React, { useEffect, useState } from 'react';
import EtherCalculator from "./contracts/EtherCalculator.sol/EtherCalculator.json";

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const contractAbi = [
  {
    "constant": false,
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
        const balance = await contract.getBalance();
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('MetaMask not found');
    }
  };

  const handleDeposit = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
        const amount = ethers.utils.parseEther(depositAmount);
        const transaction = await contract.deposit({ value: amount });
        await transaction.wait();
        const balance = await contract.getBalance();
        setBalance(ethers.utils.formatEther(balance));
        setDepositAmount('');
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('MetaMask not found');
    }
  };

  const handleWithdraw = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
        const amount = ethers.utils.parseEther(withdrawAmount);
        const transaction = await contract.withdraw(amount);
        await transaction.wait();
        const balance = await contract.getBalance();
        setBalance(ethers.utils.formatEther(balance));
        setWithdrawAmount('');
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('MetaMask not found');
    }
  };

  return (
    <div>
      <h1>Lavanish Balance: {balance} Ether</h1>

      <div>
        <input
          type="text"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Enter deposit amount"
        />
        <button onClick={handleDeposit}>Deposit</button>
      </div>

      <div>
        <input
          type="text"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Enter withdrawal amount"
        />
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>
    </div>
  );
}

export default App;
