import * as React from "react";
import {useMyContext} from "../redux/context.tsx";

const VisibleSupp: React.FC<{addLiquidity: (amount: number, tokenIn: string, LpPrice: number) => Promise<void> }> = ({addLiquidity}) => {

    const {amount, setAmount, tokenIn, setTokenIn, selectedPool, setSelectedPool, pools, gerdaAddr, krendelAddr, rtkAddr} = useMyContext();

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
                <option value = {gerdaAddr}>Gerda</option>
                <option value = {krendelAddr}>Krendel</option>
                <option value = {rtkAddr}>PTK</option>
            </select> <br/>

            <h3 style={{margin: 5}}>Сколько токенов добавить:</h3>
            <input className="input" type="text" placeholder="сколько" value={amount} onChange={(e) => setAmount(Number(e.target.value))}></input><br/>

            <button className="counter" onClick={() => addLiquidity(amount, tokenIn, 6)}>готово</button>
        </div>
    );
};

export default VisibleSupp;