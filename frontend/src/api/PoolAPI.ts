import type {Signer, ContractTransactionResponse} from "ethers";
import type {Pool} from "./Pool/Pool.ts";
import {Pool__factory} from "./Pool/Pool__factory.ts";

export class PoolAPI {
    public address: string;
    public contract: Pool;

    constructor(contractAddr: string, signer: Signer) {
        this.address = contractAddr;
        this.contract = Pool__factory.connect(contractAddr, signer)
    }

    async getToken1(): Promise<string> {
        return await this.contract.token1();
    }

    async getToken2(): Promise<string> {
        return await this.contract.token2();
    }

    async getReserve1(): Promise<number> {
        return await this.contract.reserve1();
    }

    async getReserve2(): Promise<number> {
        return await this.contract.reserve2();
    }

    async getPrice1(): Promise<number> {
        return await this.contract.price1();
    }

    async getPrice2(): Promise<number> {
        return await this.contract.price2();
    }

    async getOwner(): Promise<string> {
        return await this.contract.owner();
    }

    async getLpToken(): Promise<string> {
        return await this.contract.lpToken();
    }

    async addLiquidity(_amount: number, _tokenIn: string, LpPrice: number): Promise<ContractTransactionResponse> {
        return await this.contract.addLiquidity(_amount, _tokenIn, LpPrice);
    }

    async swapTokens(_tokenIn: string, _amount: number): Promise<ContractTransactionResponse> {
        return await this.contract.swapTokens(_tokenIn, _amount);
    }
}