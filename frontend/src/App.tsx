import {useState} from "react";
import './App.css';
import VisibleSupp from "./components/VisibleSupp.tsx";
import VisibleCreate from "./components/VisibleCreate.tsx";
import {ERC20API} from "./api/ERC20API.ts";
import CreatedPoolComponent from "./components/CreatedPoolComponent.tsx";
import {useMyContext} from "./redux/context.tsx";
import type {PoolType} from "./types/types.ts";
import {PoolAPI} from "./api/PoolAPI.ts";

function App() {

    const {signer, loading, setLoading, api, pool1, pool2, loadPools, selectedPool, setPools, LPtoken, balanceLP,
        totalPrice1, totalPrice2, getGerdaName, getKrendelName, getToken1ETH1, pools, balanceGerda, balanceKrendel, balanceRTK,
        getToken1ETH2, getRTKName, getToken2ETH1, getToken2ETH2, getData, auth} = useMyContext();

    const [visibleSup, setVisibleSup] = useState<boolean>(false);
    const [visibleCreate, setVisibleCreate] = useState<boolean>(false);

    const addLiquidity = async (_amount: number, _tokenIn: string, LpPrice: number) => {
        if (!signer) return;
        if (!api) return;
        if (!pool1 || !pool2) return;
        if (!selectedPool) return;

        setLoading(true);
        try {
            const tokenContract = new ERC20API(_tokenIn, signer);

            const token1_pool1 = await pool1.getToken1();
            const token2_pool1 = await pool1.getToken2();

            const token1_pool2 = await pool2.getToken1();
            const token2_pool2 = await pool2.getToken2();

            const userPool = pools.find(pool => pool.address === selectedPool);

            if (selectedPool == pool1.address) {
                if (token1_pool1 == _tokenIn || token2_pool1 == _tokenIn) {
                    const approve = await tokenContract.approve(pool1.address, _amount);
                    await approve.wait();

                    const addLiquidity = await pool1.addLiquidity(_amount, _tokenIn, LpPrice);
                    await addLiquidity.wait();
                }
                else {alert("нет такого токена в первом пуле")}
            }

            else if (selectedPool == pool2.address) {
                if (token1_pool2 == _tokenIn || token2_pool2 == _tokenIn) {
                    const approve1 = await tokenContract.approve(pool2.address, _amount);
                    await approve1.wait();

                    const addLiquidity1 = await pool2.addLiquidity(_amount, _tokenIn, LpPrice);
                    await addLiquidity1.wait();
                }
                else {alert("нет такого токена во втором пуле")}
            }

            else if (userPool) {
                const userPoolAPI = new PoolAPI(selectedPool, signer);
                const token1_poolUser = await userPoolAPI.getToken1();
                const token2_poolUser = await userPoolAPI.getToken2();

                if (token1_poolUser == _tokenIn || token2_poolUser == _tokenIn) {
                    const approve1 = await tokenContract.approve(userPool.address, _amount);
                    await approve1.wait();

                    const addLiquidity2 = await userPoolAPI.addLiquidity(_amount, _tokenIn, LpPrice);
                    await addLiquidity2.wait();
                }
                else {alert("нет такого токена в пользовательском пуле")}
            }
            else {alert("нет такого токенов ни в одном из пулов")}

            await getData(api, pool1, pool2);
        }
        catch (error) {
            console.log("ошибка(от addLiquidity): ", error);
            setLoading(false);
        }
    }

    const createPool = async (_token1: string, _token2: string,
                              _reserve1: number, _reserve2: number,
                              _price1: number, _price2: number,
                              _lpToken: string, _owner: string) => {
        if (!signer) return;
        if (!api) return;

        setLoading(true);
        try {
            console.log(_token1, _token2, _reserve1, _reserve2, _price1, _price2, _lpToken, _owner);
            const createPool = await api.factory.createPool(_token1, _token2, _reserve1, _reserve2, _price1, _price2, _lpToken, _owner);
            await createPool.wait();

            const poolsAddr = await api.factory.returnPools();
            const newPoolAddress = poolsAddr[poolsAddr.length - 1];

            const newPoolAPI = new PoolAPI(newPoolAddress, signer);

            const token1Name = await new ERC20API(_token1, signer).getName();
            const token2Name = await new ERC20API(_token2, signer).getName();
            const token1Value = Number(await newPoolAPI.getReserve1()) * Number(await newPoolAPI.getPrice1());
            const token2Value = Number(await newPoolAPI.getReserve2()) * Number(await newPoolAPI.getPrice2());
            const total = token1Value + token2Value;

            const newPool: PoolType = {
                name: `Пользовательский пул`,
                address: newPoolAddress,
                token1Name: token1Name,
                token2Name: token2Name,
                getToken1ETH: token1Value,
                getToken2ETH: token2Value,
                totalPrice: total,
            };

            console.log("токены: ", token1Name, token2Name, "общее число: ", total, "адрес пула: ", newPoolAddress);
            console.log("сколько 1 и 2 токена: ", token1Value, token2Value);

            setPools(prev => [...prev, newPool]);

            const pools = await loadPools(api.factory, signer);
            await getData(api, pools.pool1, pools.pool2);

        } catch (error) {
            console.log("ошибка(от createPool): ", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>СИСТЕМА ПО РАБОТЕ С ПУЛАМИ ЛИКВИДНОСТИ</h1>
            {loading ? (
                <p>загрузка...</p>
            ) : (
                <div>
                    {signer == null ? (
                        <button className="counter" onClick={auth}>войти через метамаск</button>
                    ) : (
                        <div>
                            <h2>Ваши токены</h2>
                            <h3>{getGerdaName}: {balanceGerda} {getKrendelName}: {balanceKrendel} {getRTKName}: {balanceRTK}</h3>
                            <h3>{LPtoken}: {balanceLP * 10**12}</h3>

                            <button className="counter" onClick={() => {setVisibleSup(!visibleSup)}}>{!visibleSup ? "поддержать ликвидность" : "убрать окно"}</button>
                            <button className="counter" onClick={() => {setVisibleCreate(!visibleCreate)}}>{!visibleCreate ? "создать пул" : "убрать окно"}</button>
                            {visibleSup && (<VisibleSupp addLiquidity={addLiquidity}/>)}
                            {visibleCreate && (<VisibleCreate createPool={createPool} />)}

                            <CreatedPoolComponent name="Стартовый пул №1" totalPrice={totalPrice1} tokenName1={getGerdaName} tokenName2={getKrendelName} getToken1ETH={getToken1ETH1} getToken2ETH={getToken2ETH1}/>
                            <CreatedPoolComponent name="Стартовый пул №2" totalPrice={totalPrice2} tokenName1={getKrendelName} tokenName2={getRTKName} getToken1ETH={getToken1ETH2} getToken2ETH={getToken2ETH2}/>

                            {pools.map((pool, index) => (
                                <CreatedPoolComponent
                                    key={index} name={pool.name} tokenName1={pool.token1Name} tokenName2={pool.token2Name} totalPrice={pool.totalPrice} getToken1ETH={pool.getToken1ETH} getToken2ETH={pool.getToken2ETH}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default App
