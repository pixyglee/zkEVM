import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import "./App.css";
import {ethers}  from "ethers";
import Counter from "./contracts/Counter.sol/Counter.json";
const counterAddress = "0xA7918D253764E42d60C3ce2010a34d5a1e7C1398"
console.log(counterAddress, "Counter ABI: ", Counter.abi);

function App() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // declare the data fetching function
    const fetchCount = async () => {
      const data = await readCounterValue();
      return data;
    };

    fetchCount().catch(console.error);
}, []);
async function requestAccount() {
  await window.ethereum.request({ method: "eth_requestAccounts" });
}

async function updateCounter() {
  if (typeof window.ethereum !== "undefined") {
    await requestAccount();
    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log({ provider });
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(counterAddress, Counter.abi, signer);
    const transaction = await contract.increment();
    setIsLoading(true);
    await transaction.wait();
    setIsLoading(false);
    readCounterValue();
  }
}
  async function readCounterValue() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log("provider", provider);
       const contract = new ethers.Contract(
        counterAddress,
        Counter.abi,
        provider
       );
      console.log("contract", contract);
      try {
         const data = await contract.retrieve();
         console.log(data);
         console.log("data: ", parseInt(data.toString()));
         setCount(parseInt(data.toString()));
      } catch (err) {
        console.log("Error: ", err);
        alert(
          "Switch your MetaMask network to Polygon zkEVM testnet and refresh this page!"
        );
      }
    }
  }

  const incrementCounter = async() => {
    // we should read currentCount from the blockchain
    // const currentCount = count;
    // setCount(currentCount + 1);
    await updateCounter();
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ minWidth: 275, marginTop: 20 }}>
        <CardContent>
          <p>Count: {count}</p>
          <Button onClick={incrementCounter} variant="outlined" disabled={isLoading}>
            {isLoading ? "Loading..." : "+1"}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
