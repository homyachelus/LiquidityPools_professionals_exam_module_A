import {ERC20API} from "../api/ERC20API.ts";
import {FactoryAPI} from "../api/FactoryAPI.ts";
import {RouterAPI} from "../api/RouterAPI.ts";
import {StakingAPI} from "../api/StakingAPI.ts";
import {PoolAPI} from "../api/PoolAPI.ts";
import type {JsonRpcSigner} from "ethers";
import * as React from "react";

export type APIType = {
    erc20Gerda: ERC20API;
    erc20Krendel: ERC20API;
    erc20RTK: ERC20API;
    erc20Prof: ERC20API;

    factory: FactoryAPI;
    router: RouterAPI;
    staking: StakingAPI;
}

export type PoolType = {
    name: string;
    address: string;
    token1Name: string;
    token2Name: string;
    getToken1ETH: number;
    getToken2ETH: number;
    totalPrice: number;
}

export type MyPropsProvider = {
    signer: JsonRpcSigner | null;
    loading: boolean | undefined
    setLoading: React.Dispatch<React.SetStateAction<boolean | undefined>>
    api: APIType | null

    getGerdaName: string
    getKrendelName: string
    getRTKName: string
    LPtoken: string

    balanceGerda: number
    balanceKrendel: number
    balanceRTK: number

    totalPrice1: number
    getToken1ETH1: number
    getToken2ETH1: number

    totalPrice2: number
    getToken1ETH2: number
    getToken2ETH2: number

    amount: number
    setAmount: React.Dispatch<React.SetStateAction<number>>
    tokenIn: string
    setTokenIn: React.Dispatch<React.SetStateAction<string>>
    selectedPool: string
    setSelectedPool: React.Dispatch<React.SetStateAction<string>>

    pool1: PoolAPI | null
    pool2: PoolAPI | null
    pools: PoolType[]
    setPools: React.Dispatch<React.SetStateAction<PoolType[]>>

    getData: (_api: APIType, pool1: PoolAPI | null, pool2: PoolAPI | null) => Promise<void>
    auth: () => Promise<void>
    loadPools: (factoryAPI: FactoryAPI, signer: JsonRpcSigner,) => Promise<{pool1: null | PoolAPI, pool2: null | PoolAPI} | {pool1: null, pool2: null}>
}