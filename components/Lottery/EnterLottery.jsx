import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../../constants/index";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

const EnterLottery = () => {
  const { chainId: chainIdHex, isWeb3Enabled, provider } = useMoralis();
  const chainId = chainIdHex ? parseInt(chainIdHex) : null;
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntrancefee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0x");
  const dispatch = useNotification();

  //console.log(raffleAddress, abi);

  const {
    runContractFunction: enterRaffle,
    isLoading: enterRaffleLoading,
    isFetching: enterRaffleFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const {} = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    params: {},
  });

  const EnterRaffleSuccess = async (tx) => {
    await tx.wait(1);
    handleNotification(tx);
    updateUI();
  };

  const handleNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };

  const updateUI = async () => {
    const fee = (await getEntranceFee()).toString();
    const noPlayers = (await getNumPlayers()).toString();
    const lastWinner = await getRecentWinner();
    setEntrancefee(fee);
    setNumPlayers(noPlayers);
    setRecentWinner(lastWinner);
    //console.log("fee is ", fee);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    //const raffleContract = ethers;
    //console.log(raffleContract);
    if (provider) {
      console.log(provider);
      provider.on("WinnerPicked", async (winnerAddress) => {
        console.log("winnerAddress", winnerAddress);
        setRecentWinner(winnerAddress);
      });
      provider.on("RequestedRaffleWinner", () => {
        console.log("RequestedRaffleWinner event fired!");
      });
      provider.on("RaffleEnter", () => {
        console.log("RaffleEnter event fired!");
      });
    }
  }, [provider]);

  return (
    <div>
      {raffleAddress ? (
        <div className="text-white flex flex-col gap-3 mt-5">
          <p>Entrance fee: {ethers.formatUnits(entranceFee, "ether")} ETH</p>
          <p>Number of Players: {numPlayers}</p>
          <p>Recent Winner: {recentWinner}</p>
          <button
            className="bg-[#045CF4] px-4 py-2 text-white rounded-lg w-[150px] mt-10 flex items-center justify-center"
            onClick={async () => {
              await enterRaffle({
                onSuccess: EnterRaffleSuccess,
                onError: (error) => console.log(error),
              });
            }}
            disabled={enterRaffleLoading || enterRaffleFetching}
          >
            {enterRaffleFetching || enterRaffleFetching ? (
              <div className="animate-spin spinner-border h-5 w-5 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
        </div>
      ) : (
        <div>No raffle address detected!</div>
      )}
    </div>
  );
};

export default EnterLottery;
