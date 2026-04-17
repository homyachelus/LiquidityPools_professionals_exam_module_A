import hre from 'hardhat';
import path from "node:path";
import fs from "node:fs";

async function main() {
     const {ethers} = hre;
     const accounts = await ethers.getSigners();

 // константы
     const decimal = 10n**12n;

     const priceGerda = 1n * decimal;
     const priceKrendel = 15n * decimal / 10n;
     const priceRTK = 3n * decimal;

     const reserveGerda = 1500n*decimal;
     const reserveKrendel = 1000n*decimal;
     const reserveKrendel1 = 2000n*decimal;
     const reserveRTK = 1000n*decimal;

     console.log(priceKrendel * reserveKrendel)

     // создаю 4 токена
     const myContract = await ethers.getContractFactory("ERC20");

     const erc20Gerda = await myContract.deploy("GerdaCoin", "GERDA", 12);
     const erc20Krendel = await myContract.deploy("KrendelCoin", "KRENDEL", 12);
     const erc20RTK = await myContract.deploy("RTKCoin", "RTK", 12);
     const erc20Professional = await myContract.deploy("Professional", "PROFI", 12);

     await erc20Gerda.waitForDeployment();
     await erc20Krendel.waitForDeployment();
     await erc20RTK.waitForDeployment();
     await erc20Professional.waitForDeployment();

     // минтим токены всем пользователям
     await erc20Gerda.mint(accounts[1], 100000n*decimal);
     await erc20Krendel.mint(accounts[1], 150000n*decimal);
     await erc20RTK.mint(accounts[1], 300000n*decimal);

     await erc20Gerda.mint(accounts[2], 100000n*decimal);
     await erc20Krendel.mint(accounts[2], 150000n*decimal);
     await erc20RTK.mint(accounts[2], 300000n*decimal);

     await erc20Gerda.mint(accounts[3], 100000n*decimal);
     await erc20Krendel.mint(accounts[3], 150000n*decimal);
     await erc20RTK.mint(accounts[3], 300000n*decimal);

     // фактори
     const myContract1 = await ethers.getContractFactory("Factory");
     const factory = await myContract1.deploy();
     await factory.waitForDeployment();

    // роутер
    const myContract2 = await ethers.getContractFactory("Router");
    const router = await myContract2.deploy(await factory.getAddress());
    await router.waitForDeployment();

    // стакинг
    const myContract3 = await ethers.getContractFactory("Staking");
    const staking = await myContract3.deploy(await erc20Professional.getAddress(), await erc20Professional.getAddress());
    await staking.waitForDeployment();

     // стартовые пулы
     await factory.createPool(
         await erc20Gerda.getAddress(),
         await erc20Krendel.getAddress(),
         reserveGerda, reserveKrendel,
         priceGerda * decimal, priceKrendel * decimal,
         await erc20Professional.getAddress(),
         await accounts[1].getAddress()
     );

    await factory.createPool(
         await erc20Krendel.getAddress(),
         await erc20RTK.getAddress(),
         reserveKrendel1, reserveRTK,
         priceKrendel * decimal, priceRTK * decimal,
         await erc20Professional.getAddress(),
         await accounts[2].getAddress()
     );

     const pools = await factory.returnPools();
     const pool1addr = pools[0]; // герда крендель
     const pool2addr = pools[1]; // крендель ртк
     console.log("адрес первого пула: ", pool1addr, "адрес второго пула: ", pool2addr);

    await erc20Professional.addMinter(pool1addr);
    await erc20Professional.addMinter(pool2addr);

     // добавление ликвидности
     const pool1 = await ethers.getContractAt("Pool", pool1addr);
     const pool2 = await ethers.getContractAt("Pool", pool2addr);

     const reserve1 = await pool1.reserve1();
     const reserve2 = await pool1.reserve2();
     console.log("\nколичество токенов герда: ", Number(reserve1));
     console.log("количество токенов крундель в 1пуле: ", Number(reserve2));

    console.log("стоимость герда в етх:", (Number(reserve1) / 10**12));
    console.log("стоимость крендель в етх:", (Number(reserve2) / 10**12) * 1.5);

     const reserve3 = await pool2.reserve1();
     const reserve4 = await pool2.reserve2();
     console.log("количество токенов крундель во 2пуле: ", Number(reserve3));
     console.log("количество токенов ртк: ", Number(reserve4));

    console.log("стоимость крендель в етх:", (Number(reserve3) / 10**12) * 1.5);
    console.log("стоимость ртк в етх:", (Number(reserve4) / 10**12) * 3);

     const data = {
         erc20Gerdaaddr: await erc20Gerda.getAddress(),
         erc20Krendeladdr: await erc20Krendel.getAddress(),
         erc20RTKaddr: await erc20RTK.getAddress(),
         erc20Professional: await erc20Professional.getAddress(),
         factory: await factory.getAddress(),
         Routeraddr: await router.getAddress(),
         StakingAddr: await staking.getAddress(),
     }

     console.log(data)

     const frontendDir = path.join(__dirname, "../../frontend/src/conf.json");
     fs.writeFileSync(frontendDir, JSON.stringify(data, null, 2))
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
})