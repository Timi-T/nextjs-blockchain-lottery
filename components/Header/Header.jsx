import { ConnectButton } from "web3uikit";

const Header = () => {
  return (
    <div className="flex items-center justify-between border-b border-b-white pb-10">
      <h1 className="text-2xl">Decentralized Raffle Lottery</h1>
      <ConnectButton />
    </div>
  );
};

export default Header;
