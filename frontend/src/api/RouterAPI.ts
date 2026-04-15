import type {Signer, ContractTransactionResponse} from "ethers";
import type {Router} from "./Router/Router.ts";
import {Router__factory} from "./Router/Router__factory.ts";

export class RouterAPI {
    public address: string;
    public contract: Router;

    constructor(contractAddr: string, signer: Signer) {
        this.address = contractAddr;
        this.contract = Router__factory.connect(contractAddr, signer);
    }

    async findPath(tokenIn: string, tokenOut: string): Promise<{
        token: string;
        pool1: string;
        pool2: string;
    }> {
        const result = await this.contract.findPath(tokenIn, tokenOut);
        return {
            token: result[0],
            pool1: result[1],
            pool2: result[2],
        };
    }

    async createTokens(tokenIn: string, tokenOut: string, amountIn: number): Promise<ContractTransactionResponse> {
        return this.contract.createTokens(tokenIn, tokenOut, amountIn);
    }
}