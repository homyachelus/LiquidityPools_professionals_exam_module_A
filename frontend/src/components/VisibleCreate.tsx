import * as React from "react";
import {useEffect, useState} from "react";
import {useMyContext} from "../redux/context.tsx";

const VisibleCreate: React.FC<{createPool: (_token1: string, _token2: string, _reserve1: number, _reserve2: number,
                                            _price1: number, _price2: number, _lpToken: string, _owner: string) => Promise<void>}> =
    ({createPool}) => {

    const {LPtoken, signer} = useMyContext();

    const [_token1, setToken1] = useState<string>("0x8464135c8F25Da09e49BC8782676a84730C318bC");
    const [_token2, setToken2] = useState<string>("0x8464135c8F25Da09e49BC8782676a84730C318bC");

    const [_reserve1, setReserve1] = useState<number>(0);
    const [_reserve2, setReserve2] =useState<number>(0);

    const [price1, setPrice1] =useState<number>(0);
    const [price2, setPrice2] =useState<number>(0);

    const [_owner, setOwner] = useState<string>("");

    useEffect(() => {
        const getOwner = async () => {
            if (signer) {
                const owner = await signer.getAddress();
                setOwner(owner)
            }
        };
        getOwner();
    }, [signer]);

    return (
        <div style={{backgroundColor: "rgba(170, 59, 255, 0.16)"}}>
            <h1>Создать пул</h1>

            <div style={{display: "flex", justifyContent: "center", backgroundColor: "rgba(170, 59, 255, 0.16)"}}>
                <strong style={{marginRight: "25%"}}>Первый</strong> <strong>Второй</strong>
            </div>

            <h3 style={{margin: 5}}>Выберите токены:</h3>
            <select className="input" value={_token1} onChange={(e) => setToken1(e.target.value)}>
                <option value = '0x8464135c8F25Da09e49BC8782676a84730C318bC'>Gerda</option>
                <option value = '0x71C95911E9a5D330f4D621842EC243EE1343292e'>Krendel</option>
                <option value = '0x948B3c65b89DF0B4894ABE91E6D02FE579834F8F'>PTK</option>
            </select>
            <select className="input" value={_token2} onChange={(e) => setToken2(e.target.value)}>
                <option value = '0x8464135c8F25Da09e49BC8782676a84730C318bC'>Gerda</option>
                <option value = '0x71C95911E9a5D330f4D621842EC243EE1343292e'>Krendel</option>
                <option value = '0x948B3c65b89DF0B4894ABE91E6D02FE579834F8F'>PTK</option>
            </select> <br/>

            <h3 style={{margin: 5}}>Выберите начальное количество:</h3>
            <input className="input" type="text" value={_reserve1} onChange={(e) => setReserve1(Number(e.target.value))}></input>
            <input className="input" type="text" value={_reserve2} onChange={(e) => setReserve2(Number(e.target.value))}></input> <br/>

            <h3 style={{margin: 5}}>Выберите стоимость в ETH:</h3>
            <input className="input" type="text" value={price1} onChange={(e) => setPrice1(Number(e.target.value))}></input>
            <input className="input" type="text" value={price2} onChange={(e) => setPrice2(Number(e.target.value))}></input> <br/>

            <button className="counter" onClick={() => createPool(_token1, _token2, _reserve1, _reserve2, price1, price2, LPtoken, _owner)}>готово</button>
        </div>
    );
};

export default VisibleCreate;