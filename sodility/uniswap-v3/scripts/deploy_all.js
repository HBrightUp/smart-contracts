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

    const weth9 = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    // deploy v3-factory
    const UniswapV3Factory = await ethers.getContractFactory("UniswapV3Factory");
    const uniswapv3factory = await UniswapV3Factory.deploy();
    await uniswapv3factory.deployed();
    console.log("uniswapv3factory address:", uniswapv3factory.address);

    // deploy TickLens
    const TickLens = await ethers.getContractFactory("TickLens");
    const tickLens = await TickLens.deploy();
    await tickLens.deployed();
    console.log("tickLens address:", tickLens.address);

    // deploy Quoter
    const Quoter = await ethers.getContractFactory("Quoter");
    const quoter = await Quoter.deploy(uniswapv3factory.address, weth9);
    await quoter.deployed();
    console.log("quoter address:", quoter.address);

    // deploy Quoter2
    const QuoterV2 = await ethers.getContractFactory("QuoterV2");
    const quoterv2 = await QuoterV2.deploy(uniswapv3factory.address, weth9);
    await quoterv2.deployed();
    console.log("quoterv2 address:", quoterv2.address);

    // deploy SwapRouter
    const SwapRouter = await ethers.getContractFactory("SwapRouter");
    const swaprouter = await SwapRouter.deploy(uniswapv3factory.address, weth9);
    await swaprouter.deployed();
    console.log("swaprouter address:", swaprouter.address);

    // deploy NFTDescriptor and NonfungibleTokenPositionDescriptor
    const NFTDescriptor = await ethers.getContractFactory("NFTDescriptor");
    const nftdescriptor = await NFTDescriptor.deploy();
    await nftdescriptor.deployed();

    const NonfungibleTokenPositionDescriptor = await ethers.getContractFactory("NonfungibleTokenPositionDescriptor",{
        libraries: {
            NFTDescriptor: nftdescriptor.address
        }
    });
    const nonfungibleTokenPositionDescriptor = await NonfungibleTokenPositionDescriptor.deploy( weth9,'0x4554480000000000000000000000000000000000000000000000000000000000');
    await nonfungibleTokenPositionDescriptor.deployed(); 
    console.log("nonfungibleTokenPositionDescriptor address:", nonfungibleTokenPositionDescriptor.address);

    // deploy NonfungiblePositionManager
    const NonfungiblePositionManager = await ethers.getContractFactory("NonfungiblePositionManager");
    const nonfungiblePositionManager = await NonfungiblePositionManager.deploy( uniswapv3factory.address, weth9, nonfungibleTokenPositionDescriptor.address);
    await nonfungiblePositionManager.deployed(); 
    console.log("nonfungiblePositionManager address:", nonfungiblePositionManager.address);

    // deploy V3Migrator
    const V3Migrator = await ethers.getContractFactory("V3Migrator");
    const v3migrator = await V3Migrator.deploy( uniswapv3factory.address, weth9, nonfungiblePositionManager.address);
    await v3migrator.deployed(); 
    console.log("v3migrator address:", v3migrator.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
