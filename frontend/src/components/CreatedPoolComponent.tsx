import React from 'react';

const CreatedPoolComponent: React.FC<{name: string, tokenName1: string, tokenName2: string, totalPrice: number, getToken1ETH: number, getToken2ETH: number}> =
    ({name, tokenName1, tokenName2, totalPrice, getToken1ETH, getToken2ETH}) => {

    return (
        <div>
            <h2>{name}</h2>
            <h3>
                Учавствующие токены: <span style={{color: "mediumpurple"}}>{tokenName1}, {tokenName2}</span> <br/>
                Общая цена токенов на пуле: <span style={{color: "mediumpurple"}}> {totalPrice} </span> <br/>
                Соотношение одного токена к другому: <span style={{color: "mediumpurple"}}> {getToken1ETH} : {getToken2ETH}</span> <br/>
            </h3>
        </div>
    );
};

export default CreatedPoolComponent;