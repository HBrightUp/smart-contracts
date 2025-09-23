// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

async function main() {
    // This is just a convenience check
    if (network.name === "hardhat") {
        console.warn(
            "You are trying to deploy a contract to the Hardhat Network, which" +
            "gets automatically created and destroyed every time. Use the Hardhat" +
            " option '--network localhost'"
        );
    }

    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    //solidity version：0.8.18

    //发布仓位描述
    const Mgr = await ethers.getContractFactory("NonfungiblePositionManager");
    //分别传入weth9合约地址以及转为16进制的`eth`名称，也就是该名称是bytes32：
    const mgr = await Mgr.deploy('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512','0x5FbDB2315678afecb367f032d93F642f64180aa3','0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9');
    await mgr.deployed(); //等的确认发布

    console.log("NonfungiblePositionManager address:", mgr.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
