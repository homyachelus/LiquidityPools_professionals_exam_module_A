import * as React from "react";
import {useMyContext} from "../redux/context.tsx";

const VisibleSupp: React.FC<{addLiquidity: (amount: number, tokenIn: string, LpPrice: number) => Promise<void> }> = ({addLiquidity}) => {

    const {amount, setAmount, tokenIn, setTokenIn, selectedPool, setSelectedPool, pools} = useMyContext();

    return (
        <div style={{backgroundColor: "rgba(170, 59, 255, 0.16)"}}>
            <h1>Поддержка ликвидности</h1>

            <h3 style={{margin: 5}}>Выберите пул:</h3>
            <select className="input" value={selectedPool} onChange={(e) => setSelectedPool(e.target.value)}>
                <option value = '0x063B6Ac4B1A20cab7562e0e9262464B0A122407e'>Первый стартовый пул</option>
                <option value = '0x1014f1F684451a0333Ab95E5fb29EdBa8582A1d4'>Второй стартовый пул</option>
                {pools.map((pool, index) => (
                    <option key={index} value={pool.address}>Пользовательский пул №{index+1}</option>
                ))}
            </select> <br/>

            <h3 style={{margin: 5}}>Выберите токен:</h3>
            <select className="input" value={tokenIn} onChange={(e) => setTokenIn(e.target.value)}>
                <option value = '0x8464135c8F25Da09e49BC8782676a84730C318bC'>Gerda</option>
                <option value = '0x71C95911E9a5D330f4D621842EC243EE1343292e'>Krendel</option>
                <option value = '0x948B3c65b89DF0B4894ABE91E6D02FE579834F8F'>PTK</option>
            </select> <br/>

            <h3 style={{margin: 5}}>Сколько токенов добавить:</h3>
            <input className="input" type="text" placeholder="сколько" value={amount} onChange={(e) => setAmount(Number(e.target.value))}></input><br/>

            <button className="counter" onClick={() => addLiquidity(amount, tokenIn, 6)}>готово</button>
        </div>
    );
};

export default VisibleSupp;