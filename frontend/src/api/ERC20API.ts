import type {Signer, ContractTransactionResponse} from "ethers";
import type {ERC20} from "./ERC20/ERC20.ts";
import {ERC20__factory} from "./ERC20/ERC20__factory.ts";

export class ERC20API {
    public contract: ERC20;
    public address: string;

    constructor(contractAddr:string, signer:Signer) {
        this.address = contractAddr;
        this.contract = ERC20__factory.connect(contractAddr, signer)
    }

    async getName(): Promise<string> {
        return await this.contract.name();
    }

    async transfer(address: string, amount: number): Promise<ContractTransactionResponse> {
        return await this.contract.transfer(address, amount);
    }

    async approve(address: string, amount: number): Promise<ContractTransactionResponse> {
        return await this.contract.approve(address, amount);
    }

    async transferFrom(addressFrom: string, addressTo: string, amount: number): Promise<ContractTransactionResponse> {
        return await this.contract.transferFrom(addressFrom, addressTo, amount);
    }

    async balanceOf(address: string): Promise<number> {
        return await this.contract.balances(address);
    }

    async mint(address: string, value: number): Promise<ERC20> {
        return await this.contract.mint(address, value);
    }

    async addMinter(address: string): Promise<ERC20> {
        return await this.contract.addMinter(address);
    }
}