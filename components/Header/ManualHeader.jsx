import { useEffect } from "react";
import { useMoralis } from "react-moralis";

const ManualHeader = () => {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    isWeb3EnableLoading,
    Moralis,
    deactivateWeb3,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (localStorage.getItem("connected")) enableWeb3();
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (!account) {
        localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, []);

  return (
    <div>
      <div>
        {account ? (
          <div className="w-[250px] text-center border-white border-[0.5px] px-3 py-2 rounded-lg">
            Connected to {account.slice(0, 6)}...
            {account.slice(account.length - 4)}
          </div>
        ) : (
          <button
            className="bg-[#045CF4] px-4 py-2 text-white rounded-lg"
            onClick={async () => {
              await enableWeb3();
              localStorage.setItem("connected", "injected");
            }}
            disabled={isWeb3EnableLoading}
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default ManualHeader;
