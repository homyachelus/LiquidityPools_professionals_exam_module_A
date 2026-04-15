import * as React from 'react'
import {type ReactNode, useContext, useEffect, useState} from "react";
import {erc20Gerdaaddr, factory, erc20Krendeladdr, erc20Professional, erc20RTKaddr, StakingAddr, Routeraddr} from "../conf.json";
import {PoolAPI} from "../api/PoolAPI.ts";
import {ethers, JsonRpcSigner} from "ethers";
import type {APIType, MyPropsProvider, PoolType} from "../types/types.ts";
import {ERC20API} from "../api/ERC20API.ts";
import {FactoryAPI} from "../api/FactoryAPI.ts";
import {RouterAPI} from "../api/RouterAPI.ts";
import {StakingAPI} from "../api/StakingAPI.ts";

export const MyContext = React.createContext<MyPropsProvider | null>(null);

export const MyProvider = ({children}: {children?: ReactNode}) => {

    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [loading, setLoading] = useState<boolean>();
    const [api, setApi] = useState<APIType | null>(null);

    const [getGerdaName, setGetGerdaName] = useState<string>('');
    const [getKrendelName, setGetKrendelName] = useState<string>('');
    const [getRTKName, setGetRTKName] = useState<string>('');
    const [LPtoken, setLPtoken] = useState<string>('');

    const [totalPrice1, setTotalPrice1] = useState<number>(0);
    const [getToken1ETH1, setGetToken1ETH1] = useState<number>(0);
    const [getToken2ETH1, setGetToken2ETH1] = useState<number>(0);

    const [totalPrice2, setTotalPrice2] = useState<number>(0);
    const [getToken1ETH2, setGetToken1ETH2] = useState<number>(0);
    const [getToken2ETH2, setGetToken2ETH2] = useState<number>(0);

    const [amount, setAmount] = useState<number>(0);
    const [tokenIn, setTokenIn] = useState<string>("");
    const [selectedPool, setSelectedPool] = useState<string>("");

    const [pool1, setPool1] = useState<PoolAPI | null>(null);
    const [pool2, setPool2] = useState<PoolAPI | null>(null);
    const [pools, setPools] = useState<PoolType[]>([]);

    const [balanceGerda, setBalanceGerda] = useState(0);
    const [balanceKrendel, setBalanceKrendel] = useState(0);
    const [balanceRTK, setBalanceRTK] = useState(0);

    const getData = async(_api: APIType, pool1: PoolAPI | null = null, pool2: PoolAPI | null = null) => {
        if (!signer) return;
        if (!pool1) return;
        if (!pool2) return;

        try{
            const getGerdaName = await _api.erc20Gerda.getName();
            setGetGerdaName(getGerdaName);
            const getKrendelName = await _api.erc20Krendel.getName();
            setGetKrendelName(getKrendelName);
            const getRTKName = await _api.erc20RTK.getName();
            setGetRTKName(getRTKName);
            const LPtoken = await _api.erc20Prof.contract.getAddress();
            setLPtoken(LPtoken);
            const signerAddr = await signer.getAddress();

            const getToken1ETH1 = (Number(await pool1.getReserve1()) * Number(await pool1.getPrice1())) / 10**36;
            setGetToken1ETH1(getToken1ETH1);
            const getToken2ETH1 = (Number(await pool1.getReserve2()) * Number(await pool1.getPrice2())) / 10**36;
            setGetToken2ETH1(getToken2ETH1);
            const totalPrice1 = (Number(await pool1.getPrice1()) * Number(await pool1.getReserve1()) + Number(await pool1.getPrice2()) * Number(await pool1.getReserve2())) / 10**36;
            setTotalPrice1(totalPrice1);

            const getToken1ETH2 = (Number(await pool2.getReserve1()) * Number(await pool2.getPrice1())) / 10**36;
            setGetToken1ETH2(getToken1ETH2);
            const getToken2ETH2 = (Number(await pool2.getReserve2()) * Number(await pool2.getPrice2())) / 10**36;
            setGetToken2ETH2(getToken2ETH2);
            const totalPrice2 = (Number(await pool2.getPrice1()) * Number(await pool2.getReserve1()) + Number(await pool2.getPrice2()) * Number(await pool2.getReserve2())) / 10**36;
            setTotalPrice2(totalPrice2);

            const balanceGerda = await _api.erc20Gerda.balanceOf(signerAddr);
            setBalanceGerda(Number(balanceGerda) / 10**12);
            console.log(balanceGerda);
            const balanceKrendel = await _api.erc20Krendel.balanceOf(signerAddr);
            setBalanceKrendel(Number(balanceKrendel) / 10**12);
            console.log(balanceKrendel);
            const balanceRTK = await _api.erc20RTK.balanceOf(signerAddr);
            setBalanceRTK(Number(balanceRTK) / 10**12);
            console.log(balanceRTK);
        }
        catch (error) {
            console.log("ошибка(от getData): ", error);
        } finally {
            setLoading(false);
        }
    }

    const auth = async () => {
        setLoading(true);

        if (!window.ethereum) {
            setLoading(false);
            return alert('установите метамаск');
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum)
            await provider.send("eth_requestAccounts", [])

            const signerTemp = await provider.getSigner()

            const address = await signerTemp.getAddress();
            const balance = await provider.getBalance(address);
            console.log("Подключен адрес:", address);
            console.log("Баланс:", ethers.formatEther(balance), "ETH");

            setSigner(signerTemp);
            setLoading(false);
        }
        catch (error) {
            console.log("ошибка(от auth): ", error)
            setLoading(false);
        }
    }

    const loadPools = async (factoryAPI: FactoryAPI, signer: JsonRpcSigner) => {
        try {
            const poolAddresses = await factoryAPI.returnPools();

            let pool1Instance: PoolAPI | null = null;
            let pool2Instance: PoolAPI | null = null;

            if (poolAddresses.length > 0) {
                pool1Instance = new PoolAPI(poolAddresses[0], signer);
                setPool1(pool1Instance);
            }
            if (poolAddresses.length > 1) {
                pool2Instance = new PoolAPI(poolAddresses[1], signer);
                setPool2(pool2Instance);
            }
            return { pool1: pool1Instance, pool2: pool2Instance };
        }
        catch (error) {
            console.log("ошибка(от loadPools): ", error);
            return {pool1: null, pool2: null};
        }
    };

    useEffect(() => {
        if (!signer) return;
        const awaitFunc = async() => {
            const erc20Gerda = new ERC20API(erc20Gerdaaddr, signer);
            const erc20Krendel = new ERC20API(erc20Krendeladdr, signer);
            const erc20RTK = new ERC20API(erc20RTKaddr, signer);
            const erc20Prof = new ERC20API(erc20Professional, signer);

            const factory1 = new FactoryAPI(factory, signer);
            const router = new RouterAPI(Routeraddr, signer);
            const staking = new StakingAPI(StakingAddr, signer);

            const allAPI: APIType = {
                erc20Gerda: erc20Gerda,
                erc20Krendel: erc20Krendel,
                erc20RTK: erc20RTK,
                erc20Prof: erc20Prof,
                factory: factory1,
                router: router,
                staking: staking,
            }

            setApi(allAPI);
            const pools = await loadPools(factory1, signer);
            await getData(allAPI, pools.pool1, pools.pool2);
        }
        awaitFunc().then(r => console.log(r));
    }, [signer]);

    return (
        <MyContext.Provider value={{
            signer, api, LPtoken,
            amount, setAmount,
            loading, setLoading,
            tokenIn, setTokenIn,
            selectedPool, setSelectedPool,
            totalPrice1, totalPrice2,
            pool1, pool2,
            getGerdaName, getKrendelName, getRTKName,
            getToken1ETH1, getToken2ETH1, getToken1ETH2, getToken2ETH2,
            pools, setPools,
            balanceGerda, balanceKrendel, balanceRTK,
            getData, auth, loadPools
        }}>
            {children}
        </MyContext.Provider>
    )
}

export const useMyContext = () => {
    const context = useContext(MyContext);
    if (!context) throw new Error("хук должен использоваться внутри useMyContext");
    return context;
}