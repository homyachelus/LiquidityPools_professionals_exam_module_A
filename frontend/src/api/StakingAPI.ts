import type {ContractTransactionResponse, Signer} from "ethers";
import type {Staking} from "./Staking/Staking";
import {Staking__factory} from "./Staking/Staking__factory.ts";

export class StakingAPI {
    public address: string;
    public contract: Staking;

    constructor(contractAddr: string, singer: Signer) {
        this.address = contractAddr;
        this.contract = Staking__factory.connect(contractAddr, singer);
    }

    async getLPToken(): Promise<string> {
        return this.contract.lpToken();
    }

    async getRewardToken(): Promise<string> {
        return this.contract.rewardToken();
    }

    async getTotalStaked(): Promise<number> {
        return this.contract.totalStaked();
    }

    async getStakedBalance(user: string): Promise<number> {
        return this.contract.stakedBalance(user);
    }

    async getPendingRewards(user: string): Promise<number> {
        return this.contract.pendingRewards(user);
    }

    async updateRewards(user: string): Promise<number> {
        return await this.contract.updateRewards(user);
    }

    async stake(amount: number): Promise<ContractTransactionResponse> {
        return await this.contract.stake(amount);
    }

    async unStake(amount: number): Promise<ContractTransactionResponse> {
        return await this.contract.unstake(amount);
    }

    async claimRewards(): Promise<ContractTransactionResponse> {
        return await this.contract.claimRewards();
    }

    async viewRewards(user: string): Promise<number> {
        return await this.contract.viewRewards(user);
    }
}