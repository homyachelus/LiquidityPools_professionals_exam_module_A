import type {ContractTransactionResponse, Signer} from "ethers";
import type {Factory} from "./Factory/Factory.ts";
import {Factory__factory} from "./Factory/Factory__factory.ts";

export class FactoryAPI {
    public address: string;
    public contract: Factory;

    constructor(contractAddr: string, signer: Signer) {
        this.address = contractAddr;
        this.contract = Factory__factory.connect(contractAddr, signer)
    }

    async createPool(_token1: string, _token2: string,
    _reserve1: number, _reserve2: number,
    _price1: number, _price2: number,
    _lpToken: string, _owner: string): Promise<ContractTransactionResponse> {
        return await this.contract.createPool(_token1, _token2, _reserve1, _reserve2, _price1, _price2, _lpToken, _owner);
    }

    async returnPools(): Promise<string[]> {
        return await this.contract.returnPools();
    }
}